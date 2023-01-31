import type { SimpleFunctionalComponent } from '../types';

const Overlay: SimpleFunctionalComponent = (properties, { slots }) => {
  return (
    <div class={properties.class} style={properties.style}>
      {slots.default?.()}
    </div>
  );
};

Overlay.displayName = 'LpTableV2Overlay';

export default Overlay;
