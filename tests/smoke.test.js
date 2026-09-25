import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('project metadata is identified as Celestia', () => {
  assert.equal(packageJson.name, 'celestia');
});

test('required application entry points exist', () => {
  assert.equal(existsSync(new URL('../index.html', import.meta.url)), true);
  assert.equal(existsSync(new URL('../src/main.tsx', import.meta.url)), true);
  assert.equal(existsSync(new URL('../src/App.tsx', import.meta.url)), true);
});
