/* eslint-disable unicorn/prefer-ternary */
import { computed, defineComponent, getCurrentInstance, inject, nextTick, onMounted, onUpdated, ref, watch } from 'vue';
import { useDocumentVisibility, useResizeObserver, useWindowFocus } from '@vueuse/core';
import { buildProps, capitalize, mutable, throwError } from '@lemon-peel/utils';
import { EVENT_CODE } from '@lemon-peel/constants';
import { LpIcon } from '@lemon-peel/components/icon';
import { ArrowLeft, ArrowRight, Close } from '@element-plus/icons-vue';
import { tabsRootContextKey } from '@lemon-peel/tokens';
import { useNamespace } from '@lemon-peel/hooks';
import TabBar from './TabBar.vue';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { TabsPaneContext } from '@lemon-peel/tokens';
import type { TabPaneName } from './Tabs';

interface Scrollable {
  next?: boolean;
  prev?: number;
}

export const tabNavProps = buildProps({
  panes: {
    type: Array as PropType<TabsPaneContext[]>,
    default: () => mutable([] as const),
  },
  currentName: { type: [String, Number], default: '' },
  editable: Boolean,
  type: { type: String, values: ['card', 'border-card', ''], default: '' },
  stretch: Boolean,
} as const);

export const tabNavEmits = {
  tabClick: (tab: TabsPaneContext, tabName: TabPaneName, event_: Event) =>
    event_ instanceof Event,
  tabRemove: (tab: TabsPaneContext, event_: Event) => event_ instanceof Event,
};

export type TabNavProps = ExtractPropTypes<typeof tabNavProps>;
export type TabNavEmits = typeof tabNavEmits;

