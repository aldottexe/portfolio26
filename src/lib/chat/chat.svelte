<script lang="ts">
	import { resolve } from "$app/paths";
	import ChatBubble from "./chatBubble.svelte";
	import ChatPrompt from "./chatPrompt.svelte";

   let {chatOpen = $bindable(false)} : {chatOpen: boolean} = $props();

   let message: string = $state(`Hi! I'm Little Alex. If you have any questions, I might be able to help! (I'm still a work in progress but I'm trying my best)`);
   let loading: boolean = $state(false);
   let promptElement: HTMLDivElement;

   $effect(() => {
      if (!chatOpen) return;
      function closeOnOutsideClick(event: MouseEvent) {
         if (promptElement && !event.composedPath().includes(promptElement)) {
            chatOpen = false;
         }
      }
      window.addEventListener('click', closeOnOutsideClick, true);
      return () => window.removeEventListener('click', closeOnOutsideClick, true);
   });

   async function onSend(msg: string) {
      loading = true;
      try {
         const res = await fetch(resolve("/api/ask-little-alex"), {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ message: msg }),
         });
         if (res.ok) {
            const data = await res.json();
            message = data.answer;
         }
      } catch (err) {
         console.error(err);
      } finally {
         loading = false;
      }
   }

</script>

<div bind:this={promptElement} class="fixed z-10 left-0 right-0 top-0 md:my-8 mt-4 max-w-fit mx-auto px-5">
   <ChatPrompt {onSend} onFocus={() => (chatOpen = true)} {loading}/>
</div>

{#if chatOpen}
<div class="fixed inset-0 top-[calc(50vh+20px)] left-2 right-2 flex items-center bottom-0 flex-col overflow-y-auto" >
{#key message}
   <ChatBubble msg={message}/>
{/key}
</div>
{/if}
