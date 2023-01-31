import { computed, provide, ref, watch } from 'vue';
import { ensureArray } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { collapseContextKey } from '@lemon-peel/tokens';

import type { SetupContext } from 'vue';
import type { CollapseActiveName, CollapseEmits, CollapseProps } from './collapse';

export const useCollapse = (
  props: CollapseProps,
  emit: SetupContext<CollapseEmits>['emit'],
) => {
  const activeNames = ref(ensureArray(props.modelValue));

  const setActiveNames = (_activeNames: CollapseActiveName[]) => {
    activeNames.value = _activeNames;
    const value = props.accordion ? activeNames.value[0] : activeNames.value;
    emit(UPDATE_MODEL_EVENT, value);
    emit(CHANGE_EVENT, value);
  };

  const handleItemClick = (name: CollapseActiveName) => {
    if (props.accordion) {
      setActiveNames([activeNames.value[0] === name ? '' : name]);
    } else {
      const names = [...activeNames.value];
      const index = names.indexOf(name);

      if (index > -1) {
        names.splice(index, 1);
      } else {
        names.push(name);
      }
      setActiveNames(names);
    }
  };

  watch(
    () => props.modelValue,
    () => (activeNames.value = ensureArray(props.modelValue)),
    { deep: true },
  );

  provide(collapseContextKey, {
    activeNames,
    handleItemClick,
  });
  return {
    activeNames,
    setActiveNames,
  };
};

export const useCollapseDOM = () => {
  const ns = useNamespace('collapse');

  const rootKls = computed(() => ns.b());
  return {
    rootKls,
  };
};
