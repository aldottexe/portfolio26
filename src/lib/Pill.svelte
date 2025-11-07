<script>
	const { children } = $props();
</script>

<p class="w-fit rounded-2xl bg-main-green px-3">
	<span class="relative top-[1px] filter">
		{@render children()}
	</span>
</p>

<style>
	.filter {
		/* filter: grayscale() brightness(1.1); */
	}
</style>
