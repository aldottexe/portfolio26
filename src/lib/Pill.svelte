<script>
	const { children, big = false } = $props();
</script>

<span class="pill {big ? 'big' : ''}">
	{@render children()}
</span>

<style>
	.pill {
		border: 2px var(--color-main-orange) solid;
		color: var(--color-main-orange);
		font-size: 0.7rem;
		border-radius: 100px;
		padding: 0px 10px 1px;
		width: fit-content;
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
