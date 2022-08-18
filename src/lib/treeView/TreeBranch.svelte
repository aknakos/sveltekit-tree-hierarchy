<script lang="ts">
	import TreeLeaf from './TreeLeaf.svelte';
	import { slide } from 'svelte/transition';
	import TreeSpan from './TreeSpan.svelte';
	import { onMount } from 'svelte';
	import type { DataI } from '$lib/types/tree.type.js';
	import { treeState } from './store.js';

	export let expanded = false;
	export let nodeKeyFull: Array<string>;
	export let nodeKey: string;
	export let children: DataI;
	export let treeLevel = 0;
	export let searchData = [];
	export let address: string;

	onMount(() => {
		if (
			Array.from($treeState.tree).some(
				(d) => d.startsWith(address) && (d === address || d[address.length] === 'b')
			)
		)
			expanded = true;
	});

	function toggle() {
		expanded = !expanded;
		treeState.mutateTreeStateQuery(address, expanded);
	}

	let mergedSearchData = '';
	$: {
		mergedSearchData = searchData.join(' ');
	}
</script>

{#if searchData.length === 0 || searchData.some((searchText) => nodeKeyFull
				.join('>>')
				.toLowerCase()
				.includes(searchText) || JSON.stringify(children).toLowerCase().includes(searchText))}
	<li class="cursor-pointer tree-branch" transition:slide>
		<div
			on:click={toggle}
			class="flex flex-row rounded-full p-3 hover:bg-gray-100 active:bg-primary tree-branch-heading"
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
					<svg viewBox="0 0 24 24" class="w-5 h-5 stroke-current">
						<path
							fill="currentColor"
							d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
						/>
					</svg>
				{/if}
			</div>
			<TreeSpan label={nodeKey} {mergedSearchData} />
		</div>

		{#if expanded}
			<ul class="">
				{#each Object.keys(children) as childKey, i}
					{@const childKeyFull = nodeKeyFull.concat(childKey)}
					{#if !children[childKey].hasOwnProperty('@id')}
						<svelte:self
							nodeKeyFull={childKeyFull}
							nodeKey={childKey}
							treeLevel={treeLevel + 1}
							children={children[childKey]}
							{searchData}
							address={address + 'b' + i.toString()}
							let:nodeKey
							let:nodeKeyFull
							let:treeLevel
							let:address
						>
							<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
						</svelte:self>
					{:else}
						<TreeLeaf
							nodeKeyFull={childKeyFull}
							nodeKey={childKey}
							treeLevel={treeLevel + 1}
							keyId={children[childKey]}
							{searchData}
							address={address + 'b' + i.toString()}
							forceShow={searchData.length > 0}
							let:nodeKey
							let:nodeKeyFull
							let:treeLevel
							let:address
						>
							<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
						</TreeLeaf>
					{/if}
				{/each}
			</ul>
		{/if}
	</li>
{/if}

<style>
	ul {
		padding: 0 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		/* padding: 0; */
	}
</style>
