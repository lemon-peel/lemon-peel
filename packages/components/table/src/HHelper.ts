import { defineComponent, h } from 'vue';

export const HColGroup = defineComponent({
  name: 'HColGroup',
  props: {
    columns: { type: Array, required: true },
    tableLayout: { type: String, required: true },
  },
  setup(props) {
    const isAuto = props.tableLayout === 'auto';
    let columns = props.columns || [];
    if (isAuto && columns.every(column => column.width === undefined)) {
      columns = [];
    }
    const getPropsData = column => {
      const propsData = {
        key: `${props.tableLayout}_${column.id}`,
        style: {},
        name: undefined,
      };
      if (isAuto) {
        propsData.style = {
          width: `${column.width}px`,
        };
      } else {
        propsData.name = column.id;
      }
      return propsData;
    };

    return h(
      'colgroup',
      {},
      columns.map(column => h('col', getPropsData(column))),
    );
  },
});
