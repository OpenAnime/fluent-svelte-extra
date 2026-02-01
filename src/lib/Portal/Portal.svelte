<script lang="ts">
	export let query: string;
	export let destroyable = true;
	export let teleportToTop = false;
	export let style = "";

	function teleport(node: HTMLElement) {
		let teleportContainer = document.querySelector(query);

		if (teleportToTop && teleportContainer!.firstChild) {
			teleportContainer!.insertBefore(node, teleportContainer!.firstChild);
		} else {
			teleportContainer!.appendChild(node);
		}

		if (destroyable) {
			return {
				destroy() {
					node.remove();
				}
			};
		}
	}
</script>

<div class="portal" use:teleport {style}>
	<slot></slot>
</div>

<style>
	.portal {
		display: contents;
	}
</style>
