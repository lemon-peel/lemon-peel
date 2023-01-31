import {
  Transition,
  createApp,
  createVNode,
  h,
  reactive,
  ref,
  toRefs,
  vShow,
  withCtx,
  withDirectives,
} from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { removeClass } from '@lemon-peel/utils';

import type { LoadingOptionsResolved } from './types';

export function createLoadingComponent(options: LoadingOptionsResolved) {
  let afterLeaveTimer: number;

  const ns = useNamespace('loading');
  const afterLeaveFlag = ref(false);
  const data = reactive({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  });

  function setText(text: string) {
    data.text = text;
  }

  function destroySelf() {
    const target = data.parent;
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string | null =
        target.getAttribute('loading-number');
      loadingNumber = Number.parseInt(loadingNumber as any) - 1;
      if (loadingNumber) {
        target.setAttribute('loading-number', loadingNumber.toString());
      } else {
        removeClass(target, ns.bm('parent', 'relative'));
        target.removeAttribute('loading-number');
      }
      removeClass(target, ns.bm('parent', 'hidden'));
    }
    removeLpLoadingChild();
    loadingInstance.unmount();
  }
  function removeLpLoadingChild(): void {
    vm.$el?.parentNode?.removeChild(vm.$el);
  }
  function close() {
    if (options.beforeClose && !options.beforeClose()) return;

    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);

    afterLeaveTimer = window.setTimeout(handleAfterLeave, 400);
    data.visible = false;

    options.closed?.();
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return;
    const target = data.parent;
    afterLeaveFlag.value = false;
    target.vLoadingAddClassList = undefined;
    destroySelf();
  }

  const elLoadingComponent = {
    name: 'LpLoading',
    setup() {
      return () => {
        const svg = data.spinner || data.svg;
        const spinner = h(
          'svg',
          {
            class: 'circular',
            viewBox: data.svgViewBox ? data.svgViewBox : '0 0 50 50',
            ...(svg ? { innerHTML: svg } : {}),
          },
          [
            h('circle', {
              class: 'path',
              cx: '25',
              cy: '25',
              r: '20',
              fill: 'none',
            }),
          ],
        );

        const spinnerText = data.text
          ? h('p', { class: ns.b('text') }, [data.text])
          : undefined;

        return h(
          Transition,
          {
            name: ns.b('fade'),
            onAfterLeave: handleAfterLeave,
          },
          {
            default: withCtx(() => [
              withDirectives(
                createVNode(
                  'div',
                  {
                    style: {
                      backgroundColor: data.background || '',
                    },
                    class: [
                      ns.b('mask'),
                      data.customClass,
                      data.fullscreen ? 'is-fullscreen' : '',
                    ],
                  },
                  [
                    h(
                      'div',
                      {
                        class: ns.b('spinner'),
                      },
                      [spinner, spinnerText],
                    ),
                  ],
                ),
                [[vShow, data.visible]],
              ),
            ]),
          },
        );
      };
    },
  };

  const loadingInstance = createApp(elLoadingComponent);
  const vm = loadingInstance.mount(document.createElement('div'));

  return {
    ...toRefs(data),
    setText,
    removeLpLoadingChild,
    close,
    handleAfterLeave,
    vm,
    get $el(): HTMLElement {
      return vm.$el;
    },
  };
}

export type LoadingInstance = ReturnType<typeof createLoadingComponent>;
