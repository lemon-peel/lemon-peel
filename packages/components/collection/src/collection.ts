import { inject, onBeforeUnmount, onMounted, provide, ref, unref, shallowRef } from 'vue';
import Collection from './Collection.vue';
import CollectionItem from './CollectionItem.vue';

import type { Component, InjectionKey } from 'vue';
import type { SetupContext } from 'vue';
import type { LpCollectionInjectionContext, LpCollectionItemInjectionContext } from './tokens';

export const COLLECTION_ITEM_SIGN = `data-lp-collection-item`;

// Make sure the first letter of name is capitalized
export const createCollectionWithScope = (name: string) => {
  const COLLECTION_NAME = `Lp${name}Collection`;
  const COLLECTION_ITEM_NAME = `${COLLECTION_NAME}Item`;
  const COLLECTION_INJECTION_KEY: InjectionKey<LpCollectionInjectionContext> =
    Symbol(COLLECTION_NAME);
  const COLLECTION_ITEM_INJECTION_KEY: InjectionKey<LpCollectionItemInjectionContext> =
    Symbol(COLLECTION_ITEM_NAME);

  const LpCollection = {
    ...Collection,
    name: COLLECTION_NAME,
    setup() {
      const collectionRef = ref<HTMLElement | null>(null);
      const itemMap: LpCollectionInjectionContext['itemMap'] = new Map();
      const getItems = () => {
        const collectionEl = unref(collectionRef);

        if (!collectionEl) return [];
        const orderedNodes = [...collectionEl.querySelectorAll(`[${COLLECTION_ITEM_SIGN}]`)];

        const items = [...itemMap.values()];

        return items.sort(
          (a, b) => orderedNodes.indexOf(a.ref!) - orderedNodes.indexOf(b.ref!),
        );
      };

      provide(COLLECTION_INJECTION_KEY, {
        itemMap,
        getItems: getItems as any,
        collectionRef: collectionRef as any,
      });
    },
  };

  const LpCollectionItem = {
    ...CollectionItem,
    name: COLLECTION_ITEM_NAME,
    setup(_: unknown, { attrs }: SetupContext) {
      const collectionItemRef = shallowRef<HTMLElement | null>(null);
      const collectionInjection = inject(COLLECTION_INJECTION_KEY)!;

      provide(COLLECTION_ITEM_INJECTION_KEY, {
        collectionItemRef,
      });

      onMounted(() => {
        const collectionItemEl = collectionItemRef.value;
        if (collectionItemEl) {
          collectionInjection.itemMap.set(collectionItemEl, {
            ref: collectionItemEl,
            ...attrs,
          });
        }
      });

      onBeforeUnmount(() => {
        const collectionItemEl = unref(collectionItemRef)!;
        collectionInjection.itemMap.delete(collectionItemEl);
      });
    },
  };

  return {
    COLLECTION_INJECTION_KEY,
    COLLECTION_ITEM_INJECTION_KEY,
    LpCollection: LpCollection as Component,
    LpCollectionItem: LpCollectionItem as Component,
  };
};
