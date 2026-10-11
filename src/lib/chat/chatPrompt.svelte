<script lang="ts">
   interface p {
      onSend: (msg: string) => void
      focused: boolean
   }
   let {onSend, focused = $bindable(false)} : p = $props();

   let value = $state("");
   let sent = $state(false);
   
   function sendClicked() {
      sent=true;
      onSend(value);
      setTimeout(() => 
      value = "", 400);

   }
</script>
<div>
   <input type="text" bind:value bind:focused placeholder="Ask little Alex" class={sent ? "sending" : ""}/>
   <button onclick={sendClicked} disabled={sent || value.length === 0}>↩</button>
</div>

<style lang="postcss">
div {
   --row-height: 30px;
   display: flex;
   position: relative;
   padding: 6px 6px 6px 12px;
   gap: 10px;
   background-color: var(--color-main-blue);
   align-items: stretch;
   min-width: 200px;
   border-radius: 10px;
   &:hover {
      transform: translateY(-5px) scale(105%);
   }
   transition: transform 300ms ease-out;

   &::after{
      --offset: -3px;
      border-radius: 13px;
      content: '';
      background: linear-gradient(-12deg, #2343be, #c8cee5);
      position: absolute; 
      top: var(--offset);
      bottom: var(--offset);
      left: var(--offset);
      right: var(--offset);
      z-index: -1;
   }
}

input {
   color: var(--color-main-black);
   &:focus {
   border: none;
   outline: none;
   }
}

button {
   width: var(--row-height);
   aspect-ratio: 1 / 1;
   background: var(--color-main-black);
   border-radius: 5px;
   &:hover {
      transform: translateY(-3px);
      box-shadow: 0px 3px 0px #9ebcc0;
   }
   box-shadow: 0px 0px 0px var(--color-main-gray);
   transition: all 200ms ease-in-out, opacity 100ms ease-in-out;
}

button:disabled{
   opacity: 0%;
}

.sending {
   transform: translateY(-5px);
   opacity: 0%;
   transition: all 00ms ease-out;
}
</style>
