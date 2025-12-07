<script lang="ts">
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';
	import PageTransition from '$lib/PageTransition.svelte';
	// import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>
<PageTransition />

<Nav></Nav>

<div>
	{@render children?.()}
</div>
<Footer></Footer>

<style>
	:global(body) {
		background-color: var(--color-main-white);
		overflow-x: hidden;
	}
</style>
