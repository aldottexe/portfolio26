<script lang="ts">
	import BlogTree from './BlogTree.svelte';
	import { resolve } from '$app/paths';
	import { Spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	interface tree_T {
		subdirs: { [key: string]: tree_T };
		pages: { [key: string]: [string, Record<string, unknown> | undefined] };
	}

	interface Props {
		tree: tree_T;
		even?: boolean;
	}

	let img = $state('');

	let pos = new Spring({ x: 10000, y: 10000 });

	const { tree, even }: Props = $props();
	let open = $state(new Array(Object.keys(tree.subdirs).length).fill(false));

	function checkerF(i: number): string {
		return i + ((even ? 1 : 0) % 2) ? 'bg-main-black' : 'bg-alt-black';
	}
	function checker(i: number): string {
		return (open.length + i + (even ? 1 : 0)) % 2 ? 'bg-main-black' : 'bg-alt-black';
	}
</script>

<svelte:window
	onmousemove={(e: MouseEvent) => {
		pos.set({ x: e.clientX, y: e.clientY });
	}}
/>

{#snippet important(name: string, path: string, metadata: unknown, i: number)}
	<a
		class={`block rounded-lg rounded-r-xl p-2 ${checker(i)} flex justify-between transition-colors duration-150 hover:bg-main-blue`}
		href={resolve(`/p/${path}`)}
		onmouseenter={() => (img = (metadata?.featureImage as string) || '')}
		onmouseleave={() => (img = '')}
		><span class="block">{metadata?.emoji || '📎'} {name}</span><img
			class="max-h-20 rounded-md border-2"
			style:border-color="#{metadata?.accent || ''}"
			src={metadata?.featureImage as string}
			alt="click to explore!"
		/></a
	>
{/snippet}

<div>
	{#each Object.entries(tree.subdirs) as [name, d], i (i)}
		<div class="">
			<button
				class={`block w-full rounded-md p-2 text-left ${checkerF(i)} transition-colors duration-150 hover:bg-main-blue`}
				onclick={() => (open[i] = !open[i])}
			>
				{`${open[i] ? '📂' : '📁'} ${name}/`}
			</button>
			{#if open[i]}
				<div
					class={`mt-2 mb-3 ml-4 rounded-bl-xl border-b-2 
									border-l-2 pb-4 pl-4 ${['border-main-blue', 'border-main-green', 'border-main-orange'][i % 3]}`}
				>
					<BlogTree tree={d} even={i % 2 === 0} />
				</div>
			{/if}
		</div>
	{/each}
	{#each Object.entries(tree.pages) as [name, [path, metadata]], i (i)}
		{#if metadata?.important || false}
			{@render important(name, path, metadata, i)}
		{:else}
			<a
				class={`block rounded-md p-2 ${checker(i)} transition-colors duration-150 hover:bg-main-blue`}
				href={resolve(`/p/${path}`)}
				onmouseenter={() => (img = (metadata?.featureImage as string) || '')}
				onmouseleave={() => (img = '')}>{metadata?.emoji || '📎'} {name}</a
			>
		{/if}
	{/each}
	{#key img}
		{#if img.length > 0}
			<img
				transition:fly|global={{ y: 10, duration: 100 }}
				class="pointer-events-none fixed block h-60 translate-[-20px]"
				src={img}
				alt="project preview"
				style:left={`${pos.current.x}px`}
				style:top={`${pos.current.y}px`}
			/>
		{/if}
	{/key}
	<!-- style={`top: ${pos.y}; left: ${pos.x};`} -->
</div>
