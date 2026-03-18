<script>
	const { children, big = false, clickable = false } = $props();
</script>

<span
	class="pill border-2 border-main-orange transition-colors {big ? 'big' : ''} {clickable
		? 'hover:border-alt-black'
		: ''}"
>
	{@render children()}
</span>

<style>
	.pill {
		color: var(--color-main-orange);
		font-size: 0.7rem;
		border-radius: 100px;
		padding: 0px 10px 1px;
		min-width: max-content;
		display: block;
		background-color: var(--color-main-black);
	}
	.big {
		font-size: 1.4em;
		font-style: italic;
		font-weight: lighter;
		color: var(--clor-main-white);
	}
</style>
