<script lang="ts">
	import type { OrgText } from './types';

	export let text: OrgText;

	// Todo: Tokenize text to extract links, tags, etc.
	// We need:
	// - Links, format: [[link][description]] or anything starting with http(s)://
	// - Bold, format: *bold*
	// - Italics, format: /italics/
	// - Underline, format: _underline_
	// - Strikethrough, format: +strikethrough+
	// - Code, format: ~code~
	// - Dates, format: <2021-01-01> or <2021-01-01 Fri>, <2021-01-01 Fri 12:00>, <2021-01-01 Fri 12:00-13:00>
</script>

<p>{text.text}</p>
