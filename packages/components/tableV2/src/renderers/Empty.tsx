import LpEmpty from '@lemon-peel/components/empty';
import type { CSSProperties, FunctionalComponent } from 'vue';

type EmptyRendererProps = {
  class?: any;
  style?: CSSProperties;
};

const Footer: FunctionalComponent<EmptyRendererProps> = (props, { slots }) => {
  return (
    <div class={props.class} style={props.style}>
      {slots.default ? slots.default() : <LpEmpty />}
    </div>
  );
};

Footer.displayName = 'LpTableV2Empty';

export default Footer;
