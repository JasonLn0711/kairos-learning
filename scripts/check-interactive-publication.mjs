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
    const command = spawnSync('pnpm', ['run', 'build'], { cwd: scratch, encoding: 'utf8' });
    if (command.status !== 0) throw Error(command.error?.message ?? command.stdout + command.stderr);
    const build = join(scratch, 'build');
    for (const path of lessonUrls) {
      assert(!existsSync(join(build, path, 'index.html')), path);
      assert(!existsSync(join(build, path, '__data.json')), path);
    }
    for (const file of ['interactive/index.html', 'en/interactive/index.html', 'search-index.json', 'sitemap.xml']) {
      const text = readFileSync(join(build, file), 'utf8');
      for (const path of lessonUrls) assert(!text.includes('/'+path+'/'), file);
    }
    for (const file of readdirSync(build, { recursive: true, withFileTypes: true })) {
      if (file.isFile() && /\.(?:css|html|js|json|svg|xml)$/.test(file.name)) {
        assert(!readFileSync(join(file.parentPath, file.name)).includes(marker), file.name);
      }
    }
    console.log(`PASS: ${override.status === 'draft' ? 'Draft' : 'Future-dated'} interactive lesson excluded from pages, metadata, search and public assets.`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
