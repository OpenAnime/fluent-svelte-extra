<script lang="ts">
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import Slider from "@bulatdashiev/svelte-slider";
	import { TextBlock } from "fluent-svelte";
	export let min: number = 1;
	export let max: number = 100;
	export let step: number = 1;
	let valuesText = min + "," + max;
	export let values: number[] = [min, max];

	function escapeFloatingPoint(number) {
		return Number(parseFloat(number).toPrecision(12));
	}

	$: {
		if (values.toString() !== valuesText) {
			valuesText = escapeFloatingPoint(values[0]) + "," + escapeFloatingPoint(values[1]);
		}
	}

	function handleChange(
		event: CustomEvent<{
			detail: any;
		}>
	): void {
		valuesText =
			escapeFloatingPoint(event.detail[0]) + "," + escapeFloatingPoint(event.detail[1]);
		dispatch("change", event.detail);
	}

	function handleMouseDown(): void {
		["touchend", "touchcancel", "mouseup"].forEach(ev => {
			document.addEventListener(
				ev,
				() => {
					dispatch("finish", valuesText.toString());
				},
				{
					once: true
				}
			);
		});
	}
</script>

<div id="sliderHolder">
	<div id="sliderComp" {...$$restProps}>
		<Slider bind:value={values} {min} {max} {step} range order on:input={handleChange}>
			<div
				slot="left"
				class="handle"
				on:mousedown={handleMouseDown}
				on:touchstart={handleMouseDown}
			/>
			<div
				slot="right"
				class="handle"
				on:mousedown={handleMouseDown}
				on:touchstart={handleMouseDown}
			/>
		</Slider>
		<div id="vals">
			<TextBlock>{valuesText.split(",")[0]}</TextBlock>
			<TextBlock>{valuesText.split(",")[1]}</TextBlock>
		</div>
	</div>
</div>

<style>
	#vals {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.handle {
		align-items: center;
		background-color: var(--fds-control-solid-fill-default);
		block-size: 20px;
		box-shadow: 0 0 0 1px var(--fds-control-stroke-default);
		display: flex;
		inline-size: 20px;
		justify-content: center;
		z-index: 10;
		border-radius: 100%;
	}

	.handle::before {
		border-radius: 100%;
		background-color: var(--fds-accent-default);
		block-size: 12px;
		content: "";
		inline-size: 12px;
		transition: var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing)
			transform;
	}

	.handle:hover:before {
		transform: scale(1.167);
	}

	.handle:active:before {
		background-color: var(--fds-accent-default);
		transform: scale(0.833);
	}

	#sliderHolder :global(.thumb-content::before) {
		background: none !important;
	}

	#sliderHolder :global(.track) {
		background: var(--fds-control-strong-fill-default) !important;
	}

	#sliderHolder :global(.progress) {
		background: var(--fds-accent-default) !important;
	}
</style>
