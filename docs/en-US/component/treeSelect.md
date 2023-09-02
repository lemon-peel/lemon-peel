---
title: TreeSelect
lang: en-US
---

# TreeSelect

The tree selector of the dropdown menu,
it combines the functions of components `el-tree` and `el-select`.

## Basic usage

Selector for tree structures.

:::demo

treeSelect/Basic

:::

:::tip

Since `render-after-expand` defaults to `true`,
the selected label name may not be displayed when echoing,
you can set it to `false` to display the correct name.

:::

## Select any level

When using the `check-strictly=true` attribute, any node can be checked,
otherwise only leaf nodes are supported.

:::demo

treeSelect/CheckStrictly

:::

:::tip

When using `show-checkbox`, since `check-on-click-node` is false by default,
it can only be selected by checking, you can set it to true,
and then click the node to select.

:::

## Multiple Selection

Multiple selection using clicks or checkbox.

:::demo

treeSelect/Multiple

:::

## Disabled Selection

Disable options using the disabled field.

:::demo

treeSelect/Disabled

:::

## Filterable

Use keyword filtering or custom filtering methods.
`filterMethod` can custom filter method for data,
`filterNodeMethod` can custom filter method for data node.

:::demo

treeSelect/Filterable

:::

## Custom content

Contents of custom tree nodes.

:::demo

treeSelect/Slots

:::

## LazyLoad

Lazy loading of tree nodes, suitable for large data lists.

:::demo

treeSelect/Lazy

:::

## Attributes

Since this component combines the functions of components `el-tree` and `el-select`,
the original properties have not been changed, so no repetition here,
and please go to the original component to view the documentation.

| Attributes                              | Methods                       | Events                              | Slots                              |
| --------------------------------------- | ----------------------------- | ----------------------------------- | ---------------------------------- |
| [tree](./tree.md#attributes)            | [tree](./tree.md#method)      | [tree](./tree.md#events)            | [tree](./tree.md#slots)            |
| [select](./select.md#select-attributes) | [select](./select.md#methods) | [select](./select.md#select-events) | [select](./select.md#select-slots) |
