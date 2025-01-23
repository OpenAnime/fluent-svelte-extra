<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import MenuFlyoutWrapper from "../MenuFlyout/MenuFlyoutWrapper.svelte";
	import { createEventForwarder } from "$lib/internal";

	/** @restProps {button | a} */
	/** Specifies the visual styling of the button. */
	export let variant: "standard" | "accent" | "hyperlink" = "standard";

	/** Sets an href value and converts the button element into an anchor/ */
	export let href = "";

	/** The current visibility state of the context menu. */
	export let open = false;

	/** Controls whether the button is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

	/** Controls the menu's disability state. */
	export let menuDisabled = disabled;

	/** Specifies the direction of the menu. */
	export let direction: "down" | "up" = "down";

	/** Alignment of the menu along the clickable target's given axis. */
	export let alignment: "start" | "center" | "end" = "center";

	/** Distance of the flyout from the control button in pixels. */
	export let offset = 4;

	/** Whether the use acrylic background styling for the flyout. */
	export let acrylic = true;

	/** Determines if the flyout can be closed using conventional user interaction. */
	export let closable = true;

	/** Controls if the flyout will be closed when clicking a standard variant item. Only applies if `closable` is set to `true`. */
	export let closeOnSelect = true;

	/** Specifies a custom class name for the button. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the button or anchor element. */
	export let element: HTMLElement = null;

	/** A bound DOM reference to container*/
	export let containerElement: HTMLElement = null;

	/** Bound DOM reference to chevron too*/
	export let chevronElement: HTMLElement = null;

	/** Bound DOM reference to menu*/
	export let menuElement: HTMLElement = null;

	let menu;

	const forwardEvents = createEventForwarder(get_current_component());
</script>

<!--
@component
A button gives the user a way to trigger an immediate action. Some buttons are specialized for particular tasks, such as navigation, repeated actions, or presenting menus. [Docs](https://fluent-svelte.vercel.app/docs/components/button)
- Usage:
    ```tsx
    <SplitButton>Click me!</SplitButton>
    ```
-->
<div class="split-button-container" bind:this={containerElement}>
	<svelte:element
		this={href && !disabled ? "a" : "button"}
		use:forwardEvents
		bind:this={element}
		role={href && !disabled ? "button" : undefined}
		href={href && !disabled ? href : undefined}
		class="split-button style-{variant} {className}"
		tabindex={!disabled ? 0 : -1}
		class:disabled
		{disabled}
		{...$$restProps}
	>
		<slot />
	</svelte:element>
	{#if !menuDisabled}
		<MenuFlyoutWrapper
			bind:this={menu}
			bind:element={menuElement}
			placement={direction === "down" ? "bottom" : "top"}
			open={menuDisabled ? false : open}
			{alignment}
			{offset}
			{acrylic}
			{closable}
			{closeOnSelect}
		>
			<button
				class={`split-button-chevron style-${variant}`}
				class:disabled={menuDisabled}
				aria-hidden="true"
				bind:this={chevronElement}
				disabled={menuDisabled}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
					{#if direction === "down"}
						<path
							fill="currentColor"
							d="M2.14645 4.64645C2.34171 4.45118 2.65829 4.45118 2.85355 4.64645L6 7.79289L9.14645 4.64645C9.34171 4.45118 9.65829 4.45118 9.85355 4.64645C10.0488 4.84171 10.0488 5.15829 9.85355 5.35355L6.35355 8.85355C6.15829 9.04882 5.84171 9.04882 5.64645 8.85355L2.14645 5.35355C1.95118 5.15829 1.95118 4.84171 2.14645 4.64645Z"
						/>
					{:else}
						<path
							fill="currentColor"
							d="M2.14645 7.35355C2.34171 7.54882 2.65829 7.54882 2.85355 7.35355L6 4.20711L9.14645 7.35355C9.34171 7.54882 9.65829 7.54882 9.85355 7.35355C10.0488 7.15829 10.0488 6.84171 9.85355 6.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645L2.14645 6.64645C1.95118 6.84171 1.95118 7.15829 2.14645 7.35355Z"
						/>
					{/if}
				</svg>
			</button>

			<svelte:fragment slot="flyout">
				<slot name="flyout" />
			</svelte:fragment>
		</MenuFlyoutWrapper>
	{:else}
		<button
			class={`split-button-chevron style-${variant}`}
			class:disabled={menuDisabled}
			aria-hidden="true"
			bind:this={chevronElement}
			disabled={menuDisabled}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
				{#if direction === "down"}
					<path
						fill="currentColor"
						d="M2.14645 4.64645C2.34171 4.45118 2.65829 4.45118 2.85355 4.64645L6 7.79289L9.14645 4.64645C9.34171 4.45118 9.65829 4.45118 9.85355 4.64645C10.0488 4.84171 10.0488 5.15829 9.85355 5.35355L6.35355 8.85355C6.15829 9.04882 5.84171 9.04882 5.64645 8.85355L2.14645 5.35355C1.95118 5.15829 1.95118 4.84171 2.14645 4.64645Z"
					/>
				{:else}
					<path
						fill="currentColor"
						d="M2.14645 7.35355C2.34171 7.54882 2.65829 7.54882 2.85355 7.35355L6 4.20711L9.14645 7.35355C9.34171 7.54882 9.65829 7.54882 9.85355 7.35355C10.0488 7.15829 10.0488 6.84171 9.85355 6.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645L2.14645 6.64645C1.95118 6.84171 1.95118 7.15829 2.14645 7.35355Z"
					/>
				{/if}
			</svg>
		</button>
	{/if}
</div>

<style lang="scss">
	@use "./SplitButton";
</style>
