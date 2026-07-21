<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
    
	import type { Action } from 'svelte/action';
	import {fade} from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	const { data } = $props();

	let setSize: (size: {width: number, height: number}) => void;
	const size = new Promise<{width: number, height: number}>((resolve) => {
		setSize = resolve;
	});
	onMount(() => {
		setSize({ width: window.innerWidth, height: window.innerHeight });
	});

	interface maskSize_T {
		w: number;
		h: number;
		x: number;
		y: number;
	}
	let setMaskSize: (size: maskSize_T) => void;
	const maskSize: Promise<maskSize_T> = new Promise((resolve) => {
		setMaskSize = resolve;
	});

	let mask: Action<HTMLDivElement> = (node) => {
		setMaskSize({ w: node.offsetWidth, h: node.offsetHeight, x: node.offsetLeft, y: node.offsetTop });
	}

	let mouse = new Spring({ x: 0, y: 0 });
	let fieldPoint: Action<HTMLSpanElement, maskSize_T> = (node, mask) => {
		if (
			node.offsetLeft < mask.x 
			|| node.offsetLeft > mask.x + mask.w 
			|| node.offsetTop < mask.y 
			|| node.offsetTop > mask.y + mask.h
		) {
node.style.transition = 'transform 1200ms cubic-bezier(.2,.8,.2,1)';
		$effect(() => {
			const atan = Math.atan2(mouse.current.y - node.offsetTop - node.offsetHeight / 2, mouse.current.x - node.offsetLeft - node.offsetWidth / 2);
			const r_up = atan > Math.PI / 2 ? atan - Math.PI : atan < -Math.PI / 2 ? atan + Math.PI : atan;
			const deg = r_up * 180 / Math.PI;
			node.style.transform = `rotate(${deg}deg)`;
		});
		} else {
			node.style.opacity = '0';
		}
		
	}

</script>
<svelte:window on:mousemove={(e) => {
		mouse.set({ x: e.clientX, y: e.clientY });
	}}
/>

<!-- background -->
{#await size}}
	<span class="fixed top-0 left-0 w-full h-full bg-main-black z-3" transition:fade|global={{ duration: 300 }}>ummmmm...</span>
{:then s} 
	{#await maskSize}}
		<span class="fixed top-0 left-0 w-full h-full bg-main-black z-3" transition:fade|global={{ duration: 300 }}>ummmmm...</span>
	{:then m}
	{#if mouse.current.x > 0}
		<div class="flex justify-around h-screen flex-col absolute top-0 left-0 w-full z-0">
			{#each new Array(Math.floor(s.height / 100)) as _, i}
		<div class="flex justify-around">
		{#each new Array(Math.floor(s.width / 100)) as _, j}
			<span 
				class="text-xs bg-main-white text-main-black rounded-xs px-1" 
				transition:fade|global={{ duration: 300, delay: Math.hypot(Math.abs(j- 5), Math.abs(i- 5)) * 300 }} 
				use:fieldPoint={m}
			>
				Alex's Blog
			</span>
		{/each}
		</div>	
	{/each}

</div>
{/if}
{/await}


<div class="mx-auto box-content max-w-200 px-10 z-10 relative">
<div class="h-screen flex justify-center items-center">	
	<div class="bg-main-black rounded-md padding-lg rounded-lg px-5 py-2"
	use:mask
	>
	<h1 class="mb-1">Alex's Blog</h1>
		<p class="mb-5">Here you can find all of my non-work related ramblings.</p>
	</div>	

</div>

	<ProjectList projects={data.projects} />
</div>
{/await}