<script lang="ts">
	import type { OrgNode } from './types';
	import type { OrgIdIndex } from './orgIdIndex';
	import ThreadCard from './threadcard.svelte';

	export let orgtree: OrgNode;
	export let idIndex: OrgIdIndex | null = null;
</script>

<div class="threadsview">
	<h1 class="threads-title">{orgtree.title}</h1>
	<div class="threads-container">
		{#each orgtree.children as thread}
			<ThreadCard {thread} {idIndex} />
		{/each}
	</div>
</div>

<style lang="scss">
	.threadsview {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1rem;
	}

	.threads-title {
		font-size: 1.3em;
		margin: 0 0 0.75rem 0;
		color: darkcyan;
		flex-shrink: 0;
	}

	.threads-container {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		gap: 1rem;
		overflow-x: auto;
		flex: 1;
		min-height: 0;
		padding-bottom: 1rem;
	}
</style>
