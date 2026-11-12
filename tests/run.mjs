#!/usr/bin/env node
// Replays steps through check.mjs. Each case builds a fresh git repository:
// the parent version committed as the Relay's committer (as the platform
// does), the step written on top, then `node check.mjs`. The verdict and the
// message must match the case.
//
//   node tests/run.mjs            every case
//   node tests/run.mjs nvidia     the cases whose name contains "nvidia"
//   node tests/run.mjs -v         also prints the check's output of passing cases

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CASES } from './cases.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const CHECK = join(HERE, '..', 'check.mjs')

function run(c) {
  const dir = mkdtempSync(join(tmpdir(), 'newsroom-'))
  try {
    const g = (args, env = {}) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } })
    const sync = tree => {
      for (const p of g(['ls-files', '-co', '--exclude-standard', '-z']).split('\0').filter(Boolean)) if (!tree.has(p)) rmSync(join(dir, p))
      for (const [p, v] of tree) {
        mkdirSync(dirname(join(dir, p)), { recursive: true })
        writeFileSync(join(dir, p), v)
      }
    }
    g(['init', '-q', '-b', 'main'])
    for (const [k, tree] of c.parents.entries()) {
      sync(tree)
      g(['add', '-A'])
      // The first commit is the owner's base; the platform commits every step as relay@.
      const who = k === 0 && c.parents.length > 1 ? 'owner@example.com' : c.ownerParent ? 'owner@example.com' : 'relay@llmtimemachine.com'
      g(['-c', 'user.name=Test', '-c', `user.email=${who}`, 'commit', '-q', '--allow-empty', '-m', `parent ${k}`], { GIT_COMMITTER_EMAIL: who, GIT_AUTHOR_EMAIL: who })
    }
    sync(c.child)
    if (c.fs) c.fs(dir)
    const r = spawnSync(process.execPath, [CHECK, ...(c.args || [])], { cwd: dir, encoding: 'utf8', env: { ...process.env, NEWSROOM_TODAY: c.today, NEWSROOM_BASE: '' } })
    const out = `${r.stdout}${r.stderr}`
    const pass = r.status === 0
    let ok
    if (c.expect === 'OK') ok = pass && /^OK/m.test(out)
    else if (c.expect instanceof RegExp) ok = !pass && c.expect.test(out)
    else ok = c.expect(out, pass)
    return { ok, out }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const args = process.argv.slice(2)
const verbose = args.includes('-v')
const filter = args.find(a => !a.startsWith('-'))
let failed = 0
let count = 0
for (const c of CASES) {
  if (filter && !c.name.includes(filter)) continue
  count++
  let res
  try { res = run(c) } catch (e) { res = { ok: false, out: String(e.stack || e) } }
  if (!res.ok) failed++
  console.log(`${res.ok ? 'pass' : 'FAIL'}  ${c.name}`)
  if (!res.ok || verbose) console.log(res.out.trimEnd().split('\n').map(l => `      ${l}`).join('\n'))
}
console.log(`\n${count - failed}/${count} cases pass`)
process.exitCode = failed ? 1 : 0
