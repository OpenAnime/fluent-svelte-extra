<svelte:options accessors />

<script lang="ts">
	import { createEventDispatcher, setContext } from "svelte";
	import { externalMouseEvents, arrowNavigation } from "$lib/internal";
	import { tabbable } from "tabbable";

	import MenuFlyoutSurface from "../MenuFlyout/MenuFlyoutSurface.svelte";

	/** Controls if the flyout will be closed when clicking a standard variant item. Set to `false` by default. */
	export let closeOnSelect = false;

	/** The current visibility state of the context menu. */
	export let open = false;

	/** Obtains a bound DOM reference to the content wrapper element. */
	export let wrapperElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the menu's positioning anchor element. */
	export let anchorElement: HTMLDivElement = null;

	/** Obtains a bound DOM reference to the inner menu element. */
	export let menuElement: HTMLUListElement = null;

	/** The parent element of ContextMenu */
	export let targetParent: HTMLElement = document.body;

	type ClickTypes = "rightClick" | "leftClick";
	type ClickTypesArray = Array<ClickTypes>;

	/** Controls whether ContextMenu can be opened with right or left click */
	export let openBy: ClickTypesArray = ["rightClick"];

	const dispatch = createEventDispatcher();

	let menu;
	let menuPosition = {
		x: 0,
		y: 0
	};
	let mousePosition = {
		x: 0,
		y: 0
	};

	$: dispatch(open ? "open" : "close");
	$: if (menu && tabbable(menuElement).length > 0) tabbable(menuElement)[0].focus();
	$: if (anchorElement) {
		const { width, height } = anchorElement.getBoundingClientRect();

		menuPosition.x = Math.min(window.innerWidth - width, mousePosition.x);
		menuPosition.y =
			mousePosition.y > window.innerHeight - height
				? (mousePosition.y -= height)
				: mousePosition.y;

		if (menuPosition.y < 0) menuPosition.y = 0;
	}

	async function handleContextMenu({ clientX, clientY }: MouseEvent) {
		open = true;

		mousePosition = {
			x: clientX,
			y: clientY
		};
	}

	function handleEscapeKey({ key }) {
		if (key === "Escape") open = false;
	}

	function mountMenu(node: HTMLDivElement) {
		targetParent.appendChild(node);
		return {
			destroy: () => node.remove()
		};
	}

	if (closeOnSelect) {
		setContext("closeFlyout", () => {
			dispatch("select");
			if (closeOnSelect) open = false;
		});
	}
</script>

<svelte:window on:keydown={handleEscapeKey} />

<div
	class="context-menu-wrapper"
	on:contextmenu|preventDefault|stopPropagation={openBy.includes("rightClick")
		? handleContextMenu
		: undefined}
	on:click|preventDefault|stopPropagation={openBy.includes("leftClick")
		? handleContextMenu
		: undefined}
	on:contextmenu={openBy.includes("rightClick") ? handleContextMenu : undefined}
	bind:this={wrapperElement}
>
	<slot />
	{#if open}
		<div
			use:mountMenu
			use:arrowNavigation={{ preventTab: true }}
			use:externalMouseEvents={{ type: "mousedown" }}
			on:contextmenu|stopPropagation={e => e.preventDefault()}
			bind:this={anchorElement}
			on:outermousedown={() => (open = false)}
			class="context-menu-anchor"
			style="top: {menuPosition.y}px; left: {menuPosition.x}px;"
		>
			<MenuFlyoutSurface bind:this={menu} bind:element={menuElement} {...$$restProps}>
				<slot name="flyout" />
			</MenuFlyoutSurface>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "./ContextMenu";
</style>
