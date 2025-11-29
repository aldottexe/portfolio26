<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Action } from 'svelte/action';
	import Pill from './Pill.svelte';

	interface p {
		title: string;
		tags: Array<string>;
		imgsrc: string;
		imgalt: string;
		link: string;
		desc: string;
	}

	const { title, tags, link, desc, imgsrc, imgalt }: p = $props();

	const activateOnScroll: Action<HTMLElement> = (node) => {
		window.addEventListener('scroll', () => {
			const rect = node.getBoundingClientRect();
			if (rect.y + rect.height < window.innerHeight) open = true;
			else if (rect.y + rect.height > window.innerHeight + 300) open = false;
		});
	};

	let open = $state(false);
</script>

<div class={`holder ${open ? 'open' : ''}`} use:activateOnScroll>
	<div class="top">
		<span class="featured">Featured</span>
		<div class="arrow"></div>
		<h1>{title}</h1>
	</div>
	<div class="bottom">
		<img src={imgsrc} alt={imgalt} />
		<div class="side">
			<div class="desc">
				<div class="pillHolder">
					{#each tags as tag (tag)}
						<Pill>{tag}</Pill>
					{/each}
				</div>
				<p>
					{desc}
				</p>
			</div>
			<a class="button" href={link}> (view) </a>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	* {
		--col-w: 300px;
	}
	h1 {
		min-width: var(--col-w);
	}
	.top {
		@apply text-5xl;
		height: 60px;
		margin-left: 10px;
		display: flex;
		align-items: center;
		gap: 0 30px;
		margin-bottom: 10px;
		overflow-y: hidden;
		overflow-x: hidden;
		transition: height 400ms;
	}
	.featured {
		font-style: italic;
		font-weight: 100;
		color: var(--color-main-orange);
	}
	.bottom {
		display: flex;
		gap: 15px 20px;
		width: 100%;
		justify-content: space-between;
		transition: gap 400ms 100ms;
	}
	.desc {
		width: var(--col-w);
	}
	img {
		position: relative;
		min-width: 0;
		min-height: 0;
		object-fit: contain;
		width: 100%;
		max-height: 70vh;
		border-radius: 7px;
		max-width: fit-content;
		margin: 0 auto;
		transform: translateY(0);
		transition: transform 400ms;
	}
	.side {
		display: flex;
		width: var(--col-w);
		flex-direction: column;
		justify-content: space-between;
		gap: 30px 0;
		overflow: hidden;
		transition: width 400ms 100ms;
	}
	.button {
		background-color: var(--color-main-green);
		color: var(--color-main-white);
		padding: 10px;
		border-radius: 7px;
		font-style: italic;
		transition: background-color 300ms;
		&:hover {
			background-color: var(--color-dark-green);
		}
	}
	.pillHolder {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}
	.arrow {
		background-color: var(--color-main-orange);
		border-radius: 10px;
		height: 3px;
		width: 100%;
		position: relative;
		transform: translateY(3px);
	}
	.arrow::after {
		content: ' ';
		display: block;
		background-color: var(--color-main-orange);
		border-radius: 10px;
		width: 15px;
		height: 3px;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		transform: rotate(45deg) translateY(-200%);
	}
	.arrow::before {
		content: ' ';
		display: block;
		background-color: var(--color-main-orange);
		border-radius: 10px;
		width: 15px;
		height: 3px;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		transform: rotate(-45deg) translateY(200%);
	}
	@media (max-width: 1100px) {
		.bottom {
			flex-direction: column;
		}
		.side {
			flex-direction: row;
			margin-left: 10px;
			width: 100%;
		}
		.button {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			max-width: var(--col-w);
		}
		h1 {
			min-width: unset;
			margin-right: 10px;
		}
	}
	@media (max-width: 700px) {
		.top {
			flex-direction: column;
			align-items: flex-start;
			height: 90px;
		}
		.arrow {
			visibility: hidden;
			order: -1;
		}
		.featured {
			font-size: 1.2rem;
			line-height: 0.6em;
		}
		.side {
			flex-direction: column;
			margin: 0 10px;
		}
		.desc {
			width: unset;
		}
		.button {
			max-width: unset;
		}
	}
	.holder:not(.open) {
		.top {
			height: 0px;
			transition: height 400ms 100ms;
		}
		.bottom {
			gap: 0;
			transition: gap 400ms;
		}
		.side {
			width: 0px;
			transition: width 400ms;
		}
		img {
			transform: translateY(-40px);
			transition: transform 400ms 100ms;
		}
		@media (max-width: 1100px) {
			.side {
				height: 0px;
				width: 100%;
			}
		}
	}
</style>
