<script lang="ts">
	import type { Snippet } from 'svelte';

	interface p {
		children: Snippet;
		copyVal?: string;
		linkVal?: string;
	}
	const { children, copyVal, linkVal }: p = $props();
</script>

<div class="widget-container relative w-fit">
	{@render children()}
	<div class="widgets">
		{#if copyVal}
			<button onclick={() => navigator.clipboard.writeText(copyVal)} aria-label="copy to Clipboard">
				<svg
					width="13"
					height="13"
					viewBox="0 0 13 13"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M9 4H13V13H4V9H0V0H9V4ZM9 9H6V11H11V6H9V9ZM2 2V7H7V2H2Z" fill="white" />
				</svg>
			</button>
		{/if}
		{#if linkVal}
			<a href={linkVal}>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M0.707159 0.999814C0.707328 0.447708 1.15492 -2.17056e-05 1.70705 -7.94046e-05L10.7075 -7.95521e-05C11.2595 8.94357e-05 11.7072 0.447777 11.7074 0.999814V10.0002C11.7073 10.5524 11.2596 11 10.7075 11.0001C10.1552 11.0001 9.70764 10.5525 9.70758 10.0002L9.70689 3.41461L1.41427 11.7072L5.16866e-05 10.293L8.29267 2.0004L1.70705 1.99971C1.15482 1.99965 0.707159 1.55206 0.707159 0.999814Z"
						fill="white"
					/>
				</svg>
			</a>
		{/if}
	</div>
</div>

<style>
	.widget-container:hover {
		.widgets * {
			width: 50px;
		}
	}
	.widgets {
		display: flex;
		position: absolute;
		bottom: 0;
		right: 0;
		background-color: var(--color-alt-black);
		z-index: 999;
		* {
			transition: width 200ms ease-in-out;
			width: 0;
			overflow-x: hidden;
			height: 50px;
			&:hover {
				background-color: var(--color-main-orange);
			}
		}
	}
	svg {
		transform: scale(0.31);
	}
</style>
