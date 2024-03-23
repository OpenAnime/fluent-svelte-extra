<script lang="ts">
	import Checkbox from "../Checkbox/Checkbox.svelte";

	/** Indicates the selected state of the grid view item. */
	export let selected = false;

	export let singleSelect = false;

	/**
	 * Sets the selected state of the grid view item.
	 * @param {boolean} value - The new selected state.
	 */
	function setSelected(value: boolean) {
		selected = value;
	}
</script>

<div class="grid-view-item" class:selected {...$$restProps} on:click={() => setSelected(!selected)} tabindex="0" on:keydown={(e) => e.key === "Enter" && setSelected(!selected)}>
	{#if !singleSelect}
		<div class="item-checkbox">
			<Checkbox bind:checked={selected} on:click={() => setSelected(!selected)} />
		</div>
	{/if}
		<slot {setSelected} />
</div>

<style lang="scss">
	@use "./GridViewItem";
</style>
