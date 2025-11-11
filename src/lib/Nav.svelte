<script lang="ts">
	import { resolve } from '$app/paths';
	import { expoOut } from 'svelte/easing';
	let open = $state(false);

	function whoosh(
		node: HTMLElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number }
	) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 200,
			easing: params.easing || expoOut,
			css: (t: number, u: number) => `
				transform-origin: bottom;
				transform: ${existingTransform} scale(${t});
				opacity: ${t};
			`
		};
	}
	function wide(
		node: HTMLElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number }
	) {
		const w = getComputedStyle(node).width;
		const pl = getComputedStyle(node).paddingLeft;
		const ml = getComputedStyle(node).marginLeft;
		const bl = getComputedStyle(node).borderLeftWidth;
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || expoOut,
			css: (t: number, u: number) => `
				width: calc(${t * 1} * ${w});
				padding-left: calc(${t * 1} * ${pl});
				margin-left: calc(${t * 1} * ${ml});
				border-left-width: calc(${t * 1} * ${bl});
				opacity: ${t};
				overflow: hidden;
				`
		};
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href="/x.svg" />
</svelte:head>

<button class="nav" onclick={() => (open = !open)}>
	<img src="/logo.svg" alt="open menu" width="50" />
	{#if open}
		<img src="/x.svg" alt="" transition:wide={{}} class="ml-2 border-l-2 pl-2" />
	{/if}
</button>

{#if open}
	<div class="menu-holder" onclick={() => (open = false)} transition:whoosh={{}}>
		<div class="menu">
			<img
				src="/logospin.gif"
				class="relative right-2 block w-full opacity-90"
				style="image-rendering: pixelated;"
				alt="logo"
			/>
			<div class="item-list">
				<a href={resolve('/')}> Home</a>
				<a href={resolve('/#projects')}> Projects</a>
				<a href={resolve('/#contact')}> Contact</a>
			</div>
			<hr class="my-2 border-1" />
			<button class="close">Close</button>
		</div>
	</div>
{/if}

<style>
	@reference "../app.css";
	.menu-holder {
		@apply fixed top-0 left-0 z-9 flex h-screen w-screen items-center justify-center;
	}
	.menu {
		@apply relative rounded-md border-2 border-main-white p-5;
	}
	.menu::before {
		content: ' ';
		position: absolute;
		z-index: -10;
		top: -10px;
		right: -10px;
		bottom: -10px;
		left: -10px;
		background-color: var(--color-main-black);
		border-radius: 12px;
	}
	a,
	button:not(.nav) {
		@apply mb-1 flex w-full transform justify-between gap-20 px-0 hover:text-main-blue hover:underline;
		&::after {
			content: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.707159 0.999814C0.707328 0.447708 1.15492 -2.17056e-05 1.70705 -7.94046e-05L10.7075 -7.95521e-05C11.2595 8.94357e-05 11.7072 0.447777 11.7074 0.999814V10.0002C11.7073 10.5524 11.2596 11 10.7075 11.0001C10.1552 11.0001 9.70764 10.5525 9.70758 10.0002L9.70689 3.41461L1.41427 11.7072L5.16866e-05 10.293L8.29267 2.0004L1.70705 1.99971C1.15482 1.99965 0.707159 1.55206 0.707159 0.999814Z' fill='white' /%3E%3C/svg%3E%0A");
		}
	}
	.close::after {
		content: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 11L11 0.999999' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M1.00781 1L11.0078 11' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
	}
	.nav {
		@apply fixed right-0 left-0 z-10 mx-5 my-4 box-border flex w-fit rounded-xl bg-main-black p-4 md:mx-10 md:my-8;
		transition: width 200ms ease-in-out;
		&::after {
			content: ' ';
			position: absolute;
			z-index: -10;
			top: 4px;
			bottom: 4px;
			left: 4px;
			right: 4px;
			border: 2px solid var(--color-main-white);
			border-radius: 8px;
			transition: border 200ms;
		}
		&:hover {
			&::after {
				border: 2px solid var(--color-main-blue);
			}
			* {
				border-left-color: var(--color-main-blue) !important;
			}
		}
	}
</style>
