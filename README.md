# Tree-structure component for SvelteKit

Tree-structure component with slotting, tailwindcss, integrated search and editing.

Usage:

```javascript
<script lang="ts">
	import Tree from '$lib/treeView/Tree.svelte';

	let search = ''; // some search text;
</script>

<Tree {search} let:nodeKey let:nodeKeyFull let:treeLevel let:address>
	<div>Leaf Slot {treeLevel}</div>
</Tree>
```

Tree uses tailwindcss with classes for each branch/leaf and for the search matches, so you can customize using a global style if you wish.
For full example with editing and search, see [the example project](./src/routes/+page.svelte).
