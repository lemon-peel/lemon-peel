
import type { ComponentInternalInstance, ExtractPropTypes, InjectionKey, Ref, SetupContext } from 'vue';
import type { treeEmits, treeProps } from './tree';
import type TreeStore from './model/treeStore';
import type Node from './model/node';

export interface RootTreeType {
  ctx: { emit: SetupContext<typeof treeEmits>['emit'], slots: SetupContext['slots'] } ;
  props: Readonly<ExtractPropTypes<typeof treeProps>>;
  store: Ref<TreeStore>;
  root: Ref<Node>;
  currentNode: Ref<Node | undefined>;
  instance: ComponentInternalInstance;
}

export const rootTreeKey: InjectionKey<RootTreeType> = Symbol('rootTree');
