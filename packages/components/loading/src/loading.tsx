import { Transition, createApp, reactive, ref, toRefs, vShow, withCtx, withDirectives } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';
import { removeClass } from '@lemon-peel/utils';

import type { ComponentPublicInstance, ToRefs } from 'vue';
import type { LoadingOptionsResolved, LoadingParentElement } from './types';

type LoadingComponentData = {
  originalPosition: string;
  originalOverflow: string;
  visible: boolean;
};

export function createLoadingComponent(options: LoadingOptionsResolved) {
  let afterLeaveTimer: number;

  const ns = useNamespace('loading');
  const afterLeaveFlag = ref(false);
  const data = reactive<LoadingOptionsResolved & LoadingComponentData>({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  });

  function setText(text: string) {
    data.text = text;
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return;
    const target = data.parent;
    afterLeaveFlag.value = false;
    target.vLoadingAddClassList = undefined;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    destroySelf();
  }

  const elLoadingComponent = {
    name: 'LpLoading',
    setup() {
      return () => {
        const Svg = data.spinner || data.svg;
        const spinner = <svg
          class='circular'
          viewBox={data.svgViewBox || '0 0 50 50'}>
          { Svg || <circle class='path' cx='25' cy='25' r='20' fill='none'></circle> }
        </svg>;

        const spinnerText = data.text
          ? <p class={ns.b('text')}>{data.text}</p>
          : undefined;

        return <Transition name={ns.b('fade')} onAfterLeave={handleAfterLeave}>
          {
            withCtx(() => [
              withDirectives(
                <div class={[
                  ns.b('mask'),
                  data.customClass,
                  data.fullscreen ? 'is-fullscreen' : '',
                ]} style={{
                  backgroundColor: data.background || '',
                }}>
                  <div class={ns.b('spinner')}>{spinner}{spinnerText}</div>
                </div>,
                [[vShow, data.visible]],
              ),
            ])()
          }
        </Transition>;
      };
    },
  };

  const loadingInstance = createApp(elLoadingComponent);

  const vm: ComponentPublicInstance = loadingInstance.mount(document.createElement('div'));

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

  function destroySelf() {
    const target = data.parent as LoadingParentElement;
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

  const refs = toRefs(data);
  const otherExpose = {
    vm,
    setText,
    removeLpLoadingChild,
    close,
    handleAfterLeave,
    get $el(): HTMLElement {
      return vm.$el;
    },
  };

  return {
    ...refs,
    ...otherExpose,
  } as (ToRefs<LoadingOptionsResolved & LoadingComponentData> & typeof otherExpose);
}

export type LoadingInstance = ReturnType<typeof createLoadingComponent>;
