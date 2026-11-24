// Build closed lesson fixtures without changing the working tree or the open preview.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve('.');
const scratch = mkdtempSync(join(tmpdir(), 'kairos-interactive-'));
const source = 'content/interactive/request-lifecycle.json';
const marker = 'INTERACTIVE_CLOSED_MARKER_4f89aa';
const lessonUrls = ['interactive/system-design/request-lifecycle', 'en/interactive/system-design/request-lifecycle'];
const atlasSource = 'content/interactive/aase-m02/m02-01.json';
const atlas = JSON.parse(readFileSync(atlasSource, 'utf8'));
const gatedUnit = 'embeddings';
const gatedChapter = 'm02-02';
const gatedSource = 'content/aase/lessons/aase-m02-c02.json';
const canonical = JSON.parse(readFileSync(gatedSource, 'utf8'));
const atlasRoots = ['interactive/aase/m02', 'en/interactive/aase/m02'];
const atlasUrls = atlasRoots.flatMap(path => [path + '/m02-01/' + gatedUnit, path + '/' + gatedChapter]);
const chapterUrls = atlasRoots.map(path => path + '/' + gatedChapter);
const content = JSON.parse(readFileSync(source, 'utf8'));

try {
  for (const path of ['src', 'site', 'content', 'package.json', 'pnpm-lock.yaml', 'tsconfig.json', 'vite.config.ts']) {
    cpSync(join(root, path), join(scratch, path), { recursive: true });
  }
  const modules = join(root, 'node_modules');
  const localModules = join(scratch, 'node_modules');
  mkdirSync(localModules);
  for (const name of readdirSync(modules)) {
    if (name === '$app' || (name.startsWith('.') && name !== '.bin')) continue;
    symlinkSync(join(modules, name), join(localModules, name), 'dir');
  }

  for (const override of [
    { status: 'draft' },
    { status: 'published', publishedOn: '2099-01-01', revisedOn: '2099-01-01' }
  ]) {
    const fixture = {
      ...content, ...override, summary: { zh: marker, en: marker }
    };
    writeFileSync(join(scratch, source), JSON.stringify(fixture));
    const { status, publishedOn } = override;
    // A middle concept exercises the next-concept link in its published predecessor.
    const closed = atlas.map(unit => unit.slug === gatedUnit
      ? { ...unit, status, ...(publishedOn ? { publishedOn } : {}), title: { zh: marker, en: marker } }
      : unit);
    writeFileSync(join(scratch, atlasSource), JSON.stringify(closed));
    // A single closed translation must not leave reciprocal links to an unbuilt chapter.
    const translation = { ...canonical.translations.en, status, ...(publishedOn ? { publishedOn } : {}) };
    writeFileSync(join(scratch, gatedSource), JSON.stringify({
      ...canonical, translations: { ...canonical.translations, en: translation }
    }));
    const command = spawnSync('pnpm', ['run', 'build'], { cwd: scratch, encoding: 'utf8' });
    if (command.status !== 0) throw Error(command.error?.message ?? command.stdout + command.stderr);
    const build = join(scratch, 'build');
    for (const path of [...lessonUrls, ...atlasUrls]) {
      assert(!existsSync(join(build, path, 'index.html')), path);
      assert(!existsSync(join(build, path, '__data.json')), path);
    }
    for (const path of chapterUrls) assert(!existsSync(join(build, path)), 'Closed source chapter: ' + path);
    for (const path of atlasRoots) {
      const neighbor = path + '/m02-01/tokenization';
      assert(existsSync(join(build, neighbor, 'index.html')), 'Published control concept: ' + neighbor);
      const payload = readFileSync(join(build, path, 'm02-01', 'index.html'), 'utf8');
      assert(payload.includes('data-panel="position-information-01"') && !payload.includes('data-band="embeddings"'), 'Next published concept: ' + neighbor);
    }
    for (const file of readdirSync(build, { recursive: true, withFileTypes: true })) {
      if (file.isFile() && /\.(?:css|html|js|json|svg|xml)$/.test(file.name)) {
        const path = join(file.parentPath, file.name);
        const text = readFileSync(path, 'utf8');
        assert(!text.includes(marker), 'Closed content marker found in ' + path);
        if (/\.(?:html|json|xml)$/.test(file.name)) {
          for (const closedPath of [...lessonUrls, ...atlasUrls]) {
            assert(!text.includes('/' + closedPath + '/'), 'Closed route ' + closedPath + ' found in ' + path);
          }
        }
      }
    }
    console.log(`PASS: ${override.status === 'draft' ? 'Draft' : 'Future-dated'} networking lesson, AASE concept and chapter with a closed source translation excluded from public output.`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
