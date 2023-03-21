// eslint-disable-next-line vue/prefer-import-from-vue
import { NOOP } from '@vue/shared';
import { buildProps, isObject, isString } from '@lemon-peel/utils';
import { useTooltipContentProps } from '@lemon-peel/components/tooltip';
import { placements } from '@popperjs/core';
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';

import type { ExtractPropTypes, PropType } from 'vue';
import type Autocomplete from './AutoComplete.vue';
import type { Placement } from '@lemon-peel/components/popper';
import type { Awaitable } from '@lemon-peel/utils';

export type AutocompleteData = Record<string, any>[];
export type AutocompleteFetchSuggestionsCallback = (
  data: AutocompleteData
) => void;

export type AutocompleteFetchSuggestions =
  | ((
    queryString: string,
    callback: AutocompleteFetchSuggestionsCallback
  ) => Awaitable<AutocompleteData> | void)
  | AutocompleteData;

export const autocompleteProps = buildProps({
  valueKey: { type: String, default: 'value' },
  value: { type: [String, Number], default: '' },
  debounce: { type: Number, default: 300 },
  fetchSuggestions: { type: [Function, Array] as PropType<AutocompleteFetchSuggestions>, default: NOOP },
  popperClass: { type: String, default: '' },
  triggerOnFocus: { type: Boolean, default: true },
  selectWhenUnmatched: { type: Boolean, default: false },
  hideLoading: { type: Boolean, default: false },
  label: { type: String },
  teleported: useTooltipContentProps.teleported,
  highlightFirstItem: { type: Boolean, default: false },
  fitInputWidth: { type: Boolean, default: false },
  placement: {
    type: String as PropType<Placement>,
    values: placements,
    default: 'bottom-start',
  },
});
export type AutocompleteProps = ExtractPropTypes<typeof autocompleteProps>;

export const autocompleteEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
  [INPUT_EVENT]: (value: string) => isString(value),
  [CHANGE_EVENT]: (value: string) => isString(value),
  focus: (event_: FocusEvent) => event_ instanceof FocusEvent,
  blur: (event_: FocusEvent) => event_ instanceof FocusEvent,
  clear: () => true,
  select: (item: Record<string, any>) => isObject(item),
};
export type AutocompleteEmits = typeof autocompleteEmits;

export type AutocompleteInstance = InstanceType<typeof Autocomplete>;
