<script lang="ts">
	export let target: string;
	export let description = '';

	$: label = description || target;
	$: isId = target.startsWith('id:');
	$: isFile = target.startsWith('file:');

	function dispatchBubbling(e: MouseEvent, name: string, detail: string) {
		e.currentTarget?.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
	}
</script>

{#if isId}
	<button
		class="org-link id-link"
		title={target}
		on:click={(e) => dispatchBubbling(e, 'idnavigate', target.slice(3))}>{label}</button
	>
{:else if isFile}
	<button
		class="org-link file-link"
		title={target}
		on:click={(e) => dispatchBubbling(e, 'filenavigate', target.slice(5))}>{label}</button
	>
{:else}
	<a class="org-link" href={target} title={target} target="_blank" rel="noopener">{label}</a>
{/if}

<style>
	.org-link {
		color: darkcyan;
		text-decoration: underline;
		cursor: pointer;
	}

	.org-link:hover {
		color: teal;
	}

	button.org-link {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
	}
</style>
