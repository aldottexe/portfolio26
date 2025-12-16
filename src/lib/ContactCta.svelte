<script lang="ts">
	interface props {
		href: string;
		title: string;
		copyVal: string;
		clickVal: string;
	}
	const { href, title, copyVal, clickVal }: props = $props();
</script>

<div class="outer">
	<span class="mainBar">
		<span>{title}</span>
	</span>
	<button
		class="button wh"
		onclick={() => navigator.clipboard.writeText(copyVal)}
		aria-label="copy"
	>
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M9 4H13V13H4V9H0V0H9V4ZM9 9H6V11H11V6H9V9ZM2 2V7H7V2H2Z" fill="white" />
		</svg>
	</button>
	<a class="button grow" {href} aria-label="go to link" target="_blank">
		<div class="scroller">
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
			<span>{clickVal}</span>
		</div>
	</a>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.outer {
		--height: 50px;
		--gap: 7px;
		display: flex;
		position: relative;
	}
	@media (max-width: 40rem) {
		.outer {
			--height: 30px;
		}
	}
	.mainBar {
		@apply text-xl font-light italic sm:text-3xl;
		background-color: var(--color-main-black);
		height: var(--height);
		display: flex;
		align-items: center;
		transition: all 300ms cubic-bezier(0.37, 0.01, 0.04, 1.23);
		z-index: 2;
		padding: 0 10px;
	}
	.button {
		background-color: var(--color-alt-black);
		height: var(--height);
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 0;
		width: 0;
		transition:
			background-color 200ms,
			max-width 400ms ease-in-out,
			width 400ms ease-in-out;
		&:hover {
			background-color: var(--color-main-green);
		}
	}
	svg {
		transform: scale(1.3);
	}
	.scroller {
		display: flex;
		flex-wrap: nowrap;
		overflow: hidden;
		* {
			padding-right: 30px;
			min-width: max-content;
			animation: scroll 2s infinite linear;
		}
	}
	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}

	/* -------------------HOVER --------------------------*/

	.outer:hover {
		.mainBar {
			text-decoration: underline;
			text-decoration-thickness: 1px;
			text-underline-offset: 3px;
		}
		.button {
			max-width: 100%;
		}
		.wh {
			width: var(--height);
		}
	}
</style>
