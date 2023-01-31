import { makeInstaller } from './makeInstaller';
import Components from './component';
import Plugins from './plugin';

export default makeInstaller([...Components, ...Plugins]);
