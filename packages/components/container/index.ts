import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Container from './src/Container.vue';
import Aside from './src/Aside.vue';
import Footer from './src/Footer.vue';
import Header from './src/Header.vue';
import Main from './src/Main.vue';

export const LpContainer = withInstall(Container, {
  Aside,
  Footer,
  Header,
  Main,
});

export default LpContainer;
export const LpAside = withNoopInstall(Aside);
export const LpFooter = withNoopInstall(Footer);
export const LpHeader = withNoopInstall(Header);
export const LpMain = withNoopInstall(Main);

export type ContainerInstance = InstanceType<typeof Container>;
export type AsideInstance = InstanceType<typeof Aside>;
export type FooterInstance = InstanceType<typeof Footer>;
export type HeaderInstance = InstanceType<typeof Header>;
export type MainInstance = InstanceType<typeof Main>;
