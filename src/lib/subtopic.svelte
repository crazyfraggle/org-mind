<script lang="ts">
	import { onMount } from 'svelte';
	import Expander from './expander.svelte';
	import type { OrgNode } from './orgtree.ts';

	export let node: OrgNode;
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

<li class="subtopic" bind:this={topicElement}>
	<div class="subtopicContainer">
		<span class="title">{node.title}</span>
		<div class="body">{node.body}</div>
	</div>
	{#if node.children.length > 0}
		<Expander bind:isExpanded={expanded} on:expanded exits={subnodePositions} />
		<ul bind:this={subtopicList} class={expanded ? 'expanded' : 'collapsed'}>
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
			background-color: bisque;
			padding-inline: 0.5em;

			.title {
				font-weight: bold;
			}
			.body {
				font-size: 90%;
				display: none;
			}
		}
	}
	ul {
		padding-inline-start: 0;
	}
	.collapsed {
		display: none;
	}
</style>
