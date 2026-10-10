<script lang="ts">
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';
	import PageTransition from '$lib/PageTransition.svelte';
	import Background from '$lib/Background.svelte';
	import { page } from '$app/state';
	import RotatePage from '$lib/rotatePage.svelte';
	import { setContext } from 'svelte';
	// import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

   let ctx = $state({y: 0})
   setContext<{y: number}>('scroll', ctx);

	let scrollPos = $state(0)
   $inspect(scrollPos);
   $effect(() => {ctx.y = scrollPos});
   let flip = $state(false);
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

<PageTransition />
<Background isProject={/\/p\//.test(page.url.pathname)} rotate={flip} pagePos={scrollPos}/>

<Nav></Nav>

<button onclick={()=>flip = !flip} class="fixed z-999 left-0 right-0 bottom-5 bg-main-blue max-w-fit mx-auto px-5">ask little alex</button>
<RotatePage angle={flip ? 90 : 0} bind:scrollPos>
	<div>
		{@render children?.()}
	</div>
	<Footer></Footer>
</RotatePage>

<style>
	:global(body) {
		background-color: var(--color-main-black);
		overflow-x: hidden;
	}
</style>
