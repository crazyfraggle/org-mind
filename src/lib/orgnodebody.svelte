<script lang="ts">
	import OrgNodeText from './orgnodetext.svelte';
	import type { OrgBodyElement } from './types';

	export let bodyparts: OrgBodyElement[] = [];
</script>

<div class="body">
	{#each bodyparts as element}
		{#if element.type === 'text'}
			<OrgNodeText text={element.text} />
		{:else if element.type === 'preformatted'}
			<pre>{element.text}</pre>
		{:else if element.type === 'table'}
			<table>
				{#each element.rows as row}
					<tr>
						{#each row as cell}
							<td>{cell}</td>
						{/each}
					</tr>
				{/each}
			</table>
		{:else if element.type === 'unorderedList'}
			<ul>
				{#each element.items as item}
					<li>{item}</li>
				{/each}
			</ul>
		{:else if element.type === 'orderedList'}
			<ol>
				{#each element.items as item}
					<li>{item}</li>
				{/each}
			</ol>
		{:else if element.type === 'source'}
			<pre><code>{element.text}</code></pre>
		{/if}
	{/each}
</div>
