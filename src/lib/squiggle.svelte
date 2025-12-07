<script lang="ts">
	import type { Snippet } from 'svelte';
	const { children }: { children: Snippet } = $props();

	const sw = 20; // squiggle width
	const sh = 7; // squiggle height

	let clientWidth = $state(0);
	let clientHeight = $state(0);

	let tb: string = $state();
	let lr: string = $state();
	$effect(() => {
		let horizontalBorder = 'M2,2 ';
		for (let i = 0; i < clientWidth / sw + 1; i++) {
			horizontalBorder += !(i % 2)
				? `c${sw / 2},0,${sw / 2},${sh},${sw},${sh} `
				: `c${sw / 2},0,${sw / 2},-${sh},${sw},-${sh} `;
		}
		tb = horizontalBorder;
	});
</script>

<div class="relative w-fit px-5 py-3" bind:clientWidth bind:clientHeight>
	{@render children()}
	<svg
		viewBox="0 0 {clientWidth} {clientHeight}"
		width={clientWidth}
		height={clientHeight}
		class="absolute inset-0 z-[-1] bg-main-gray"
	>
		<path
			class="fill-transparent stroke-main-orange stroke-2"
			vector-effect="non-scaling-stroke"
			d={tb}
		>
			<!-- <animate -->
			<!-- 	attributeName="d" -->
			<!-- 	values=" -->
			<!--               M2,2 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 ;  -->
			<!--               M2,22 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 ;  -->
			<!--               M2,2 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20 c10,0,10,20,20,20 c10,0,10,-20,20,-20  -->
			<!--           " -->
			<!-- 	keyTimes="0; 0.5; 1" -->
			<!-- 	dur="5s" -->
			<!-- 	repeatCount="indefinite" -->
			<!-- 	calcMode="spline" -->
			<!-- 	keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" -->
			<!-- ></animate> -->
		</path>
	</svg>
</div>
