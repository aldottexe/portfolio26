<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import Recent from '$lib/Recent.svelte';
	import type { PageProps } from './$types';
	import Slashes from '$lib/Slashes.svelte';
	import Squiggle from '$lib/squiggle.svelte';
	let w = $state(0);
	const { data }: PageProps = $props();
	const featuredProject = data.projects.find((e) => e.slug === '200kmi');
</script>

<svelte:window bind:innerWidth={w} />

<div class="grid h-[calc(100vh-50px)] w-screen place-content-center">
	<div>
		<img
			src="logoAnimated.svg"
			alt="Welcome!"
			class="mx-auto mb-3 w-[80vw] max-w-100 rounded-xl border-2 border-main-orange"
		/>
		<p class="max-w-120 px-10 text-center text-xl">
			Hey there, I’m Alex—a designer, developer, and dungeon delver based out of Philadelphia, PA.
			Feel free to explore my work, or <a href="/#contact" class="gold-text"> get in touch.</a>
		</p>
	</div>
</div>

{#if featuredProject?.metadata}
	<div class="mx-auto mb-10 max-w-310 px-10">
		<Recent
			title={featuredProject.metadata.title as string}
			tags={((featuredProject.metadata.tags as string) || '').split(',')}
			link="p/{featuredProject.slug}"
			imgsrc={featuredProject.metadata.featureImage as string}
			imgalt="view project"
			desc={featuredProject.metadata.desc as string}
		/>
	</div>
{/if}

<!-- <Slashes name="Projects" /> -->
<Squiggle className="py-5 px-8 mx-10">
	<h2 class="my-5 text-center">Projects</h2>
	<div class="mx-auto mb-10 max-w-310 px-10">
		<ProjectList projects={data.projects} />
	</div>
</Squiggle>
