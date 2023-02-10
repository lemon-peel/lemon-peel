import type { InjectionKey } from 'vue';
import type LpTable from './table/Table.vue';

export const TABLE_INJECTION_KEY: InjectionKey<InstanceType<typeof LpTable>> = Symbol('LpTable');
