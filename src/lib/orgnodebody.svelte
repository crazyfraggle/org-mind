<script lang="ts">
	import OrgNodeText from './orgnodetext.svelte';
	import {
		type OrgBodyElement,
		isText,
		isPreformatted,
		isSource,
		isOrderedList,
		isUnorderedList,
		isTable,
		isLink
	} from './types';

	export let bodyparts: OrgBodyElement[] = [];
</script>

<div class="body">
	{#each bodyparts as element}
		{#if isText(element)}
			<OrgNodeText text={element} />
		{:else if isPreformatted(element)}
			<pre>{element.text}</pre>
		{:else if isTable(element)}
			<table>
				<tbody>
					{#each element.rows as row}
						<tr>
							{#each row as cell}
								<td>{cell}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if isUnorderedList(element)}
			<ul>
				{#each element.items as item}
					<li>{item}</li>
				{/each}
			</ul>
		{:else if isOrderedList(element)}
			<ol>
				{#each element.items as item}
					<li>{item}</li>
				{/each}
			</ol>
		{:else if isSource(element)}
			<pre><code>{element.text}</code></pre>
		{:else if isLink(element)}
			{#if element.target.startsWith('id:')}
				<button
					class="org-link id-link"
					title={element.target}
					on:click={(e) =>
						e.currentTarget.dispatchEvent(
							new CustomEvent('idnavigate', {
								detail: element.target.slice(3),
								bubbles: true
							})
						)}>{element.description}</button
				>
			{:else}
				<a class="org-link" href={element.target} title={element.target}
					>{element.description}</a
				>
			{/if}
		{/if}
	{/each}
</div>

<style>
	.id-link {
		color: darkcyan;
		text-decoration: underline;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
	}

	.id-link:hover {
		color: teal;
	}
</style>
