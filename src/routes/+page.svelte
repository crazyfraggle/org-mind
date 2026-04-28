<script lang="ts">
	import { onMount } from 'svelte';
	import Mindmap from '$lib/mindmap.svelte';
	import ThreadsView from '$lib/threadsview.svelte';
	import WikiView from '$lib/wikiview.svelte';
	import { orgTextToMindMap } from '$lib/orgTextToMindMap';
	import {
		buildOrgIdIndex,
		buildOrgFilePathIndex,
		resolveFilePath,
		type OrgIdIndex,
		type OrgFilePathIndex
	} from '$lib/orgIdIndex';
	import { theme, toggleTheme } from '$lib/theme';

	// Default URL for URL popup
	let url: string | null =
		'https://raw.githubusercontent.com/crazyfraggle/org-mind/main/static/orgmind.org';
	let fileHandle: FileSystemFileHandle | null = null;
	let orgDir: FileSystemDirectoryHandle | null = null;
	let idIndex: OrgIdIndex | null = null;
	let filePathIndex: OrgFilePathIndex | null = null;
	let orgFiles: FileSystemFileHandle[] = [];

	// Default map contains instructions for use
	let orgText = `#+TITLE: Org Mode Mindmap
	
* View local files
** Click the "Open file" button
** Select a file
** If you change the file locally, the reload file button will reload it in place
* View online files
** Click the "Open URL" button
** Enter a URL
* Usage
** Click on the +/- icon next to a topic to expand or collapse it
** Settings
*** Click on the gear icon in the top right corner
*** Change the "Right only" to keep the root node on the left`;

	type ViewMode = 'wiki' | 'mindmap' | 'threads';
	const VIEW_MODES: ViewMode[] = ['wiki', 'mindmap', 'threads'];
	let viewMode: ViewMode = 'mindmap';
	let reloadKey = 0;

	$: orgTree = orgTextToMindMap(orgText);

	function pathForHandle(handle: FileSystemFileHandle): string | null {
		if (!filePathIndex) return null;
		for (const [p, h] of filePathIndex) {
			if (h === handle) return p;
		}
		return null;
	}

	function isViewMode(s: string): s is ViewMode {
		return (VIEW_MODES as string[]).includes(s);
	}

	function encodePath(p: string): string {
		return p.split('/').map(encodeURIComponent).join('/');
	}

	function decodePath(p: string): string {
		try {
			return p.split('/').map(decodeURIComponent).join('/');
		} catch {
			return p;
		}
	}

	function parseNavHash(): { view: ViewMode | null; path: string } {
		const raw = typeof window === 'undefined' ? '' : window.location.hash.slice(1);
		if (!raw) return { view: null, path: '' };
		const idx = raw.indexOf(':');
		if (idx > 0) {
			const head = raw.slice(0, idx);
			if (isViewMode(head)) {
				return { view: head, path: decodePath(raw.slice(idx + 1)) };
			}
		}
		// Legacy hash with no view prefix
		return { view: null, path: decodePath(raw) };
	}

	function writeNavHash(view: ViewMode, path: string) {
		const next = '#' + view + ':' + encodePath(path);
		if (window.location.hash !== next) {
			window.location.hash = next;
		}
	}

	async function loadFileContents(handle: FileSystemFileHandle) {
		const file = await handle.getFile();
		orgText = await file.text();
	}

	async function navigateToHash() {
		if (!filePathIndex) return;
		const { view, path } = parseNavHash();
		if (!path) return;
		const handle = resolveFilePath(filePathIndex, path);
		if (!handle) return;
		// Apply state updates synchronously so the reactive sync below batches
		// them into a single hash write (which then no-ops, since it equals the
		// hash we just navigated to).
		const needsLoad = handle !== fileHandle;
		if (needsLoad) fileHandle = handle;
		if (view && view !== viewMode) viewMode = view;
		if (needsLoad) await loadFileContents(handle);
	}

	// Single source of truth for the hash: any change to the loaded file or the
	// view writes the new hash, creating a history entry the back button can use.
	$: if (fileHandle && filePathIndex) {
		const p = pathForHandle(fileHandle);
		if (p) writeNavHash(viewMode, p);
	}

	onMount(() => {
		const handler = () => {
			navigateToHash();
		};
		window.addEventListener('hashchange', handler);
		return () => window.removeEventListener('hashchange', handler);
	});

	async function openFile() {
		[fileHandle] = await window.showOpenFilePicker();
		if (!fileHandle) {
			alert('No file selected');
			return;
		}
		const file = await fileHandle.getFile();
		const contents = await file.text();
		orgText = contents;
	}

	async function reloadFiles() {
		if (!fileHandle) {
			alert('No file selected');
			return;
		}
		const file = await fileHandle.getFile();
		orgText = await file.text();
		// Force all components to recreate, re-resolving linked content
		reloadKey++;
	}

	async function openURL() {
		url = prompt('Enter URL', url || '');
		if (!url) return;
		const response = await fetch(url);
		const contents = await response.text();
		orgText = contents;
	}

	async function openOrgDirectory() {
		orgDir = await window.showDirectoryPicker();
		if (!orgDir) return;
		filePathIndex = await buildOrgFilePathIndex(orgDir);
		// Derive root-level files from the path index so the picker, the wiki
		// index, and the path index all share the same handle references.
		orgFiles = [...filePathIndex.entries()]
			.filter(([p]) => !p.includes('/'))
			.map(([, h]) => h)
			.sort((a, b) => a.name.localeCompare(b.name));
		idIndex = await buildOrgIdIndex(filePathIndex);
		fileHandle = null;
		viewMode = 'wiki';
		// If the URL already points at a file in this dir, jump to it
		await navigateToHash();
	}

	async function selectOrgFile(handle: FileSystemFileHandle) {
		fileHandle = handle;
		await loadFileContents(handle);
	}

	function listenIdNavigate(node: HTMLElement) {
		const idHandler = async (e: Event) => {
			const id = (e as CustomEvent<string>).detail;
			if (!idIndex) return;
			const handle = idIndex.get(id);
			if (!handle) return;
			fileHandle = handle;
			viewMode = 'wiki';
			await loadFileContents(handle);
		};
		const fileHandler = async (e: Event) => {
			const path = (e as CustomEvent<string>).detail;
			if (!filePathIndex) return;
			const handle = resolveFilePath(filePathIndex, path);
			if (!handle) return;
			fileHandle = handle;
			viewMode = 'wiki';
			await loadFileContents(handle);
		};
		node.addEventListener('idnavigate', idHandler);
		node.addEventListener('filenavigate', fileHandler);
		return {
			destroy: () => {
				node.removeEventListener('idnavigate', idHandler);
				node.removeEventListener('filenavigate', fileHandler);
			}
		};
	}
