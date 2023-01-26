<script lang="ts">
 import { createEventDispatcher } from 'svelte'
 const dispatch = createEventDispatcher()
 import Slider from '@bulatdashiev/svelte-slider'
 import { TextBlock } from 'fluent-svelte'
 export let min: number = 1
 export let max: number = 100
 let valuesText = min + ',' + max
 export let values: number[] = [min,max]
 $: {
    if(values.toString() !== valuesText) {
        valuesText = values[0] + "," + values[1]
    }
 }

 function handleChange(event: CustomEvent<{detail: any}>): void {
     valuesText = event.detail.toString()
     dispatch('change', event.detail)
 }

 function handleMouseDown(): void {
    document.addEventListener("mouseup",() => {
        dispatch('finish', valuesText.toString())
    }, {once: true});
 }
</script>

<div id="sliderComp" {...$$restProps}>
 <Slider
     bind:value={values}
     {min}
     {max}
     range
     order
     on:input={handleChange}
 >
     <div
         slot="left"
         class="handle"
         on:mousedown={handleMouseDown}
     />
     <div
         slot="right"
         class="handle"
         on:mousedown={handleMouseDown}
     />
 </Slider>
 <div id="vals">
     <TextBlock>{valuesText.split(',')[0]}</TextBlock>
     <TextBlock>{valuesText.split(',')[1]}</TextBlock>
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
