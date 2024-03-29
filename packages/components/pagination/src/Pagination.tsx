import { computed, defineComponent, getCurrentInstance, h, provide, ref, watch } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { buildProps, debugWarn, iconPropType, mutable } from '@lemon-peel/utils';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { elPaginationKey } from '@lemon-peel/tokens';

import Previous from './components/Prev.vue';
import Next from './components/Next.vue';
import Sizes from './components/Sizes.vue';
import Jumper from './components/Jumper.vue';
import Total from './components/Total.vue';
import Pager from './components/Pager.vue';

import type { ExtractPropTypes, VNode, PropType } from 'vue';

/**
 * It it user's responsibility to guarantee that the value of props.total... is number
 * (same as pageSize, defaultPageSize, currentPage, defaultCurrentPage, pageCount)
 * Otherwise we can reasonable infer that the corresponding field is absent
 */
const isAbsent = (v: unknown): v is undefined => typeof v !== 'number';

type LayoutKey =
  | 'prev'
  | 'pager'
  | 'next'
  | 'jumper'
  | '->'
  | 'total'
  | 'sizes'
  | 'slot';

export const paginationProps = buildProps({
  total: Number,
  pageSize: Number,
  defaultPageSize: Number,
  currentPage: Number,
  defaultCurrentPage: Number,
  pageCount: Number,
  pagerCount: {
    type: Number,
    validator: (value: unknown) => {
      return (
        typeof value === 'number' &&
        Math.trunc(value) === value &&
        value > 4 &&
        value < 22 &&
        value % 2 === 1
      );
    },
    default: 7,
  },
  layout: {
    type: String,
    default: (
      ['prev', 'pager', 'next', 'jumper', '->', 'total'] as LayoutKey[]
    ).join(', '),
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => mutable([10, 20, 30, 40, 50, 100] as const),
  },
  popperClass: { type: String, default: '' },
  prevText: { type: String, default: '' },
  prevIcon: { type: iconPropType, default: () => ArrowLeft },
  nextText: { type: String, default: '' },
  nextIcon: { type: iconPropType, default: () => ArrowRight },
  small: Boolean,
  background: Boolean,
  disabled: Boolean,
  hideOnSinglePage: Boolean,
});

export type PaginationProps = ExtractPropTypes<typeof paginationProps>;

export const paginationEmits = {
  'update:current-page': (value: number) => typeof value === 'number',
  'update:page-size': (value: number) => typeof value === 'number',
  'size-change': (value: number) => typeof value === 'number',
  'current-change': (value: number) => typeof value === 'number',
  'prev-click': (value: number) => typeof value === 'number',
  'next-click': (value: number) => typeof value === 'number',
};
export type PaginationEmits = typeof paginationEmits;

function addClass(element: any, cls: string) {
  if (element) {
    if (!element.props) {
      element.props = {};
    }
    element.props.class = [element.props.class, cls].join(' ');
  }
}

const componentName = 'LpPagination';

