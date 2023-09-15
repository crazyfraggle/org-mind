<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isExpanded = false;
	export let exits: number[] = [];

	const dispatch = createEventDispatcher();
	let canvasElement: HTMLCanvasElement | null = null;
	let expanderContainer: HTMLDivElement | null = null;

	const updateLines = (exits: number[], isExpanded: boolean) => {
		// Get canvas element.
		const ctx = canvasElement?.getContext('2d');
		console.log(canvasElement, ctx);
		if (!ctx || !canvasElement || !expanderContainer) return;
		canvasElement.width = expanderContainer.clientWidth;
		canvasElement.height = expanderContainer.clientHeight;

		// Get canvas size.
		const canvasRect = canvasElement.getBoundingClientRect();
		const canvasWidth = canvasRect.width;
		const canvasHeight = canvasRect.height;
		console.log(canvasWidth, canvasHeight);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		ctx.beginPath();

		ctx.moveTo(0, canvasHeight / 2);
		ctx.lineTo(canvasWidth / 2, canvasHeight / 2);

		exits.forEach((exit) => {
			ctx.moveTo(canvasWidth / 2, canvasHeight / 2);
			ctx.arcTo(canvasWidth / 2, exit, canvasWidth, exit, canvasWidth / 2);
		});
		ctx.stroke();
	};

	$: buttonLabel = isExpanded ? '➖' : '➕';
	$: dispatch('expanded', isExpanded);
	$: updateLines(exits, isExpanded);
</script>

<div class="expander" bind:this={expanderContainer}>
	<label class="expander">{buttonLabel}<input bind:checked={isExpanded} type="checkbox" /></label>
	<canvas bind:this={canvasElement} />
</div>

<style lang="scss">
	// Mirror the canvas horizontally if the expander is on the left.
	@container style(--rol: left) {
		canvas {
			transform: scale(-1, 1);
		}
	}

	div.expander {
		flex-shrink: 0;
		width: 2em;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: stretch;
		position: relative;

		canvas {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			// background-color: rgba(0, 0, 0, 0.1);
		}
	}
	label {
		display: flex;
		align-items: center;
		width: 1.5em;
		height: 1.5em;
		border-radius: 50%;
		border: 0.5px solid black;
		background: white;
	}

	input {
		display: none;
	}
</style>
