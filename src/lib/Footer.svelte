<script lang="ts">
	import ContactCta from './ContactCta.svelte';
</script>

<footer
	id="contact"
	class="relative flex h-screen w-full flex-col items-center justify-center overflow-clip"
>
	<div class="flex gap-2">
		<div class="left">
			<h2>Lets chat!</h2>
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
		<!-- <div class="mail-widget">email</div> -->
	</div>
</footer>

<style>
	h2 {
		text-align: center;
		width: 100%;
		word-break: break-all;
		line-height: 0.8;
		height: fit-content;
		border-radius: 4px;
		padding: 2px;
	}
	@media (max-width: 750px) {
		h2 {
			margin-bottom: 10px;
		}
	}
	.left {
		display: flex;
		flex-direction: column;
		gap: 5px;
		z-index: 2;
	}
	.mail-widget {
		background-color: var(--color-main-gray);
		width: 90px;
		position: relative;
		padding: 20px;
		border-radius: 5px;
		&::before {
			content: '';
			inset: 5px;
			position: absolute;
			border: 2px var(--color-main-white) solid;
			border-radius: 3px;
		}
	}
</style>
