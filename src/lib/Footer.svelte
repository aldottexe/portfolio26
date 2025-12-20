<script lang="ts">
	import ContactCta from './ContactCta.svelte';
	import LinkWidgets from './linkWidgets.svelte';
</script>

<footer
	id="contact"
	class="relative flex h-screen w-full flex-col items-center justify-center overflow-clip"
>
	<div>
		<LinkWidgets copyVal="alexanderlutz@yahoo.com" linkVal="mailto:alexanderlutz@yahoo.com">
			<a
				href="mailto:alexanderlutz@yahoo.com"
				class="relative text-[8vw] font-bold tracking-tight [text-decoration-thickness:4px] [text-underline-offset:3px] hover:underline"
				>alexanderlutz@yahoo.com</a
			>
		</LinkWidgets>
		<div>
			<ContactCta
				href="https://cal.com/alex-lutz"
				title="Book a meeting"
				copyVal="https://cal.com/alex-lutz-zenutu"
				clickVal="book now"
			/>
			<ContactCta
				href="https://www.linkedin.com/in/alex-lutz-1o/"
				title="Linkedin"
				copyVal="alex-lutz-1o"
				clickVal="view now"
			/>
			<ContactCta
				href="https://github.com/aldottexe"
				title="Github"
				copyVal="aldottexe"
				clickVal="view now"
			/>
		</div>
	</div>
</footer>

<style lang="postcss">
	@reference "tailwindcss";
	.social {
		@apply text-3xl font-light italic;
	}
	@media (max-width: 800px) {
		a:after {
			content: ' ';
			@apply absolute inset-0 -z-1 bg-(--color-main-black);
		}
	}
</style>
