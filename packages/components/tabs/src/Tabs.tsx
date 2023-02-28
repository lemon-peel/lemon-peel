import { defineComponent, getCurrentInstance, nextTick, provide, ref, renderSlot, watch } from 'vue';
import { buildProps, isNumber, isString, isUndefined } from '@lemon-peel/utils';
import { EVENT_CODE, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import LpIcon from '@lemon-peel/components/icon';
import { Plus } from '@element-plus/icons-vue';
import { tabsRootContextKey } from '@lemon-peel/tokens';
import { useNamespace, useOrderedChildren } from '@lemon-peel/hooks';
import TabNav from './TabNav';

import type { TabNavInstance } from './TabNav';
import type { TabsPaneContext } from '@lemon-peel/tokens';
import type { ExtractPropTypes, PropType } from 'vue';
import type { Awaitable } from '@lemon-peel/utils';

export type TabPaneName = string | number;

export const tabsProps = buildProps({
  type: { type: String, values: ['card', 'border-card', ''], default: '' },
  activeName: { type: [String, Number] },
  closable: Boolean,
  addable: Boolean,
  modelValue: { type: [String, Number] },
  editable: Boolean,
  tabPosition: {
    type: String,
    values: ['top', 'right', 'bottom', 'left'],
    default: 'top',
  },
  beforeLeave: {
    type: Function as PropType<(newName: TabPaneName, oldName: TabPaneName) => Awaitable<void | boolean>>,
    default: () => true,
  },
  stretch: Boolean,
} as const);

export type TabsProps = ExtractPropTypes<typeof tabsProps>;

const isPaneName = (value: unknown): value is string | number =>
  isString(value) || isNumber(value);

export const tabsEmits = {
  [UPDATE_MODEL_EVENT]: (name: TabPaneName) => isPaneName(name),
  tabClick: (pane: TabsPaneContext, event_: Event) => event_ instanceof Event,
  tabChange: (name: TabPaneName) => isPaneName(name),
  edit: (paneName: TabPaneName | undefined, action: 'remove' | 'add') =>
    ['remove', 'add'].includes(action),
  tabRemove: (name: TabPaneName) => isPaneName(name),
  tabAdd: () => true,
};

export type TabsEmits = typeof tabsEmits;

export type TabsPanes = Record<number, TabsPaneContext>;

export default defineComponent({
  name: 'LpTabs',

  props: tabsProps,
  emits: tabsEmits,

  setup(props, { emit, slots, expose }) {
    const ns = useNamespace('tabs');

    const {
      children: panes,
      addChild: registerPane,
      removeChild: unregisterPane,
    } = useOrderedChildren<TabsPaneContext>(getCurrentInstance()!, 'LpTabPane');

    const nav$ = ref<TabNavInstance>();
    const currentName = ref<TabPaneName>(
      props.modelValue ?? props.activeName ?? '0',
    );

    const changeCurrentName = (value: TabPaneName) => {
      currentName.value = value;
      emit(UPDATE_MODEL_EVENT, value);
      emit('tabChange', value);
    };

    const setCurrentName = async (value?: TabPaneName) => {
      // should do nothing.
      if (currentName.value === value || isUndefined(value)) return;

      try {
        const canLeave = await props.beforeLeave?.(value, currentName.value);
        if (canLeave !== false) {
          changeCurrentName(value);

          // call exposed function, Vue doesn't support expose in typescript yet.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          nav$.value?.removeFocus?.();
        }
      } catch {}
    };

    const handleTabClick = (
      tab: TabsPaneContext,
      tabName: TabPaneName,
      event: Event,
    ) => {
      if (tab.props.disabled) return;
      setCurrentName(tabName);
      emit('tabClick', tab, event);
    };

    const handleTabRemove = (pane: TabsPaneContext, event_: Event) => {
      if (pane.props.disabled || isUndefined(pane.props.name)) return;
      event_.stopPropagation();
      emit('edit', pane.props.name, 'remove');
      emit('tabRemove', pane.props.name);
    };

    const handleTabAdd = () => {
      emit('edit', undefined, 'add');
      emit('tabAdd');
    };

    watch(
      () => props.activeName,
      modelValue => setCurrentName(modelValue),
    );

    watch(
      () => props.modelValue,
      modelValue => setCurrentName(modelValue),
    );

    watch(currentName, async () => {
      await nextTick();
      // call exposed function, Vue doesn't support expose in typescript yet.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      nav$.value?.scrollToActiveTab();
    });

    provide(tabsRootContextKey, {
      props,
      currentName,
      registerPane,
      unregisterPane,
    });

    expose({
      currentName,
    });

    return () => {
      const newButton =
        props.editable || props.addable ? (
          <span
            class={ns.e('new-tab')}
            tabindex="0"
            onClick={handleTabAdd}
            onKeydown={(event_: KeyboardEvent) => {
              if (event_.code === EVENT_CODE.enter) handleTabAdd();
            }}
          >
            <LpIcon class={ns.is('icon-plus')}>
              <Plus />
            </LpIcon>
          </span>
        ) : null;

      const header = (
        <div class={[ns.e('header'), ns.is(props.tabPosition)]}>
          {newButton}
          <TabNav
            ref={nav$}
            currentName={currentName.value}
            editable={props.editable}
            type={props.type}
            panes={panes.value}
            stretch={props.stretch}
            onTabClick={handleTabClick}
            onTabRemove={handleTabRemove}
          />
        </div>
      );

      const panels = (
        <div class={ns.e('content')}>{renderSlot(slots, 'default')}</div>
      );

      return (
        <div
          class={[
            ns.b(),
            ns.m(props.tabPosition),
            {
              [ns.m('card')]: props.type === 'card',
              [ns.m('border-card')]: props.type === 'border-card',
            },
          ]}
        >
          {...props.tabPosition === 'bottom'
            ? [panels, header]
            : [header, panels]}
        </div>
      );
    };
  },
});
