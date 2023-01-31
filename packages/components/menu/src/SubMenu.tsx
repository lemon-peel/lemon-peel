import { Fragment, computed, defineComponent, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, provide, reactive, ref, vShow, watch, withDirectives } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import LpCollapseTransition from '@lemon-peel/components/collapseTransition';
import LpTooltip from '@lemon-peel/components/tooltip';
import { buildProps, iconPropType, isString, throwError } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue';
import { LpIcon } from '@lemon-peel/components/icon';
import useMenu from './useMenu';
import { useMenuCssVar as useMenuCssVariable } from './useMenuCssVar';

import type { Placement } from '@lemon-peel/components/popper';
import type { CSSProperties, ExtractPropTypes, VNodeArrayChildren } from 'vue';
import type { MenuProvider, SubMenuProvider } from './types';

export const subMenuProps = buildProps({
  index: {
    type: String,
    required: true,
  },
  showTimeout: {
    type: Number,
    default: 300,
  },
  hideTimeout: {
    type: Number,
    default: 300,
  },
  popperClass: String,
  disabled: Boolean,
  popperAppendToBody: {
    type: Boolean,
    default: undefined,
  },
  popperOffset: {
    type: Number,
    default: 6,
  },
  expandCloseIcon: {
    type: iconPropType,
  },
  expandOpenIcon: {
    type: iconPropType,
  },
  collapseCloseIcon: {
    type: iconPropType,
  },
  collapseOpenIcon: {
    type: iconPropType,
  },
} as const);
export type SubMenuProps = ExtractPropTypes<typeof subMenuProps>;