export default defineComponent({
  name: componentName,

  props: paginationProps,
  emits: paginationEmits,

  setup(props, { emit, slots }) {
    const { t } = useLocale();
    const ns = useNamespace('pagination');
    const vnodeProps = getCurrentInstance()!.vnode.props || {};
    // we can find @xxx="xxx" props on `vnodeProps` to check if user bind corresponding events
    const hasCurrentPageListener =
      // eslint-disable-next-line no-restricted-syntax
      'onUpdate:currentPage' in vnodeProps ||
      'onUpdate:current-page' in vnodeProps ||
      'onCurrentChange' in vnodeProps;
    const hasPageSizeListener =
      'onUpdate:pageSize' in vnodeProps ||
      'onUpdate:page-size' in vnodeProps ||
      'onSizeChange' in vnodeProps;
    const assertValidUsage = computed(() => {
      // Users have to set either one, otherwise count of pages cannot be determined
      if (isAbsent(props.total) && isAbsent(props.pageCount)) return false;
      // <lp-pagination ...otherProps :current-page="xxx" /> without corresponding listener is forbidden now
      // Users have to use two way binding of `currentPage`
      // If users just want to provide a default value, `defaultCurrentPage` is here for you
      if (!isAbsent(props.currentPage) && !hasCurrentPageListener) return false;
      // When you want to change sizes, things get more complex, detailed below
      // Basically the most important value we need is page count
      // either directly from props.pageCount
      // or calculated from props.total
      // we will take props.pageCount precedence over props.total
      if (props.layout.includes('sizes')) {
        if (!isAbsent(props.pageCount)) {
          // if props.pageCount is assign by user, then user have to watch pageSize change
          // and recalculate pageCount
          if (!hasPageSizeListener) return false;
        } else if (!isAbsent(props.total)) {
          // Otherwise, we will see if user have props.pageSize defined
          // If so, meaning user want to have pageSize controlled himself/herself from component
          // Thus page size listener is required
          // users are account for page size change
          if (isAbsent(props.pageSize)) {
            // (else block just for explaination)
            // else page size is controlled by lp-pagination internally
          } else {
            if (!hasPageSizeListener) {
              return false;
            }
          }
        }
      }
      return true;
    });

    const innerPageSize = ref(
      isAbsent(props.defaultPageSize) ? 10 : props.defaultPageSize,
    );
    const innerCurrentPage = ref(
      isAbsent(props.defaultCurrentPage) ? 1 : props.defaultCurrentPage,
    );

    const pageSizeBridge = computed({
      get() {
        return isAbsent(props.pageSize) ? innerPageSize.value : props.pageSize;
      },
      set(v: number) {
        if (isAbsent(props.pageSize)) {
          innerPageSize.value = v;
        }
        if (hasPageSizeListener) {
          emit('update:page-size', v);
          emit('size-change', v);
        }
      },
    });

    const pageCountBridge = computed<number>(() => {
      let pageCount = 0;
      if (!isAbsent(props.pageCount)) {
        pageCount = props.pageCount;
      } else if (!isAbsent(props.total)) {
        pageCount = Math.max(1, Math.ceil(props.total / pageSizeBridge.value));
      }
      return pageCount;
    });

    const currentPageBridge = computed<number>({
      get() {
        return isAbsent(props.currentPage)
          ? innerCurrentPage.value
          : props.currentPage;
      },
      set(v) {
        let newCurrentPage = v;
        if (v < 1) {
          newCurrentPage = 1;
        } else if (v > pageCountBridge.value) {
          newCurrentPage = pageCountBridge.value;
        }
        if (isAbsent(props.currentPage)) {
          innerCurrentPage.value = newCurrentPage;
        }
        if (hasCurrentPageListener) {
          emit('update:current-page', newCurrentPage);
          emit('current-change', newCurrentPage);
        }
      },
    });

    watch(pageCountBridge, value => {
      if (currentPageBridge.value > value) currentPageBridge.value = value;
    });

    function handleCurrentChange(value: number) {
      currentPageBridge.value = value;
    }

    function handleSizeChange(value: number) {
      pageSizeBridge.value = value;
      const newPageCount = pageCountBridge.value;
      if (currentPageBridge.value > newPageCount) {
        currentPageBridge.value = newPageCount;
      }
    }

    function previous() {
      if (props.disabled) return;
      currentPageBridge.value -= 1;
      emit('prev-click', currentPageBridge.value);
    }

    function next() {
      if (props.disabled) return;
      currentPageBridge.value += 1;
      emit('next-click', currentPageBridge.value);
    }

    provide(elPaginationKey, {
      pageCount: pageCountBridge,
      disabled: computed(() => props.disabled),
      currentPage: currentPageBridge,
      changeEvent: handleCurrentChange,
      handleSizeChange,
    });

    return () => {
      if (!assertValidUsage.value) {
        debugWarn(componentName, t('lp.pagination.deprecationWarning'));
        return null;
      }
      if (!props.layout) return null;
      if (props.hideOnSinglePage && pageCountBridge.value <= 1) return null;
      const rootChildren: Array<VNode | VNode[] | null> = [];
      const rightWrapperChildren: Array<VNode | VNode[] | null> = [];
      const rightWrapperRoot = h(
        'div',
        { class: ns.e('rightwrapper') },
        rightWrapperChildren,
      );
      const TEMPLATE_MAP: Record<
      Exclude<LayoutKey, '->'>,
      VNode | VNode[] | null
      > = {
        prev: h(Previous, {
          disabled: props.disabled,
          currentPage: currentPageBridge.value,
          prevText: props.prevText,
          prevIcon: props.prevIcon,
          onClick: previous,
        }),
        jumper: h(Jumper),
        pager: h(Pager, {
          currentPage: currentPageBridge.value,
          pageCount: pageCountBridge.value,
          pagerCount: props.pagerCount,
          onChange: handleCurrentChange,
          disabled: props.disabled,
        }),
        next: h(Next, {
          disabled: props.disabled,
          currentPage: currentPageBridge.value,
          pageCount: pageCountBridge.value,
          nextText: props.nextText,
          nextIcon: props.nextIcon,
          onClick: next,
        }),
        sizes: h(Sizes, {
          pageSize: pageSizeBridge.value,
          pageSizes: props.pageSizes,
          popperClass: props.popperClass,
          disabled: props.disabled,
          size: props.small ? 'small' : 'default',
        }),
        slot: slots?.default?.() ?? null,
        total: h(Total, { total: isAbsent(props.total) ? 0 : props.total }),
      };

      const components = props.layout
        .split(',')
        .map((item: string) => item.trim()) as LayoutKey[];

      let haveRightWrapper = false;

      for (const c of components) {
        if (c === '->') {
          haveRightWrapper = true;
          continue;
        }
        if (haveRightWrapper) {
          rightWrapperChildren.push(TEMPLATE_MAP[c]);
        } else {
          rootChildren.push(TEMPLATE_MAP[c]);
        }
      }

      addClass(rootChildren[0], ns.is('first'));
      addClass(rootChildren.at(-1), ns.is('last'));

      if (haveRightWrapper && rightWrapperChildren.length > 0) {
        addClass(rightWrapperChildren[0], ns.is('first'));
        addClass(
          rightWrapperChildren.at(-1),
          ns.is('last'),
        );
        rootChildren.push(rightWrapperRoot);
      }

      return <div role="navigation" aria-label="pagination" class={[
        ns.b(),
        ns.is('background', props.background),
        {
          [ns.m('small')]: props.small,
        },
      ]}>{rootChildren}</div>;
    };
  },
});

