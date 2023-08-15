/* eslint-disable @typescript-eslint/consistent-type-imports */
// For this project development
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    LpAffix: typeof import('../packages/main')['LpAffix'];
    LpAlert: typeof import('../packages/main')['LpAlert'];
    LpAside: typeof import('../packages/main')['LpAside'];
    LpAutocomplete: typeof import('../packages/main')['LpAutocomplete'];
    LpAvatar: typeof import('../packages/main')['LpAvatar'];
    LpBacktop: typeof import('../packages/main')['LpBacktop'];
    LpBadge: typeof import('../packages/main')['LpBadge'];
    LpBreadcrumb: typeof import('../packages/main')['LpBreadcrumb'];
    LpBreadcrumbItem: typeof import('../packages/main')['LpBreadcrumbItem'];
    LpButton: typeof import('../packages/main')['LpButton'];
    LpButtonGroup: typeof import('../packages/main')['LpButtonGroup'];
    LpCalendar: typeof import('../packages/main')['LpCalendar'];
    LpCard: typeof import('../packages/main')['LpCard'];
    LpCarousel: typeof import('../packages/main')['LpCarousel'];
    LpCarouselItem: typeof import('../packages/main')['LpCarouselItem'];
    LpCascader: typeof import('../packages/main')['LpCascader'];
    LpCascaderPanel: typeof import('../packages/main')['LpCascaderPanel'];
    LpCheckbox: typeof import('../packages/main')['LpCheckbox'];
    LpCheckboxButton: typeof import('../packages/main')['LpCheckboxButton'];
    LpCheckboxGroup: typeof import('../packages/main')['LpCheckboxGroup'];
    LpCol: typeof import('../packages/main')['LpCol'];
    LpCollapse: typeof import('../packages/main')['LpCollapse'];
    LpCollapseItem: typeof import('../packages/main')['LpCollapseItem'];
    LpCollapseTransition: typeof import('../packages/main')['LpCollapseTransition'];
    LpColorPicker: typeof import('../packages/main')['LpColorPicker'];
    LpContainer: typeof import('../packages/main')['LpContainer'];
    LpConfigProvider: typeof import('../packages/main')['LpConfigProvider'];
    LpDatePicker: typeof import('../packages/main')['LpDatePicker'];
    LpDialog: typeof import('../packages/main')['LpDialog'];
    LpDivider: typeof import('../packages/main')['LpDivider'];
    LpDrawer: typeof import('../packages/main')['LpDrawer'];
    LpDropdown: typeof import('../packages/main')['LpDropdown'];
    LpDropdownItem: typeof import('../packages/main')['LpDropdownItem'];
    LpDropdownMenu: typeof import('../packages/main')['LpDropdownMenu'];
    LpEmpty: typeof import('../packages/main')['LpEmpty'];
    LpFooter: typeof import('../packages/main')['LpFooter'];
    LpForm: typeof import('../packages/main')['LpForm'];
    LpFormItem: typeof import('../packages/main')['LpFormItem'];
    LpHeader: typeof import('../packages/main')['LpHeader'];
    LpIcon: typeof import('../packages/main')['LpIcon'];
    LpImage: typeof import('../packages/main')['LpImage'];
    LpImageViewer: typeof import('../packages/main')['LpImageViewer'];
    LpInput: typeof import('../packages/main')['LpInput'];
    LpInputNumber: typeof import('../packages/main')['LpInputNumber'];
    LpLink: typeof import('../packages/main')['LpLink'];
    LpMain: typeof import('../packages/main')['LpMain'];
    LpMenu: typeof import('../packages/main')['LpMenu'];
    LpMenuItem: typeof import('../packages/main')['LpMenuItem'];
    LpMenuItemGroup: typeof import('../packages/main')['LpMenuItemGroup'];
    LpOption: typeof import('../packages/main')['LpOption'];
    LpOptionGroup: typeof import('../packages/main')['LpOptionGroup'];
    LpPageHeader: typeof import('../packages/main')['LpPageHeader'];
    LpPagination: typeof import('../packages/main')['LpPagination'];
    LpPopconfirm: typeof import('../packages/main')['LpPopconfirm'];
    LpPopper: typeof import('../packages/main')['LpPopper'];
    LpProgress: typeof import('../packages/main')['LpProgress'];
    LpRadio: typeof import('../packages/main')['LpRadio'];
    LpRadioButton: typeof import('../packages/main')['LpRadioButton'];
    LpRadioGroup: typeof import('../packages/main')['LpRadioGroup'];
    LpRate: typeof import('../packages/main')['LpRate'];
    LpRow: typeof import('../packages/main')['LpRow'];
    LpSelect: typeof import('../packages/main')['LpSelect'];
    LpSlider: typeof import('../packages/main')['LpSlider'];
    LpStep: typeof import('../packages/main')['LpStep'];
    LpSteps: typeof import('../packages/main')['LpSteps'];
    LpSubMenu: typeof import('../packages/main')['LpSubMenu'];
    LpSwitch: typeof import('../packages/main')['LpSwitch'];
    LpTabPane: typeof import('../packages/main')['LpTabPane'];
    LpTable: typeof import('../packages/main')['LpTable'];
    LpTableColumn: typeof import('../packages/main')['LpTableColumn'];
    LpTabs: typeof import('../packages/main')['LpTabs'];
    LpTag: typeof import('../packages/main')['LpTag'];
    LpTimePicker: typeof import('../packages/main')['LpTimePicker'];
    LpTimeSelect: typeof import('../packages/main')['LpTimeSelect'];
    LpTimeline: typeof import('../packages/main')['LpTimeline'];
    LpTimelineItem: typeof import('../packages/main')['LpTimelineItem'];
    LpTooltip: typeof import('../packages/main')['LpTooltip'];
    LpTransfer: typeof import('../packages/main')['LpTransfer'];
    LpTree: typeof import('../packages/main')['LpTree'];
    LpTreeSelect: typeof import('../packages/main')['LpTreeSelect'];
    LpUpload: typeof import('../packages/main')['LpUpload'];
    LpSpace: typeof import('../packages/main')['LpSpace'];
    LpSkeleton: typeof import('../packages/main')['LpSkeleton'];
    LpSkeletonItem: typeof import('../packages/main')['LpSkeletonItem'];
    LpCheckTag: typeof import('../packages/main')['LpCheckTag'];
    LpDescriptions: typeof import('../packages/main')['LpDescriptions'];
    LpDescriptionsItem: typeof import('../packages/main')['LpDescriptionsItem'];
    LpResult: typeof import('../packages/main')['LpResult'];
  }

  interface ComponentCustomProperties {
    $message: typeof import('../packages/main')['LpMessage'];
    $notify: typeof import('../packages/main')['LpNotification'];
    $msgbox: typeof import('../packages/main')['LpMessageBox'];
    $messageBox: typeof import('../packages/main')['LpMessageBox'];
    $alert: typeof import('../packages/main')['LpMessageBox']['alert'];
    $confirm: typeof import('../packages/main')['LpMessageBox']['confirm'];
    $prompt: typeof import('../packages/main')['LpMessageBox']['prompt'];
    $loading: typeof import('../packages/main')['LpLoadingService'];
  }
}

export {};
