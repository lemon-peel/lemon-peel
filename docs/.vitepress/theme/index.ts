import LemonPeel from 'lemon-peel';

import VPApp, { NotFound, globals } from '../vitepress';
import { define } from '../utils/types';
// eslint-disable-next-line import/no-unresolved
import 'uno.css';
import './style.css';
import type { Theme } from 'vitepress';

export default define<Theme>({
  NotFound,
  Layout: VPApp,
  enhanceApp: ({ app }) => {
    app.use(LemonPeel);

    globals.forEach(([name, Comp]) => {
      app.component(name, Comp);
    });
  },
});
