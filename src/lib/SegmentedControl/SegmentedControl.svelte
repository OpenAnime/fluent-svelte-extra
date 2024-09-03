<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import { createEventForwarder } from "$lib/internal";

	/** Sets the input element's native `value` attribute for usage in forms. */
	export let value: any = undefined;

	/** Controls whether the radio is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

	/** Specifies a custom class name for the radio. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the checkbox's outer container element. */
	export let containerElement: HTMLDivElement;

	const forwardEvents = createEventForwarder(get_current_component());
</script>

<div class="segmented-control {className}" bind:this={containerElement}>
	<slot {value}></slot>
</div>

<style lang="scss">
	@use "./SegmentedControl";
</style>
