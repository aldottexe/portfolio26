<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { threeState } from './siteState.svelte';

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

	let loaded = $state(false);
	let to: NodeJS.Timeout | undefined;
	$effect(() => {
		if (threeState.loaded && !loaded && !to) {
			to = setTimeout(() => {
				loaded = true;
				animate(false);
			}, 1000);
		}
	});

	onNavigate((nav) => {
		return new Promise(async (res) => {
			await animate(true);
			res();
			await nav.complete;
			await new Promise((res) => setTimeout(res, 200));
			await animate(false);
		});
	});
</script>

<!-- Preload all transition frames to avoid flickering -->
<svelte:head>
	{#each links as i (i)}
		<link rel="preload" href={i} as="image" />
	{/each}
	<link rel="preload" href="/logo.svg" as="image"/>
</svelte:head>

{#if frame > 0}
	<img class="fixed z-50 h-full w-full object-cover" src={links[frame]} alt="Page is Loading" />
{/if}
{#if frame >= links.length}
	<div class="fixed z-51 h-full w-full bg-main-black"></div>
{/if}
{#if !loaded}
	<div class="fadein fixed z-51 flex h-full w-full flex-col items-center justify-center gap-5">
		<img src="/logo.svg" class="block w-20" alt="welcome!"/>
		<p class="pl-1">
			{#each 'Loading...' as l, i (i)}
				<span class="inline-block animate-bounce" style="animation-delay: {i * 10}ms">
					{l}
				</span>
			{/each}
			</p>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
	.fadein {
		animation: f 200ms 200ms both;
	}
	@keyframes f {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
