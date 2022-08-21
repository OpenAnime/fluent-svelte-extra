<script>
 import { createEventDispatcher } from 'svelte'
 import Slider from '@bulatdashiev/svelte-slider'
 import { TextBlock } from 'fluent-svelte'
 export let min
 export let max
 export let width;
 let values = min + ',' + max
 let range = [min, max]

 const dispatch = createEventDispatcher()

 function handleChange(event) {
     values = event.detail.toString()
     dispatch('change', event.detail)
 }
</script>

<div id="sliderComp" style="width: {width}">
 <Slider
     bind:value={range}
     {min}
     {max}
     range
     on:input={(e) => handleChange(e)}
 >
     <div
         slot="left"
         class="handle"
         on:mouseup={() => dispatch('finish', values.toString())}
     />
     <div
         slot="right"
         class="handle"
         on:mouseup={() => dispatch('finish', values.toString())}
     />
 </Slider>
 <div id="vals">
     <TextBlock>{values.split(',')[0]}</TextBlock>
     <TextBlock>{values.split(',')[1]}</TextBlock>
 </div>
</div>

<style>
    #vals {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .handle {
        width: 0;
        height: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .handle::after {
        background-color: hsl(199, 99%, 69%); /*mavi*/
        border: solid 5px hsl(0, 0%, 30%);
        content: ' ';
        box-sizing: border-box;
        position: absolute;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        transition: all 0.1s linear !important;
    }

    .handle:hover::after {
        border: solid 4px hsl(0, 0%, 30%);
    }

    .handle:active::after {
        border: solid 6px hsl(0, 0%, 30%);
        box-shadow: 0 0 10px hsla(0, 0%, 0%, 0.4);
    }

    #sliderComp {
        --thumb-bg: transparent;
        --progress-bg: hsl(199, 99%, 69%);
        --track-bg: hsl(0, 0%, 27%);
    }

    #sliderComp {
        --thumb-bg: transparent;
        --progress-bg: hsl(199, 99%, 69%);
        --track-bg: hsl(0, 0%, 27%);
    }
</style>
