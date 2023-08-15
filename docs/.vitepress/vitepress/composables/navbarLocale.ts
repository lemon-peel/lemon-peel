import { computed } from 'vue';
import { useLang } from './lang';

export function useNavbarLocale() {
  const lang = useLang();

  return computed<Record<string, string>>(() => (({})[lang.value] || {}));
}
