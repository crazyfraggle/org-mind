<script lang="ts">
	import type { OrgNode } from './types';
	import OrgNodeBody from './orgnodebody.svelte';

	export let entry: OrgNode;

	let collapsed = entry.state === 'done';
</script>

<div class={`thread-entry ${entry.state}`}>
	<button class="entry-title" on:click={() => (collapsed = !collapsed)}>
		<span class="collapse-indicator">{collapsed ? '+' : '-'}</span>
		{#if entry.stateKeyword}
			<span class="keyword">{entry.stateKeyword}</span>
		{/if}
		{entry.title}
	</button>
	{#if !collapsed && entry.body.length > 0}
		<div class="entry-body">
			<OrgNodeBody bodyparts={entry.body} />
		</div>
	{/if}
</div>

<style lang="scss">
	.thread-entry {
		padding: 0.4em 0.5em;
		border: 1px solid #e0e0e0;
		border-radius: 0.4em;
		background: white;
		font-size: 0.85em;

		&.done {
			opacity: 0.6;
		}
	}

	.entry-title {
		display: flex;
		align-items: baseline;
		gap: 0.3em;
		font-weight: 600;
		font-size: inherit;
		font-family: inherit;
		text-align: left;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		width: 100%;

		&:hover {
			color: darkcyan;
		}

		.collapse-indicator {
			color: darkcyan;
			flex-shrink: 0;
			width: 1em;
			text-align: center;
		}

		.keyword {
			margin-right: 0.3em;
		}
	}

	.entry-body {
		margin-top: 0.3em;
		padding-left: 1.3em;
	}
</style>
