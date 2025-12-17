<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import Recent from '$lib/Recent.svelte';
	import type { PageProps } from './$types';
	import Squiggle from '$lib/squiggle.svelte';
	const { data }: PageProps = $props();
	const featuredProject = data.projects.find((e) => e.slug === '200kmi');
</script>

<div class="grid h-[calc(100vh-50px)] w-screen place-content-center">
	<p class="mt-60 max-w-120 px-10 text-center text-xl sm:mt-50">
		Hey there, I’m Alex—a designer, developer, and dungeon delver based out of Philadelphia, PA.
		Feel free to explore my work, or <a href="/#contact" class="gold-text"> get in touch!</a>
	</p>
</div>

{#if featuredProject?.metadata}
	<div class="mx-auto mb-30 max-w-310 px-10">
		<Recent
			title={featuredProject.metadata.title as string}
			tags={((featuredProject.metadata.tags as string) || '').split(',')}
			link="p/{featuredProject.slug}"
			imgsrc={featuredProject.metadata.featureImage as string}
			vidsrc={featuredProject.metadata.featureVid as string}
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
