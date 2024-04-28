<script lang="ts">
	import { get_current_component } from "svelte/internal";
	import { createEventForwarder } from "$lib/internal";

	/** @restProps */


	/** Specifies a custom class name for the surface. */
	let className = "";
	export { className as class };

	/** Obtains a bound DOM reference to the surface or anchor element. */
	export let element: HTMLElement = null;

	const forwardEvents = createEventForwarder(get_current_component());
</script>

<!--
@component
A component that provides an acrylic surface for content.
- Usage:
    ```tsx
    <div>
        <AcrylicSurface></AcrylicSurface>
        <div id="content">
            <h1>Acrylic Surface</h1>
        </div>
    </div>
    ```
-->
<svelte:element
	this="div"
	use:forwardEvents
	bind:this={element}
	class="acrylic-surface {className}"
	{...$$restProps}
>
	<slot />
</svelte:element>

<style lang="scss">
	@use "./AcrylicSurface";
</style>
