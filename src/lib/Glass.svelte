<script lang="ts">
	//big thanks to https://codepen.io/jh3y/pen/EajLxJV

	import { onMount, type Snippet } from 'svelte';

	interface p {
		children: Snippet;
		radius?: number;
		className?: string;
	}

	let w = $state(0);
	let h = $state(0);
	let imgUrl = $state('');

	const { children, radius = 14, className = '' }: p = $props();
	const shaderid = $props.id();

	const border = 3;

	onMount(() => {
		const c = document.createElement('canvas');

		function drawMap(w: number, h: number) {
			c.width = w;
			c.height = h;
			const ctx = c.getContext('2d');
			if (ctx) {
				const xgrad = ctx.createLinearGradient(0, 0, c.width, 0);
				xgrad.addColorStop(0, 'rgb(0, 0, 0)');
				xgrad.addColorStop(1, 'rgb(255, 0, 0)');
				ctx.fillStyle = xgrad;
				ctx.fillRect(0, 0, c.width, c.height);

				ctx.globalCompositeOperation = 'difference';
				const ygrad = ctx.createLinearGradient(0, 0, 0, c.height);
				ygrad.addColorStop(1, 'rgb(0, 0, 0)');
				ygrad.addColorStop(0, 'rgb(0, 255, 0)');
				ctx.fillStyle = ygrad;
				ctx.fillRect(0, 0, c.width, c.height);

				ctx.globalCompositeOperation = 'source-atop';
				ctx.fillStyle = 'rgb(128, 128, 128)';
				ctx.beginPath();
				ctx.roundRect(border, border, c.width - 2 * border, c.height - 2 * border, radius);
				ctx.fill();
			}
			imgUrl = c.toDataURL();
		}
		let to = 0;
		function queueRedraw(w: number, h: number) {
			window.clearTimeout(to);
			to = window.setTimeout(() => {
				drawMap(w, h);
			}, 20);
		}
		$effect(() => {
			queueRedraw(w, h);
		});
	});
</script>

<div
	class="glass {className}"
	bind:offsetWidth={w}
	bind:offsetHeight={h}
	style:border-radius={radius + 'px'}
	style:backdrop-filter="url(#shader{shaderid}) blur(1px)"
>
	{@render children()}
</div>
<svg hidden>
	<defs>
		<filter id="shader{shaderid}" color-interpolation-filters="sRGB">
			<!-- Load the displacement map image -->
			<feImage href={imgUrl} result="mapRaw" x="0" y="0" width={w} height={h} id="displacement-map"
			></feImage>
			<feGaussianBlur in="mapRaw" stdDeviation="5" result="map" />

			<!-- RED channel - strongest displacement -->
			<feDisplacementMap
				in="SourceGraphic"
				in2="map"
				scale="55"
				xChannelSelector="R"
				yChannelSelector="G"
				result="dispRed"
			/>
			<feColorMatrix
				in="dispRed"
				type="matrix"
				values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
				result="red"
			/>

			<!-- GREEN channel - medium displacement (reference) -->
			<feDisplacementMap
				in="SourceGraphic"
				in2="map"
				scale="45"
				xChannelSelector="R"
				yChannelSelector="G"
				result="dispGreen"
			/>
			<feColorMatrix
				in="dispGreen"
				type="matrix"
				values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
				result="green"
			/>

			<!-- BLUE channel - least displacement -->
			<feDisplacementMap
				in="SourceGraphic"
				in2="map"
				scale="35"
				xChannelSelector="R"
				yChannelSelector="G"
				result="dispBlue"
			/>
			<feColorMatrix
				in="dispBlue"
				type="matrix"
				values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
				result="blue"
			/>

			<!-- Blend all channels back together -->
			<feBlend in="red" in2="green" mode="screen" result="rg" />
			<feBlend in="rg" in2="blue" mode="screen" />
		</filter>
	</defs>
</svg>

<style>
	.glass {
		box-shadow:
			0 0 10px 1px rgba(255, 255, 255, 0.05) inset,
			0 8px 32px rgba(0, 0, 0, 0.05);
		border: 1px solid #ffffff55;
		background: rgba(255, 255, 255, 0.1);
	}
</style>
