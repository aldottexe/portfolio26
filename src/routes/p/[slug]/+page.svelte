<script lang="ts">
	import Pill from '$lib/Pill.svelte';
	import type { PageProps } from '../$types';
	// import Backdrop from '$lib/Backdrop.svelte';
	// import Border from '$lib/Border.svelte';

	const { data }: PageProps = $props();
	const Post = data.component;
	const meta = data.metadata;
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
		class="content sticky top-16 right-2 bottom-8 left-2 mx-5 flex h-[52px] flex-wrap items-baseline justify-between px-5"
	>
		<h1 class="rounded-md bg-main-black font-light tracking-[-2px] italic">
			{meta.title}
		</h1>
		<div class="flex flex-wrap gap-1">
			{#each meta.tags.split(',') as tag (tag)}
				<Pill>{tag}</Pill>
			{/each}
		</div>
	</div>

	<div
		class="prose
      min-h-screen
      max-w-full
      px-10
      pt-20
      prose-headings:mx-auto
      prose-headings:max-w-150
      prose-headings:text-main-white
      prose-p:mx-auto
      prose-p:max-w-150
      prose-p:text-main-white
      prose-a:text-main-green
      prose-a:no-underline
      prose-a:hover:text-main-blue
      prose-img:mx-auto
      prose-img:max-h-[calc(100vh-80px)]
      prose-p:[&:has(>img:first-child)]:max-w-170"
	>
		<Post />
	</div>
</div>

<style>
</style>
