<script lang="ts">
	import type { OrgNode } from './types';
	import type { OrgIdIndex } from './orgIdIndex';
	import ThreadItem from './threaditem.svelte';
	import OrgNodeBody from './orgnodebody.svelte';

	export let thread: OrgNode;
	export let idIndex: OrgIdIndex | null = null;

	let hideDone = false;
	$: hasDone = thread.children.some((c) => c.state === 'done');
	$: visibleChildren = hideDone
		? thread.children.filter((c) => c.state !== 'done')
		: thread.children;
</script>

<div class={`threadcard ${thread.state}`}>
	<div class="card-header">
		<div class="header-text">
			{#if thread.stateKeyword}
				<span class="keyword">{thread.stateKeyword}</span>
			{/if}
			<span class="title">{thread.title}</span>
		</div>
		{#if hasDone}
			<button class="toggle-done" on:click={() => (hideDone = !hideDone)}>
				{hideDone ? 'Show' : 'Hide'} done
			</button>
		{/if}
	</div>
	{#if thread.deadline}
		<div class="meta deadline">Deadline: {thread.deadline}</div>
	{/if}
	{#if thread.scheduled}
		<div class="meta scheduled">Scheduled: {thread.scheduled}</div>
	{/if}
	{#if thread.body.length > 0}
		<div class="body">
			<OrgNodeBody bodyparts={thread.body} />
		</div>
	{/if}
	{#if visibleChildren.length > 0}
		<div class="columns">
			{#each visibleChildren as child (child.line)}
				<div class="column">
					<ThreadItem item={child} {idIndex} />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.threadcard {
		border: 1px solid #bbb;
		border-radius: 0.75em;
		padding: 1em;
		background: #f8f8f8;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		overflow-y: auto;
		flex-shrink: 0;

		&.done {
			opacity: 0.5;
		}
	}

	.card-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5em;
		font-size: 1.1em;
		font-weight: bold;
		border-bottom: 2px solid darkcyan;
		padding-bottom: 0.4em;

		.keyword {
			margin-right: 0.3em;
		}
	}

	.toggle-done {
		font-size: 0.65em;
		font-weight: normal;
		padding: 0.15em 0.4em;
		border: 1px solid #ccc;
		border-radius: 3px;
		background: #f0f0f0;
		cursor: pointer;
		white-space: nowrap;

		&:hover {
			background: #e0e0e0;
		}
	}

	.threadcard.todo .card-header .keyword {
		color: #d32f2f;
	}
	.threadcard.done .card-header .keyword {
		color: #888;
	}

	.meta {
		font-size: 0.8em;
		color: #666;

		&.deadline {
			color: #c62828;
		}
	}

	.body {
		font-size: 0.85em;
	}

	.columns {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		overflow-x: auto;
	}

	.column {
		flex: 0 0 auto;
		min-width: 200px;
		max-width: 300px;
	}
</style>