const COMPONENT_NAME = 'LpTabNav';
const TabNav = defineComponent({
  name: COMPONENT_NAME,
  props: tabNavProps,
  emits: tabNavEmits,
  setup(props, { expose, emit }) {
    const vm = getCurrentInstance()!;

    const rootTabs = inject(tabsRootContextKey);
    if (!rootTabs) throwError(COMPONENT_NAME, `<lp-tabs><tab-nav /></lp-tabs>`);

    const ns = useNamespace('tabs');
    const visibility = useDocumentVisibility();
    const focused = useWindowFocus();

    const navScroll$ = ref<HTMLDivElement>();
    const nav$ = ref<HTMLDivElement>();
    const element$ = ref<HTMLDivElement>();

    const scrollable = ref<false | Scrollable>(false);
    const navOffset = ref(0);
    const isFocus = ref(false);
    const focusable = ref(true);

    const sizeName = computed(() =>
      ['top', 'bottom'].includes(rootTabs.props.tabPosition)
        ? 'width'
        : 'height',
    );
    const navStyle = computed<CSSProperties>(() => {
      const dir = sizeName.value === 'width' ? 'X' : 'Y';
      return {
        transform: `translate${dir}(-${navOffset.value}px)`,
      };
    });

    const scrollPrevious = () => {
      if (!navScroll$.value) return;

      const containerSize =
        navScroll$.value[`offset${capitalize(sizeName.value)}`];
      const currentOffset = navOffset.value;

      if (!currentOffset) return;

      const newOffset =
        currentOffset > containerSize ? currentOffset - containerSize : 0;

      navOffset.value = newOffset;
    };

    const scrollNext = () => {
      if (!navScroll$.value || !nav$.value) return;

      const navSize = nav$.value[`offset${capitalize(sizeName.value)}`];
      const containerSize =
        navScroll$.value[`offset${capitalize(sizeName.value)}`];
      const currentOffset = navOffset.value;

      if (navSize - currentOffset <= containerSize) return;

      const newOffset =
        navSize - currentOffset > containerSize * 2
          ? currentOffset + containerSize
          : navSize - containerSize;

      navOffset.value = newOffset;
    };

    const scrollToActiveTab = async () => {
      const nav = nav$.value;
      if (!scrollable.value || !element$.value || !navScroll$.value || !nav) return;

      await nextTick();

      const activeTab = element$.value.querySelector('.is-active');
      if (!activeTab) return;

      const navScroll = navScroll$.value;
      const isHorizontal = ['top', 'bottom'].includes(
        rootTabs.props.tabPosition,
      );
      const activeTabBounding = activeTab.getBoundingClientRect();
      const navScrollBounding = navScroll.getBoundingClientRect();
      const maxOffset = isHorizontal
        ? nav.offsetWidth - navScrollBounding.width
        : nav.offsetHeight - navScrollBounding.height;
      const currentOffset = navOffset.value;
      let newOffset = currentOffset;

      if (isHorizontal) {
        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset =
            currentOffset - (navScrollBounding.left - activeTabBounding.left);
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset =
            currentOffset + activeTabBounding.right - navScrollBounding.right;
        }
      } else {
        if (activeTabBounding.top < navScrollBounding.top) {
          newOffset =
            currentOffset - (navScrollBounding.top - activeTabBounding.top);
        }
        if (activeTabBounding.bottom > navScrollBounding.bottom) {
          newOffset =
            currentOffset +
            (activeTabBounding.bottom - navScrollBounding.bottom);
        }
      }
      newOffset = Math.max(newOffset, 0);
      navOffset.value = Math.min(newOffset, maxOffset);
    };

    const update = () => {
      if (!nav$.value || !navScroll$.value) return;

      const navSize = nav$.value[`offset${capitalize(sizeName.value)}`];
      const containerSize =
        navScroll$.value[`offset${capitalize(sizeName.value)}`];
      const currentOffset = navOffset.value;

      if (containerSize < navSize) {
        const offset = navOffset.value;
        scrollable.value = scrollable.value || {};
        scrollable.value.prev = offset;
        scrollable.value.next = offset + containerSize < navSize;
        if (navSize - offset < containerSize) {
          navOffset.value = navSize - containerSize;
        }
      } else {
        scrollable.value = false;
        if (currentOffset > 0) {
          navOffset.value = 0;
        }
      }
    };

    const setFocus = () => {
      if (focusable.value) isFocus.value = true;
    };

    const changeTab = (e: KeyboardEvent) => {
      const code = e.code;

      const { up, down, left, right } = EVENT_CODE;
      if (![up, down, left, right].includes(code)) return;

      // 左右上下键更换tab
      const tabList = [...(e.currentTarget as HTMLDivElement).querySelectorAll<HTMLDivElement>(
        '[role=tab]:not(.is-disabled)',
      )];
      const currentIndex = tabList.indexOf(e.target as HTMLDivElement);

      let nextIndex: number;
      if (code === left || code === up) {
        // left
        if (currentIndex === 0) {
          // first
          nextIndex = tabList.length - 1;
        } else {
          nextIndex = currentIndex - 1;
        }
      } else {
        // right
        if (currentIndex < tabList.length - 1) {
          // not last
          nextIndex = currentIndex + 1;
        } else {
          nextIndex = 0;
        }
      }
      tabList[nextIndex].focus({ preventScroll: true }); // 改变焦点元素
      tabList[nextIndex].click(); // 选中下一个tab
      setFocus();
    };

    const removeFocus = () => (isFocus.value = false);

    watch(visibility, val => {
      if (val === 'hidden') {
        focusable.value = false;
      } else if (val === 'visible') {
        setTimeout(() => (focusable.value = true), 50);
      }
    });

    watch(focused, val => {
      if (val) {
        setTimeout(() => (focusable.value = true), 50);
      } else {
        focusable.value = false;
      }
    });

    useResizeObserver(element$, update);

    onMounted(() => setTimeout(() => scrollToActiveTab(), 0));
    onUpdated(() => update());

    expose({
      scrollToActiveTab,
      removeFocus,
    });

    watch(
      () => props.panes,
      () => vm.update(),
      { flush: 'post' },
    );

    return () => {
      const scrollButton = scrollable.value
        ? [
            <span
              class={[
                ns.e('nav-prev'),
                ns.is('disabled', !scrollable.value.prev),
              ]}
              onClick={scrollPrevious}
            >
              <LpIcon>
                <ArrowLeft />
              </LpIcon>
            </span>,
            <span
              class={[
                ns.e('nav-next'),
                ns.is('disabled', !scrollable.value.next),
              ]}
              onClick={scrollNext}
            >
              <LpIcon>
                <ArrowRight />
              </LpIcon>
            </span>,
        ]
        : null;

      const tabs = props.panes.map((pane, index) => {
        const uid = pane.uid;
        const disabled = pane.props.disabled;
        const tabName = pane.props.name ?? pane.index ?? `${index}`;
        const closable = !disabled && (pane.isClosable || props.editable);
        pane.index = `${index}`;

        const buttonClose = closable ? (
          <LpIcon
            class="is-icon-close"
            // `onClick` not exist when generate dts
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onClick={(event_: MouseEvent) => emit('tabRemove', pane, event_)}
          >
            <Close />
          </LpIcon>
        ) : null;

        const tabLabelContent = pane.slots.label?.() || pane.props.label;
        const tabindex = !disabled && pane.active ? 0 : -1;

        return (
          <div
            ref={`tab-${uid}`}
            class={[
              ns.e('item'),
              ns.is(rootTabs.props.tabPosition),
              ns.is('active', pane.active),
              ns.is('disabled', disabled),
              ns.is('closable', closable),
              ns.is('focus', isFocus.value),
            ]}
            id={`tab-${tabName}`}
            key={`tab-${uid}`}
            aria-controls={`pane-${tabName}`}
            role="tab"
            aria-selected={pane.active}
            tabindex={tabindex}
            onFocus={() => setFocus()}
            onBlur={() => removeFocus()}
            onClick={(event_: MouseEvent) => {
              removeFocus();
              emit('tabClick', pane, tabName, event_);
            }}
            onKeydown={(event_: KeyboardEvent) => {
              if (
                closable &&
                (event_.code === EVENT_CODE.delete ||
                  event_.code === EVENT_CODE.backspace)
              ) {
                emit('tabRemove', pane, event_);
              }
            }}
          >
            {...[tabLabelContent, buttonClose]}
          </div>
        );
      });

      return (
        <div
          ref={element$}
          class={[
            ns.e('nav-wrap'),
            ns.is('scrollable', !!scrollable.value),
            ns.is(rootTabs.props.tabPosition),
          ]}
        >
          {scrollButton}
          <div class={ns.e('nav-scroll')} ref={navScroll$}>
            <div
              class={[
                ns.e('nav'),
                ns.is(rootTabs.props.tabPosition),
                ns.is(
                  'stretch',
                  props.stretch &&
                    ['top', 'bottom'].includes(rootTabs.props.tabPosition),
                ),
              ]}
              ref={nav$}
              style={navStyle.value}
              role="tablist"
              onKeydown={changeTab}
            >
              {...[
                props.type ? null : <TabBar tabs={[...props.panes]} />,
                tabs,
              ]}
            </div>
          </div>
        </div>
      );
    };
  },
});

export type TabNavInstance = InstanceType<typeof TabNav>;
export default TabNav;
