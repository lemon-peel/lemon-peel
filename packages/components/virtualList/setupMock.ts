
import defineGetter from '@lemon-peel/test-utils/defineGetter';

export default () => {
  const clientWidth = defineGetter(
    HTMLElement.prototype,
    'clientWidth',
    function (this: HTMLElement) {
      return Number.parseInt(this.style.width, 10) || 0;
    },
    0,
  );

  const clientHeight = defineGetter(
    HTMLElement.prototype,
    'clientHeight',
    function (this: HTMLElement) {
      return Number.parseInt(this.style.height, 10) || 0;
    },
    0,
  );

  const scrollHeight = defineGetter(
    HTMLElement.prototype,
    'scrollHeight',
    () => {
      return Number.MAX_SAFE_INTEGER;
    },
    0,
  );

  const scrollWidth = defineGetter(
    HTMLElement.prototype,
    'scrollWidth',
    () => {
      return Number.MAX_SAFE_INTEGER;
    },
    0,
  );

  // clean up function
  return () => {
    clientWidth();
    clientHeight();
    scrollHeight();
    scrollWidth();
  };
};
