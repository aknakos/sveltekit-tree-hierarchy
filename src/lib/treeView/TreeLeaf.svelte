<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import TreeSpan from './TreeSpan.svelte';
	import { onMount } from 'svelte';
	import { treeState } from './store.js';

	export let expanded = false;
	export let nodeKey: string;
	export let nodeKeyFull: Array<string>;
	export let treeLevel = 0;
	export let keyId;
	export let searchData = [];
	export let forceShow = false;
	export let address: string;

	onMount(() => {
		if (
			Array.from($treeState.tree).some(
				(d) => d.startsWith(address) && (d === address || d[address.length] === 'b')
			)
		) {
			expanded = true;
		}
	});

	let mergedSearchData = '';
	$: {
		mergedSearchData = searchData.join(' ');
	}

	function toggle() {
		expanded = !expanded;
		treeState.mutateTreeStateQuery(address, expanded);
	}
</script>

{#if forceShow || searchData.length === 0 || searchData.some((searchText) => nodeKeyFull
			.join('>>')
			.toLowerCase()
			.includes(searchText))}
	<li class="tree-leaf" transition:slide>
		<div
			class="flex p-3 rounded-full hover:bg-gray-100 active:bg-primary tree-leaf-heading"
			on:click={toggle}
		>
			<div class="flex flex-grow-0 self-center">
				{#if expanded}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="w-5 h-5 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
						/>
					</svg>
				{:else}
					<svg class="w-5 h-5 stroke-current" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
						/>
					</svg>
				{/if}
			</div>
			<TreeSpan label={nodeKey} {mergedSearchData} />
		</div>
	</li>

	{#if expanded}
		<div transition:slide>
			<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
		</div>
	{/if}
{/if}

<style>
</style>
