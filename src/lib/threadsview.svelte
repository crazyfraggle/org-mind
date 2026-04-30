<script lang="ts">
	import type { OrgNode } from './types';
	import type { OrgIdIndex } from './orgIdIndex';
	import ThreadCard from './threadcard.svelte';

	export let orgtree: OrgNode;
	export let idIndex: OrgIdIndex | null = null;

	let container: HTMLDivElement;

	function scrollByOne(direction: 1 | -1) {
		if (!container) return;
		const cards = Array.from(container.children) as HTMLElement[];
		if (cards.length === 0) return;

		const containerRect = container.getBoundingClientRect();
		const tolerance = 2;

		const firstVisibleIdx = cards.findIndex((card) => {
			const rect = card.getBoundingClientRect();
			return rect.left >= containerRect.left - tolerance;
		});

		const baseIdx = firstVisibleIdx === -1 ? cards.length - 1 : firstVisibleIdx;
		const targetIdx = Math.max(0, Math.min(cards.length - 1, baseIdx + direction));

		const target = cards[targetIdx];
		const targetRect = target.getBoundingClientRect();
		const newScrollLeft = container.scrollLeft + (targetRect.left - containerRect.left);
		container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
	}
</script>

<div class="threadsview">
	<div class="threads-header">
		<button class="nav-arrow" on:click={() => scrollByOne(-1)} aria-label="Previous thread">
			‹
		</button>
		<button class="nav-arrow" on:click={() => scrollByOne(1)} aria-label="Next thread">›</button>
		<h1 class="threads-title">{orgtree.title}</h1>
	</div>
	<div class="threads-container" bind:this={container}>
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

	.threads-header {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.75rem 0;
		flex-shrink: 0;
	}

	.nav-arrow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.6em;
		height: 1.6em;
		font-size: 1.1em;
		line-height: 1;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--bg-muted);
		color: var(--fg);
		cursor: pointer;
		padding: 0;

		&:hover {
			background: var(--bg-muted-hover);
		}
	}

	.threads-title {
		font-size: 1.3em;
		margin: 0;
		color: var(--accent);
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
