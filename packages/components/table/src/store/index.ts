import { useNamespace } from '@lemon-peel/hooks';
import { useCurrent } from './current';
import { useExpand } from './expand';
import { useTree } from './tree';
import { useWatcher } from './watcher';

import type { TableVM } from './../table/defaults';
import useActions from './actions';

function useStore(table: TableVM) {
  const actions = useActions(table);
  const current = useCurrent(table);
  const expand = useExpand(table);
  const tree = useTree(table);
  const watcher = useWatcher(table);

  const clear = () => {
    useActions.cache.delete(table);
    useCurrent.cache.delete(table);
    useExpand.cache.delete(table);
    useTree.cache.delete(table);
    useWatcher.cache.delete(table);
  };

  return {
    states: {
      ...current.states,
      ...expand.states,
      ...tree.states,
      ...watcher.states,
    },
    ns: useNamespace('table'),
    commit: actions.commit,
    clear,
    current,
    expand,
    tree,
    watcher,
  };
}

export default useStore;

export type StoreFilter = Record<string, string[]>;
export type Store = ReturnType<typeof useStore>;
