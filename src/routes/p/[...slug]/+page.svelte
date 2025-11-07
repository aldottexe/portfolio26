<script lang="ts">
	import type { PageProps } from '../$types';
	import Backdrop from '$lib/Backdrop.svelte';
	import Border from '$lib/Border.svelte';

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

<Border primary={accent} />
<Backdrop primaryC={accent} />

<div class="relative">
	<div
		class="content sticky top-8 right-20 left-20 mx-auto flex h-[52px] w-fit flex-wrap items-center rounded-xl bg-main-black px-5"
	>
		<h1 class="tracking-[-5px]">
			{meta.title}
		</h1>
		<!-- <p class="w-1/2 min-w-fit p-4 {colorClass}"> -->
		<!-- 	{meta.desc} -->
		<!-- </p> -->
	</div>
	<img
		class="z-[-1] mx-auto box-border h-screen rounded-4xl p-15"
		style="background-size:cover"
		src={meta.featureImage}
	/>

	<div class="mx-auto prose min-h-screen p-20 prose-p:text-main-black">
		<Post />
	</div>
</div>

<style>
	.content::before {
		position: absolute;
		content: '';
		inset: 4px;
		border: 2px solid var(--color-main-white);
		border-radius: 10px;
	}
</style>
