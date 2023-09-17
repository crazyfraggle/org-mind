<script lang="ts">
	import type { OrgText } from './types';

	export let text: OrgText;

	// Todo: Tokenize text to extract links, tags, etc.
	// We need:
	// - Links
	// - Bold
	// - Italics
	// - Underline
	// - Strikethrough
	// - Code
	// - Dates
</script>

<p>{text.text}</p>
