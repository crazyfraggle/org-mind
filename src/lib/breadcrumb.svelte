<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { OrgNode } from './types';

	const dispatch = createEventDispatcher();

	export let crumbs: OrgNode[] = [];
</script>

<div class="breadcrumb">
	{#each crumbs as crumb}
		<button
			class="crumb"
			role="link"
			on:click={() => {
				console.log('Clicked', crumb);
				dispatch('nodeSelected', crumb);
			}}
			on:keydown={(event) => {
				console.log('Keydown', event, crumb);
				if (event.key === 'Enter' || event.key === ' ') {
					dispatch('nodeSelected', crumb);
				}
			}}
			aria-label={crumb.title}
		>
			<span>{crumb.title}</span>
		</button>
		<span>▶</span>
	{/each}
</div>

<style lang="scss">
	.breadcrumb {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row-reverse;
		justify-content: center;
		align-items: center;

		.crumb {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0.5em;
			padding: 0.5em;
			border-radius: 0.5em;
			background-color: var(--bg-muted);
			color: var(--fg);
			border: 1px solid var(--border);
			cursor: pointer;
			&:hover {
				background-color: var(--bg-muted-hover);
			}
			&:focus {
				outline: none;
				background-color: var(--bg-muted-hover);
			}
		}
	}
</style>
