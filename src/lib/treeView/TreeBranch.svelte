<script lang="ts">
	import TreeSpan from './TreeSpan.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { DataBranchI, DataI } from '$lib/types/tree.type.js';
	import { treeState } from './store.js';
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID, SOURCES, TRIGGERS } from 'svelte-dnd-action';
	import type { DndEvent, Item } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import OptionalTransition from './OptionalTransition.svelte';

	export let expanded = false;
	export let nodeKeyFull: Array<string>;
	export let nodeKey: string;
	export let data: DataI;
	export let treeLevel = 0;
	export let searchData: Array<string> = [];
	export let address: string;
	export let flipDurationMs = 300;
	export let allowReorder = false;
	export let allowEdit = false;
	const dispatch = createEventDispatcher();

	let childExpanded: Record<string, boolean> = {};

	onMount(() => {
		if (
			Array.from($treeState.tree).some(
				(d) => d.startsWith(address) && (d === address || d[address.length] === 'b')
			)
		) {
			expanded = true;
		}
		// data.forEach((e: DataBranchI, i) => {
		// 	childExpanded[e.id] = false;
		// });
	});

	function handleDndConsider(e: { detail: DndEvent }) {
		data = e.detail.items as DataI;
	}
	function handleDndFinalize(e: { detail: DndEvent }) {
		data = e.detail.items as DataI;
	}

	function toggle() {
		expanded = !expanded;
		treeState.mutateTreeStateQuery(address, expanded);
		// dispatch('expanded', expanded);
	}

	function childExpansion(i: number, e: boolean) {
		// childExpanded[i] = e;
		// console.log(
		// 	childExpanded,
		// 	Object.values(childExpanded).some((e) => e)
		// );
	}

	let mergedSearchData = '';
	let editing = false;
	let hovered = false;
	$: mergedSearchData = searchData.join(' ');

	function newFolder() {
		data.push({ id: 'NEW ENTRY', children: [] });
		data = data;
	}

	function deleteFolder() {
		editing = true;
	}

	function editFolder() {
		editing = true;
	}

	function finishEditFolder(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			saveFolder();
		}
	}

	function saveFolder() {
		editing = false;
		dispatch('edit', nodeKey);
	}

	function hover() {
		hovered = true;
	}

	function unhover() {
		hovered = false;
	}

	// bind:expanded={childExpanded[datum.id]}
	// 							reorder={reorder && !Object.values(childExpanded).some((e) => e)}
	// on:expanded={(e) => childExpansion(index, e.detail)}
</script>

{#if searchData.length === 0 || searchData.some((searchText) => nodeKeyFull
				.join('>>')
				.toLowerCase()
				.includes(searchText) || JSON.stringify(data).toLowerCase().includes(searchText))}
	<li class="cursor-pointer tree-branch">
		<OptionalTransition allowTransition={!allowReorder}>
			<div
				on:click|stopPropagation|preventDefault={toggle}
				class="flex flex-row rounded-full p-3 hover:bg-gray-100 active:bg-primary tree-branch-heading"
				on:mouseenter|stopPropagation={hover}
				on:mouseleave|stopPropagation={unhover}
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
				{#if editing}
					<input
						bind:value={nodeKey}
						class="ml-4 flex-grow"
						on:keypress={finishEditFolder}
						autofocus
					/>
					<button class="btn btn-warning ml-5" on:click={saveFolder}>Save</button>
				{:else}
					<div>
						<TreeSpan label={nodeKey} {mergedSearchData} />
						{#if allowEdit && hovered}
							<button class="btn btn-warning ml-5" on:click={editFolder}>Edit</button>
							<button class="btn btn-error" on:click={deleteFolder}>Delete</button>
						{/if}
					</div>
				{/if}
			</div>

			{#if expanded}
				{#if data}
					<ul
						use:dndzone={{
							items: data,
							flipDurationMs,
							dragDisabled: !allowReorder || data.length === 0
						}}
						on:consider={handleDndConsider}
						on:finalize={handleDndFinalize}
					>
						{#if data.length > 0}
							{#each data?.filter((d) => d.id !== SHADOW_PLACEHOLDER_ITEM_ID) as datum, index (datum.id)}
								{@const keyFull = nodeKeyFull.concat(datum.id.toString())}
								<div animate:flip={{ duration: flipDurationMs }} class="item">
									{#if datum?.children}
										<svelte:self
											nodeKeyFull={keyFull}
											nodeKey={datum.id.toString()}
											treeLevel={treeLevel + 1}
											{allowReorder}
											{allowEdit}
											bind:data={datum.children}
											on:edit={(e) => (datum.id = e.detail)}
											{searchData}
											address={address + 'b' + index.toString()}
											let:nodeKey
											let:nodeKeyFull
											let:treeLevel
											let:address
										>
											<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
											<slot name="new_folder" slot="new_folder" />
											<slot name="no_content" slot="no_content" />
										</svelte:self>
									{:else}
										<OptionalTransition allowTransition={!allowReorder}>
											<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
										</OptionalTransition>
									{/if}
								</div>
							{/each}
						{:else}
							<slot name="no_content">No content here</slot>
						{/if}
						{#if allowReorder}
							<li>
								<button class="btn btn-primary" on:click={newFolder}>
									<slot name="new_folder">New Folder</slot>
								</button>
							</li>
						{/if}
					</ul>
				{:else}
					<li>
						<div class="">ERROR PELASE ALWAYS INCLUDE CHILDREN LIST</div>
					</li>
				{/if}
			{/if}
		</OptionalTransition>
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
