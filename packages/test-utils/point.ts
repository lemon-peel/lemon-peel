import { describe, test, bench } from 'vitest';

export function useTest(prefix = '#') {
  let count = 1;

  const apply: ProxyHandler<any>['apply'] = (target, thisArg, args) => {
    const [name] = args;
    args[0] = `${prefix}${(100 + count++).toString().slice(1)}: ${name}`;
    Reflect.apply(target, thisArg, args);
  };

  const getter: ProxyHandler<any>['get'] = (target, name) => {
    const res = Reflect.get(target, name);
    if (typeof res === 'function') {
      if (name !== 'each')
        return new Proxy(res, { apply });

      return new Proxy(res, {
        apply(target, thisArg, args) {
          const res = Reflect.apply(target, thisArg, args);
          return new Proxy(res, { apply });
        },
      });
    }
    return res;
  };

  return {
    describe: new Proxy(describe, {
      apply,
      get: getter,
    }),
    test: new Proxy(test, {
      apply,
      get: getter,
    }),
    bench: new Proxy(bench, {
      apply,
      get: getter,
    }),
  };
}

