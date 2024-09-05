<script lang="ts">
	import { deleteKey, getKey, setKey, uid, getCSSDuration, createEventForwarder } from "$lib/internal";
	import { onDestroy, onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { get_current_component } from "svelte/internal";
	import { expoOut } from "svelte/easing";

	/** Sets the input element's native `value` attribute for usage in forms. */
	export let value: any = undefined;

	/** Controls whether the element is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

	/** Controls dynamic animation for highlighting the selected button. */
	export let animation = true;

	/** Specifies a custom class name for the element. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the element's container element. */
	export let containerElement: HTMLDivElement;

	/** Obtains a bound DOM reference to the highlight element. */
	export let highlightElement: HTMLDivElement;

	let isSelectedDisabled = false;
	const segmentId = uid("segment-");
	const highlight = tweened<{ width: number; left: number }>(
		{
			width: 0,
			left: 0
		},
		{
			easing: expoOut,
			duration: 333
		}
	);

	setKey(`${segmentId}-setValue`, target => {
		value = target;
	});

	let mounted = false;

	$: {
		if (mounted && value) {
			const buttons = Array.from(
				containerElement.querySelectorAll("[data-segmented-button-id]")
			);

			buttons.forEach(button => {
				if (animation === false) {
					button.classList.add("no-animation");
				}
				const buttonId = button.getAttribute("data-segmented-button-id");
				const buttonValue = button.getAttribute("data-segmented-button-value");

				const setSelected = getKey(`${buttonId}-setSelected`) as Function;

				if (setSelected) {
					setSelected(value === buttonValue);
					if (value === buttonValue) {
						const { width, left } = button.getBoundingClientRect();
						highlight.set({
							width,
							left: left - containerElement.getBoundingClientRect().left - 1
						});

						isSelectedDisabled = button.classList.contains("disabled");
					}
				}
			});
		}
	}

	onMount(() => {
		mounted = true;
		// just change the duration not the value (use ... )
		highlight.set(
			{ width: 0, left: 0 },
			{ duration: getCSSDuration("--fds-control-slow-duration") }
		);
	});

	onDestroy(() => {
		deleteKey(`${segmentId}-setValue`);
	});

	const forwardEvents = createEventForwarder(get_current_component());
</script>

<div
	class="segmented-control {className}"
	data-segment-id={segmentId}
	bind:this={containerElement}
	class:no-animation={!animation}
	class:disabled
	{...$$restProps}
	use:forwardEvents
>
	{#if animation}
		<div
			class="segmented-control-highlight"
			bind:this={highlightElement}
			style="width: {$highlight.width}px; left: {$highlight.left}px;"
			class:disabled={isSelectedDisabled || disabled}
		></div>
	{/if}
	<slot></slot>
</div>

<style lang="scss">
	@use "./SegmentedControl";
</style>
