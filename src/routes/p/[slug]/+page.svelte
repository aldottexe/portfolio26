<script lang="ts">
	import Pill from '$lib/Pill.svelte';
	import type { PageProps } from '../$types';
	// import Backdrop from '$lib/Backdrop.svelte';
	// import Border from '$lib/Border.svelte';

	const { data }: PageProps = $props();
	const Post = data.component;
	const meta = data.metadata;
	const accent = '#' + (meta.accent || 'ec4e20');
	const r = parseInt(accent.substring(1, 3), 16);
	const g = parseInt(accent.substring(3, 5), 16);
	const b = parseInt(accent.substring(5, 7), 16);
	const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;
	console.log(luminosity);

	const colorClass =
		luminosity > 127 ? 'text-main-black border-main-black' : 'text-main-white border-main-white';
</script>

<!-- <Border primary={accent} /> -->
<!-- <Backdrop primaryC={accent} /> -->

<div class="relative">
	<div class="grid h-screen w-full place-content-center">
		{#if meta.featureVid}
			<video class="rounded-5xl max-h-screen px-5 py-20" src={meta.featureVid} loop autoplay muted
			></video>
		{:else}
			<img class="rounded-5xl max-h-screen px-5 py-20" src={meta.featureImage} />
		{/if}
	</div>
	<div
		class="content sticky top-20 right-2 bottom-8 left-2 mx-5 flex h-[52px] flex-wrap items-baseline justify-between px-5"
	>
		<h1 class="bg-main-black font-light tracking-[-2px] italic">
			{meta.title}
		</h1>
		<div class="flex flex-wrap gap-1">
			{#each meta.tags.split(',') as tag}
				<Pill>{tag}</Pill>
			{/each}
		</div>
	</div>

	<div
		class="prose min-h-screen px-10 pt-20 prose-headings:text-main-white prose-p:text-main-white"
	>
		<Post />
	</div>
</div>

<style>
</style>
