<script lang="ts">
	import TreeBranch from './TreeBranch.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { DataI } from '$lib/types/tree.type.js';

	export let data: DataI = {
		first1: { second: { '@id': 2 }, third: { fourth: { '@id': 4 }, fifth: { '@id': 5 } } },
		first2: { second: { '@id': 2 }, third: { '@id': 3 } },
		first3: { second: { '@id': 2 }, third: { '@id': 3 } }
	};

	export let keyId = '@id';
	export let search = '';

	let searchData: Array<string> = [];
	let maxTitle = '';

	$: searchData = search.trim().toLowerCase().split(' ');
</script>

<div class="flex flex-col w-full bg-base-100 Tree" in:fly={{ y: -200 }} out:fly={{ y: -200 }}>
	<div class={`h-full w-full`} style="overflow-y:auto;">
		<ul class="p-4 shadow-lg w-full overflow-visible">
			{#each Object.keys(data) as child, index}
				<TreeBranch
					nodeKeyFull={[child]}
					nodeKey={child}
					children={data[child]}
					expanded
					{searchData}
					address={index.toString()}
					let:nodeKey
					let:nodeKeyFull
					let:treeLevel
					let:address
				>
					<slot {nodeKey} {nodeKeyFull} {treeLevel} {address} />
				</TreeBranch>
			{/each}
		</ul>
	</div>
</div>
