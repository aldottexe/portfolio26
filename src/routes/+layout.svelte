<script lang="ts">
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';
	import PageTransition from '$lib/PageTransition.svelte';
	import Background from '$lib/Background.svelte';
	import { page } from '$app/state';
	import RotatePage from '$lib/rotatePage.svelte';
	// import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

<PageTransition />
<Background isProject={/\/p\//.test(page.url.pathname)} />

<Nav></Nav>

<RotatePage angle={0}>
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
