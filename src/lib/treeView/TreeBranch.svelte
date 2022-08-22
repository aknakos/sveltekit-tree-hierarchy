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
	export let data: DataBranchI;
	export let treeLevel = 0;
	export let searchData: Array<string> = [];
	export let address: string;
	export let flipDurationMs = 300;
	export let allowReorder = false;
	export let allowEdit = false;
	export let folderValueKey: string = 'id';
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
		data.children = e.detail.items as DataI;
	}
	function handleDndFinalize(e: { detail: DndEvent }) {
		data.children = e.detail.items as DataI;
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
	let inputValue: string = data[folderValueKey].toString();
	$: mergedSearchData = searchData.join(' ');

	function newFolder(entry = false) {
		if (!data?.children) data.children = [];
		let newData: DataBranchI = {
			id: 'id-' + (Math.random() * 100000).toFixed(0).toString()
		};
		if (folderValueKey !== 'id') newData[folderValueKey] = 'new';
		if (!entry) newData['children'] = [];
		data.children.push(newData);
		data = data;
	}

	function deleteFolder() {
		dispatch('delete');
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
		data[folderValueKey] = inputValue;
		data = data;
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
						type="text"
						bind:value={inputValue}
						class="ml-4 flex-grow"
						on:keypress|stopPropagation={finishEditFolder}
						on:click|preventDefault|stopPropagation={() => {}}
						autofocus
					/>
					<button class="btn btn-warning ml-5" on:click={saveFolder}>Save</button>
				{:else}
					<div>
						<TreeSpan label={data[folderValueKey]} {mergedSearchData} />
						{#if allowEdit && hovered}
							<button class="btn btn-warning ml-5" on:click={editFolder}>Edit</button>
							<button class="btn btn-error ml-5" on:click={deleteFolder}>Delete</button>
						{/if}
					</div>
				{/if}
			</div>

			{#if expanded}
				{#if data?.children}
					<ul
						use:dndzone={{
							items: data.children,
							flipDurationMs,
							dragDisabled: !allowReorder || data.length === 0
						}}
						on:consider={handleDndConsider}
						on:finalize={handleDndFinalize}
					>
						{#if data.children.length > 0}
							{#each data.children?.filter((d) => d.id !== SHADOW_PLACEHOLDER_ITEM_ID) as datum, index (datum.id)}
								{@const keyFull = nodeKeyFull.concat(datum.id.toString())}
								<div animate:flip={{ duration: flipDurationMs }} class="item">
									{#if datum?.children}
										<svelte:self
											nodeKeyFull={keyFull}
											nodeKey={datum.id.toString()}
											treeLevel={treeLevel + 1}
											{allowReorder}
											{allowEdit}
											{folderValueKey}
											bind:data={datum}
											{searchData}
											address={address + 'b' + index.toString()}
											on:delete={() => {
												data.children?.splice(index, 1);
												data = data;
											}}
										>
											<slot
												let:nodeKey
												let:nodeKeyFull
												let:treeLevel
												let:address
												{nodeKey}
												{nodeKeyFull}
												{treeLevel}
												{address}
												name="value"
												slot="value"
											/>
											<slot name="new_folder" slot="new_folder" />
											<slot name="no_content" slot="no_content" />
										</svelte:self>
									{:else}
										<OptionalTransition allowTransition={!allowReorder}>
											<slot
												name="value"
												nodeKey={datum.id.toString()}
												nodeKeyFull={keyFull}
												treeLevel={treeLevel + 1}
												address={address + 'b' + index.toString()}
											/>
										</OptionalTransition>
									{/if}
								</div>
							{/each}
						{:else}
							<slot name="no_content">No content here</slot>
						{/if}
						{#if allowReorder}
							<li>
								<button class="btn btn-secondary" on:click={() => newFolder(false)}>
									<slot name="new_folder">New Folder</slot>
								</button>
								<!-- <button class="btn btn-secondary" on:click={() => newFolder(true)}>
									<slot name="new_leaf">New Entry</slot>
								</button> -->
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
