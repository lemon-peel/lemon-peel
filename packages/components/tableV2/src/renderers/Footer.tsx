import type { CSSProperties, FunctionalComponent } from 'vue';

type FooterRendererProps = {
  class?: any;
  style: CSSProperties;
};

const Footer: FunctionalComponent<FooterRendererProps> = (props, { slots }) => {
  return (
    <div class={props.class} style={props.style}>
      {slots.default?.()}
    </div>
  );
};

Footer.displayName = 'LpTableV2Footer';

export default Footer;
