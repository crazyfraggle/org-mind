<script lang="ts">
	import type { OrgText } from './types';
	import OrgLink from './orglink.svelte';

	export let text: OrgText;

	// Todo: Tokenize text to extract more markup:
	// - Bold, format: *bold*
	// - Italics, format: /italics/
	// - Underline, format: _underline_
	// - Strikethrough, format: +strikethrough+
	// - Code, format: ~code~
	// - Dates, format: <2021-01-01> or <2021-01-01 Fri>, <2021-01-01 Fri 12:00>, <2021-01-01 Fri 12:00-13:00>

	const orgLinkPattern = /\[\[([^\]]+)\](?:\[([^\]]+)\])?\]/g;
	const urlPattern = /\b[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s)>\]]+/g;

	type TextSeg = { kind: 'text'; text: string };
	type UrlSeg = { kind: 'url'; text: string };
	type LinkSeg = { kind: 'link'; target: string; description: string };
	type Segment = TextSeg | UrlSeg | LinkSeg;

	$: segments = tokenize(text.text);

	function tokenize(input: string): Segment[] {
		const parts: Segment[] = [];
		let lastIndex = 0;
		for (const match of input.matchAll(orgLinkPattern)) {
			if (match.index > lastIndex) {
				parts.push(...splitUrls(input.slice(lastIndex, match.index)));
			}
			parts.push({ kind: 'link', target: match[1], description: match[2] ?? '' });
			lastIndex = match.index + match[0].length;
		}
		if (lastIndex < input.length) {
			parts.push(...splitUrls(input.slice(lastIndex)));
		}
		return parts;
	}

	function splitUrls(input: string): Segment[] {
		const parts: Segment[] = [];
		let lastIndex = 0;
		for (const match of input.matchAll(urlPattern)) {
			if (match.index > lastIndex) {
				parts.push({ kind: 'text', text: input.slice(lastIndex, match.index) });
			}
			parts.push({ kind: 'url', text: match[0] });
			lastIndex = match.index + match[0].length;
		}
		if (lastIndex < input.length) {
			parts.push({ kind: 'text', text: input.slice(lastIndex) });
		}
		return parts;
	}
</script>

<p
	>{#each segments as seg}{#if seg.kind === 'url'}<a
				href={seg.text}
				target="_blank"
				rel="noopener">{seg.text}</a
			>{:else if seg.kind === 'link'}<OrgLink
				target={seg.target}
				description={seg.description}
			/>{:else}{seg.text}{/if}{/each}</p
>
