<script lang="ts">
	import { fly } from "svelte/transition";

let { msg } : { msg: string } = $props();
</script>
{#key msg}

<div 
out:fly|global={{y:10, duration: 300}}
in:fly|global={{y:10, duration: 300, delay: 1000}}>
   {#each msg as l, i (i)}
      <span style:animation-delay="{i*20}ms">{l}</span>
   {/each}
</div>
{/key}

<style>

   div {
      max-width: 400px;
      border: solid 2px var(--color-main-white);
      border-radius: 12px;
      border-bottom-width: 5px;
      border-right-width: 5px;
      padding: 12px 24px;
   }

   span {
      opacity: 0;
      animation-name: fade;
      animation-duration: 0s;
      animation-fill-mode: both;
   }
   @keyframes fade {
      from {
         opacity: 0;
      }
      to {
         opacity: 1;
      }
   }
</style>
