<script lang="ts">
	interface p {
		title: string;
	}
	const { name }: string = $props();
</script>

<div class="mx-10 flex justify-center rounded-xl border-2 border-main-orange">
	<h2>
		{name}
	</h2>
	<svg width="100%" height="40">
		<line x1="0" y1="0" x2="100%" y2="100%" style="stroke: red; stroke-width: 2" />
	</svg>
</div>
