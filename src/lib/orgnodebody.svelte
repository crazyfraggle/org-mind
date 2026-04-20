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
			<a class="org-link" href={element.target} title={element.target}>{element.description}</a>
		{/if}
	{/each}
</div>
