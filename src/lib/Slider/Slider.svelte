<script lang="ts">
	import { createEventForwarder, TooltipSurface } from "$lib/internal";
	import ProgressBar from "fluent-svelte/ProgressBar/ProgressBar.svelte";
	import { createEventDispatcher } from "svelte";
	import { get_current_component } from "svelte/internal";

	/** The slider's current value. */
	export let value = 0;

	/** The minimum value of the slider. */
	export let min = 0;

	/** The maximum value of the slider. */
	export let max = 100;

	/** The buffer value */
	export let bufferValue = 0;

	/** Determines how much the slider's value should increase per step. */
	export let step: number = 1;

	/** Determines the position of slider ticks along the min and max of the track. */
	export let ticks: number[] = [];

	/** Determines the placement of slider ticks around the track. */
	export let tickPlacement: "around" | "before" | "after" = "around";

	/** Determines if the slider's value tooltip will be shown. */
	export let tooltip = true;

	/** Text placed before the slider's value tooltip. */
	export let prefix = "";

	/** Text placed after the slider's value tooltip. */
	export let suffix = "";

	/** Determines if the slider's fill track will be visible or not. */
	export let track = true;

	/** Determines the slider's orientation. */
	export let orientation: "vertical" | "horizontal" = "horizontal";

	export let loading = false;

	/** Determines if the slider track will be in reverse direction. */
	export let reverse = false;

	/** Controls whether the slider is disabled. */
	export let disabled = false;

	/** Specifies a custom class name for the slider's container element. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the slider's input element. */
	export let inputElement: HTMLInputElement = null;

	/** Obtains a bound DOM reference to the slider's outer container element. */
	export let containerElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the slider's tick container element. */
	export let tickBarElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the slider's thumb element. */
	export let thumbElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the slider's outer rail element. */
	export let railElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the slider's track (fill) element. */
	export let trackElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the slider's buffer track element. */
	export let bufferElement: HTMLDivElement = null;

	let dragging = false;
	let holding = false;
	let directionAwareReverse = false;
	let thumbClientWidth = 20;

	$: if (containerElement) {
		directionAwareReverse =
			window?.getComputedStyle(containerElement).direction === "ltr" ? reverse : !reverse;
	}

	const dispatch = createEventDispatcher();
	const forwardEvents = createEventForwarder(get_current_component(), [
		"input",
		"change",
		"userChange",
		"userUpdate",
		"userHoldStart",
		"userHoldEnd",
		"end",
		"beforeinput"
	]);

	// Divides the current value minus the minimum value
	// by the difference between the max and min values,
	// and multiplies by 100 to get a percentage.
	const valueToPercentage = v => ((v - min) / (max - min)) * 100;

	const bufferValueToPercentage = v => (v * 100) / max;

	function cancelMove() {
		holding = false;
		dragging = false;

		if (sliderThumbHolding) {
			sliderThumbHolding = false;
			dispatch("userHoldEnd");
		}
	}

	function handleMove() {
		if (holding) dragging = true;
	}

	function calculateValue(event) {
		if (disabled || !railElement) return;
		const { top, bottom, left, right, width, height } = railElement.getBoundingClientRect();
		const percentageX = event.touches ? event.touches[0].clientX : event.clientX;
		const percentageY = event.touches ? event.touches[0].clientY : event.clientY;

		const position = orientation === "horizontal" ? percentageX : percentageY;
		const startingPos =
			orientation === "horizontal"
				? directionAwareReverse
					? right
					: left
				: directionAwareReverse
				? top
				: bottom;
		const length = orientation === "horizontal" ? width : height;

		let nextStep =
			min +
			Math.round(
				((max - min) *
					((position - startingPos) / length) *
					(directionAwareReverse ? -1 : 1) *
					(orientation === "vertical" ? -1 : 1)) /
					step
			) *
				step;

		if (nextStep <= min) nextStep = min;
		else if (nextStep >= max) nextStep = max;
		dispatch("userChange", [value, nextStep]);
		value = nextStep;
	}

	function handleArrowKeys(event) {
		const { key } = event;

		if (key === "ArrowDown" || key === "ArrowUp") event.preventDefault();
		if (key === "ArrowLeft" || (key === "ArrowDown" && !disabled)) {
			if (reverse) {
				stepUp();
			} else {
				stepDown();
			}
		} else if (key === "ArrowRight" || (key === "ArrowUp" && !disabled)) {
			if (reverse) {
				stepDown();
			} else {
				stepUp();
			}
		}
	}

	function handleTouchStart(event) {
		if (event.cancelable) event.preventDefault();
		holding = true;
	}

	function linearScale(input: readonly [number, number], output: readonly [number, number]) {
		return (value: number) => {
			if (input[0] === input[1] || output[0] === output[1]) return output[0];
			const ratio = (output[1] - output[0]) / (input[1] - input[0]);
			return output[0] + ratio * (value - input[0]);
		};
	}

	export function stepUp() {
		if (value === max) return;
		value += step;
		if (value > max) value = max;
	}

	export function stepDown() {
		if (value === min) return;
		value -= step;
		if (value < min) value = min;
	}

	$: {
		dispatch("change", value);
		if (value === max) dispatch("end", value);
	}
	$: percentage = valueToPercentage(value);
	$: bufferPercentage = bufferValueToPercentage(bufferValue);
	$: {
		if (value <= min) value = min;
		else if (value >= max) value = max;

		if (dragging) {
			calculateValue(event);
			dragging = false;
		}
	}

	let sliderThumbHolding = false;
