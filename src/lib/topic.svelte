<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import type { OrgNode } from './types';
	import Expander from './expander.svelte';
	import Subtopic from './subtopic.svelte';
	import OrgNodeBody from './orgnodebody.svelte';

	export let orgnode: OrgNode;

	const dispatch = createEventDispatcher();

	let expanded = false;
	let topicElement: HTMLElement | null = null;
	let subtopicList: HTMLElement | null = null;
	let subnodePositions: number[] = [];
	let showBody = false;

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

	const onDoubleTap = (event: MouseEvent) => {
		console.log('Double tap', event);
		dispatch('nodeSelected', orgnode);
	};

	$: onMount(() => {
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

<li bind:this={topicElement} class={`topic ${orgnode.state}`} on:dblclick={onDoubleTap}>
	<div class="topicContainer">
		<span class="title"><span class="keyword">{orgnode.stateKeyword}</span> {orgnode.title}</span>
		{#if orgnode.body.length > 0}
			<label><input type="checkbox" bind:checked={showBody} />{showBody ? '🔼' : '🔽'}</label>

			{#if showBody}
				<OrgNodeBody bodyparts={orgnode.body} />
			{/if}
		{/if}
	</div>
	{#if orgnode.children.length > 0}
		<Expander on:expanded bind:isExpanded={expanded} exits={subnodePositions} />
		<ul bind:this={subtopicList} class={'subtopics ' + (expanded ? 'expanded' : 'collapsed')}>
			{#each orgnode.children as child}
				<Subtopic node={child} on:expanded on:nodeSelected />
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

		&.done {
			.topicContainer {
				background-color: #ddd;
			}
			.keyword {
				color: #aaa;
			}
		}
		&.todo {
			.keyword {
				color: #f00;
			}
		}
	}

	.topicContainer {
		max-width: 25vw;
		border: 1px solid black;
		border-radius: 1em;
		padding: 0.5em;

		.title {
			font-weight: bolder;
		}
		.body {
			font-size: 80%;
		}

		input[type='checkbox'] {
			display: none;
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
