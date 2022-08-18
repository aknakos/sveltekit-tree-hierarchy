import { get, writable } from 'svelte/store';

function createTreeState() {
	const {
		subscribe,
		update,
		set,
	} = writable({ tree: new Set<string>(), map: null, maximized: false, loaded: false });

	function mutateTreeStateQuery(value: string, add = true) {
		const valueP = value.substring(0, value.lastIndexOf('b'));
		if (add)
			update((draft) => {
				if (draft.tree.has(valueP)) draft.tree.delete(valueP);
				draft.tree.add(value);
				return draft;
			});
		else
			update((draft) => {
				draft.tree.forEach((t) => {
					if (t.startsWith(value)) draft.tree.delete(t);
				});
				if (valueP.length > 0) draft.tree.add(valueP);
				return draft;
			});
	}

	const addTreeStateQuery = (value: string) => mutateTreeStateQuery(value, true);
	const deleteTreeStateQuery = (value: string) => mutateTreeStateQuery(value, false);

	return {
		subscribe,
		update,
		set,
		mutateTreeStateQuery,
		addTreeStateQuery,
		deleteTreeStateQuery,
	};
}

export const treeState = createTreeState();
