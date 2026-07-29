<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import { threeState } from './siteState.svelte';
	import { fade } from 'svelte/transition';

	const frames: Record<string, () => Promise<unknown>> = import.meta.glob('/static/transition/*');
	const links = ['', ...Object.keys(frames).map((k) => k.replaceAll(/\/static/g, ''))];

	let frame = $state(links.length);

	function animate(inc: boolean = true) {
		function step(inc: boolean = true, res: () => void) {
			if (inc) {
				frame++;
				if (frame < links.length + 1) setTimeout(() => step(inc, res), 50);
				else res();
			} else {
				frame--;
				if (frame > 0) setTimeout(() => step(inc, res), 50);
				else res();
			}
		}
		return new Promise<void>((res) => step(inc, res));
	}
	
	let loaded = false;
	$effect(() => {
		console.log("hello!")
		if(threeState.loaded && !loaded) {
			loaded = true
			animate(false)
		}
	});

	onNavigate((nav) => {
		return new Promise(async (res) => {
			await animate(true);
			res();
			await nav.complete;
			await new Promise(res => setTimeout(res, 200));
			await animate(false);
		});
	});
</script>

<!-- Preload all transition frames to avoid flickering -->
<svelte:head>
	{#each links as i (i)}
		<link rel="preload" href={i} as="image" />
	{/each}
</svelte:head>

{#if frame > 0}
	<img class="fixed z-50 h-full w-full object-cover" src={links[frame]} alt="Page is Loading" />
{/if}
{#if frame >= links.length}
	<div class="fixed z-51 h-full w-full bg-main-black"></div>
{/if}
{#if !threeState.loaded}
	<div 
		class="fixed z-51 h-full w-full flex items-center justify-center flex-col gap-5"
		in:fade|global={{duration: 1000}}
	>
<img src="logo.svg" class="w-20"/>
		<div>
		{#each "Loading..." as l, i (i)}
			<span 
				class="animate-bounce inline-block" 
				style="animation-delay: {i * 10}ms" 
				
			>
				{l}
			</span>
		{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
