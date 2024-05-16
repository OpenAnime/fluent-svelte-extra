<script lang="ts">
	/** Specifies a custom class name for the surface. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the surface element. */
	export let element: HTMLUListElement = null;

	export let acrylic = true;

	let animationComplete = false;
</script>

<div
	class="menu-flyout-surface-container"
	style={animationComplete ? "overflow: visible;" : undefined}
>
	<ul
		on:animationend|once={() => (animationComplete = true)}
		class="menu-flyout {className}"
		class:acrylic
		bind:this={element}
		{...$$restProps}
	>
		<div class="menu-flyout-background"></div>

		<div class="menu-flyout-items">
			<slot />
		</div>
	</ul>
</div>

<style lang="scss">
	@use "./MenuFlyoutSurface";
</style>
