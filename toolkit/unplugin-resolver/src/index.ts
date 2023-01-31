import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from 'unplugin-vue-components';
import { compare } from 'compare-versions';
import { kebabCase } from 'unplugin-vue-components';
import { getPackageInfo, isPackageExists } from 'local-pkg';

export async function getPkgVersion(pkgName: string, defaultVersion: string): Promise<string> {
  try {
    const isExist = isPackageExists(pkgName);
    if (isExist) {
      const pkg = await getPackageInfo(pkgName);
      return pkg?.version ?? defaultVersion;
    } else {
      return defaultVersion;
    }
  } catch (err) {
    console.error(err);
    return defaultVersion;
  }
}

export interface LemonPeelResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * use commonjs lib & source css or scss for ssr
   */
  ssr?: boolean

  /**
   * specify lemon-peel version to load style
   *
   * @default installed version
   */
  version?: string

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp

  /**
   * a list of component names that have no styles, so resolving their styles file should be prevented
   */
  noStylesComponents?: string[]
}

type LemonPeelResolverOptionsResolved = Required<Omit<LemonPeelResolverOptions, 'exclude'>> &
Pick<LemonPeelResolverOptions, 'exclude'>;

/**
 * @deprecated
 * @param partialName
 * @param options
 *
 * @returns
 */
function getSideEffectsLegacy(
  partialName: string,
  options: LemonPeelResolverOptionsResolved,
): SideEffectsInfo | undefined {
  const { importStyle } = options;
  if (!importStyle)
    return;

  if (importStyle === 'sass') {
    return [
      'lemon-peel/packages/theme-chalk/src/base.scss',
      `lemon-peel/packages/theme-chalk/src/${partialName}.scss`,
    ];
  } else if (importStyle === true || importStyle === 'css') {
    return [
      'lemon-peel/lib/theme-chalk/base.css',
      `lemon-peel/lib/theme-chalk/el-${partialName}.css`,
    ];
  }
}

function getSideEffects(dirName: string, options: LemonPeelResolverOptionsResolved): SideEffectsInfo | undefined {
  const { importStyle, ssr } = options;
  const themeFolder = 'lemon-peel/theme-chalk';
  const esComponentsFolder = 'lemon-peel/es/components';

  if (importStyle === 'sass')
    return ssr ? `${themeFolder}/src/${dirName}.scss` : `${esComponentsFolder}/${dirName}/style/index`;
  else if (importStyle === true || importStyle === 'css')
    return ssr ? `${themeFolder}/el-${dirName}.css` : `${esComponentsFolder}/${dirName}/style/css`;
}

function resolveComponent(name: string, options: LemonPeelResolverOptionsResolved): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return;

  if (!name.match(/^El[A-Z]/))
    return;

  if (name.match(/^ElIcon.+/)) {
    return {
      name: name.replace(/^ElIcon/, ''),
      from: '@element-plus/icons-vue',
    };
  }

  const partialName = kebabCase(name.slice(2));// LpTableColumn -> table-column
  const { ssr } = options;

  return {
    name,
    from: `lemon-peel/${ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(partialName, options),
  };
}

function resolveDirective(name: string, options: LemonPeelResolverOptionsResolved): ComponentInfo | undefined {
  if (!options.directives)
    return;

  const directives: Record<string, { importName: string; styleName: string }> = {
    Loading: { importName: 'LpLoadingDirective', styleName: 'loading' },
    Popover: { importName: 'LpPopoverDirective', styleName: 'popover' },
    InfiniteScroll: { importName: 'LpInfiniteScroll', styleName: 'infinite-scroll' },
  };

  const directive = directives[name];
  if (!directive)
    return;

  const { version, ssr } = options;

  if (compare(version, '1.0.0', '>=')) {
    return {
      name: directive.importName,
      from: `lemon-peel/${ssr ? 'lib' : 'es'}`,
      sideEffects: getSideEffects(directive.styleName, options),
    };
  }

  return {
    name: directive.importName,
    from: `lemon-peel/${ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(directive.styleName, options),
  };
}

const noStylesComponents = ['LpAutoResizer'];

/**
 * Resolver for Lemon Peel
 */
export function index(userOpt: LemonPeelResolverOptions = {}): ComponentResolver[] {
  let optionsResolved: LemonPeelResolverOptionsResolved;

  async function resolveOptions() {
    if (optionsResolved)
      return optionsResolved;
    optionsResolved = {
      ssr: false,
      version: await getPkgVersion('lemon-peel', '1.0.0'),
      importStyle: 'css',
      directives: true,
      exclude: undefined,
      noStylesComponents: userOpt.noStylesComponents || [],
      ...userOpt,
    };
    return optionsResolved;
  }

  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        const options = await resolveOptions();

        if ([...options.noStylesComponents, ...noStylesComponents].includes(name))
          return resolveComponent(name, { ...options, importStyle: false });
        else return resolveComponent(name, options);
      },
    },
    {
      type: 'directive',
      resolve: async (name: string) => {
        return resolveDirective(name, await resolveOptions());
      },
    },
  ];
}

export default index;