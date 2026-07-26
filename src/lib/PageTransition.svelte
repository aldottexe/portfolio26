<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import type { Action } from '@sveltejs/kit';
	import { tick } from 'svelte';

	const frames: Record<string, ()=>Promise<unknown>> = import.meta.glob('/static/transition/*')
	const links = ["", ...Object.keys(frames).map(k => k.replaceAll(/\/static/g, ""))];
	console.log(frames);

	let transitioning = $state(false);
	let frame = $state(0);

	function animate(inc: boolean = true) {
		function step(inc: boolean = true, res: () => void) {
			if (inc) {
				frame++;
				if (frame < links.length + 1)
					setTimeout(()=>step(inc, res), 50);
				else
					res();
			} else {
				frame--;
				if (frame > 0)
					setTimeout(()=>step(inc, res), 50);
				else
					res();
			}	
		}
		return new Promise<void>((res) => step(inc, res));
	}
	

	onNavigate((nav) => {
		return new Promise(async (res) => {
			transitioning = true;
			await animate(true);
			res();
			await nav.complete;
			await tick();
			await animate(false);
			transitioning = false;
		});
	});

</script>

<!-- Preload all transition frames to avoid flickering -->
<svelte:head>
	{#each links as i}
		<link rel="preload" href={i} as="image"/>
	{/each}
</svelte:head>

{#if frame > 0}
<img
	class={`fixed h-full object-cover z-50 w-full transition-[height] duration-300 pointer-events-none`}
	src={links[frame]}
	alt="Page is Loading"
	style:background={frame === links.length ? "#d9d9d9" : "transparent"}
/>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
