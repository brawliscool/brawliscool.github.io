import {readdir} from 'node:fs/promises';
import sharp from 'sharp';

const directory = new URL('../images/', import.meta.url);
for (const name of await readdir(directory)) {
  if (!name.endsWith('.webp')) continue;
  for (const width of [480, 800]) {
    await sharp(new URL(name, directory).pathname)
      .resize({width, withoutEnlargement: true})
      .avif({quality: 55, effort: 6})
      .toFile(new URL(`${name.slice(0, -5)}-${width}.avif`, directory).pathname);
  }
}
