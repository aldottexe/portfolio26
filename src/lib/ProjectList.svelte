<script lang="ts">
	import { resolve } from '$app/paths';
	import { Spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import Pill from '$lib/Pill.svelte';
	import Glass from './Glass.svelte';

	type projects_T = {
		metadata?: Record<string, unknown>;
		slug: string;
	}[];

	interface Props {
		projects: projects_T;
	}

	let img = $state('');

	let pos = new Spring({ x: 10000, y: 10000 });

	const { projects }: Props = $props();
</script>

<svelte:window
	onmousemove={(e: MouseEvent) => {
		pos.set({ x: e.clientX, y: e.clientY });
	}}
/>

<div>
	{#each projects as p, i (i)}
		<div class="mb-10 lg:mb-5">
			<a
				class="relative flex flex-col justify-center rounded-xl p-2 transition-all duration-300 hover:scale-102 hover:border-main-white lg:h-20"
				href={resolve(`/p/${p.slug}`)}
				onmouseenter={() => (img = (p.metadata?.featureImage as string) || '')}
				onmouseleave={() => (img = '')}
			>
				<h3 class="mb-1 text-3xl font-light italic">
					<!-- {p.metadata?.emoji || '📎'} -->
					{p.metadata?.title || 'project'}
				</h3>
				<img
					class="top-2 right-2 bottom-2 rounded-md object-contain max-md:mb-2 max-md:w-30 md:absolute md:h-[calc(100%_-_1rem)]"
					style:border-color="#{p.metadata?.accent || ''}"
					src={p.metadata?.featureImage as string}
					alt="click to explore!"
				/>
				<div class="flex flex-wrap gap-1 max-lg:mb-5">
					{#each p.metadata?.tags?.split(',') as tag (tag)}
						<Pill>{tag}</Pill>
					{/each}
				</div>
				<div class="inset-0 items-center justify-center lg:absolute lg:flex">
					<p
						class=" w-fit max-w-80 border-main-orange lg:border-2 lg:border-t-0 lg:border-b-0 lg:px-2"
					>
						{p.metadata?.desc}
					</p>
				</div>
			</a>
		</div>
	{/each}
	{#key img}
		{#if img.length > 0}
			<img
				transition:fly|global={{ y: 10, duration: 100 }}
				class="pointer-events-none fixed block h-50 translate-[-20px]"
				src={img}
				alt="project preview"
				style:left={`${pos.current.x}px`}
				style:top={`${pos.current.y}px`}
			/>
		{/if}
	{/key}
	<!-- style={`top: ${pos.y}; left: ${pos.x};`} -->
</div>
