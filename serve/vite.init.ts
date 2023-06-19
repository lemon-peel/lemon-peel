import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const btn = 'src/Button.vue';
const example = 'template.vue';

if (!existsSync(btn)) {
  writeFileSync(btn, readFileSync(example));
}
