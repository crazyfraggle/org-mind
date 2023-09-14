<script lang="ts">
	import Mindmap from '$lib/mindmap.svelte';
	import { orgTextToMindMap } from '$lib/orgTextToMindMap';

	let orgText = `#+TITLE: Org Mode Mindmap
	
* You need to click that "Open file" button to load a file.`;

	$: orgTree = orgTextToMindMap(orgText);

	async function openFile() {
		const [fileHandle] = await window.showOpenFilePicker();
		const file = await fileHandle.getFile();
		const contents = await file.text();
		orgText = contents;
	}
</script>

<div>
	<button on:click={openFile}>Open file</button>
	<Mindmap orgtree={orgTree} />
</div>
