<script lang="ts">
	import TreeBranch from './TreeBranch.svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import type { DataChildrenI, DataI, DataBranchI } from '$lib/types/tree.type.js';
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID, SOURCES, TRIGGERS } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import { onMount } from 'svelte';

	export let data: DataI = [
		{
			id: 'first1',
			children: [
				{ id: 'second', children: [{ id: 1 }] },
				{
					id: 'third',
					children: [
						{ id: 'fourth', children: [{ id: 4 }] },
						{ id: 'fifth', children: [{ id: 5 }] }
					]
				}
			]
		},
		{
			id: 'first2',
			children: [
				{ id: 'second2', children: [{ id: 2 }] },
				{ id: 'third', children: [{ id: 3 }] }
			]
		},
		{
			id: 'first3',
			children: [
				{ id: 'six', children: [{ id: 6 }] },
				{ id: 'seven', children: [{ id: 7 }] }
			]
		},
		{
			id: 'first4',
			children: []
		}
	];
	export let flipDurationMs = 300;
	export let allowReorder = false;
	export let allowEdit = false;

	let childExpanded: Record<string, boolean> = {};

	onMount(() => {
		data.forEach((e: DataBranchI, i) => {
			childExpanded[e.id] = false;
		});
	});

	function handleDndConsider(e: { detail: DndEvent }) {
		// console.log(e.detail.items);
		data = e.detail.items as DataI;
		// data = [...data];
	}
	function handleDndFinalize(e: { detail: DndEvent }) {
		// console.log(e.detail.items);
		data = e.detail.items as DataI;
		data = [...data];
	}

	export let search = '';
	export let expanded = false;

	let searchData: Array<string> = search.trim().toLowerCase().split(' ');
	$: searchData = search.trim().toLowerCase().split(' ');

	// bind:expanded={childExpanded[datum.id]}
	// 						reorder={reorder && !Object.values(childExpanded).some((e) => e)}
</script>

<div class="flex flex-col w-full bg-base-100 Tree" in:fly={{ y: -200 }} out:fly|local={{ y: -200 }}>
	<div class={`h-full w-full`} style="overflow-y:auto;">
		<ul class="p-4 shadow-lg w-full overflow-visible pb-3">
			<section
				use:dndzone={{
					items: data,
					flipDurationMs,
					dragDisabled: !allowReorder
				}}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
			>
				{#each data?.filter((d) => d.id !== SHADOW_PLACEHOLDER_ITEM_ID) as datum, index (datum.id)}
					<div animate:flip={{ duration: flipDurationMs }} class="item">
						<TreeBranch
							nodeKeyFull={[datum.id.toString()]}
							nodeKey={datum.id.toString()}
							bind:data={datum.children}
							{allowReorder}
							{allowEdit}
							{flipDurationMs}
							{searchData}
							on:edit={(e) => (datum.id = e.detail)}
							address={index.toString()}
							on:consider={handleDndConsider}
							on:finalize={handleDndFinalize}
							let:nodeKey
							let:nodeKeyFull
							let:treeLevel
							let:address
						>
							<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
							<slot name="new_folder" slot="new_folder" />
							<slot name="no_content" slot="no_content" />
						</TreeBranch>
					</div>
				{/each}
			</section>
		</ul>
	</div>
</div>

<style :global>
	section {
	}
	.item {
	}
</style>
