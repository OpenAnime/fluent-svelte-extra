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

	/** Obtains a bound DOM reference to the checkbox's outer container element. */
	export let containerElement: HTMLDivElement;

	const segmentId = uid("segment-");

	setKey(`${segmentId}-setValue`, target => {
		value = target;
	});

	let mounted = false;

	$: {
		if (mounted && value) {
			const buttons = Array.from(
				containerElement.querySelectorAll("[data-segment-button-id]")
			);

			buttons.forEach(button => {
				const buttonId = button.getAttribute("data-segment-button-id");
				const buttonValue = button.getAttribute("data-segment-button-value");

				const setSelected = getKey(`${buttonId}-setSelected`) as Function;

				if (setSelected) {
					setSelected(value === buttonValue);
				}
			});
		}
	}

	onMount(() => {
		mounted = true;
	});

	onDestroy(() => {
		deleteKey(`${segmentId}-setValue`);
	});
</script>

<div class="segmented-control {className}" data-segment-id={segmentId} bind:this={containerElement}>
	<slot></slot>
</div>

<style lang="scss">
	@use "./SegmentedControl";
</style>
