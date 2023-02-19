import type { InjectionKey } from 'vue';

import type { TableVM } from './table/defaults';
import type { Store } from './store';

export const TABLE_INJECTION_KEY: InjectionKey<TableVM> = Symbol('LpTable');
export const STORE_INJECTION_KEY: InjectionKey<Store> = Symbol('LpTableStore');
