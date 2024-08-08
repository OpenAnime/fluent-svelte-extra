<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { uid, focusTrap, getCSSDuration } from "$lib/internal";
	import { fade, scale } from "svelte/transition";
	import { expoIn, expoOut } from "svelte/easing";

	import TeachingTipSurface from "./TeachingTipSurface.svelte";

	/** Determines the teaching-tip's visibility. */
	export let open = false;

	/** Determines if the teaching-tip can be closed using conventional user interaction. */
	export let closable = true;

    /** Determines if the teaching-tip can be closed by clicking outside of it. */
    export let closeOnBackdropClick = false;

	/** Determines if the teaching-tip can be clicked. */
	export let enableClick = true;

	/** Direction that the teaching-tip will be opened from. */
	export let placement: "top" | "bottom" | "left" | "right" = "top";

	/** Alignment of the menu along the clickable target's given axis. */
	export let alignment: "start" | "center" | "end" = "center";

	/** Distance of the teaching-tip from the control button in pixels. */
	export let offset = 4;

	/** Determines if keyboard focus should be locked to the teaching-tip's contents. */
	export let trapFocus = true;

	/** Specifies a custom class name for the content wrapper. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the content wrapper element. */
	export let wrapperElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the menu's positioning anchor element. */
	export let anchorElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the inner menu element. */
	export let menuElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the menu backdrop, which is present while the menu is `open`. */
	export let backdropElement: HTMLDivElement = null;

	const dispatch = createEventDispatcher();
	const menuId = uid("fds-teaching-tip-anchor-");

	$: _focusTrap = trapFocus ? focusTrap : () => {};
	$: if (open) {
		dispatch("open");
	} else {
		dispatch("close");
	}

	function handleEscapeKey({ key }: KeyboardEvent) {
		if (key === "Escape" && closable) open = false;
	}

	function closeTeachingTip() {
		if (closable && closeOnBackdropClick) open = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === " " || event.key === "Enter") {
			event.preventDefault();
			open = !open;
		}
	}
</script>

<!--
@component
TeachingTips represent a control that displays lightweight UI that is either information, or requires user interaction. Unlike a dialog, a TeachingTip can be dismissed by clicking or tapping outside of it, or pressing the Esc key. [Docs](https://fluent-svelte.vercel.app/docs/components/teaching-tip)
- Usage:
    ```tsx
    <TeachingTip>
        <Button>Trigger Button</Button>
        <svelte:fragment slot="teaching-tip">
            TeachingTip Contents
        </svelte:fragment>
    </TeachingTip>
    ```
-->

<svelte:window on:keydown={handleEscapeKey} />

<div
	class="teaching-tip-wrapper {className}"
	aria-expanded={open}
	aria-haspopup={open}
	aria-controls={menuId}
	on:click={() => {
		enableClick && (open = !open);
	}}
	on:keydown={handleKeyDown}
	bind:this={wrapperElement}
>
	<slot />
	{#if open}
		<div
			id={menuId}
			class="teaching-tip-anchor placement-{placement} alignment-{alignment}"
			style="--fds-teaching-tip-offset: {offset}px;"
			use:_focusTrap
            in:scale|local={{
                duration: getCSSDuration("--fds-control-slow-duration"),
                easing: expoOut,
                opacity: 1
            }}
            out:scale|local={{
                duration: getCSSDuration("--fds-control-slow-duration"),
                easing: expoIn,
                opacity: 1
            }}
			bind:this={anchorElement}
			on:click={e => e.stopPropagation()}
			{...$$restProps}
		>
			<slot name="override">
				<TeachingTipSurface bind:element={menuElement}>
					<slot name="flyout" />
				</TeachingTipSurface>
			</slot>
		</div>
		<div
			class="teaching-tip-backdrop"
			bind:this={backdropElement}
			on:click={e => e.stopPropagation()}
			on:mousedown={closeTeachingTip}
		/>
	{/if}
</div>

<style lang="scss">
	@use "./TeachingTipWrapper";
</style>
