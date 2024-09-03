<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import { createEventForwarder } from "$lib/internal";

	/** Sets the input element's native `value` attribute for usage in forms. */
	export let value: any = undefined;

	/** Controls whether the radio is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

    /** Specifies a custom class name for the segmented control button. */
    export let group = null; 

	/** Specifies a custom class name for the radio. */
	let className = "";
	export { className as class };

	const forwardEvents = createEventForwarder(get_current_component());

	export let selected = false;

</script>

<button class="segmented-control-button" class:selected {disabled}>
	<slot></slot>
</button>

<style lang="scss">
	@use "./SegmentedControlButton";
</style>