const COMPONENT_NAME = 'LpSubMenu';
export default defineComponent({
  name: COMPONENT_NAME,
  props: subMenuProps,

  setup(props, { slots, expose }) {
    const instance = getCurrentInstance()!;
    const { indexPath, parentMenu } = useMenu(
      instance,
      computed(() => props.index),
    );
    const nsMenu = useNamespace('menu');
    const nsSubMenu = useNamespace('sub-menu');

    // inject
    const rootMenu = inject<MenuProvider>('rootMenu');
    if (!rootMenu) throwError(COMPONENT_NAME, 'can not inject root menu');

    const subMenu = inject<SubMenuProvider>(`subMenu:${parentMenu.value!.uid}`);
    if (!subMenu) throwError(COMPONENT_NAME, 'can not inject sub menu');

    const items = ref<MenuProvider['items']>({});
    const subMenus = ref<MenuProvider['subMenus']>({});

    let timeout: (() => void) | undefined;
    const mouseInChild = ref(false);
    const verticalTitleRef = ref<HTMLDivElement>();
    const vPopper = ref<InstanceType<typeof LpTooltip> | null>(null);

    // computed
    const mode = computed(() => rootMenu.props.mode);
    const isFirstLevel = computed(() => {
      return subMenu.level === 0;
    });
    const opened = computed(() => rootMenu.openedMenus.includes(props.index));
    const currentPlacement = computed<Placement>(() =>
      mode.value === 'horizontal' && isFirstLevel.value
        ? 'bottom-start'
        : 'right-start',
    );
    const subMenuTitleIcon = computed(() => {
      return (mode.value === 'horizontal' && isFirstLevel.value) ||
        (mode.value === 'vertical' && !rootMenu.props.collapse)
        ? (props.expandCloseIcon && props.expandOpenIcon
          ? opened.value
            ? props.expandOpenIcon
            : props.expandCloseIcon
          : ArrowDown)
        : (props.collapseCloseIcon && props.collapseOpenIcon
          ? opened.value
            ? props.collapseOpenIcon
            : props.collapseCloseIcon
          : ArrowRight);
    });
    const appendToBody = computed(() => {
      return props.popperAppendToBody === undefined
        ? isFirstLevel.value
        : Boolean(props.popperAppendToBody);
    });
    const menuTransitionName = computed(() =>
      rootMenu.props.collapse
        ? `${nsMenu.namespace.value}-zoom-in-left`
        : `${nsMenu.namespace.value}-zoom-in-top`,
    );
    const fallbackPlacements = computed<Placement[]>(() =>
      mode.value === 'horizontal' && isFirstLevel.value
        ? [
          'bottom-start',
          'bottom-end',
          'top-start',
          'top-end',
          'right-start',
          'left-start',
        ]
        : [
          'right-start',
          'left-start',
          'bottom-start',
          'bottom-end',
          'top-start',
          'top-end',
        ],
    );

    const active = computed(() => {
      let isActive = false;

      for (const item of Object.values(items.value)) {
        if (item.active) {
          isActive = true;
        }
      }

      for (const subItem of Object.values(subMenus.value)) {
        if (subItem.active) {
          isActive = true;
        }
      }

      return isActive;
    });

    const backgroundColor = computed(() => rootMenu.props.backgroundColor || '');
    const activeTextColor = computed(() => rootMenu.props.activeTextColor || '');
    const textColor = computed(() => rootMenu.props.textColor || '');

    const item = reactive({
      index: props.index,
      indexPath,
      active,
    });

    const titleStyle = computed<CSSProperties>(() => {
      if (mode.value !== 'horizontal') {
        return {
          color: textColor.value,
        };
      }
      return {
        borderBottomColor: active.value
          ? (rootMenu.props.activeTextColor
            ? activeTextColor.value
            : '')
          : 'transparent',
        color: active.value ? activeTextColor.value : textColor.value,
      };
    });

    // methods
    const doDestroy = () =>
      vPopper.value?.popperRef?.popperInstanceRef?.destroy();

    const handleCollapseToggle = (value: boolean) => {
      if (!value) {
        doDestroy();
      }
    };

    const handleClick = () => {
      if (
        (rootMenu.props.menuTrigger === 'hover' &&
          rootMenu.props.mode === 'horizontal') ||
        (rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
        props.disabled
      )
        return;

      rootMenu.handleSubMenuClick({
        index: props.index,
        indexPath: indexPath.value,
        active: active.value,
      });
    };

    const handleMouseenter = (
      event: MouseEvent | FocusEvent,
      showTimeout = props.showTimeout,
    ) => {
      if (event.type === 'focus') {
        return;
      }
      if (
        (rootMenu.props.menuTrigger === 'click' &&
          rootMenu.props.mode === 'horizontal') ||
        (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') ||
        props.disabled
      ) {
        return;
      }
      subMenu.mouseInChild.value = true;

      timeout?.()
      ;({ stop: timeout } = useTimeoutFn(() => {
        rootMenu.openMenu(props.index, indexPath.value);
      }, showTimeout));

      if (appendToBody.value) {
        parentMenu.value.vnode.el?.dispatchEvent(new MouseEvent('mouseenter'));
      }
    };

    const handleMouseleave = (deepDispatch = false) => {
      if (
        (rootMenu.props.menuTrigger === 'click' &&
          rootMenu.props.mode === 'horizontal') ||
        (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical')
      ) {
        return;
      }
      timeout?.();
      subMenu.mouseInChild.value = false
      ;({ stop: timeout } = useTimeoutFn(
        () =>
          !mouseInChild.value &&
          rootMenu.closeMenu(props.index, indexPath.value),
        props.hideTimeout,
      ));

      if (appendToBody.value && deepDispatch && instance.parent?.type.name === 'LpSubMenu') {
        subMenu.handleMouseleave?.(true);
      }
    };

    watch(
      () => rootMenu.props.collapse,
      value => handleCollapseToggle(Boolean(value)),
    );

    // provide
    {
      const addSubMenu: SubMenuProvider['addSubMenu'] = val => {
        subMenus.value[val.index] = val;
      };
      const removeSubMenu: SubMenuProvider['removeSubMenu'] = val => {
        delete subMenus.value[val.index];
      };
      provide<SubMenuProvider>(`subMenu:${instance.uid}`, {
        addSubMenu,
        removeSubMenu,
        handleMouseleave,
        mouseInChild,
        level: subMenu.level + 1,
      });
    }

    // expose
    expose({
      opened,
    });

    // lifecycle
    onMounted(() => {
      rootMenu.addSubMenu(item);
      subMenu.addSubMenu(item);
    });

    onBeforeUnmount(() => {
      subMenu.removeSubMenu(item);
      rootMenu.removeSubMenu(item);
    });

    return () => {
      const titleTag: VNodeArrayChildren = [
        slots.title?.(),
        h(
          LpIcon,
          {
            class: nsSubMenu.e('icon-arrow'),
            style: {
              transform: opened.value
                ? ((props.expandCloseIcon && props.expandOpenIcon) ||
                  (props.collapseCloseIcon &&
                    props.collapseOpenIcon &&
                    rootMenu.props.collapse)
                  ? 'none'
                  : 'rotateZ(180deg)')
                : 'none',
            },
          },
          {
            default: () =>
              isString(subMenuTitleIcon.value)
                ? h(instance.appContext.components[subMenuTitleIcon.value])
                : h(subMenuTitleIcon.value),
          },
        ),
      ];

      const ulStyle = useMenuCssVariable(rootMenu.props, subMenu.level + 1);

      // this render function is only used for bypass `Vue`'s compiler caused patching issue.
      // temporarily mark LpPopper as any due to type inconsistency.
      const child = rootMenu.isMenuPopup
        ? h(
          // TODO: correct popper's type.
          LpTooltip as any,
          {
            ref: vPopper,
            visible: opened.value,
            effect: 'light',
            pure: true,
            offset: props.popperOffset,
            showArrow: false,
            persistent: true,
            popperClass: props.popperClass,
            placement: currentPlacement.value,
            teleported: appendToBody.value,
            fallbackPlacements: fallbackPlacements.value,
            transition: menuTransitionName.value,
            gpuAcceleration: false,
          },
          {
            content: () =>
              h(
                'div',
                {
                  class: [
                    nsMenu.m(mode.value),
                    nsMenu.m('popup-container'),
                    props.popperClass,
                  ],
                  onMouseenter: (event_: MouseEvent) =>
                    handleMouseenter(event_, 100),
                  onMouseleave: () => handleMouseleave(true),
                  onFocus: (event_: FocusEvent) => handleMouseenter(event_, 100),
                },
                [
                  h(
                    'ul',
                    {
                      class: [
                        nsMenu.b(),
                        nsMenu.m('popup'),
                        nsMenu.m(`popup-${currentPlacement.value}`),
                      ],
                      style: ulStyle.value,
                    },
                    [slots.default?.()],
                  ),
                ],
              ),
            default: () =>
              h(
                'div',
                {
                  class: nsSubMenu.e('title'),
                  style: [
                    titleStyle.value,
                    { backgroundColor: backgroundColor.value },
                  ],
                  onClick: handleClick,
                },
                titleTag,
              ),
          },
        )
        : h(Fragment, {}, [
          h(
            'div',
            {
              class: nsSubMenu.e('title'),
              style: [
                titleStyle.value,
                { backgroundColor: backgroundColor.value },
              ],
              ref: verticalTitleRef,
              onClick: handleClick,
            },
            titleTag,
          ),
          h(
            LpCollapseTransition,
            {},
            {
              default: () =>
                withDirectives(
                  h(
                    'ul',
                    {
                      role: 'menu',
                      class: [nsMenu.b(), nsMenu.m('inline')],
                      style: ulStyle.value,
                    },
                    [slots.default?.()],
                  ),
                  [[vShow, opened.value]],
                ),
            },
          ),
        ]);

      return h(
        'li',
        {
          class: [
            nsSubMenu.b(),
            nsSubMenu.is('active', active.value),
            nsSubMenu.is('opened', opened.value),
            nsSubMenu.is('disabled', props.disabled),
          ],
          role: 'menuitem',
          ariaHaspopup: true,
          ariaExpanded: opened.value,
          onMouseenter: handleMouseenter,
          onMouseleave: () => handleMouseleave(true),
          onFocus: handleMouseenter,
        },
        [child],
      );
    };
  },
});
