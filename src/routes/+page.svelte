<script lang="ts">
	import BlogTree from '$lib/BlogTree.svelte';
	import ContactCta from '$lib/ContactCta.svelte';
	import FeaturePost from '$lib/FeaturePost.svelte';
	import Pill from '$lib/Pill.svelte';
	import Recent from '$lib/Recent.svelte';
	import type { PageProps } from './$types';
	import Border from '$lib/Border.svelte';
	import Backdrop from '$lib/Backdrop.svelte';
	let w = $state(0);
	const { data }: PageProps = $props();
</script>

<svelte:window bind:innerWidth={w} />

<Border />
<Backdrop />

<!-- hero image -->
<div class="flex h-[100vh] items-center justify-center gap-10 px-10" id="contact">
	{#if w > 1000}
		<FeaturePost title="200kmi" link="#" imgsrc="200kmi/200kmiHero.gif" imgalt="web project" />
	{/if}
	<div class="flex h-[320px] max-w-110 flex-col justify-between">
		<div>
			<div class="mb-1 flex gap-1">
				<Pill>👋</Pill>
			</div>
			<!-- 	<h1 class="mb-5 uppercase">alexlutz.com</h1> -->
			<!-- 	<p class="leading-[1.3] tracking-tight"> -->
			<!-- 		Hey, I’m Alex! A Philly based designer with a passion for creative code and web -->
			<!-- 		developement. Feel free to explore my work, or <a -->
			<!-- 			href="mailto:alexanderlutz@yahoo.com" -->
			<!-- 			class="border-box relative inline-block transform bg-main-yellow opacity-85 transition duration-[50ms] hover:scale-125" -->
			<!-- 			>get in touch</a -->
			<!-- 		>. -->
			<!-- 	</p> -->
			<img
				src="name.svg"
				alt="Alex Lutz"
				class="box-border w-full scale-110 px-3 pb-3 md:max-h-45"
			/>
		</div>
		<div class="flex flex-col gap-2">
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
	</div>
</div>
<div class="mx-10">
	<Recent title="200kmi" link="#" imgsrc="200kmi/200kmiHero.gif" imgalt="web project" />
</div>
<div class="box-border h-[100vh] p-10 md:p-20">
	<h2 id="projects" class=" mb-5 text-[100px] tracking-[-25px] md:text-[180px] md:tracking-[-35px]">
		Projects
	</h2>
	<div class="rounded-2xl bg-main-black p-5">
		<BlogTree tree={data.structure} />
	</div>
</div>
