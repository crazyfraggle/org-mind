<script lang="ts">
	import type { OrgText } from './types';

	export let text: OrgText;

	// Todo: Tokenize text to extract more markup:
	// - Bold, format: *bold*
	// - Italics, format: /italics/
	// - Underline, format: _underline_
	// - Strikethrough, format: +strikethrough+
	// - Code, format: ~code~
	// - Dates, format: <2021-01-01> or <2021-01-01 Fri>, <2021-01-01 Fri 12:00>, <2021-01-01 Fri 12:00-13:00>

	const urlPattern = /(\b[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s)>\]]+)/g;

	type Segment = { text: string; url: boolean };

	$: segments = splitUrls(text.text);

	function splitUrls(input: string): Segment[] {
		const parts: Segment[] = [];
		let lastIndex = 0;
		for (const match of input.matchAll(urlPattern)) {
			if (match.index > lastIndex) {
				parts.push({ text: input.slice(lastIndex, match.index), url: false });
			}
			parts.push({ text: match[1], url: true });
			lastIndex = match.index + match[0].length;
		}
		if (lastIndex < input.length) {
			parts.push({ text: input.slice(lastIndex), url: false });
		}
		return parts;
	}
</script>

<p>{#each segments as seg}{#if seg.url}<a href={seg.text} target="_blank" rel="noopener">{seg.text}</a>{:else}{seg.text}{/if}{/each}</p>
