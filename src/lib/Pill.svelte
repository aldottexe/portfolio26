<script>
	const { children } = $props();
</script>

<span class="pill">
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
	}
</style>
