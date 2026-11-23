<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { UIEventHandler } from 'svelte/elements';

	interface p {
		children: Snippet;
		flip: boolean;
		scrollPos: number;
		scrollTo: () => void;
	}
	let { children, flip, scrollPos = $bindable(0), scrollTo = $bindable(() => {}) }: p = $props();

	const onscroll: UIEventHandler<HTMLDivElement> = (e) => {
		scrollPos = e.currentTarget.scrollTop;
	};

	let content: HTMLDivElement | null = $state(null);

	scrollTo = () => content?.scrollTo({top: 0, behavior: 'instant'});
</script>

<div class="viewport">
	<div class="body {flip ? 'flip' : ''}">
		<div class="content" {onscroll} bind:this={content}>
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
		transition: all 600ms ease-in-out;
      transform: rotateX(0deg);
      opacity: 100%;
      filter: blur(0px);
	}
	div {
		flex-grow: 1;
		overflow: auto;
		scroll-behavior: smooth;
		overflow-x: hidden;
	}
   .flip {
      transform: rotateX(90deg);
      opacity: 0%;
      filter: blur(5px);
   }
</style>
