<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { uid, focusTrap, getCSSDuration } from "$lib/internal";
	import IconButton from "../IconButton/IconButton.svelte";
	import TextBlock from "../TextBlock/TextBlock.svelte";
	import { scale, type ScaleParams } from "svelte/transition";
	import { expoIn, expoOut } from "svelte/easing";

	import TeachingTipSurface from "./TeachingTipSurface.svelte";

	/** Determines the teaching-tip's visibility. */
	export let open = false;

	/** Title of the teaching-tip. */
	export let title = "";

	/** Determines if the teaching-tip can be closed using conventional user interaction. */
	export let closable = true;

	/** Determines if the teaching-tip can be closed by clicking outside of it. */
	export let closeOnBackdropClick = true;

	/** Determines if the teaching-tip should display a close button. */
	export let closeButton = true;

	/** Determines if the teaching-tip can be clicked. */
	export let enableClick = true;

	/** Direction that the teaching-tip will be opened from. */
	export let placement: "top" | "bottom" | "left" | "right" = "top";

	const initialPlacement: typeof placement = placement;

	/** Determines the direction of the image element. */
	export let imagePlacement: "top" | "bottom" = placement === "top" ? "bottom" : "top";

	/** Determines the direction of the image element. */
	export let src = "";

	/** Alignment of the menu along the clickable target's given axis. */
	export let alignment: "start" | "center" | "end" = "center";

	/** Distance of the teaching-tip from the control button in pixels. */
	export let offset = 8;

	/** Whether the use acrylic background styling for the teaching-tip. */
	export let acrylic = true;

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

	/** Obtains a bound DOM reference to the menu footer element. */
	export let footerElement: HTMLElement = null;

	const dispatch = createEventDispatcher();
	const menuId = uid("fds-teaching-tip-anchor-");

	$: _focusTrap = trapFocus ? focusTrap : () => {};

	$: if (open) {
		dispatch("open");
	} else {
		dispatch("close");
	}

	function handleEscapeKey({ key }: KeyboardEvent) {
		if (key === "Escape") closeTeachingTip();
	}

	function closeTeachingTip() {
		if (closable) open = false;
	}

	function backdropClick() {
		if (closeOnBackdropClick) closeTeachingTip();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === " " || event.key === "Enter") {
			event.preventDefault();

			open = !(open && closable);
		}
	}

	let anchorElementWidth: number;
	let anchorElementHeight: number;

	async function handleResize() {
		if (!anchorElement) return;

		const { x, y, width, height } = anchorElement.getBoundingClientRect();

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		if (placement === "top" && y < 0) {
			placement = "bottom";
		} else if (placement === "bottom" && y + height > screenHeight) {
			placement = "top";
		} else if (placement === "left" && x < 0) {
			placement = "right";
		} else if (placement === "right" && x + width > screenWidth) {
			placement = "left";
		}
	}

	let imageHeight: number = 0;

	function customScale(node: HTMLElement, params: ScaleParams & { intro?: boolean }) {
		if (params?.intro) {
			handleResize();
		}

		return scale(node, params);
	}

	$: {
		if (anchorElementWidth || anchorElementHeight || anchorElement || open || imageHeight) {
			handleResize();
		}
	}

	let resizeTimeout: NodeJS.Timeout;
</script>

<!--
@component
TeachingTips represent a control that displays lightweight UI that is either information, or requires user interaction. Unlike a dialog, a TeachingTip can be dismissed by clicking or tapping outside of it, or pressing the Esc key. [Docs](https://fluent-svelte.vercel.app/docs/components/teaching-tip)
- Usage:
    ```tsx
    <TeachingTip>
        <Button>Button</Button>
        <svelte:fragment slot="teaching-tip">
            TeachingTip Contents
        </svelte:fragment>
    </TeachingTip>
    ```
-->

<svelte:window
	on:keydown={handleEscapeKey}
	on:resize={() => {
		clearTimeout(resizeTimeout);

		resizeTimeout = setTimeout(handleResize, 100);
	}}
/>

<div
	class="teaching-tip-wrapper {className}"
	aria-expanded={open}
	aria-haspopup={open}
	aria-controls={menuId}
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
			in:customScale|local={{
				duration: getCSSDuration("--fds-control-slow-duration"),
				easing: expoOut,
				opacity: 1,
				start: 0.1,
				intro: true
			}}
			out:customScale|local={{
				duration: getCSSDuration("--fds-control-slow-duration"),
				easing: expoIn,
				opacity: 1,
				start: 0.1
			}}
			bind:this={anchorElement}
			bind:clientHeight={anchorElementHeight}
			bind:clientWidth={anchorElementWidth}
			on:click={e => e.stopPropagation()}
			{...$$restProps}
		>
				<slot name="override">
					<TeachingTipSurface bind:element={menuElement} {acrylic}>
						{#if src && imagePlacement === "top"}
							<div bind:clientHeight={imageHeight}>
								<img class="teaching-tip-image placement-top" {src} alt={title} />
							</div>
						{/if}
						<div class="teaching-tip-content">
							{#if closeButton}
								<IconButton
									class="teaching-tip-close-button"
									on:click={closeTeachingTip}
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
								</IconButton>
							{/if}
							{#if title}
								<TextBlock class="teaching-tip-title" variant="bodyStrong">
									{title}
								</TextBlock>
							{/if}
							<slot name="flyout" />
							{#if $$slots.footer}
								<footer class="teaching-tip-footer" bind:this={footerElement}>
									<slot name="footer" />
								</footer>
							{/if}
						</div>
						{#if src && imagePlacement === "bottom"}
							<img class="teaching-tip-image placement-bottom" {src} alt={title} />
						{/if}
					</TeachingTipSurface>
				</slot>

			<svg
				width="16"
				height="10"
				viewBox="0 0 16 10"
				class="teaching-tip-caret"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7.99902 7.79297L14.999 0.792969H0.999023L7.99902 7.79297Z"
					fill="currentColor"
				/>
				<path
					d="M7.99917 9.20718L0.584961 1.79297H1.99917L7.99917 7.79297L13.9992 1.79297H15.4134L7.99917 9.20718Z"
					class="stroke"
					fill="currentColor"
				/>
			</svg>
		</div>
		{#if closeOnBackdropClick}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="teaching-tip-backdrop"
				bind:this={backdropElement}
				on:click={e => e.stopPropagation()}
				on:mousedown={backdropClick}
			/>
		{/if}
	{/if}
</div>

<style lang="scss">
	@use "./TeachingTipWrapper";
</style>
