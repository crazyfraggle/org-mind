<script lang="ts">
	import Mindmap from '$lib/mindmap.svelte';
	import ThreadsView from '$lib/threadsview.svelte';
	import { orgTextToMindMap } from '$lib/orgTextToMindMap';
	import { buildOrgIdIndex, resolveIdLink, type OrgIdIndex } from '$lib/orgIdIndex';

	// Default URL for URL popup
	let url: string | null =
		'https://raw.githubusercontent.com/crazyfraggle/org-mind/main/static/orgmind.org';
	let fileHandle: FileSystemFileHandle | null = null;
	let orgDir: FileSystemDirectoryHandle | null = null;
	let idIndex: OrgIdIndex | null = null;
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

	let viewMode: 'mindmap' | 'threads' = 'mindmap';
	let reloadKey = 0;

	$: orgTree = orgTextToMindMap(orgText);

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
		// Collect root-level .org files for the file picker
		const files: FileSystemFileHandle[] = [];
		for await (const entry of orgDir.values()) {
			if (entry.kind === 'file' && entry.name.endsWith('.org')) {
				files.push(entry as FileSystemFileHandle);
			}
		}
		orgFiles = files.sort((a, b) => a.name.localeCompare(b.name));
		idIndex = await buildOrgIdIndex(orgDir);
	}

	async function selectOrgFile(handle: FileSystemFileHandle) {
		fileHandle = handle;
		const file = await handle.getFile();
		orgText = await file.text();
	}

	function listenIdNavigate(node: HTMLElement) {
		const handler = async (e: Event) => {
			const id = (e as CustomEvent<string>).detail;
			if (!idIndex) return;
			const text = await resolveIdLink(idIndex, id);
			if (text) orgText = text;
		};
		node.addEventListener('idnavigate', handler);
		return { destroy: () => node.removeEventListener('idnavigate', handler) };
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
		<label class:active={viewMode === 'mindmap'}>
			<input type="radio" bind:group={viewMode} value="mindmap" /> Map
		</label>
		<label class:active={viewMode === 'threads'}>
			<input type="radio" bind:group={viewMode} value="threads" /> Threads
		</label>
	</div>
</div>
<div id="content" use:listenIdNavigate>
	{#key reloadKey}
		{#if viewMode === 'mindmap'}
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
		background: white;
		border-bottom: 1px solid #ccc;
		z-index: 1;

		button {
			padding: 0.25rem 0.6rem;
			border: 1px solid #aaa;
			border-radius: 4px;
			background: #f4f4f4;
			cursor: pointer;

			&:hover {
				background: #e8e8e8;
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
				border: 1px solid #ccc;

				&.active {
					background: darkcyan;
					color: white;
					border-color: darkcyan;
				}
			}

			input[type='radio'] {
				display: none;
			}
		}
	}

	#content {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>
