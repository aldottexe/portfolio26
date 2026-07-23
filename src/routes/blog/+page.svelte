<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import type { Action } from 'svelte/action';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import type { UIEventHandler } from 'svelte/elements';
	const { data } = $props();

	const patternDistance = 150;

	let setSize: (size: { width: number; height: number }) => void;
	const size = new Promise<{ width: number; height: number }>((resolve) => {
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

	let maskSize: maskSize_T | undefined = $state();

	let scroll = $state(0);

	function updateMask(node: HTMLDivElement) {
		const r = node.getBoundingClientRect()
		maskSize = {
			w: r.width,
			h: r.height,
			x: r.x,
			y: r.y
		};
	}
	const updateMaskFromEvent: UIEventHandler<HTMLDivElement> = (e) => {
		updateMask(e.currentTarget)
	}


	let mask: Action<HTMLDivElement> = (node) => {
		updateMask(node)
	};

	let mouse = new Spring({ x: 0, y: 0 });
	let fieldPoint: Action<HTMLSpanElement> = (node) => {
		$effect(()=>{
			node.style.opacity = maskSize && (
			node.offsetLeft + node.offsetWidth < maskSize.x ||
			node.offsetLeft > maskSize.x + maskSize.w ||
			node.offsetTop + node.offsetHeight + node.offsetWidth / 2 + 10 < maskSize.y - scroll ||
			node.offsetTop > maskSize.y + maskSize.h - scroll
		) ? '100' : '0';
		});
		
		node.style.transition = 'transform 1200ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease-in-out';
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
	bind:scrollY={scroll}
/>

{#snippet loader()}
<span
		class="fixed top-0 left-0 z-3 h-full w-full bg-main-black flex items-center justify-center"
		transition:fade|global={{ duration: 300 }}>ummmmm...</span
	>
{/snippet}

<!-- background -->
{#await size}}
	{@render loader()}
{:then s}
		{#if mouse.current.x > 0 && maskSize}
			<div class="fixed top-0 left-0 z-0 flex h-screen w-full flex-col justify-around">
				{#each new Array(Math.floor(s.height / patternDistance)) as _, i (i)}
					<div class="flex justify-around">
						{#each new Array(Math.floor(s.width / patternDistance)) as _, j (j)}
							<span
								class="rounded-xs px-1 text-xs text-main-black"
								transition:fade|global={{
									duration: 300,
									delay: Math.hypot(Math.abs(j - 5), Math.abs(i - 5)) * 150
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
{/await}
<div class="pt-[50vh]">
	<div class="relative z-10 mx-auto box-content max-w-200 px-10" use:mask>
			<div class="py-5 px-2" 
			onresize={updateMaskFromEvent}
			>
				<h1 class="mb-1">Alex's Blog</h1>
				<p class="mb-5">Hi I'm alex, and this is my blog. Here you can find all kinds of ramblings. From experiments in tech, to life updates, to opinion pieces. Whatever you're looking for, I hope you find something you like.</p>
			</div>

		<ProjectList projects={data.projects} />
	</div>
</div>