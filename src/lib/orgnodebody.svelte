<script lang="ts">
	import OrgNodeText from './orgnodetext.svelte';
	import {
		type OrgBodyElement,
		isText,
		isPreformatted,
		isSource,
		isOrderedList,
		isUnorderedList,
		isTable
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
				{#each element.rows as row}
					<tr>
						{#each row as cell}
							<td>{cell}</td>
						{/each}
					</tr>
				{/each}
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
		{/if}
	{/each}
</div>
