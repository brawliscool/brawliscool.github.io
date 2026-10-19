import {readFile, writeFile} from 'node:fs/promises';
import {transform} from 'lightningcss';

// Checked-in output keeps GitHub Pages deployable without a server-side build.
for (const name of ['style', 'legal', 'receptionist']) {
  const source = new URL(`../src/css/${name}.css`, import.meta.url);
  const {code} = transform({
    filename: `${name}.css`,
    code: await readFile(source),
    minify: true,
    targets: {safari: (16 << 16) | (4 << 8), chrome: 110 << 16, firefox: 110 << 16},
  });
  await writeFile(new URL(`../css/${name}.css`, import.meta.url), code);
}
