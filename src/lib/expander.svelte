<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let isExpanded = false;
	const dispatch = createEventDispatcher();
	$: buttonLabel = isExpanded ? '➖' : '➕';

	function toggleExpanded() {
		isExpanded = !isExpanded;
		dispatch('expanded', { expanded: isExpanded });
	}

	onMount(() => {
		// Code to run when component is mounted
	});
</script>

<button on:click={toggleExpanded}>
	{buttonLabel}
</button>
<!-- <label class="expander">{buttonLabel}<input bind:checked={expanded} type="checkbox" /></label> -->

{#if isExpanded}
	<div>
		<!-- Canvas for lines, or some other hack to draw the lines. -->
	</div>
{/if}
