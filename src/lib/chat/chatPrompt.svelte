<script lang="ts">
	import Glass from "$lib/Glass.svelte";

   interface p {
      onSend: (msg: string) => void
      focused: boolean
      loading: boolean
   }
   let {onSend, focused = $bindable(false), loading = $bindable(false)} : p = $props();

   let value = $state("<br>");
   let sent = $state(false);

   function sendMessage() {
      sent=true;
      onSend(value);
      setTimeout(() => {
         value = "<br>";
         loading = true;
         sent = false;
      }, 400
      );
   }
</script>

<Glass>
<div class="field">
   <div class="fieldContent">
   {#if loading}
   <img src="/loading.svg" class="h-[30px] object-contain object-center px-3 bg-[#ffffff88]" alt="loading"/>
   {:else}
      <img src="/chat.svg" class="max-w-4 top-0.25 relative"/>
      <div class="flex">
      {#if value.length == 0 || value === "<br>"}
         <p class="text-sm opacity-90 w-0 text-nowrap pointer-events-none bottom-px relative">
         Ask Little Alex</p>
      {/if}
      <div contenteditable=true bind:innerHTML={value} bind:focused role="textbox" class={(sent ? "sending" : "") + " text-sm input"}></div>
      </div>
      <button onclick={sendMessage} disabled={sent || value.length === 0 || value === "<br>"} >↩</button>
   {/if}
   </div>
</div>
</Glass>

<style lang="postcss">
	@reference "../../app.css";
.field {
   --row-height: 30px;
   display: flex;
   padding: 2px;
   gap: 10px;
   overflow: visible;
   border-radius: 12px;
   &:hover, &:focus-within {
      padding: 5px;
   }
   transition: all 200ms ease-out;
}

.fieldContent {
padding: 4px;
   display: flex;
   gap: 5px;
}

.input {
   &:focus {
   border: none;
   outline: none;
   padding: 0;
   }
   min-width: 130px;
   max-width: 200px;
   position: relative;
   bottom: 1px;
}

button {
   @apply text-sm;
   width: 50px;
   border-radius: 8px;
   transition: all 200ms ease-in-out, opacity 100ms ease-in-out;
   overflow:hidden;
   position: relative;
   top: 1px;
}

button:disabled{
   width: 0;
}

.sending {
   transform: translateY(-5px);
   opacity: 0%;
   transition: all 200ms ease-out;
}
</style>
