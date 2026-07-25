<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import type { Action } from 'svelte/action';
	import { scale } from 'svelte/transition';
	import { Spring } from 'svelte/motion';
	import type { UIEventHandler } from 'svelte/elements';
	import Squiggle from '$lib/squiggle.svelte';
	const { data } = $props();

	const patternDistance = 120;

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
			node.style.scale =
				maskSize && (
					rect.right < maskSize.x ||
					rect.left > maskSize.right ||
					rect.bottom < maskSize.y ||
					rect.top > maskSize.bottom
				)
					? '1'
					: '0'
		});
		
		node.style.transition = `transform 1200ms cubic-bezier(.2,.8,.2,1), scale 1200ms cubic-bezier(.2,.8,.2,1) ${Math.floor(Math.random() * 200)}ms`;
		let lastDeg = 0;
		let currentScale = 0;
		let timeout: NodeJS.Timeout | null = null;
		$effect(() => {
			const atan = Math.atan2(
				mouse.current.y - node.offsetTop - node.offsetHeight / 2,
				mouse.current.x - node.offsetLeft - node.offsetWidth / 2
			);
			// const r_up =
			// 	atan > Math.PI / 2 ? atan - Math.PI : atan < -Math.PI / 2 ? atan + Math.PI : atan;
			const deg = (atan * 180) / Math.PI;
			if (lastDeg % 360 - deg > 180) lastDeg += 360;
			if (lastDeg % 360 - deg < -180) lastDeg -= 360;

			const newdeg = lastDeg - lastDeg % 360 + deg;

			lastDeg = newdeg;
			const scale = mouse.current.x > node.offsetLeft + node.offsetWidth / 2 ? 0 : 180;
			
			if (currentScale !== scale) {
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(() => {
					currentScale = scale;
					node.style.transform = `rotate(${newdeg}deg) rotateY(${scale}deg) rotateX(${scale}deg)`;
				}, Math.random() * 500);
			}
			node.style.transform = `rotate(${newdeg}deg) rotateY(${scale}deg) rotateX(${currentScale}deg)`;
			
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
	<div class="fixed top-0 left-0 z-0 flex h-screen w-full flex-col justify-between box-border px-5 py-20 md:px-30 md:py-20"
	>
		{#each new Array(Math.floor(windowHeight / patternDistance)) as _, i (i)}
			<div class="flex justify-between">
				{#each new Array(Math.floor(windowWidth / patternDistance)) as _, j (j)}
					<span
						class="rounded-xs px-1 text-xs text-main-black"
						use:fieldPoint
						style="animation: pulse 3s ease-in-out {Math.floor(Math.random() * 2000)}ms infinite"
					>
							<svg 
								class="fill-main-green" width="34" height="24" 						
								in:scale|global={{
									duration: 300,
									delay: Math.hypot(
										Math.abs(j), 
										Math.abs(i)
									) * 150
								}}>
								<use href="/logo small.svg#shape" class="scale-[0.3]" />
							</svg>
					</span>
				{/each}
			</div>
		{/each}
	</div>
{/if}


<div class="pt-[35vh]">
	<div class="relative z-5 mx-auto box-content max-w-200 px-5 pb-3" use:mask>
			<div class="py-5 px-2" 
			onresize={updateMask}
			>
				<h1 class="mb-5">Alex's Blog</h1>
				<Squiggle>
					<p class="p-5">Hi I'm Alex, and this is my blog. Here you can find all kinds of ramblings ~ from experiments in tech, to life updates, to opinion pieces. Whatever you're looking for, I hope you find something you like :-)</p>
				</Squiggle>
				
			</div>

		<ProjectList projects={data.projects} />
	</div>
</div>

<style lang="postcss">
	@keyframes pulse {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>