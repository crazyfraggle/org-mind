const idPattern = /^\s*:ID:\s+(.+)$/m;

async function* walkOrgFiles(
	dir: FileSystemDirectoryHandle,
	path = ''
): AsyncGenerator<{ handle: FileSystemFileHandle; path: string }> {
	for await (const entry of dir.values()) {
		const entryPath = path ? `${path}/${entry.name}` : entry.name;
		if (entry.kind === 'directory') {
			yield* walkOrgFiles(entry as FileSystemDirectoryHandle, entryPath);
		} else if (entry.kind === 'file' && entry.name.endsWith('.org')) {
			yield { handle: entry as FileSystemFileHandle, path: entryPath };
		}
	}
}

export type OrgIdIndex = Map<string, FileSystemFileHandle>;
export type OrgFilePathIndex = Map<string, FileSystemFileHandle>;

export async function buildOrgIdIndex(dir: FileSystemDirectoryHandle): Promise<OrgIdIndex> {
	const index: OrgIdIndex = new Map();

	for await (const { handle } of walkOrgFiles(dir)) {
		const file = await handle.getFile();
		const text = await file.text();
		// Scan for all :ID: lines in the file
		for (const line of text.split('\n')) {
			const m = line.match(idPattern);
			if (m) {
				index.set(m[1].trim(), handle);
			}
		}
	}

	return index;
}

export async function buildOrgFilePathIndex(
	dir: FileSystemDirectoryHandle
): Promise<OrgFilePathIndex> {
	const index: OrgFilePathIndex = new Map();
	for await (const { handle, path } of walkOrgFiles(dir)) {
		index.set(path, handle);
	}
	return index;
}

export async function resolveIdLink(
	index: OrgIdIndex,
	id: string
): Promise<string | null> {
	const handle = index.get(id);
	if (!handle) return null;
	const file = await handle.getFile();
	return file.text();
}

export function resolveFilePath(
	index: OrgFilePathIndex,
	path: string
): FileSystemFileHandle | null {
	// Strip any in-file anchor like ::heading or ::*Heading
	const cleaned = path.split('::')[0];
	// Try direct match first (e.g. "roam/foo.org"), then basename fallback
	const direct = index.get(cleaned);
	if (direct) return direct;
	const base = cleaned.split('/').pop() ?? cleaned;
	for (const [p, h] of index) {
		if (p === base || p.endsWith('/' + base)) return h;
	}
	return null;
}