</script>

<div id="page">
	<div id="toolbar">
		<button on:click={openFile}>Open single file</button>
		{#if fileHandle}
			<button on:click={reloadFiles}>Reload files</button>
		{/if}
		<button on:click={openURL}>Open URL</button>
		<button on:click={openOrgDirectory}>
			{orgDir ? `Org: ${orgDir.name}` : 'Open org dir'}
		</button>
		{#if orgFiles.length > 0}
			<select
				value={fileHandle?.name ?? ''}
				on:change={(e) => {
					const handle = orgFiles.find((f) => f.name === e.currentTarget.value);
					if (handle) selectOrgFile(handle);
				}}
			>
				<option value="" disabled>Select file...</option>
				{#each orgFiles as f}
					<option value={f.name}>{f.name}</option>
				{/each}
			</select>
		{/if}
		<div class="view-toggle">
			<label class:active={viewMode === 'wiki'}>
				<input type="radio" bind:group={viewMode} value="wiki" /> Wiki
			</label>
			<label class:active={viewMode === 'mindmap'}>
				<input type="radio" bind:group={viewMode} value="mindmap" /> Map
			</label>
			<label class:active={viewMode === 'threads'}>
				<input type="radio" bind:group={viewMode} value="threads" /> Threads
			</label>
		</div>
		<button
			class="theme-toggle"
			on:click={toggleTheme}
			title={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
			aria-label="Toggle theme"
		>
			{$theme === 'dark' ? '☀️' : '🌙'}
		</button>
	</div>
	<div id="content" use:listenIdNavigate>
		{#key reloadKey}
			{#if viewMode === 'wiki'}
				<WikiView
					orgtree={orgTree}
					{orgFiles}
					showIndex={fileHandle === null && orgFiles.length > 0}
					on:fileSelect={(e) => selectOrgFile(e.detail)}
				/>
			{:else if viewMode === 'mindmap'}
				<Mindmap orgtree={orgTree} />
			{:else}
				<ThreadsView orgtree={orgTree} {idIndex} />
			{/if}
		{/key}
	</div>
</div>

<style lang="scss">
	#page {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	#toolbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.75rem;
		background: var(--bg);
		color: var(--fg);
		border-bottom: 1px solid var(--border);
		z-index: 1;

		button {
			padding: 0.25rem 0.6rem;
			border: 1px solid var(--border);
			border-radius: 4px;
			background: var(--bg-alt);
			color: var(--fg);
			cursor: pointer;

			&:hover {
				background: var(--bg-alt-hover);
			}
		}

		.view-toggle {
			display: flex;
			gap: 2px;
			margin-left: auto;

			label {
				text-align: center;
				padding: 0.25rem 0.6rem;
				border-radius: 4px;
				cursor: pointer;
				font-size: 0.85em;
				border: 1px solid var(--border);
				color: var(--fg);

				&.active {
					background: var(--accent);
					color: var(--accent-fg);
					border-color: var(--accent);
				}
			}

			input[type='radio'] {
				display: none;
			}
		}

		.theme-toggle {
			padding: 0.25rem 0.5rem;
			font-size: 1em;
			line-height: 1;
		}
	}

	#content {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>
