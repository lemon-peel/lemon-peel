import DatePickPanel from './datePickerCom/panelDatePick.vue';
import DateRangePickPanel from './datePickerCom/panelDateRange.vue';
import MonthRangePickPanel from './datePickerCom/panelMonthRange.vue';
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
