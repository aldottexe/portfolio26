<script lang="ts">
	import { resolve } from '$app/paths';

	interface props {
		href: string;
		title: string;
		copyVal: string;
	}
	const { href, title, copyVal }: props = $props();
</script>

<div class="outer">
	<a class="mainBar" {href} target="_blank">
		<span>{title}</span>
		<div class="m-1 rounded-md border-[1.5px] border-main-green"></div>
	</a>
	<button class="button" onclick={() => navigator.clipboard.writeText(copyVal)} aria-label="copy">
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M9 4H13V13H4V9H0V0H9V4ZM9 9H6V11H11V6H9V9ZM2 2V7H7V2H2Z" fill="white" />
		</svg>
	</button>
	<a class="button" {href} aria-label="go to link" target="_blank">
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M0.707159 0.999814C0.707328 0.447708 1.15492 -2.17056e-05 1.70705 -7.94046e-05L10.7075 -7.95521e-05C11.2595 8.94357e-05 11.7072 0.447777 11.7074 0.999814V10.0002C11.7073 10.5524 11.2596 11 10.7075 11.0001C10.1552 11.0001 9.70764 10.5525 9.70758 10.0002L9.70689 3.41461L1.41427 11.7072L5.16866e-05 10.293L8.29267 2.0004L1.70705 1.99971C1.15482 1.99965 0.707159 1.55206 0.707159 0.999814Z"
				fill="white"
			/>
		</svg>
	</a>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.outer {
		transform: scale(1);
		transition: transform 300ms cubic-bezier(0.37, 0.01, 0.04, 1.23);
		--height: 30px;
		--gap: 5px;
		display: flex;
		gap: var(--gap);
		position: relative;
		justify-content: end;
	}
	.mainBar {
		position: absolute;
		left: 0;
		height: var(--height);
		background-color: var(--color-main-black);
		padding: 3px 5px 3px 12px;
		border-radius: 5px;
		display: flex;
		justify-content: space-between;
		width: 100%;
		transition: width 300ms cubic-bezier(0.37, 0.01, 0.04, 1.23);
		z-index: 2;
	}
	.outer:hover {
		transform: scale(1.05);
		.mainBar {
			width: calc(100% - 2 * (var(--height) + var(--gap)));
		}
		.button {
			transform: scale(1);
		}
	}
	.button {
		position: relative;
		transform: scale(0.001);
		background-color: var(--color-main-green);
		height: var(--height);
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		transition:
			background-color 200ms,
			transform 300ms cubic-bezier(0.37, 0.01, 0.04, 1.23) 100ms;
		&:hover {
			background-color: var(--color-dark-green);
		}
		&:nth-child(2) {
			transition:
				background-color 200ms,
				transform 300ms cubic-bezier(0.37, 0.01, 0.04, 1.23) 200ms;
		}
	}
</style>
