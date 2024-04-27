<script lang="ts">
	import Checkbox from "../Checkbox/Checkbox.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	/** Indicates the selected state of the grid view item. */
	export let selected = false;

	export let singleSelect = false;

	/**
	 * Sets the selected state of the grid view item.
	 * @param {boolean} value - The new selected state.
	 */
	function setSelected(value: boolean) {
		selected = value;
		dispatch("change", { selected });
	}
</script>

<div
	class="grid-view-item"
	class:selected
	{...$$restProps}
	on:click={() => singleSelect && setSelected(!selected)}
	on:keydown={e => e.key === "Enter" && singleSelect && setSelected(!selected)}
>
	{#if !singleSelect}
		<div class="item-checkbox">
			<Checkbox
	            tabindex="-1"
				bind:checked={selected}
				on:change={() => {
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
