<script lang="ts">
	import { deleteKey, getKey, setKey, uid, createEventForwarder } from "$lib/internal";
	import { onDestroy, onMount } from "svelte";
	import { get_current_component } from "svelte/internal";

	/** Sets the input element's native `value` attribute for usage in forms. */
	export let value: any = undefined;

	/** Controls whether the element is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

	/** Specifies whether the element is selected or not. */
	export let selected = false;

	/** Specifies a custom class name for the radio. */
	let className = "";
	export { className as class };

	let root: HTMLButtonElement;

	function handleClick() {
		if (root) {
			const found = root.closest("[data-segment-id]");

			if (found) {
				const segmentId = found.getAttribute("data-segment-id");

				const setValue = getKey(`${segmentId}-setValue`) as Function;

				if (setValue) {
					setValue(value);
				}
			}
		}
	}

	const segmentButtonId = uid("segmented-button-");

	setKey(`${segmentButtonId}-setSelected`, isSelected => {
		selected = isSelected;
	});

	onMount(() => {
		if (selected) {
			handleClick();
		}
	});

	onDestroy(() => {
		deleteKey(`${segmentButtonId}-setSelected`);
	});

	const forwardEvents = createEventForwarder(get_current_component());
</script>

<button
	class="segmented-control-button"
	class:selected
	class:disabled
	on:click={handleClick}
	{disabled}
	bind:this={root}
	data-segmented-button-id={segmentButtonId}
	data-segmented-button-value={value}
	use:forwardEvents
	{...$$restProps}
>
	{#if $$slots.icon}
		<div class="icon">
			<slot name="icon" />
		</div>
	{/if}
	<slot></slot>
</button>

<style lang="scss">
	@use "./SegmentedControlButton";
</style>
