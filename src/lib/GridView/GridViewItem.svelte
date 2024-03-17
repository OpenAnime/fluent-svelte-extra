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

<div class="grid-view-item" class:selected>
	{#if !singleSelect}
		<div class="item-checkbox">
			<Checkbox bind:checked={selected}></Checkbox>
		</div>
	{/if}

	<div
		class="inner-grid-item"
		on:click={() => {
			if (singleSelect) {
				setSelected(!selected);
			}
		}}
	>
		<slot {setSelected} />
	</div>
</div>

<style lang="scss">
	@use "./GridViewItem";
</style>
