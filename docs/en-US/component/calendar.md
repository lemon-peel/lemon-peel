---
title: Calendar
lang: en-US
---

# Calendar

Display date.

## Basic

:::demo Set `value` to specify the currently displayed month. If `value` is not specified, current month is displayed. `value` supports two-way binding.

calendar/Basic

:::

## Custom Content

:::demo Customize what is displayed in the calendar cell by setting `scoped-slot` named `date-cell`. In `scoped-slot` you can get the date (the date of the current cell), data (including the type, isSelected, day attribute). For details, please refer to the API documentation below.

calendar/Customize

:::

## Range

:::demo Set the `range` attribute to specify the display range of the calendar. Start time must be Monday, end time must be Sunday, and the time span cannot exceed two months.

calendar/Range

:::

## Customize header

:::demo

calendar/Header

:::

## Localization

The default locale of is English, if you need to use other languages, please check [Internationalization](/en-US/guide/i18n)

Note, date time locale (month name, first day of the week ...) are also configured in localization.

## Attributes

| Name                    | Description                                                                                                                                                    | Type           | Default |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------- |
| `model-value / v-model` | binding value                                                                                                                                                  | `Date`         | —       |
| `range`                 | time range, including start time and end time. Start time must be start day of week, end time must be end day of week, the time span cannot exceed two months. | `[Date, Date]` | —       |

## Slots

| Name        | Description                                                                                                                                                                                                                                             | Type                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `date-cell` | `type` indicates which month the date belongs, optional values are prev-month, current-month, next-month; `isSelected` indicates whether the date is selected; `day` is the formatted date in the format YYYY-MM-DD; `date` is date the cell represents | `{ type: 'prev-month' \| 'current-month' \| 'next-month', isSelected: boolean, day: string, date: Date }` |
| `header`    | content of the Calendar header                                                                                                                                                                                                                          | —                                                                                                         |
