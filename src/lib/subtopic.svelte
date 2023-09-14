<script lang="ts">
	import Expander from './expander.svelte';
	import type { OrgNode } from './orgtree.ts';

	export let node: OrgNode;
	let expanded = false;
</script>

<li class="subtopic">
	<div class="subtopicContainer">
		<span>{node.title}</span>
	</div>
	{#if node.children.length > 0}
		<Expander bind:isExpanded={expanded} on:expanded />
		<ul class={expanded ? 'expanded' : 'collapsed'}>
			{#each node.children as child}
				<svelte:self node={child} />
			{/each}
		</ul>
	{/if}
</li>

<style lang="scss">
	@container style(--rol: left) {
		.subtopic {
			flex-direction: row-reverse;
		}
	}

	@container style(--rol: right) {
		.subtopic {
			flex-direction: row;
		}
	}

	.subtopic {
		display: flex;
		align-items: center;
		margin: 0.5em 0;

		.subtopicContainer {
			border-bottom: 1px solid #ccc;
		}
	}
	ul {
		padding-inline-start: 0;
	}
	.collapsed {
		display: none;
	}
</style>
