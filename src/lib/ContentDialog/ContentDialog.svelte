<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { get_current_component } from "svelte/internal";
	import { fade, scale } from "svelte/transition";
	import { circOut } from "svelte/easing";
	import { uid, focusTrap, getCSSDuration, createEventForwarder } from "$lib/internal";

	import TextBlock from "../TextBlock/TextBlock.svelte";

	/** Determines whether the dialog is open or not. */
	export let open: boolean = false;

	/** Title text displayed as the dialog header. */
	export let title: string = "";

	/** Specifies the visual size of the dialog. */
	export let size: "standard" | "max" | "min" = "standard";

	/** Determines whether the dialog can be conventially closed using the escape key. */
	export let closable = true;

	/** Determines whether the dialog should display a close button. */
	export let closeButton = false;

	/** Determines the node the dialog should be appended to. */
	export let append: HTMLElement = undefined;

	/** Determines if the dialog should darken the contents behind it. */
	export let darken = true;

	/** Determines if keyboard focus should be locked to the dialog's contents. */
	export let trapFocus = true;

	/** Specifies a custom class name for the dialog. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the inner dialog element. */
	export let element: HTMLElement = null;

	/** Obtains a bound DOM reference to the dialog's backdrop container element. */
	export let backdropElement: HTMLElement = null;

	/** Obtains a bound DOM reference to the dialog's inner body element. */
	export let bodyElement: HTMLElement = null;

	/** Obtains a bound DOM reference to the dialog's footer element. */
	export let footerElement: HTMLElement = null;

	const forwardEvents = createEventForwarder(get_current_component(), [
		"open",
		"close",
		"closeByButton",
		"backdropclick",
		"backdropmousedown"
	]);
	const dispatch = createEventDispatcher();
	const titleId = uid("fds-dialog-title-");
	const bodyId = uid("fds-dialog-body-");

	$: if (!open) dispatch("close");
	$: _focusTrap = trapFocus ? focusTrap : () => {};

	function mountDialog(node: HTMLDivElement) {
		dispatch("open");
		if (append) append.appendChild(node);
		node.focus();
	}

	function close() {
		open = false;
	}

	function closeByButton() {
		if (closable) {
			close();
			dispatch("closeByButton");
		}
	}

	function handleEscapeKey({ key }: KeyboardEvent) {
		if (key === "Escape" && open && closable) close();
	}
</script>

<svelte:window on:keydown={handleEscapeKey} />

{#if open}
	<div
		class="content-dialog-smoke"
		class:darken
		on:click|self={e => dispatch("backdropclick", e)}
		on:mousedown|self={e => dispatch("backdropmousedown", e)}
		transition:fade|local={{ duration: getCSSDuration("--fds-control-faster-duration") }}
		use:mountDialog
		use:_focusTrap
		bind:this={backdropElement}
	>
		<div
			class="content-dialog-container {className}"
			transition:scale|local={{
				duration: getCSSDuration("--fds-control-fast-duration"),
				start: 1.05,
				easing: circOut
			}}
		>
			<div
				use:forwardEvents
				class="content-dialog size-{size}"
				role="dialog"
				aria-modal="true"
				aria-labelledby={title && titleId}
				aria-describedby={bodyId}
				bind:this={element}
				{...$$restProps}
			>
				<div class="content-dialog-body" id={bodyId} bind:this={bodyElement}>
					{#if title}
						<TextBlock variant="subtitle" class="content-dialog-title" id={titleId}>
							{title}
						</TextBlock>
					{/if}
					<slot />
				</div>
				{#if $$slots.footer}
					<footer class="content-dialog-footer" bind:this={footerElement}>
						<slot name="footer" />
					</footer>
				{/if}
			</div>
			{#if closeButton}
				<button
					id="close-button"
					aria-label="Close dialog"
					tabindex="0"
					class:disabled={!closable}
					on:click={closeByButton}
				>
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 1024 1024"
					>
						<path
							fill="currentColor"
							d="M512,584.5L87.5,1009C77.5,1019 65.5,1024 51.5,1024C36.8333,1024 24.5833,1019.08 14.75,1009.25C4.91667,999.417 0,987.167 0,972.5C0,958.5 5,946.5 15,936.5L439.5,512L15,87.5C5,77.5 0,65.3334 0,51C0,44 1.33333,37.3334 4,31C6.66667,24.6667 10.3333,19.25 15,14.75C19.6667,10.25 25.1667,6.66669 31.5,4C37.8333,1.33337 44.5,0 51.5,0C65.5,0 77.5,5 87.5,15L512,439.5L936.5,15C946.5,5 958.667,0 973,0C980,0 986.583,1.33337 992.75,4C998.917,6.66669 1004.33,10.3334 1009,15C1013.67,19.6667 1017.33,25.0834 1020,31.25C1022.67,37.4167 1024,44 1024,51C1024,65.3334 1019,77.5 1009,87.5L584.5,512L1009,936.5C1019,946.5 1024,958.5 1024,972.5C1024,979.5 1022.67,986.167 1020,992.5C1017.33,998.833 1013.75,1004.33 1009.25,1009C1004.75,1013.67 999.333,1017.33 993,1020C986.667,1022.67 980,1024 973,1024C958.667,1024 946.5,1019 936.5,1009Z"
						/>
					</svg>
				</button>
			{/if}
		</div>
		<slot name="outer" />
	</div>
{/if}

<style lang="scss">
	@use "./ContentDialog";
</style>
