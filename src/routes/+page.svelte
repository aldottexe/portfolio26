<script lang="ts">
	import Backdrop from '$lib/Backdrop.svelte';
	import Backdrop2 from '$lib/Backdrop2.svelte';
	import Border from '$lib/Border.svelte';
	import ProjectList from '$lib/ProjectList.svelte';
	import Recent from '$lib/Recent.svelte';
	import type { PageProps } from './$types';
	let w = $state(0);
	const { data }: PageProps = $props();
	const featuredProject = data.projects.find((e) => e.slug === '200kmi');
</script>

<svelte:window bind:innerWidth={w} />

<Backdrop primaryC="#f1b49f" accentC="#facdc0" />

<div class="grid h-[calc(100vh-50px)] w-screen place-content-center">
	<div>
		<img src="logo.svg" alt="Welcome!" class="mx-auto w-50" />
		<p class="max-w-100 text-center text-xl">
			Hey there, I’m Alex—a designer, developer, and dungeon delver based out of Philadelphia, PA.
			Feel free to explore my work, or get in touch.
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

<div class="mx-auto mb-10 max-w-310 px-10">
	<ProjectList projects={data.projects} />
</div>
