<script lang="ts">
	const { primary = '#4964D1' }: { primary: string } = $props();
</script>

{#snippet corner(pos: string)}
	<svg
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 85.73 84.33"
		class={`fixed ${pos} z-[-1] w-10 md:w-15`}
	>
		<path style:fill={primary} d="M0,0v84.33h85.73C38.38,84.33,0,46.57,0,0Z" />
	</svg>
{/snippet}

{@render corner('rotate-90 left-[9px] top-[9px]')}
{@render corner('rotate-180 right-[9px] top-[9px]')}
{@render corner('left-[9px] bottom-[9px]')}
{@render corner('rotate-270 right-[9px] bottom-[9px]')}

<div
	class="pointer-events-none fixed top-0 left-0 z-[-1] box-border h-full w-full border-10"
	style:border-color={primary}
></div>

<style>
</style>
