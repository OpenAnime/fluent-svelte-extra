<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import { externalMouseEvents, createEventForwarder } from "$lib/internal";

 /** The input's current value. */
	export let value: any = "";

	export let disableBottomBorder: boolean = false;

	export let spellcheck: boolean = false


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

	const inputProps = {
		class: "text-area",
		disabled: disabled || undefined,
		readonly: readonly || undefined,
		placeholder: placeholder || undefined,
		...$$restProps
	};

	


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

 <div role="textbox" spellcheck={spellcheck} contenteditable="true" bind:this={textAreaElement} use:forwardEvents {...inputProps} bind:textContent={value}/>
	<slot></slot>
	<div class="text-area-underline" 	style={disableBottomBorder ? "--fds-bottom-border: none;" : "--fds-bottom-border: 1px solid var(--fds-control-strong-stroke-default);"} />
</div>

<style lang="scss">
	@use "./TextArea";
</style>
