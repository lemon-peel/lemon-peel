import { HeaderRow } from '../components';
import { tryCall } from '../utils';

import type { FunctionalComponent } from 'vue';
import type { CssNamespace } from '@lemon-peel/hooks';
import type { TableV2HeaderRendererParams } from '../components';
import type { TableV2Props } from '../table';

type HeaderRendererProps = TableV2HeaderRendererParams &
Pick<TableV2Props, 'headerClass' | 'headerProps'> & {
  ns: CssNamespace;
};

const HeaderRenderer: FunctionalComponent<HeaderRendererProps> = (
  {
    columns,
    columnsStyles,
    headerIndex,
    style,
    // derived from root
    headerClass,
    headerProps,

    ns,
  },
  { slots },
) => {
  const parameter = { columns, headerIndex };

  const kls = [
    ns.e('header-row'),
    tryCall(headerClass, parameter, ''),
    {
      // [ns.is('resizing')]: Boolean(resizingKey),
      [ns.is('customized')]: Boolean(slots.header),
    },
  ];

  const extraProps = {
    ...tryCall(headerProps, parameter),
    columnsStyles,
    class: kls,
    columns,
    headerIndex,
    style,
  };

  return <HeaderRow {...extraProps}>{slots}</HeaderRow>;
};

export default HeaderRenderer;
