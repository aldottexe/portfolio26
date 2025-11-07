<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import ContactCta from './ContactCta.svelte';

	let interval = 0;
	let elements = 0;
	let poppups: { l: string; x: number; y: number; r: number; key: number }[] = $state([]);
	onMount(() => {
		interval = window.setInterval(() => {
			const r = Math.random() * 360;
			const x = Math.random() * 95;
			const y = Math.random() * 95;
			const l = 'ALEXLUTZ'[elements % 8];
			poppups.push({ l, x, y, r, key: elements });
			elements++;
			if (poppups.length > 200) poppups.shift();
		}, 5000);
	});
	onDestroy(() => {
		if (browser) window.clearInterval(interval);
	});
</script>

<footer class="relative flex h-screen w-full flex-col items-center justify-center overflow-clip">
	<div class="flex gap-2">
		<div class="left">
			<h2>Lets chat!</h2>
			<ContactCta
				href="mailto:alexanderlutz@yahoo.com"
				title="Email"
				copyVal="alexanderlutz@yahoo.com"
			/>
			<ContactCta
				href="https://www.linkedin.com/in/alex-lutz-1o/"
				title="Linkedin"
				copyVal="alex-lutz-1o"
			/>
			<ContactCta href="https://github.com/aldottexe" title="Github" copyVal="aldottexe" />
		</div>
		<!-- <div class="mail-widget">email</div> -->
	</div>

	{#each poppups as p, i (p.key)}
		<button
			onmouseover={() => poppups.splice(i, 1)}
			style:top={`${p.y}%`}
			style:left={`${p.x}%`}
			style:rotate={`${p.r}deg`}
			class="pop-up absolute text-5xl"
			transition:scale={{ duration: 600, easing: elasticOut }}
			>{p.l}
		</button>
	{/each}
</footer>

<style>
	h2 {
		text-align: center;
		width: 100%;
		word-break: break-all;
		letter-spacing: -0.14em;
		line-height: 0.8;
		height: fit-content;
		background-color: var(--color-main-black);
		border-radius: 4px;
		padding: 2px;
	}
	@media (max-width: 750px) {
		h2 {
			margin-bottom: 10px;
		}
	}
	.pop-up {
		color: var(--color-main-orange);
		font-variation-settings: 'wght' 100;
		font-size: 100px;
	}
	.left {
		display: flex;
		flex-direction: column;
		gap: 5px;
		z-index: 2;
	}
	.mail-widget {
		background-color: var(--color-main-black);
		width: 90px;
		position: relative;
		padding: 20px;
		border-radius: 5px;
		&::before {
			content: '';
			inset: 5px;
			position: absolute;
			border: 2px var(--color-main-white) solid;
			border-radius: 3px;
		}
	}
</style>
