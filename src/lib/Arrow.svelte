<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Action } from 'svelte/action';

	interface props_T {
		c1var?: string;
		c2var?: string;
		className?: string;
		children: Snippet;
		href: string;
	}

	const {
		c1var = '--color-light-green',
		c2var = '--color-main-green',
		className,
		children,
		href = ''
	}: props_T = $props();

	const downScale = 6;

	let ew: number = $state(0);
	let eh: number = $state(0);

	const arrow: Action<HTMLCanvasElement> = (node: HTMLCanvasElement) => {
		// colors
		let styles;
		if (document) {
			styles = getComputedStyle(document.documentElement);
		}
		let c1 = c1var[0] === '#' ? c1var : styles?.getPropertyValue(c1var) || 'black';
		let c2 = c2var[0] === '#' ? c2var : styles?.getPropertyValue(c2var) || 'white';

		let w = $derived(Math.floor(ew / downScale));
		let h = $derived(Math.floor(eh / downScale));

		// canvas time
		const c = node.getContext('2d');
		//size
		$effect(() => {
			if (c) {
				c.canvas.width = w;
				c.canvas.height = h;
			}
		});

		let lastTime = -999;
		let delay = 1000 / 24;

		let frame = 0;
		function animate(now: number) {
			if (now - lastTime > delay) {
				draw(frame);
				lastTime = now;
				frame++;
			}
			requestAnimationFrame(animate);
		}
		requestAnimationFrame(animate);

		function draw(frame: number) {
			const arrowCount = 24;

			c.globalCompositeOperation = 'source-over';
			if (c) {
				const offset = (frame % 24) / 24 / arrowCount;

				const g1 = c.createLinearGradient(-w, -w, 2 * w, w + h);

				for (let i = 0; i < arrowCount; i++) {
					const arrowOffset = i / arrowCount;
					g1.addColorStop([offset + arrowOffset, 1].sort()[0], c2);
					g1.addColorStop([offset + arrowOffset + 0.005, 1].sort()[0], c1);
				}

				c.fillStyle = g1;
				c.fillRect(0, h / 2, w, h);

				const g2 = c.createLinearGradient(-w, w + h, 2 * w, -w);

				for (let i = 0; i < arrowCount; i++) {
					const arrowOffset = i / arrowCount;
					g2.addColorStop([offset + arrowOffset, 1].sort()[0], c2);
					g2.addColorStop([offset + arrowOffset + 0.005, 1].sort()[0], c1);
					c.fillStyle = g2;
				}
				c.fillRect(0, 0, w, h / 2);
			}
		}
	};
</script>

<a class={className} {href}>
	<canvas use:arrow bind:offsetWidth={ew} bind:offsetHeight={eh}></canvas>
	{@render children()}
</a>

<style>
	a {
		position: relative;
		color: var(--color-main-white);
		font-style: italic;
		font-weight: 900;
		padding: 10px;
		width: 100%;
	}
	canvas {
		image-rendering: pixelated;
		position: absolute;
		height: 100%;
		width: inherit;
		inset: 0;
		z-index: -1;
		border-radius: 8px;
		background-color: var(--color-main-green);
	}
</style>
