import { inject } from 'vue';
import { elPaginationKey } from '@lemon-peel/tokens';

export const usePagination = () => inject(elPaginationKey, {});
