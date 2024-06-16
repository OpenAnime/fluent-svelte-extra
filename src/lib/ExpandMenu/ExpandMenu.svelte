<script lang="ts">
	export let state: "closed" | "expanded";
	import { onMount, createEventDispatcher } from "svelte";
	import { get_current_component } from "svelte/internal";
	import { createEventForwarder } from "$lib/internal";
	const dispatch = createEventDispatcher();

	const forwardEvents = createEventForwarder(get_current_component(), ["closed", "expanded"]);

	let root: HTMLDivElement;

	export function toggleMenu(userDefState?: "closed" | "expanded") {
		if (userDefState == undefined) {
			state == "closed" ? (userDefState = "expanded") : (userDefState = "closed");
		}
		dispatch(userDefState);
		root.classList.toggle("expand-menu-closed");
		state = userDefState;
	}

	export function getCurrentState(): "closed" | "expanded" {
		return state;
	}

	function calculateMaxWidth() {
		const calculations = [];
		for (const el of Array.from(root.querySelectorAll("span"))) {
			const cop = el.cloneNode(true) as HTMLDivElement;
			cop.classList.add("fds-copy-calculation");
			const ap = document.body.appendChild(cop);
			calculations.push(ap.clientWidth);
			ap.remove();
		}
		root.style.width = 22 + 48 + Math.max(...calculations) + "px";
	}

	onMount(() => {
		calculateMaxWidth();
		if (state == "closed") {
			toggleMenu(state);
		}

		const getAllListItems = root.querySelectorAll('[role="listitem"]');
		for (const el of Array.from(getAllListItems)) {
			const findSvg = el.querySelector('[slot="icon"]');
			const findText = Array.from(el.children).find(x => x.tagName != "svg");
			findSvg.classList.add("expand-menu-icon");
			findText.classList.add("expand-menu-text");
		}
	});
</script>

<div class="glob">
	<div role="list" class="expand-menu" bind:this={root} use:forwardEvents>
		<slot />
	</div>
</div>

<style>
	.expand-menu {
		transition: width var(--fds-control-normal-duration)
			var(--fds-control-fast-out-slow-in-easing);
		display: flex;
		flex-direction: column;
		background-color: var(--fds-solid-background-quarternary);
		overflow: hidden;
	}

	.glob :global(.expand-menu-closed) {
		width: 48px !important;
	}

	.glob :global(.expand-menu-closed > li[role="listitem"]) {
		padding-inline: unset !important;
	}

	.glob :global(.expand-menu-icon) {
		left: 11px;
		min-width: 16px;
		min-height: 16px;
		position: absolute;
		-webkit-margin-end: unset !important;
		margin-inline-end: unset !important;
	}

	.glob :global(.expand-menu-text) {
		position: absolute;
		left: 45px;
		white-space: nowrap !important;
	}

	:global(.fds-copy-calculation) {
		opacity: 0;
		display: block;
		position: absolute;
		left: -1000000000px;
	}
</style>
