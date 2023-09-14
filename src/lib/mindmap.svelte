<script lang="ts">
	import type { OrgNode } from '$lib/orgtree';
	import { afterUpdate } from 'svelte';
	import Breadcrumb from './breadcrumb.svelte';
	import Topic from './topic.svelte';

	export let orgtree: OrgNode;
	export let level: number = 0;
	let rightOnly = false;
	$: splitNodes = !rightOnly && orgtree.children.length > 2;
	$: splitPoint = splitNodes ? Math.ceil(orgtree.children.length / 2) : orgtree.children.length;
	$: rightNodes = orgtree.children.slice(0, splitPoint);
	$: leftNodes = orgtree.children.slice(splitPoint);

	let leftPositions: DOMRect[] = [];
	let rightPositions: DOMRect[] = [];
	$: console.log(leftPositions, rightPositions);
	console.log(orgtree);

	// Update size of canvas to fit the map div after update.
	const updateCanvas = () => {
		// Hack to make sure the canvas is sized correctly after the DOM is updated.
		setTimeout(() => {
			const map = document.getElementById('map');
			const canvas = document.querySelector('canvas');
			if (!map || !canvas) return;

			canvas.width = map.clientWidth;
			canvas.height = map.clientHeight;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			// Draw lines from the root node to the topic nodes.
			// Get position of #root relative to #map.
			const root = document.getElementById('root');
			if (!root) return;
			const mapRect = map.getBoundingClientRect();
			const rootRect = root.getBoundingClientRect();
			const rightX = rootRect.x + (rootRect.width * 7) / 8;
			const rightY = rootRect.y + rootRect.height / 2;
			const leftX = rootRect.x + (rootRect.width * 1) / 8;
			const leftY = rootRect.y + rootRect.height / 2;

			document.querySelectorAll('#right .topic').forEach((topic) => {
				const topicRect = topic.getBoundingClientRect();
				const topicX = topicRect.x;
				const topicY = topicRect.y + topicRect.height / 2;
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(rightX - mapRect.x, rightY - mapRect.y);
				ctx.lineTo(topicX - mapRect.x, topicY - mapRect.y);
				ctx.stroke();
			});
			document.querySelectorAll('#left .topic').forEach((topic) => {
				const topicRect = topic.getBoundingClientRect();
				const topicX = topicRect.x + topicRect.width;
				const topicY = topicRect.y + topicRect.height / 2;
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(leftX - mapRect.x, leftY - mapRect.y);
				ctx.lineTo(topicX - mapRect.x, topicY - mapRect.y);
				ctx.stroke();
			});
			// rightPositions.forEach((pos) => {
			// 	// ctx.clearRect(0, 0, canvas.width, canvas.height);
			// 	ctx.strokeStyle = 'black';
			// 	ctx.lineWidth = 2;
			// 	ctx.beginPath();
			// 	ctx.moveTo(rootX - mapRect.x, rootY - mapRect.y);
			// 	ctx.lineTo(pos.x - mapRect.x, pos.y - mapRect.y + pos.height / 2);
			// 	ctx.stroke();
			// });
		}, 0);
	};
	afterUpdate(updateCanvas);
</script>

<Breadcrumb
	crumbs={[
		{ title: orgtree.title, node: orgtree },
		{ title: orgtree.children[0].title, node: orgtree.children[0] }
	]}
/>

<div class="settings">
	<label><input type="checkbox" bind:checked={rightOnly} />Right only</label>
	<label>Level: <input type="number" bind:value={level} /></label>
</div>

<div id="mapContainer">
	<div id="map">
		{#if !rightOnly}
			<ul id="left">
				{#each leftNodes as child, idx}
					<Topic orgnode={child} bind:position={leftPositions[idx]} on:expanded={updateCanvas} />
				{/each}
			</ul>
		{/if}
		<div id="root">
			<span class="title">{orgtree.title}</span>
		</div>
		<ul id="right">
			{#each rightNodes as child, idx}
				<Topic orgnode={child} bind:position={rightPositions[idx]} on:expanded={updateCanvas} />
			{/each}
		</ul>
	</div>
	<canvas />
</div>

<style lang="scss">
	#map {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	#mapContainer {
		position: relative;

		canvas {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			background-color: aqua;
		}
	}
	ul {
		margin: 0;
		padding: 0;
	}
	#left {
		--rol: left;
		flex-direction: row-reverse;
		margin-right: 40px;
	}

	#right {
		--rol: right
		flex-direction: row;
		margin-left: 40px;
	}

	div#root {
		background: darkcyan;
		border: 1px solid cyan;
		border-radius: 5px;
		padding: 5px 10px;
		font-size: 125%;
	}

	.highlight {
		border: 2px solid blue;
	}
</style>