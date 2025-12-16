<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import Recent from '$lib/Recent.svelte';
	import type { PageProps } from './$types';
	import Squiggle from '$lib/squiggle.svelte';
	import Background from '$lib/Background.svelte';
	let w = $state(0);
	const { data }: PageProps = $props();
	const featuredProject = data.projects.find((e) => e.slug === '200kmi');
</script>

<svelte:window bind:innerWidth={w} />

<div class="grid h-[calc(100vh-50px)] w-screen place-content-center">
	<div>
		<!-- <img -->
		<!-- 	src="logoAnimated.svg" -->
		<!-- 	alt="Welcome!" -->
		<!-- 	class="mx-auto mb-3 w-[80vw] max-w-100 rounded-xl border-2 border-main-orange" -->
		<!-- /> -->
		<p class="mt-60 max-w-120 px-10 text-center text-xl sm:mt-50">
			Hey there, I’m Alex—a designer, developer, and dungeon delver based out of Philadelphia, PA.
			Feel free to explore my work, or <a href="/#contact" class="gold-text"> get in touch!</a>
		</p>
	</div>
</div>

{#if featuredProject?.metadata}
	<div class="mx-auto mb-30 max-w-310 px-10">
		<Recent
			title={featuredProject.metadata.title as string}
			tags={((featuredProject.metadata.tags as string) || '').split(',')}
			link="p/{featuredProject.slug}"
			imgsrc="/200kmivid@720.mov"
			imgalt="view project"
			desc={featuredProject.metadata.desc as string}
		/>
	</div>
{/if}

<div class="mx-auto max-w-310">
	<Squiggle className="max-w-310 mx-2">
		<div class="mx-auto p-8">
			<h2 class="mb-10 text-5xl font-thin text-main-orange italic">Projects</h2>
			<ProjectList projects={data.projects} />
		</div>
	</Squiggle>
</div>
