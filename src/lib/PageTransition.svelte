<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { tick } from 'svelte';

	const frames: Record<string, ()=>Promise<unknown>> = import.meta.glob('/static/transition/*')
	const links = ["", ...Object.keys(frames).map(k => k.replaceAll(/\/static/g, ""))];
	console.log(frames);

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
			await animate(true);
			res();
			await nav.complete;
			randomizeRotation();
			await tick();
			await animate(false);
			randomizeRotation();
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
		class="fixed h-full object-cover z-50 w-full"
		src={links[frame]}
		alt="Page is Loading"	
	/>
{/if}
{#if frame == links.length}
	<div class="fixed h-full z-51 w-full bg-main-black"></div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
