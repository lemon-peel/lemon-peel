import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import TestCollection, { CollectionChildComponent, CollectionItemChildComponent } from '../testHelper';

import type { ComponentPublicInstance } from 'vue';
import type { LpCollectionInjectionContext } from '../src/tokens';

const { LpCollection, LpCollectionItem } = TestCollection;
const AXIOM = 'rem is the best girl';

describe('<LpCollectionItem />', () => {
  const createComponent = (props = {}, count = 3) =>
    mount(LpCollection as any, {
      props,
      slots: {
        default: () => {
          return h(
            CollectionChildComponent as any,
            {},
            {
              default: () =>
                Array.from({ length: count }).map(idx => {
                  return h(
                    LpCollectionItem as any,
                    {},
                    {
                      default: () => [
                        h(
                          CollectionItemChildComponent,
                          {},
                          { default: () => `${AXIOM} ${idx}` },
                        ),
                      ],
                    },
                  );
                }),
            },
          );
        },
      },
    });

  let wrapper: ReturnType<typeof createComponent>;

  afterEach(() => {
    wrapper.unmount();
  });

  test('should be able to render correctly', async () => {
    wrapper = createComponent();
    await nextTick();

    expect(wrapper.findAllComponents(LpCollectionItem as any)).toHaveLength(3);
    expect(wrapper.findComponent(LpCollectionItem as any).text()).toContain(
      AXIOM,
    );
  });

  test('register child instance', () => {
    wrapper = createComponent();

    const childItemComponent = wrapper.findComponent(
      CollectionChildComponent as any,
    );
    const childVm =
      childItemComponent.vm as ComponentPublicInstance<LpCollectionInjectionContext>;

    const collectionItems = wrapper.findAllComponents(
      CollectionItemChildComponent as any,
    );
    expect(childVm.itemMap.size).toBe(3);
    const items = childVm.getItems();
    expect(childVm.getItems()).toHaveLength(3);
    expect(items[0].ref).toBe(collectionItems.at(0)?.element);
  });
});
