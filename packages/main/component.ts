import type { Component, Plugin } from 'vue';

import { LpAffix } from '@lemon-peel/components/affix';
import { LpAlert } from '@lemon-peel/components/alert';
import { LpAutocomplete } from '@lemon-peel/components/autocomplete';
import { LpAvatar } from '@lemon-peel/components/avatar';
import { LpBacktop } from '@lemon-peel/components/backtop';
import { LpBadge } from '@lemon-peel/components/badge';
import { LpBreadcrumb, LpBreadcrumbItem } from '@lemon-peel/components/breadcrumb';
import { LpButton, LpButtonGroup } from '@lemon-peel/components/button';
import { LpCalendar } from '@lemon-peel/components/calendar';
import { LpCard } from '@lemon-peel/components/card';
import { LpCarousel, LpCarouselItem } from '@lemon-peel/components/carousel';
import { LpCascader } from '@lemon-peel/components/cascader';
import { LpCascaderPanel } from '@lemon-peel/components/cascaderPanel';
import { LpCheckTag } from '@lemon-peel/components/checkTag';
import { LpCheckbox, LpCheckboxButton, LpCheckboxGroup } from '@lemon-peel/components/checkbox';
import { LpCol } from '@lemon-peel/components/col';
import { LpCollapse, LpCollapseItem } from '@lemon-peel/components/collapse';
import { LpCollapseTransition } from '@lemon-peel/components/collapseTransition';
import { LpColorPicker } from '@lemon-peel/components/colorPicker';
import { LpConfigProvider } from '@lemon-peel/components/configProvider';
import { LpAside, LpContainer, LpFooter, LpHeader, LpMain } from '@lemon-peel/components/container';
import { LpDatePicker } from '@lemon-peel/components/datePicker';
import { LpDescriptions, LpDescriptionsItem } from '@lemon-peel/components/descriptions';
import { LpDialog } from '@lemon-peel/components/dialog';
import { LpDivider } from '@lemon-peel/components/divider';
import { LpDrawer } from '@lemon-peel/components/drawer';
import { LpDropdown, LpDropdownItem, LpDropdownMenu } from '@lemon-peel/components/dropdown';
import { LpEmpty } from '@lemon-peel/components/empty';
import { LpForm, LpFormItem } from '@lemon-peel/components/form';
import { LpIcon } from '@lemon-peel/components/icon';
import { LpImage } from '@lemon-peel/components/image';
import { LpImageViewer } from '@lemon-peel/components/imageViewer';
import { LpInput } from '@lemon-peel/components/input';
import { LpInputNumber } from '@lemon-peel/components/inputNumber';
import { LpLink } from '@lemon-peel/components/link';
import { LpMenu, LpMenuItem, LpMenuItemGroup } from '@lemon-peel/components/menu';
import { LpPageHeader } from '@lemon-peel/components/pageHeader';
import { LpPagination } from '@lemon-peel/components/pagination';
import { LpPopconfirm } from '@lemon-peel/components/popconfirm';
import { LpPopover } from '@lemon-peel/components/popover';
import { LpPopper } from '@lemon-peel/components/popper';
import { LpProgress } from '@lemon-peel/components/progress';
import { LpRadio, LpRadioButton, LpRadioGroup } from '@lemon-peel/components/radio';
import { LpRate } from '@lemon-peel/components/rate';
import { LpResult } from '@lemon-peel/components/result';
import { LpRow } from '@lemon-peel/components/row';
import { LpScrollBar } from '@lemon-peel/components/scrollbar';
import { LpOption, LpOptionGroup, LpSelect } from '@lemon-peel/components/select';
import { LpSelectV2 } from '@lemon-peel/components/selectV2';
import { LpSkeleton, LpSkeletonItem } from '@lemon-peel/components/skeleton';
import { LpSlider } from '@lemon-peel/components/slider';
import { LpSpace } from '@lemon-peel/components/space';
import { LpStep, LpSteps } from '@lemon-peel/components/steps';
import { LpSwitch } from '@lemon-peel/components/switch';
import { LpTable, LpTableColumn } from '@lemon-peel/components/table';
import { LpAutoResizer, LpTableV2 } from '@lemon-peel/components/tableV2';
import { LpTabPane, LpTabs } from '@lemon-peel/components/tabs';
import { LpTag } from '@lemon-peel/components/tag';
import { LpTimePicker } from '@lemon-peel/components/timePicker';
import { LpTimeSelect } from '@lemon-peel/components/timeSelect';
import { LpTimeline, LpTimelineItem } from '@lemon-peel/components/timeline';
import { LpTooltip } from '@lemon-peel/components/tooltip';
import { LpTooltipV2 } from '@lemon-peel/components/tooltipV2';
import { LpTransfer } from '@lemon-peel/components/transfer';
import { LpTree } from '@lemon-peel/components/tree';
import { LpTreeSelect } from '@lemon-peel/components/treeSelect';
import { LpTreeV2 } from '@lemon-peel/components/treeV2';
import { LpUpload } from '@lemon-peel/components/upload';

export default [
  LpAffix,
  LpAlert,
  LpAutocomplete,
  LpAutoResizer,
  LpAvatar,
  LpBacktop,
  LpBadge,
  LpBreadcrumb,
  LpBreadcrumbItem,
  LpButton,
  LpButtonGroup,
  LpCalendar,
  LpCard,
  LpCarousel,
  LpCarouselItem,
  LpCascader,
  LpCascaderPanel,
  LpCheckTag,
  LpCheckbox,
  LpCheckboxButton,
  LpCheckboxGroup,
  LpCol,
  LpCollapse,
  LpCollapseItem,
  LpCollapseTransition,
  LpColorPicker,
  LpConfigProvider,
  LpContainer,
  LpAside,
  LpFooter,
  LpHeader,
  LpMain,
  LpDatePicker,
  LpDescriptions,
  LpDescriptionsItem,
  LpDialog,
  LpDivider,
  LpDrawer,
  LpDropdown,
  LpDropdownItem,
  LpDropdownMenu,
  LpEmpty,
  LpForm,
  LpFormItem,
  LpIcon,
  LpImage,
  LpImageViewer,
  LpInput,
  LpInputNumber,
  LpLink,
  LpMenu,
  LpMenuItem,
  LpMenuItemGroup,
  LpPageHeader,
  LpPagination,
  LpPopconfirm,
  LpPopover,
  LpPopper,
  LpProgress,
  LpRadio,
  LpRadioButton,
  LpRadioGroup,
  LpRate,
  LpResult,
  LpRow,
  LpScrollBar,
  LpSelect,
  LpOption,
  LpOptionGroup,
  LpSelectV2,
  LpSkeleton,
  LpSkeletonItem,
  LpSlider,
  LpSpace,
  LpSteps,
  LpStep,
  LpSwitch,
  LpTable,
  LpTableColumn,
  LpTableV2,
  LpTabs,
  LpTabPane,
  LpTag,
  LpTimePicker,
  LpTimeSelect,
  LpTimeline,
  LpTimelineItem,
  LpTooltip,
  LpTooltipV2,
  LpTransfer,
  LpTree,
  LpTreeSelect,
  LpTreeV2,
  LpUpload,
] as (Component & Plugin)[];
