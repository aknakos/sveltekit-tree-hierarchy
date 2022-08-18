<script lang="ts">
	import match from 'autosuggest-highlight/match/index.js';
	import parse from 'autosuggest-highlight/parse/index.js';

	export let mergedSearchData;
	export let label;

	let matched;
	$: matched = match(label, mergedSearchData, { insideWords: true, findAllOccurrences: true });
	// $: {
	// 	parse(label, matched).forEach((p, i) => {
	// 		console.log(i, p.highlight, p.text, matched, label);
	// 	});
	// }
</script>

<span class="outer-span ml-4 flex-grow highlight-wrapper">
	{#each parse(label, matched) as p, i}
		{#if p.highlight && label?.[matched?.[i / 2]?.[0] - 1] === ' '}
			<span class="p-0 m-0 pl-1" />
		{/if}
		{#if p.highlight}
			<mark class="highlight bg-transparent">{p.text}</mark>
		{:else}
			<span class="non-highlight">{p.text}</span>
		{/if}
		{#if p.highlight && label?.[matched[(parseInt(i / 2) * 2) / 2]?.[1]] === ' '}
			<span class="p-0 m-0 pr-1" />
		{/if}
	{/each}
</span>

<style>
	.highlight-wrapper {
		font-size: 0;
	}

	.highlight {
		font-size: 1rem;
		border-bottom: 3px solid red;
		color: red;
		padding-left: 0;
		padding-right: 0;

		/* margin-left: 3px; */
		/* display: inline-block; */
	}

	.non-highlight {
		font-size: 1rem;
		border-bottom: 3px solid rgba(0, 0, 0, 0);
		padding: 0;
		min-width: 3px;
		/* display: inline-block; */
	}

	.outer-span {
		padding: 0 0 0 1.5em;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}
</style>
