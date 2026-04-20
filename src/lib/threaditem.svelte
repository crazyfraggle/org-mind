<script lang="ts">
	import type { OrgNode } from './types';
	import { isLink } from './types';
	import type { OrgIdIndex } from './orgIdIndex';
	import { resolveIdLink } from './orgIdIndex';
	import { orgTextToMindMap } from './orgTextToMindMap';
	import OrgNodeBody from './orgnodebody.svelte';
	import ThreadEntry from './threadentry.svelte';

	export let item: OrgNode;
	export let idIndex: OrgIdIndex | null = null;

	let linkedNode: OrgNode | null = null;
	let resolving = false;
	let resolved = false;

	// Find the first id: link in this item's body
	$: idLink = item.body.find(
		(el) => isLink(el) && el.target.startsWith('id:')
	);
	$: linkId = idLink && isLink(idLink) ? idLink.target.slice(3) : null;

	// Auto-resolve when we have both an index and a link
	$: if (idIndex && linkId && !resolved) {
		resolving = true;
		resolveIdLink(idIndex, linkId).then((text) => {
			if (text) {
				linkedNode = orgTextToMindMap(text);
			}
			resolving = false;
			resolved = true;
		});
	}
</script>

<div class={`threaditem ${item.state}`}>
	<div class="header">
		{#if item.stateKeyword}
			<span class="keyword">{item.stateKeyword}</span>
		{/if}
		<span class="title">{item.title}</span>
	</div>
	{#if item.deadline}
		<div class="meta deadline">Deadline: {item.deadline}</div>
	{/if}
	{#if item.scheduled}
		<div class="meta scheduled">Scheduled: {item.scheduled}</div>
	{/if}
	{#if item.closed}
		<div class="meta closed">Closed: {item.closed}</div>
	{/if}
	{#if item.body.length > 0}
		<div class="body">
			<OrgNodeBody bodyparts={item.body} />
		</div>
	{/if}
	{#if resolving}
		<div class="loading">Loading...</div>
	{/if}
	{#if linkedNode}
		<div class="thread-entries">
			{#if linkedNode.body.length > 0}
				<div class="thread-entry intro">
					<OrgNodeBody bodyparts={linkedNode.body} />
				</div>
			{/if}
			{#each linkedNode.children as entry}
				<ThreadEntry {entry} />
			{/each}
		</div>
	{:else if item.children.length > 0}
		<div class="thread-entries">
			{#each item.children as entry}
				<ThreadEntry {entry} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.threaditem {
		display: flex;
		flex-direction: column;
		gap: 0.4em;

		&.done {
			opacity: 0.6;
			.header .title {
				text-decoration: line-through;
			}
		}
		&.todo .keyword {
			color: #d32f2f;
		}
	}

	.header {
		font-weight: bold;
		padding: 0.5em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		background: white;

		.keyword {
			margin-right: 0.3em;
		}
	}

	.meta {
		font-size: 0.8em;
		color: #666;
		padding: 0 0.5em;

		&.deadline {
			color: #c62828;
		}
	}

	.body {
		font-size: 0.85em;
		padding: 0 0.5em;
	}

	.loading {
		font-size: 0.8em;
		color: #999;
		padding: 0.3em 0.5em;
	}

	.thread-entries {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
	}

	.thread-entry.intro {
		padding: 0.4em 0.5em;
		border: 1px solid darkcyan;
		border-left: 3px solid darkcyan;
		border-radius: 0.4em;
		background: white;
		font-size: 0.85em;
	}
</style>
