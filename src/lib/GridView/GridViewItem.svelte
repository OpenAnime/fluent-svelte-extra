<script lang="ts">
	import Checkbox from "../Checkbox/Checkbox.svelte";
	import { createEventDispatcher } from "svelte";
	import { setKey, getKey } from "$lib/internal";

	const dispatch = createEventDispatcher();

	/** Indicates the selected state of the grid view item. */
	export let selected = false;

	export let group = "";

	export let singleSelect = false;

	export let disableUnselectionIfGrouped = false;

	const id = Math.random();

	type GroupItem = {
		id: number;
		setSelected: (value: boolean, __depth: boolean) => void;
	};

	/**
	 * Sets the selected state of the grid view item.
	 * @param {boolean} value - The new selected state.
	 * @param {boolean} __depth - INTERNAL USE ONLY: Used to prevent recursive call.
	 */
	function setSelected(value: boolean, __depth: boolean) {
		if (singleSelect && !__depth) {
			const getAvailableGroupItems = (getKey(`group:${group}`) as GroupItem[]) ?? [];
			if (getAvailableGroupItems.length) {
				const filteredGroupItems = getAvailableGroupItems.filter(item => item.id !== id);

				for (const item of filteredGroupItems) {
					item.setSelected(false, true);
				}
			}
		}

		selected = value;
	}

	function handleInteraction() {
		if (disableUnselectionIfGrouped && group.length > 0 && selected) {
			return;
		}

		setSelected(!selected, false);
		dispatch("change", { selected: selected });
	}

	if (group.length) {
		const getAvailableGroupItems = (getKey(`group:${group}`) as GroupItem[]) ?? [];

		getAvailableGroupItems.push({
			id,
			setSelected
		});

		setKey(`group:${group}`, getAvailableGroupItems);
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	class="grid-view-item"
	class:selected
	{...$$restProps}
	tabindex="0"
	on:click={handleInteraction}
	on:keydown={e => {
		if (e.key !== "Enter") return;
		handleInteraction();
	}}
>
	{#if !singleSelect}
		<div class="item-checkbox">
			<Checkbox
				tabindex="-1"
				bind:checked={selected}
				on:change={() => {
					if (disableUnselectionIfGrouped && group.length > 0 && !selected) {
						selected = true;
						return;
					}
					dispatch("change", { selected: !selected });
				}}
			/>
		</div>
	{/if}
	<slot {setSelected} />
</div>

<style lang="scss">
	@use "./GridViewItem";
</style>
