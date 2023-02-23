
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

import type { TreeNodeProps } from '../treeNode';
import type Node from '../model/node';

interface NodeMap {
  treeNodeExpand(node: Node): void;
  children: NodeMap[];
}

const TreeNodeMapKey: InjectionKey<NodeMap> = Symbol('TreeNodeMap');

export function useNodeExpandEventBroadcast(props: TreeNodeProps) {
  const parentNodeMap = inject(TreeNodeMapKey, null);

  const currentNodeMap: NodeMap = {
    treeNodeExpand: node => {
      if (props.node !== node) {
        props.node.collapse();
      }
    },
    children: [],
  };

  if (parentNodeMap) {
    parentNodeMap.children.push(currentNodeMap);
  }

  provide(TreeNodeMapKey, currentNodeMap);

  return {
    broadcastExpanded: (node: Node): void => {
      if (!props.accordion) return;
      for (const childNode of currentNodeMap.children) {
        childNode.treeNodeExpand(node);
      }
    },
  };
}
