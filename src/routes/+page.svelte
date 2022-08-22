<script lang="ts">
	import Tree from '$lib/treeView/Tree.svelte';

	let search = ''; // some search text;

	let allowEdit = true;
</script>

<div>
	<label>
		<span>Enable edit</span>
		<input type="checkbox" bind:checked={allowEdit} />
	</label>
</div>

<div class="w-screen h-screen">
	<Tree
		{search}
		allowReorder={allowEdit}
		{allowEdit}
		let:nodeKey
		let:nodeKeyFull
		let:treeLevel
		let:address
	>
		<div>Leaf Slot {treeLevel}</div>
		<div slot="new_folder">Add new folder here</div>
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
