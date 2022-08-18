<script lang="ts">
	import Tree from '$lib/treeView/Tree.svelte';

	let search = ''; // some search text;
</script>

<Tree {search} let:nodeKey let:nodeKeyFull let:treeLevel let:address>
	<div>Leaf Slot {treeLevel}</div>
</Tree>
