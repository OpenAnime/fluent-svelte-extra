<script>
  import { createEventDispatcher } from "svelte"

  let dispatch = createEventDispatcher()
 export let direction;
</script>

<div id="flipper" on:click={() => dispatch("click", null)}>
 {#if direction === "right"}
 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
  <g id="surface1">
  <path d="M 6 11.933594 C 6 12.644531 6.84375 13.03125 7.378906 12.558594 L 11.589844 8.878906 C 11.84375 8.65625 11.988281 8.339844 11.988281 8 C 11.988281 7.660156 11.84375 7.34375 11.589844 7.121094 L 7.378906 3.441406 C 6.84375 2.96875 6 3.355469 6 4.066406 Z M 6 11.933594 "/>
  </g>
  </svg>
  {:else if direction === "left"}
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
   <g id="surface1">
   <path  d="M 10 11.933594 C 10 12.648438 9.15625 13.03125 8.617188 12.558594 L 4.410156 8.878906 C 4.15625 8.65625 4.011719 8.335938 4.011719 8 C 4.011719 7.664062 4.15625 7.34375 4.410156 7.121094 L 8.617188 3.441406 C 9.15625 2.96875 10 3.351562 10 4.066406 Z M 10 11.933594 "/>
   </g>
   </svg>   
  {/if}
</div>

<style>

 #flipper {
  display:flex;
  align-items: center;
  justify-content:center;
  height:35px;
  border-radius:3px;
  background-color: rgba(255,255,255,.1);
  backdrop-filter: blur(30px) saturate(125%);
  fill: rgb(205, 193, 193);
 }

 #flipper > svg {
  transform:scale(0.9);
 }

 #flipper:hover {
  fill: currentColor;
 }

 #flipper:hover > svg {
  transform:scale(1);
 }

 #flipper:active > svg {
  transform:scale(0.8);  
 }
</style>