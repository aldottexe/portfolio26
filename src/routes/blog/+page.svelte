<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import type { Action } from 'svelte/action';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import type { DOMAttributes, UIEventHandler } from 'svelte/elements';
	const { data } = $props();

	const patternDistance = 150;

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	let maskSize: DOMRect | undefined = $state();

	const mouse = new Spring({ x: 0, y: 0 });

	let updateMask: (() => void) | undefined = $state();

	let mask: Action<HTMLDivElement> = (node) => {
		updateMask = () => {
			maskSize = node.getBoundingClientRect()
		}
		requestAnimationFrame(updateMask)
	};

	let winSizeSynced = $state(false);
	let winSizeTimeout: NodeJS.Timeout | null = null;
	const resizeThrottler: UIEventHandler<Window> = (e) => {
		if (winSizeTimeout) clearTimeout(winSizeTimeout);

		winSizeSynced = false;
		winSizeTimeout = setTimeout(() => {
			const targetWindow = e.currentTarget as Window;
			windowWidth = targetWindow.innerWidth;
			windowHeight = targetWindow.innerHeight;
			if (updateMask) updateMask();
			winSizeSynced = true;
		}, 300);
	}
	const win: Action<Window> = (node) => {
		windowWidth = node.innerWidth;
		windowHeight = node.innerHeight;
		winSizeSynced = true;
	}

	let fieldPoint: Action<HTMLSpanElement> = (node) => {
		$effect(() => {
			const rect = node.getBoundingClientRect();
			node.style.opacity =
				maskSize && (
					rect.right < maskSize.x ||
					rect.left > maskSize.right ||
					rect.bottom < maskSize.y ||
					rect.top > maskSize.bottom
				)
					? '100'
					: '0'
		});
		
		node.style.transition = 'transform 1200ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease-in-out';
		$effect(() => {
			const atan = Math.atan2(
				mouse.current.y - node.offsetTop - node.offsetHeight / 2,
				mouse.current.x - node.offsetLeft - node.offsetWidth / 2
			);
			const r_up =
				atan > Math.PI / 2 ? atan - Math.PI : atan < -Math.PI / 2 ? atan + Math.PI : atan;
			const deg = (r_up * 180) / Math.PI;
			node.style.transform = `rotate(${deg}deg)`;
		});
	};
</script>

<svelte:window
	on:mousemove={(e) => {
		mouse.set({ x: e.clientX, y: e.clientY });
	}}
	on:scroll={updateMask}
	on:resize={resizeThrottler}
	use:win
/>

<!-- background -->

{#if mouse.current.x > 0 && maskSize && winSizeSynced}
	<div class="fixed top-0 left-0 z-0 flex h-screen w-full flex-col justify-between box-border px-5 py-4 md:px-9 md:py-8"
	>
		{#each new Array(Math.floor(windowHeight / patternDistance)) as _, i (i)}
			<div class="flex justify-between">
				{#each new Array(Math.floor(windowWidth / patternDistance)) as _, j (j)}
					<span
						class="rounded-xs px-1 text-xs text-main-black"
						in:fade|global={{
							duration: 300,
							delay: Math.hypot(
								Math.abs(j), 
								Math.abs(i)
							) * 150
						}}
						use:fieldPoint
					>
							<svg class="fill-main-green" width="50" height="34">
								<use href="/logo small.svg#shape" class="scale-[0.4]" />
							</svg>
					</span>
				{/each}
			</div>
		{/each}
	</div>
{/if}


<div class="pt-[50vh]">
	<div class="relative z-10 mx-auto box-content max-w-200 px-10 pb-3" use:mask>
			<div class="py-5 px-2" 
			onresize={updateMask}
			>
				<h1 class="mb-1">Alex's Blog</h1>
				<p class="mb-5">Hi I'm alex, and this is my blog. Here you can find all kinds of ramblings. From experiments in tech, to life updates, to opinion pieces. Whatever you're looking for, I hope you find something you like.</p>
			</div>

		<ProjectList projects={data.projects} />
	</div>
</div>