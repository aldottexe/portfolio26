<script>
	const { children, big = false, clickable = false } = $props();
</script>

<span
	class="pill border-2 border-transparent transition-all {big ? 'big' : ''} {clickable
		? 'hover:border-old-orange'
		: ''}"
>
	{@render children()}
</span>

<style>
	.pill {
		color: var(--color-main-white);
		font-size: 0.7rem;
		border-radius: 5px;
		padding: 0px 10px 1px;
		min-width: max-content;
		display: block;
		background-color: var(--color-alt-black);
	}
	.big {
		font-size: 1.4em;
		padding: 0px 15px 1px;
		border-radius: 10px;
		font-style: italic;
		font-weight: lighter;
		color: var(--color-old-orange);
	}
</style>
