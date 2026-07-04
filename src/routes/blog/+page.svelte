<script lang="ts">
	import ProjectList from '$lib/ProjectList.svelte';
	const { data } = $props();
</script>

<div class="flex h-screen flex-col justify-end p-10">
	<h1 class="mb-1 italic">Alex's Blog</h1>
	<p>Here you can find all of my non-work related ramblings.</p>
</div>
<ProjectList projects={data.projects} />
