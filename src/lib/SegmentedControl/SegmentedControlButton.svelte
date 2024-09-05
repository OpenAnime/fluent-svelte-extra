<script lang="ts">
	import { deleteKey, getKey, setKey, uid } from "$lib/internal";
	import { onDestroy, onMount } from "svelte";

	/** Sets the input element's native `value` attribute for usage in forms. */
	export let value: any = undefined;

	/** Controls whether the radio is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

	/** Specifies a custom class name for the radio. */
	let className = "";
	export { className as class };

	let root: HTMLButtonElement;

	export let selected = false;

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

	const segmentButtonId = uid("segment-button-");

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
</script>

<button
	class="segmented-control-button"
	class:selected
	on:click={handleClick}
	{disabled}
	bind:this={root}
	data-segment-button-id={segmentButtonId}
	data-segment-button-value={value}
>
	<slot></slot>
</button>

<style lang="scss">
	@use "./SegmentedControlButton";
</style>
