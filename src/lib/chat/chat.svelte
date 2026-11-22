<script lang="ts">
	import ChatBubble from "./chatBubble.svelte";
	import ChatPrompt from "./chatPrompt.svelte";

   let {chatOpen = $bindable(false)} : {chatOpen: boolean} = $props();

   let message: string = $state(`Hi! I'm Little Alex. If you have any questions, I might be able to help! (I'm still a work in progress but I'm trying my best)`);
   let loading: boolean = $state(false);

   function onSend() {
      generateResponse().then(() => loading = false);
   }

   async function generateResponse() {
      const res = await fetch("https://dev.alexlutz.com/api/ask-little-alex", {
        method: "POST",
        body: JSON.stringify({ "message": "hello world" }),
      });
      if (res.ok && res.body) {
         console.log(res)
         message = JSON.parse(res.body.toString()).answer;
      }
   }

</script>

<div class="fixed z-10 left-0 right-0 top-0 md:my-8 mt-4 max-w-fit mx-auto px-5">
   <ChatPrompt {onSend} bind:focused={chatOpen} {loading}/>
</div>

{#if chatOpen}
<div class="fixed inset-0 top-[calc(50vh+20px)] left-2 right-2 flex items-center bottom-0 flex-col overflow-y-auto" >
{#key message}
   <ChatBubble msg={message}/>
{/key}
</div>
{/if}
