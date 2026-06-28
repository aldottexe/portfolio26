<script lang="ts">
	import type { PageProps } from '../$types';
	// import Backdrop from '$lib/Backdrop.svelte';
	// import Border from '$lib/Border.svelte';

	const { data }: PageProps = $props();
	const Post = data.component;
	const meta = data.metadata;
</script>

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
