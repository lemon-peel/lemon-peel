import { withInstall, withNoopInstall } from '@lemon-peel/utils';
import Form from './src/Form.vue';
import FormItem from './src/FormItem.vue';

export const LpForm = withInstall(Form, {
  FormItem,
});
export default LpForm;
export const LpFormItem = withNoopInstall(FormItem);

export * from './src/form';
export * from './src/formItem';
export * from './src/types';

export type FormInstance = InstanceType<typeof Form>;
export type FormItemInstance = InstanceType<typeof FormItem>;
