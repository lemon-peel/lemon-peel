import { defineComponent, getCurrentInstance, nextTick } from 'vue';
import { LpOption } from '@lemon-peel/components/select';

const component = defineComponent({
  extends: LpOption,
  setup(props, ctx) {
    const result = (LpOption.setup as NonNullable<any>)(props, ctx);

    const vm = (getCurrentInstance() as NonNullable<any>).proxy;

    result.selectOptionClick = () => {
      // $el.parentElement => lp-tree-node__content
      vm.$el.parentElement.click();
    };

    // Fix: https://github.com/element-plus/element-plus/issues/7917
    // `el-option` will delete the cache before unmount,
    // This is normal for flat arrays `<lp-select><lp-option v-for="3"></lp-select>`,
    // Because the same node key does not create a difference node,
    // But in tree data, the same key at different levels will create diff nodes,
    // So the destruction of `el-option` in `nextTick` will be slower than
    // the creation of new `el-option`, which will delete the new node,
    // here restore the deleted node.
    // @link https://github.com/element-plus/element-plus/blob/6df6e49db07b38d6cc3b5e9a960782bd30879c11/packages/components/select/src/option.vue#L78
    nextTick(() => {
      if (!result.select.options.get(vm.value)) {
        result.select.onOptionCreate(vm);
      }
    });

    return result;
  },
});

export default component;
