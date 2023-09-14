<script lang="ts">
	import type { Crumb } from './crumb';

	export let crumbs: Crumb[] = [];
</script>

{#each crumbs as crumb}
	<span class="crumb">{crumb.title}</span>
{/each}
