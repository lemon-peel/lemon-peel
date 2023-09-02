import { withInstall } from '@lemon-peel/utils';
import Autocomplete from './src/AutoComplete.vue';

export const LpAutocomplete = withInstall(Autocomplete);

export default LpAutocomplete;

export * from './src/autoComplete';

export type AutocompleteInst = InstanceType<typeof Autocomplete>;
