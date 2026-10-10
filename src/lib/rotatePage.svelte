<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { UIEventHandler } from 'svelte/elements';

	interface p {
		children: Snippet;
		angle: number;
		scrollPos: number;
	}
	let { children, angle, scrollPos = $bindable(0) }: p = $props();
	const onscroll: UIEventHandler<HTMLDivElement> = (e) => {
		scrollPos = e.currentTarget.scrollTop;
	};
</script>

<div class="viewport">
	<div class="body" style:transform="rotateX({angle}deg)">
		<div class="content" {onscroll}>
			{@render children()}
		</div>
	</div>
</div>

<style>
	.viewport {
		perspective: 300px;
		overflow: hidden;
	}
	.body {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: transform 400ms ease-in-out;
	}
	div {
		flex-grow: 1;
		overflow: auto;
		scroll-behavior: smooth;
		overflow-x: hidden;
	}
</style>
