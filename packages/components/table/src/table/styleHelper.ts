import { computed, nextTick, onMounted, ref, unref, watch, watchEffect } from 'vue';
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { useSize } from '@lemon-peel/hooks';

// import type { NormalizedWheelEvent } from 'normalize-wheel-es';
import type { TableProps, TableVM } from './defaults';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type { Store } from '../store/index';
import type TableLayout from '../layout/TableLayout';

function useStyle(props: TableProps, layout: TableLayout, store: Store, table: TableVM) {
  const isHidden = ref(false);
  const renderExpanded = ref(null);
  const resizeProxyVisible = ref(false);

  const setDragVisible = (visible: boolean) => {
    resizeProxyVisible.value = visible;
  };

  const resizeState = ref<{
    width: null | number;
    height: null | number;
    headerHeight: null | number;
  }>({
    width: null,
    height: null,
    headerHeight: null,
  });

  const isGroup = ref(false);
  const scrollbarViewStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  const tableWidth = ref();
  const tableScrollHeight = ref(0);
  const bodyScrollHeight = ref(0);
  const headerScrollHeight = ref(0);
  const footerScrollHeight = ref(0);

  watchEffect(() => {
    layout.setHeight(props.height!);
  });

  watchEffect(() => {
    layout.setMaxHeight(props.maxHeight!);
  });

  watch(
    () => [props.currentRowKey, props.rowKey],
    ([currentRowKey, rowKey]) => {
      if (!unref(rowKey) || !unref(currentRowKey)) return;
      store.current.setCurrentRowKey(`${currentRowKey}`);
    },
    { immediate: true },
  );

  watch(
    () => props.data,
    data => store.actions.setData(data),
    { immediate: true, deep: true },
  );

  watch(
    () => props.expandRowKeys,
    keys => keys && store.watcher.setExpandRowKeysAdapter(keys),
    { immediate: true  },
  );

  const handleMouseLeave = () => {
    store.actions.setHoverRow(null);
    if (table.hoverState) table.hoverState = null;
  };

  const handleHeaderFooterMousewheel = (event: WheelEvent, data: { pixelX: number, pixelY: number }) => {
    const { pixelX, pixelY } = data;
    if (Math.abs(pixelX) >= Math.abs(pixelY)) {
      table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
    }
  };

  const shouldUpdateHeight = computed(() => {
    return (
      props.height ||
      props.maxHeight ||
      store.states.fixedColumns.value.length > 0 ||
      store.states.rightFixedColumns.value.length > 0
    );
  });

  const tableBodyStyles = computed(() => {
    return {
      width: layout.bodyWidth.value ? `${layout.bodyWidth.value}px` : '',
    };
  });

  const doLayout = () => {
    if (shouldUpdateHeight.value) {
      layout.updateElsHeight();
    }
    layout.updateColumnsWidth();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    requestAnimationFrame(syncPosition);
  };

  onMounted(async () => {
    await nextTick();
    store.watcher.updateColumns();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    bindEvents();
    requestAnimationFrame(doLayout);

    const el: HTMLElement = table.vnode.el as HTMLElement;
    const tableHeader: HTMLElement = table.refs.headerWrapper;
    if (props.flexible && el && el.parentElement) {
      // Automatic minimum size of flex-items
      // Ensure that the main axis does not follow the width of the items
      el.parentElement.style.minWidth = '0';
    }

    resizeState.value = {
      width: (tableWidth.value = el.offsetWidth),
      height: el.offsetHeight,
      headerHeight:
        props.showHeader && tableHeader ? tableHeader.offsetHeight : null,
    };

    // init filters
    store.states.columns.value.forEach((column: TableColumnCtx) => {
      if (column.filteredValue && column.filteredValue.length > 0) {
        store.actions.filterChange({
          column,
          values: column.filteredValue,
          silent: true,
        });
      }
    });

    table.$ready = true;
  });

  const setScrollClassByEl = (el: HTMLElement, className: string) => {
    if (!el) return;
    const classList = Array.from(el.classList).filter(
      item => !item.startsWith('is-scrolling-'),
    );
    classList.push(layout.scrollX.value ? className : 'is-scrolling-none');
    el.className = classList.join(' ');
  };

  const setScrollClass = (className: string) => {
    const { tableWrapper } = table.refs;
    setScrollClassByEl(tableWrapper, className);
  };

  const hasScrollClass = (className: string) => {
    const { tableWrapper } = table.refs;
    return !!(tableWrapper && tableWrapper.classList.contains(className));
  };

  function syncPosition() {
    if (!table.refs.scrollBarRef) return;
    if (!layout.scrollX.value) {
      const scrollingNoneClass = 'is-scrolling-none';
      if (!hasScrollClass(scrollingNoneClass)) {
        setScrollClass(scrollingNoneClass);
      }
      return;
    }
    const scrollContainer = table.refs.scrollBarRef.wrap$;
    if (!scrollContainer) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer;
    const { headerWrapper, footerWrapper } = table.refs;
    if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
    if (footerWrapper) footerWrapper.scrollLeft = scrollLeft;
    const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
    if (scrollLeft >= maxScrollLeftPosition) {
      setScrollClass('is-scrolling-right');
    } else if (scrollLeft === 0) {
      setScrollClass('is-scrolling-left');
    } else {
      setScrollClass('is-scrolling-middle');
    }
  }

  const resizeListener = () => {
    const el = table.vnode.el;
    if (!table.$ready || !el) return;

    let shouldUpdateLayout = false;
    const {
      width: oldWidth,
      height: oldHeight,
      headerHeight: oldHeaderHeight,
    } = resizeState.value;

    const width = (tableWidth.value = el.offsetWidth);
    if (oldWidth !== width) {
      shouldUpdateLayout = true;
    }

    const height = el.offsetHeight;
    if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) {
      shouldUpdateLayout = true;
    }

    const tableHeader: HTMLElement =
      props.tableLayout === 'fixed'
        ? table.refs.headerWrapper
        : table.refs.tableHeaderRef?.$el;
    if (props.showHeader && tableHeader?.offsetHeight !== oldHeaderHeight) {
      shouldUpdateLayout = true;
    }

    tableScrollHeight.value = table.refs.tableWrapper?.scrollHeight || 0;
    headerScrollHeight.value = tableHeader?.scrollHeight || 0;
    footerScrollHeight.value = table.refs.footerWrapper?.offsetHeight || 0;
    bodyScrollHeight.value =
      tableScrollHeight.value -
      headerScrollHeight.value -
      footerScrollHeight.value;

    if (shouldUpdateLayout) {
      resizeState.value = {
        width,
        height,
        headerHeight: (props.showHeader && tableHeader?.offsetHeight) || 0,
      };
      doLayout();
    }
  };

  function bindEvents() {
    if (!table.refs.scrollBarRef) return;
    if (table.refs.scrollBarRef.wrap$) {
      useEventListener(table.refs.scrollBarRef.wrap$, 'scroll', syncPosition, {
        passive: true,
      });
    }

    if (props.fit) {
      useResizeObserver(table.vnode.el as HTMLElement, resizeListener);
    } else {
      useEventListener(window, 'resize', resizeListener);
    }

    useResizeObserver(table.refs.bodyWrapper, () => {
      resizeListener();
      table.refs?.scrollBarRef?.update();
    });
  }

  const tableSize = useSize();
  const bodyWidth = computed(() => {
    const { bodyWidth: bodyWidthNum, scrollY, gutterWidth } = layout;
    return bodyWidthNum.value
      ? `${(bodyWidthNum.value as number) - (scrollY.value ? gutterWidth : 0)}px`
      : '';
  });

  const tableLayout = computed(() => {
    if (props.maxHeight) return 'fixed';
    return props.tableLayout;
  });

  const emptyBlockStyle = computed(() => {
    if (props.data && props.data.length > 0) return;
    let height = '100%';
    if (props.height && bodyScrollHeight.value) {
      height = `${bodyScrollHeight.value}px`;
    }
    const width = tableWidth.value;
    return {
      width: width ? `${width}px` : '',
      height,
    };
  });

  const tableInnerStyle = computed(() => {
    if (props.height) {
      return {
        height: Number.isNaN(Number(props.height))
          ? props.height
          : `${props.height}px`,
      };
    }
    if (props.maxHeight) {
      return {
        maxHeight: Number.isNaN(Number(props.maxHeight))
          ? props.maxHeight
          : `${props.maxHeight}px`,
      };
    }
    return {};
  });

  const scrollbarStyle = computed(() => {
    if (props.height) {
      return {
        height: '100%',
      };
    }
    if (props.maxHeight) {
      if (Number.isNaN(Number(props.maxHeight))) {
        return {
          maxHeight: `calc(${props.maxHeight} - ${
            headerScrollHeight.value + footerScrollHeight.value
          }px)`,
        };
      } else {
        const maxHeight = props.maxHeight;
        const reachMaxHeight = tableScrollHeight.value >= Number(maxHeight);
        if (reachMaxHeight) {
          return {
            maxHeight: `${
              tableScrollHeight.value -
              headerScrollHeight.value -
              footerScrollHeight.value
            }px`,
          };
        }
      }
    }

    return {};
  });

  /**
   * fix layout
   */
  const handleFixedMousewheel = (event: WheelEvent, data: any) => {
    const bodyWrapper = table.refs.bodyWrapper;
    if (Math.abs(data.spinY) > 0) {
      const currentScrollTop = bodyWrapper.scrollTop;
      if (data.pixelY < 0 && currentScrollTop !== 0) {
        event.preventDefault();
      }
      if (
        data.pixelY > 0 &&
        bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop
      ) {
        event.preventDefault();
      }
      bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
    } else {
      bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
    }
  };

  return {
    isHidden,
    renderExpanded,
    setDragVisible,
    isGroup,
    handleFixedMousewheel,
    handleMouseLeave,
    handleHeaderFooterMousewheel,
    tableSize,
    emptyBlockStyle,
    resizeProxyVisible,
    bodyWidth,
    resizeState,
    doLayout,
    tableBodyStyles,
    tableLayout,
    scrollbarViewStyle,
    tableInnerStyle,
    scrollbarStyle,
  };
}

export default useStyle;
