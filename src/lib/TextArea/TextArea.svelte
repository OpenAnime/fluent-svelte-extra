<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import { externalMouseEvents, createEventForwarder, conditionalEvent } from "$lib/internal";

	/** The input's current value. */
	export let value: any = "";

	/** Specifies whether the user can paste an image into TextArea */
	export let includeImages = false;

	/** Determines the maximum length of the TextArea */
	export let maxLength: number = undefined;

	export let disableBottomBorder: boolean = false;

	export let spellcheck: boolean = false;

	/** The initial placeholder text displayed if no value is present. */
	export let placeholder: string = undefined;

	/** Determines whether the textarea can be typed in or not. */
	export let readonly = false;

	/** Controls whether the TextArea is intended for user interaction, and styles it accordingly. */
	export let disabled = false;

	/** Specifies a custom class name for the TextArea container. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the TextArea's input element. */
	export let textAreaElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the TextArea's container element. */
	export let containerElement: HTMLDivElement = null;

	const forwardEvents = createEventForwarder(get_current_component());

	$: {
		if (disabled && containerElement && textAreaElement) {
			containerElement.blur();
			textAreaElement.blur();
		}
	}
</script>

<!--
@component
textarea.
- Usage:
    ```tsx
    <TextArea />
    ```
-->
<div
	class="text-area-container {className}"
	class:disabled
	bind:this={containerElement}
	use:externalMouseEvents={{ type: "mousedown" }}
	on:outermousedown
>
	<div
		role="textbox"
		{spellcheck}
		contenteditable
		tabindex={disabled ? -1 : 1}
		bind:this={textAreaElement}
		use:forwardEvents
		on:keypress={e => {
			if (maxLength != undefined && textAreaElement.innerText.length + 1 > maxLength)
				e.preventDefault();
		}}
		on:paste={e => {
			if (includeImages) return;

			const pastedData = e.clipboardData.getData("text");
			const regex = /^[a-zA-Z0-9@  `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$/;

			if (regex.test(pastedData) !== true) {
				e.preventDefault();
			}

			if (textAreaElement.innerText.length + pastedData.length > maxLength)
				e.preventDefault();
		}}
		on:focus={e => {
			if (disabled) e.target.blur();
		}}
		class="text-area"
		{disabled}
		{readonly}
		{placeholder}
		{...$$restProps}
		bind:innerText={value}
	/>
	<slot />
	<div
		class="text-area-underline"
		style={disableBottomBorder
			? "--fds-bottom-border: none;"
			: "--fds-bottom-border: 1px solid var(--fds-control-strong-stroke-default);"}
	/>
</div>

<style lang="scss">
	@use "./TextArea";
</style>
