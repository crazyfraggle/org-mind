<script lang="ts">
	import Mindmap from '$lib/mindmap.svelte';
	import { orgTextToMindMap } from '$lib/orgTextToMindMap';

	// Default URL for URL popup
	let url: string | null =
		'https://raw.githubusercontent.com/crazyfraggle/org-mind/main/static/orgmind.org';
	let fileHandle: FileSystemFileHandle | null = null;

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

	async function reloadFile() {
		if (!fileHandle) {
			alert('No file selected');
			return;
		}
		const file = await fileHandle.getFile();
		const contents = await file.text();
		orgText = contents;
	}

	async function openURL() {
		url = prompt('Enter URL', url || '');
		if (!url) return;
		const response = await fetch(url);
		const contents = await response.text();
		orgText = contents;
	}
</script>

<div id="fileSelect">
	<button on:click={openFile}>Open file</button>
	{#if fileHandle}
		<button on:click={reloadFile}>Reload file</button>
	{/if}
	<button on:click={openURL}>Open URL</button>
</div>
<Mindmap orgtree={orgTree} />

<style lang="scss">
	#fileSelect {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		background: white;
		padding: 5px;
		border: 1px solid black;
		border-radius: 5px;
		button {
			margin-block: 3px;
			padding: 2px;
		}
	}
</style>
