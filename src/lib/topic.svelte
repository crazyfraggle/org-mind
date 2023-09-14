<script lang="ts">
	import { onMount } from 'svelte';
	import type { OrgNode } from './orgtree';
	import Expander from './expander.svelte';
	import Subtopic from './subtopic.svelte';

	export let orgnode: OrgNode;

	let expanded = false;
	let topicElement: HTMLElement | null = null;
	let subtopicList: HTMLElement | null = null;
	let subnodePositions: number[] = [];

	const updateListItemPositions = (expanded: boolean) => {
		const subtopicPosition = subtopicList?.getBoundingClientRect() || { top: 0 };
		subnodePositions = expanded
			? Array.from(subtopicList?.children || [])
					.map((child) => child.getBoundingClientRect())
					.map((rect) => {
						console.log(rect);
						return rect;
					})
					.map((rect) => rect.top - subtopicPosition.top + rect.height / 2)
			: [];
	};

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				console.log('Resizing', entry);
				updateListItemPositions(expanded);
			});
		});
		resizeObserver.observe(topicElement as Element);
		return () => resizeObserver.unobserve(topicElement as Element);
	});
</script>

<li bind:this={topicElement} class="topic">
	<div class="topicContainer">
		<span class="title">{orgnode.title}</span>
		{#if orgnode.body}
			<!-- TODO: Might need a smarter body renderer to support links, lists, tables -->
			<div class="body">{orgnode.body}</div>
		{/if}
	</div>
	{#if orgnode.children.length > 0}
		<Expander on:expanded bind:isExpanded={expanded} exits={subnodePositions} />
		<ul bind:this={subtopicList} class={'subtopics ' + (expanded ? 'expanded' : 'collapsed')}>
			{#each orgnode.children as child}
				<Subtopic node={child} on:expanded />
			{/each}
		</ul>
	{/if}
</li>

<style lang="scss">
	@container style(--rol: left) {
		.topic {
			flex-direction: row-reverse;
		}
	}

	@container style(--rol: right) {
		.topic {
			flex-direction: row;
		}
	}

	.topic {
		display: flex;
		align-items: center;
		margin: 0.5em 0;
	}

	.topicContainer {
		border: 1px solid black;
		border-radius: 1em;
		padding: 0.5em;

		.body {
			font-size: 80%;
		}
	}

	.subtopics {
		display: flex;
		flex-direction: column;
		padding-inline-start: 0.1em;
	}

	.collapsed {
		display: none;
	}
</style>
