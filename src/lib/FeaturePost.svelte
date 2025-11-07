<script lang="ts">
	import { resolve } from '$app/paths';

	const {
		title,
		link,
		imgsrc,
		imgalt
	}: { title: string; imgsrc: string; imgalt: string; link: string } = $props();
</script>

<div class="holder">
	<div class="main">
		<a href={resolve(link)}>
			<img src={imgsrc} alt={imgalt} />
		</a>
		<div class="lower">
			<div class="text">
				<p class="text-main-orange">FEATURED</p>
				<div class={title.length > 8 ? 'scroller' : ''}>
					<h2 class="text-2xl font-medium">{title}</h2>
					{#if title.length > 8}
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
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.main {
		position: relative;
		max-width: 330px;
		aspect-ratio: 1/1;
		box-sizing: border-box;
		background-color: var(--color-main-black);
		border-radius: 50px;
		transition: padding 400ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 150ms;
	}

	img {
		border-radius: 50px;
		aspect-ratio: 1/1;
		object-fit: cover;
		transition: border-radius 100ms ease-in-out 150ms;
	}
	.lower {
		display: flex;
		justify-content: space-between;
		overflow: hidden;
		height: 0px;
		margin: 0px 30px 0px 60px;
		transition:
			height 200ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 100ms,
			margin 300ms ease-in-out 100ms;
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
		border-radius: 10px 10px 35px 10px;
		margin: 0 5px 5px 0;
		transition: background-color 150ms;
		&:hover {
			background-color: var(--color-dark-green);
		}
	}

	.main:hover {
		padding: 10px;
		transition: padding 400ms cubic-bezier(0.33, 0.13, 0.02, 1.12);
		img {
			border-radius: 40px;
			transition: border-radius 100ms ease-in-out;
		}
		.lower {
			height: 70px;
			margin: 30px 0 0px 30px;
			transition:
				height 300ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 50ms,
				margin 300ms cubic-bezier(0.33, 0.13, 0.02, 1.12) 50ms;
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
</style>
