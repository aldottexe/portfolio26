<script lang="ts">
	import { onNavigate } from '$app/navigation';

	let transitioning = $state(false);

	onNavigate((nav) => {
		return new Promise(async (res) => {
			transitioning = true;
			await new Promise((res) => setTimeout(res, 300));
			res();
			await nav.complete;
			await new Promise((res) => setTimeout(res, 200));
			transitioning = false;
		});
	});
</script>

<div
	class={`fixed ${transitioning ? 'bottom-0 h-full ease-out' : 'top-0 h-0 ease-in'} z-50 w-full bg-main-black transition-[height] duration-300`}
></div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
