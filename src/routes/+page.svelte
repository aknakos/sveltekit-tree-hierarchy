<script lang="ts">
	import Tree from '$lib/treeView/Tree.svelte';
	import type { DataI } from '$lib/types/tree.type.js';

	let search = ''; // some search text;

	let allowEdit = true;

	let data: DataI = [
		{
			id: 1,
			name: 'First Folder',
			children: [
				{
					id: 11,
					name: 'First Subfolder',
					children: [
						{
							id: 111,
							name: 'Some Entry'
						}
					]
				}
			]
		},
		{
			id: 2,
			name: 'Second Folder',
			children: [
				{
					id: 21,
					name: 'Some Entry'
				}
			]
		}
	];
</script>

<div>
	<label>
		<span>Enable edit</span>
		<input type="checkbox" bind:checked={allowEdit} />
	</label>
</div>

<div class="w-screen h-screen">
	<Tree {search} allowReorder={allowEdit} {allowEdit} {data} folderValueKey="name">
		<div slot="value" let:nodeKey let:nodeKeyFull let:treeLevel let:address>
			Leaf Slot {treeLevel}
		</div>
		<div slot="new_folder">Create New Folder</div>
		<div slot="no_content">No content..</div>
	</Tree>
</div>

<style global>
	.btn {
		@apply rounded-full;
		@apply bg-slate-300;
		@apply p-2;
		@apply my-2;
		@apply px-4;
	}
	.btn:hover {
		@apply bg-slate-200;
	}
	.btn:active {
		@apply bg-slate-500;
	}
</style>
