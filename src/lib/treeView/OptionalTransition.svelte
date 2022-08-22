<script lang="ts">
	import { slide } from 'svelte/transition';

	export let allowTransition = false;
</script>

{#if allowTransition}
	<div transition:slide>
		<slot />
	</div>
{:else}
	<div>
		<slot />
	</div>
{/if}