</script>

<svelte:window
	on:mousemove={handleMove}
	on:touchmove={handleMove}
	on:mouseup={cancelMove}
	on:touchend={cancelMove}
	on:touchcancel={cancelMove}
/>

<!--
@component
A slider is a control that lets the user select from a range of values by moving a thumb control along a track. [Docs](https://fluent-svelte.vercel.app/docs/components/slider)
- Usage:
    ```tsx
    <Slider bind:value min={-100} max={100} step={10} ticks={[-50, 0, 50]} />
    ```
-->
<div
	use:forwardEvents
	on:mousedown|preventDefault={() => {
		holding = true;
		dragging = true;
	}}
	on:mouseup|preventDefault={() => {
		dispatch("userUpdate", value);
	}}
	on:touchend|preventDefault={() => {
		dispatch("userUpdate", value);
	}}
	on:touchcancel|preventDefault={() => {
		dispatch("userUpdate", value);
	}}
	on:touchstart={handleTouchStart}
	on:keydown={handleArrowKeys}
	tabindex={disabled ? -1 : 0}
	style="--fds-slider-percentage: {percentage}%; --fds-slider-thumb-offset: {thumbClientWidth /
		2 -
		linearScale(
			[0, 50],
			[0, thumbClientWidth / 2]
		)(percentage)}px; --fds-buffer-percentage: {bufferPercentage}%"
	class="slider orientation-{orientation} {className}"
	class:disabled
	class:reverse={directionAwareReverse}
	bind:this={containerElement}
	{...$$restProps}
>
	<div
		class="slider-thumb"
		role="slider"
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		bind:this={thumbElement}
		bind:clientWidth={thumbClientWidth}
		on:mousedown|preventDefault={() => {
			sliderThumbHolding = true;
			dispatch("userHoldStart");
		}}
		on:mouseup|preventDefault={() => {
			if (sliderThumbHolding) {
				sliderThumbHolding = false;
				dispatch("userHoldEnd");
			}
		}}
		on:touchend|preventDefault={() => {
			if (sliderThumbHolding) {
				sliderThumbHolding = false;
				dispatch("userHoldEnd");
			}
		}}
		on:touchcancel|preventDefault={() => {
			if (sliderThumbHolding) {
				sliderThumbHolding = false;
				dispatch("userHoldEnd");
			}
		}}
		on:touchstart={handleTouchStart}
		on:keydown={handleArrowKeys}
	>
		{#if tooltip && !disabled}
			<TooltipSurface class="slider-tooltip">
				<slot name="tooltip" {prefix} {suffix} {value}>
					{prefix}{value}{suffix}
				</slot>
			</TooltipSurface>
		{/if}
	</div>

	<div class="slider-rail" bind:this={railElement}>
		{#if track}
			<div class="slider-track" bind:this={trackElement} />
		{/if}

		{#if loading}
			<div class="slider-loading-track">
				<ProgressBar />
			</div>
		{/if}

		{#if bufferValue > 0}
			<div class="slider-buffer-track" bind:this={bufferElement} />
		{/if}
	</div>

	{#if ticks}
		<div class="slider-tick-bar placement-{tickPlacement}" bind:this={tickBarElement}>
			{#each ticks as tick}
				<div
					class="slider-tick"
					style="--fds-slider-tick-percentage: {valueToPercentage(tick)}%"
				/>
			{/each}
		</div>
	{/if}

	<input type="range" hidden {min} {max} {step} {disabled} {value} bind:this={inputElement} />
</div>

<style lang="scss">
	@use "./Slider";
</style>
