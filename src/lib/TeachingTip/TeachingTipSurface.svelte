<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import { createEventForwarder } from "$lib/internal";

	/** Specifies a custom class name for the surface. */
	let className = "";
	export { className as class };

	/** Whether to use acryllic styling for the surface. */
	export let acrylic = true;

	/** Obtains a bound DOM reference to the surface element. */
	export let element: HTMLDivElement = null;

	const forwardEvents = createEventForwarder(get_current_component());
</script>

<div class="teaching-tip {className}" use:forwardEvents bind:this={element} {...$$restProps} class:acrylic>
	<slot />
</div>

<style lang="scss">
	@use "./TeachingTipSurface";
</style>
