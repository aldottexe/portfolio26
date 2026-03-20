<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	import Recent from '$lib/Recent.svelte';
	import type { PageProps } from './$types';
	import Squiggle from '$lib/squiggle.svelte';
	import Skills from '$lib/skills.svelte';
	const { data }: PageProps = $props();
	const featuredProject = data.projects.find((e) => e.slug === '200kmi');

	const skills = [
		{ name: 'Sveltekit', categories: ['Dev'] },
		{ name: 'Threejs', categories: ['Dev', 'Motion'] },
		{ name: 'NextJS', categories: ['Dev'] },
		{ name: 'React', categories: ['Dev'] },
		{ name: 'PostgreSQL', categories: ['Dev'] },
		{ name: 'Supabase', categories: ['Dev'] },
		{ name: 'Bash', categories: ['Dev'] },
		{ name: 'Unix', categories: ['Dev'] },
		{ name: 'GNU/Linux', categories: ['Dev'] },
		{ name: 'HTML/CSS', categories: ['Dev'] },
		{ name: 'GLSL', categories: ['Dev', 'Motion'] },
		{ name: 'Sass', categories: ['Dev'] },
		{ name: 'Python', categories: ['Dev'] },
		{ name: 'Java', categories: ['Dev'] },
		{ name: 'Kotlin', categories: ['Dev'] },
		{ name: 'C', categories: ['Dev'] },
		{ name: 'Mac OS', categories: ['Dev', 'Business'] },
		{ name: 'Windows', categories: ['Dev', 'Business'] },
		{ name: 'NodeJS', categories: ['Dev'] },
		{ name: 'Vite', categories: ['Dev'] },
		{ name: 'Git/Github', categories: ['Dev'] },
		{ name: 'Wordpress', categories: ['Dev'] },
		{ name: 'Vim', categories: ['Dev'] },
		{ name: 'VS Code', categories: ['Dev'] },
		{ name: 'Powerpoint', categories: ['Business', 'Design'] },
		{ name: 'Word', categories: ['Business'] },
		{ name: 'Excel', categories: ['Business'] },
		{ name: 'Slack', categories: ['Business'] },
		{ name: 'Teams', categories: ['Business'] },
		{ name: 'Photoshop', categories: ['Design'] },
		{ name: 'Illustrator', categories: ['Design'] },
		{ name: 'After Effects', categories: ['Design', 'Motion'] },
		{ name: 'Indesign', categories: ['Design'] },
		{ name: 'Figma', categories: ['Design', 'Dev'] },
		{ name: 'Blender', categories: ['Design', 'Motion'] },
		{ name: 'Rive', categories: ['Design', 'Motion', 'Dev'] }
	];
</script>

<div class="grid h-[calc(100vh-50px)] w-screen place-content-center">
	<p class="mt-60 max-w-120 px-10 text-center text-xl sm:mt-50">
		Hey there, I’m Alex—a designer, developer, and dungeon delver based out of Philadelphia, PA.
		Feel free to explore my work, or <a href="/#contact" class="gold-text"> get in touch!</a>
	</p>
</div>

<!-- Featured Project -->
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

<!-- Projects -->
<div class="mx-auto mb-30 max-w-310 md:px-10" id="projects">
	<Squiggle className="max-w-310 mx-2">
		<div class="mx-auto p-8">
			<h2 class="mb-10 text-5xl font-thin text-main-orange italic">Projects</h2>
			<ProjectList projects={data.projects} />
		</div>
	</Squiggle>
</div>

<!-- Skills -->
<div class="mx-auto mb-10 max-w-310 overflow-x-visible px-10" id="skills">
	<div class="flex flex-col gap-10 md:max-w-400 md:flex-row">
		<div>
			<h2 class="mb-10 text-5xl font-thin text-main-orange italic">Skills</h2>
			<p class="leading-6 md:max-w-60">
				I build for the web with a focus on motion and play. Create something that is fun to use and
				explore, and intake will happen almost subconciously. I'm comfortable across the full stack,
				from custom WebGL shaders to backend work with Supabase and PostgreSQL. On the design side,
				I move between Figma, Blender, and Rive to keep the gap between concept and reality small.
			</p>
		</div>
		<Skills {skills} />
	</div>
</div>
