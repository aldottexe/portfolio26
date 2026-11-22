<script lang="ts">
	import ChatBubble from "./chatBubble.svelte";

   let {chatOpen} : {chatOpen: boolean} = $props();

   let message: string = `Hi! I'm Little Alex. If you have any questions, I might be able to help! (I'm still a work in progress but I'm trying my best)`;

</script>
{#if chatOpen}
<div class="fixed inset-0 top-[calc(50vh+20px)] left-2 right-2 flex items-center bottom-0 flex-col overflow-y-auto" >
{#key message}
   <ChatBubble msg={message}/>
{/key}
</div>
{/if}
