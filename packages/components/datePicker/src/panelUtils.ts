import DatePickPanel from './datePickerCom/PanelDatePick.vue';
import DateRangePickPanel from './datePickerCom/PanelDateRange.vue';
import MonthRangePickPanel from './datePickerCom/PanelMonthRange.vue';

import type { IDatePickerType } from './datePicker.type';

export const getPanel = function (type: IDatePickerType) {
  switch (type) {
    case 'daterange':
    case 'datetimerange': {
      return DateRangePickPanel;
    }
    case 'monthrange': {
      return MonthRangePickPanel;
    }
    default: {
      return DatePickPanel;
    }
  }
};
