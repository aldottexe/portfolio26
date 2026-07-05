<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	const { data } = $props();

	let showAltImage = $state(false);
	setInterval(() => {
		showAltImage = !showAltImage;
	}, 300);
</script>

<div class="mx-auto box-content max-w-200 px-10">
	<div class="relative box-border flex h-screen flex-col justify-end py-10">
		<div class="absolute flex h-full w-full items-center justify-center py-10">
			<img
				src={showAltImage ? '/logo f1.svg' : '/logo f2.svg'}
				style="image-rendering: pixelated"
				class="w-50"
				alt=""
			/>
		</div>

		<h1 class="mb-1 italic">Alex's Blog</h1>
		<p>Here you can find all of my non-work related ramblings.</p>
	</div>

	<ProjectList projects={data.projects} />
</div>
