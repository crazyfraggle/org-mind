<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { OrgNode } from './types';
	import OrgNodeBody from './orgnodebody.svelte';

	export let orgtree: OrgNode;
	export let orgFiles: FileSystemFileHandle[] = [];
	export let showIndex = false;
	export let level = 1;

	const dispatch = createEventDispatcher<{ fileSelect: FileSystemFileHandle }>();
	$: headingTag = 'h' + Math.min(level, 6);
	$: stripName = (name: string) => name.replace(/\.org$/i, '');
</script>

{#if level === 1 && showIndex}
	<div class="wikiview">
		<h1>Wiki index</h1>
		<ul class="wiki-index">
			{#each orgFiles as handle}
				<li>
					<button class="index-link" on:click={() => dispatch('fileSelect', handle)}>
						{stripName(handle.name)}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{:else if level === 1}
	<div class="wikiview">
		<svelte:element this={headingTag} class={`wiki-heading ${orgtree.state}`}>
			{orgtree.title}
		</svelte:element>
		{#if orgtree.body.length > 0}
			<OrgNodeBody bodyparts={orgtree.body} />
		{/if}
		{#each orgtree.children as child}
			<svelte:self orgtree={child} {orgFiles} showIndex={false} level={level + 1} on:fileSelect />
		{/each}
	</div>
{:else}
	<svelte:element this={headingTag} class={`wiki-heading ${orgtree.state}`}>
		{orgtree.title}
	</svelte:element>
	{#if orgtree.body.length > 0}
		<OrgNodeBody bodyparts={orgtree.body} />
	{/if}
	{#each orgtree.children as child}
		<svelte:self orgtree={child} {orgFiles} showIndex={false} level={level + 1} on:fileSelect />
	{/each}
{/if}

<style lang="scss">
	.wikiview {
		height: 100%;
		overflow-y: auto;
		max-width: 70ch;
		margin: 0 auto;
		padding: 2rem 1rem;
		line-height: 1.5;
	}

	.wiki-heading {
		margin: 1.2em 0 0.4em;

		&.done {
			text-decoration: line-through;
			color: #888;
		}

		&.todo {
			color: red;
		}
	}

	.wiki-heading:first-child {
		margin-top: 0;
	}

	.wiki-index {
		list-style: none;
		padding: 0;
		margin: 1em 0;

		li {
			margin: 0.4em 0;
		}
	}

	.index-link {
		color: darkcyan;
		text-decoration: underline;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		font: inherit;

		&:hover {
			color: teal;
		}
	}
</style>
