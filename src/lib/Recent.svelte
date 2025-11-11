<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Action } from 'svelte/action';

	const {
		title,
		link,
		imgsrc,
		imgalt
	}: { title: string; imgsrc: string; imgalt: string; link: string } = $props();

	const activateOnScroll: Action<HTMLElement> = (node) => {
		window.addEventListener('scroll', () => {
			const rect = node.getBoundingClientRect();
			if (rect.y + rect.height < window.innerHeight) open = true;
			else if (rect.y + rect.height > window.innerHeight + 100) open = false;
		});
	};

	let open = $state(false);
</script>

<div class={`holder ${open ? 'open' : ''}`} use:activateOnScroll>
	<a href={resolve(link)} class="imgHolder" style={`background-image:url(${imgsrc})`}>
		<!-- <img src={imgsrc} alt={imgalt} /> -->
	</a>
	<div class="lower">
		<div class="text">
			<p class="min-w-max text-main-orange">RECENT WORK</p>
			<div class={title.length > 12 ? 'scroller' : ''}>
				<h2 class="text-2xl font-medium">{title}</h2>
				{#if title.length > 12}
					<h2 class="text-2xl font-medium">{title}</h2>
				{/if}
			</div>
		</div>
		<a href={resolve(link)} class="cta" aria-label="go to project">
			<svg
				width="30"
				height="30"
				viewBox="0 0 21 23"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8.39355 0.43934C8.97934 -0.146447 9.92886 -0.146447 10.5146 0.43934L20.0605 9.98524C20.6463 10.571 20.6463 11.5205 20.0605 12.1063L10.5146 21.6522C9.92886 22.238 8.97934 22.238 8.39355 21.6522C7.80777 21.0664 7.80777 20.1169 8.39355 19.5311L15.3789 12.5458H0V9.54579H15.3789L8.39355 2.56043C7.80777 1.97465 7.80777 1.02513 8.39355 0.43934Z"
					fill="white"
				/>
			</svg>
		</a>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.holder {
		max-height: min(90vh, 130vw);
		min-height: min-content;
		height: 100vh;
		display: flex;
		box-sizing: border-box;
		background-color: var(--color-main-black);
		border-radius: 20px;
		transition: padding 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
	}
	.imgHolder {
		display: block;
		width: 100%;
		border-radius: 20px;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		transition: border-radius 600ms ease-in-out 100ms;
		flex: 1 1 auto;
		max-width: 1000px;
	}
	.lower {
		display: flex;
		justify-content: space-between;
		overflow: hidden;
		height: 0px;
		margin: 0px 30px 0px 60px;
		transition:
			height 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms,
			width 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms,
			margin 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms;
	}
	h2 {
		font-variation-settings: 'wght' 600;
		font-size: 2.5rem;
		line-height: 0.8;
	}
	.text {
		margin-bottom: 5px;
	}
	.cta {
		background-color: var(--color-main-green);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		min-height: 70px;
		border-radius: 5px;
		margin: 0 5px 5px 0;
		transition: background-color 150ms;
		&:hover {
			background-color: var(--color-dark-green);
		}
	}
	/*//////////////////////////////////////////////////////////////////////////////////*/
	.open {
		padding: 10px;
		transition: padding 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms;
		.imgHolder {
			border-radius: 10px;
			transition: border-radius 100ms ease-in-out;
		}
		.lower {
			height: 100px;
			margin: 30px 0 0px 30px;
			transition:
				height 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms,
				margin 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms,
				width 600ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms;
		}
		animation-play-state: running;
	}
	.scroller {
		max-width: 200px;
		position: relative;
		display: flex;
		overflow: hidden;
		padding-bottom: 10px;
		h2 {
			padding-right: 80px;
			min-width: max-content;
			animation-play-state: paused;
			&:nth-child(2) {
				animation: scroll 10000ms linear infinite;
			}
			&:nth-child(1) {
				animation: scroll 10000ms linear infinite;
			}
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
	@media (min-width: 1000px) {
		.holder {
			flex-direction: row;
			justify-content: stretch;
			align-items: stretch;
			width: 100%;
			max-width: 1300px;
		}
		.lower {
			padding-top: 10px;
			box-sizing: border-box;
			margin: 0;
			width: 0px;
			flex-direction: column;
			justify-content: space-between;
			align-self: stretch;
			align-self: stretch;
			height: auto; /* remove height limits */
			max-width: 250px;
		}
		.cta {
			align-self: end;
		}
		.imgHolder {
			width: 100%;
			max-width: unset;
		}

		.open {
			.lower {
				margin-top: 0;
				width: 500px;
				height: auto; /* remove height limits */
			}
		}
	}
</style>
