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
	<div class="grid h-screen w-full place-content-center">
		<img class="max-h-screen rounded-4xl px-5 py-20" src={meta.featureImage} />
	</div>
	<div
		class="content sticky top-8 right-20 bottom-8 left-20 mx-auto flex h-[52px] w-fit flex-wrap items-center rounded-xl bg-main-black px-5"
	>
		<h1 class="tracking-[-5px]">
			{meta.title}
		</h1>
	</div>

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
