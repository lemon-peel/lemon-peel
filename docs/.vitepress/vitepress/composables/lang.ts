import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { defaultLang } from '../constant';

export const useLang = () => {
  const route = useRoute();
  return computed(() => {
    // the first part of the first slash
    const path = route.data?.relativePath;
    const lang: string = path?.includes('/') ? path.split('/').shift()! || defaultLang : defaultLang;
    return lang;
  });
};
