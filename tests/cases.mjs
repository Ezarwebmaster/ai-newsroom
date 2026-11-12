// The replay cases of check.mjs. A case is a parent version (one commit, or a
// chain of them), a step written on top (the child tree), the date of the
// check, and the verdict: 'OK', or a pattern the FAIL output must match.
//
// Trees come from the fixtures: tests/fixtures/<fixture>/<NN-step>/ holds the
// files a step wrote; the tree after a step is the base plus every step up to it.

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, rmSync, statSync, symlinkSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const BASE = {
  'state.json': '{ "contract": 1, "cycle": null, "next": "scout", "post": null, "history": [] }\n',
  'README.md': '# AI Newsroom (test copy)\n',
}

function readDir(dir, prefix = '', out = new Map()) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) readDir(p, `${prefix}${name}/`, out)
    else out.set(`${prefix}${name}`, readFileSync(p, 'utf8'))
  }
  return out
}
export function treeAt(fixture, step) {
  const tree = new Map(Object.entries(BASE))
  if (!step) return tree
  const steps = readdirSync(join(FIXTURES, fixture)).sort()
  if (!steps.includes(step)) throw new Error(`no step ${step} in fixture ${fixture}`)
  for (const s of steps) {
    for (const [p, v] of readDir(join(FIXTURES, fixture, s))) tree.set(p, v)
    if (s === step) break
  }
  return tree
}

export const CASES = []
const W = 'week46'
// parent: a step name (or null for the base); step: the step written on top
// (null: nothing changed); edit(tree): changes the child before the check.
function add(name, { parent, step, edit, today = '2026-11-12', ...rest }) {
  const parentTree = treeAt(W, parent)
  const child = step === null ? new Map(parentTree) : treeAt(W, step)
  if (edit) edit(child, parentTree)
  CASES.push({ name, parents: [parentTree], child, today, ...rest })
}

// ── The Nvidia cycle (2026-11-12) ──
add('nvidia: nothing changed on the base', { parent: null, step: null, expect: 'OK' })
add('nvidia: scout', { parent: null, step: '01-scout', expect: 'OK' })
add('nvidia: editor', { parent: '01-scout', step: '02-editor', expect: 'OK' })
add('nvidia: writer', { parent: '02-editor', step: '03-writer', expect: 'OK' })
add('nvidia: reviser', { parent: '03-writer', step: '04-reviser', expect: 'OK' })
add('nvidia: checker', { parent: '04-reviser', step: '05-checker', expect: 'OK' })

// ── The Gemini cycle (2026-11-13), after the Nvidia one ──
add('gemini: scout', { parent: '05-checker', step: '06-scout', today: '2026-11-13', expect: 'OK' })
add('gemini: editor', { parent: '06-scout', step: '07-editor', today: '2026-11-13', expect: 'OK' })
add('gemini: writer', { parent: '07-editor', step: '08-writer', today: '2026-11-13', expect: 'OK' })
add('gemini: reviser', { parent: '08-writer', step: '09-reviser', today: '2026-11-13', expect: 'OK' })
add('gemini: checker', { parent: '09-reviser', step: '10-checker', today: '2026-11-14', expect: 'OK' })

// ── The recap of week 46, on Sunday 2026-11-15 ──
add('recap: written on the Sunday', { parent: '10-checker', step: '11-recap', today: '2026-11-15', expect: 'OK' })

/* ── Faults: every rule must refuse, with a clear message ── */

const NVP = 'posts/2026-11-12-nvidia-ceo-transition'
const GEP = 'posts/2026-11-13-google-gemini-decision-1'
const RCP = 'posts/2026-11-15-week-46-recap'
const T1 = 'editions/2026-11-12/topics.json'
const C1 = 'editions/2026-11-12/choice.json'
function json(t, p, fn) {
  const v = JSON.parse(t.get(p))
  const r = fn(v)
  t.set(p, `${JSON.stringify(r === undefined ? v : r, null, 2)}\n`)
}
function sub(t, p, a, b) {
  const s = t.get(p)
  if (!s.includes(a)) throw new Error(`case edit: "${a}" is not in ${p}`)
  t.set(p, s.replace(a, b))
}
const lineOf = (t, p, text) => t.get(p).split('\n').findIndex(l => l.includes(text)) + 1
function addParent(name, c) { // the parent is edited too (editParent), the child is built on that parent
  const { parent, step, editParent, edit, today = '2026-11-12', ...rest } = c
  const parentTree = treeAt(W, parent)
  editParent(parentTree)
  const child = step === null ? new Map(parentTree) : treeAt(W, step)
  if (edit) edit(child, parentTree)
  CASES.push({ name, parents: [parentTree], child, today, ...rest })
}

// ── scout ──
const scout = (name, edit, expect, extra = {}) => add(`scout: ${name}`, { parent: null, step: '01-scout', edit, expect, ...extra })
scout('the cycle is older than yesterday', null, /the cycle is today \(2026-11-14\) or yesterday/, { today: '2026-11-14' })
scout('two topics', t => json(t, T1, v => { v.topics.pop() }), /exactly 3 topics/)
scout('sources from one site', t => json(t, T1, v => { v.topics[1].sources[1].url = 'https://decrypt.co/383000/anthropic-ipo-explained' }), /topic 2: the sources come from at least 2 different sites/)
scout('stale sources', t => json(t, T1, v => { for (const s of v.topics[2].sources) s.published = '2026-10-01' }), /topic 3: at least 2 sources published between 2026-11-09 and 2026-11-13/)
scout('a social network as a source', t => json(t, T1, v => { v.topics[1].sources[0].url = 'https://x.com/AnthropicAI/status/1988' }), /x\.com: aggregators/)
scout('a news aggregator as a source', t => json(t, T1, v => { v.topics[1].sources[0].url = 'https://news.google.com/articles/CBMi' }), /news\.google\.com: aggregators/)
scout('an http source', t => json(t, T1, v => { v.topics[1].sources[0].url = 'http://decrypt.co/382939/x' }), /must start with https/)
scout('an unknown key', t => json(t, T1, v => { v.topics[0].score = 9 }), /unknown key "score"/)
scout('a summary of 70 words', t => json(t, T1, v => { v.topics[0].summary = 'word '.repeat(70).trim() }), /"summary" has at most 60 words/)
scout('a wrong state.json', t => json(t, 'state.json', v => { v.next = 'writer' }), /state\.json: must be exactly/)
scout('edits the README', t => t.set('README.md', '# Hacked\n'), /README\.md: is not a file the scout writes/)
scout('deletes the README', t => t.delete('README.md'), /README\.md: was deleted/)
scout('two cycles at once', t => t.set('editions/2026-11-11/topics.json', t.get(T1)), /writes one file/)
scout('the parent is the owner\'s base commit', null, 'OK', { ownerParent: true })
add('scout: a story already covered', { parent: '05-checker', step: '06-scout', today: '2026-11-13',
  edit: t => json(t, 'editions/2026-11-13/topics.json', v => { v.topics[2].sources[0].url = 'https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm' }),
  expect: /primary source of 2026-11-12-nvidia-ceo-transition, already covered/ })
add('scout: a follow-up of a covered story', { parent: '05-checker', step: '06-scout', today: '2026-11-13',
  edit: t => json(t, 'editions/2026-11-13/topics.json', v => { v.topics[2].sources[0].url = 'https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm'; v.topics[2].follow_up_of = '2026-11-12-nvidia-ceo-transition' }),
  expect: 'OK' })
add('scout: a follow-up of an unknown story', { parent: '05-checker', step: '06-scout', today: '2026-11-13',
  edit: t => json(t, 'editions/2026-11-13/topics.json', v => { v.topics[2].follow_up_of = '2026-11-01-nothing' }),
  expect: /"follow_up_of" is null, or the id of a finished story/ })
add('scout: the cycle is not after the last one', { parent: '05-checker', step: '06-scout', today: '2026-11-13',
  edit: t => { const v = t.get('editions/2026-11-13/topics.json'); t.delete('editions/2026-11-13/topics.json'); t.set('editions/2026-11-12/topics.json', v.replace('"cycle": "2026-11-13"', '"cycle": "2026-11-12"')); json(t, 'state.json', s => { s.cycle = '2026-11-12' }) },
  expect: /the cycle comes after the last one/ })

// ── the recap's calendar ──
const sundayScout = (date, published) => t => {
  const v = JSON.parse(treeAt(W, '06-scout').get('editions/2026-11-13/topics.json'))
  v.cycle = date
  for (const x of v.topics) for (const s of x.sources) s.published = published
  v.topics[0].sources[0].url = 'https://blog.google/technology/ai/gemini-decision-1-one-week-later/'
  t.set(`editions/${date}/topics.json`, `${JSON.stringify(v, null, 2)}\n`)
  json(t, 'state.json', s => { s.cycle = date; s.next = 'editor'; s.post = null })
}
add('calendar: a new cycle on Sunday before the recap', { parent: '10-checker', step: null, today: '2026-11-15', edit: sundayScout('2026-11-15', '2026-11-14'), expect: /the recap of week 46 \(2026-11-15-week-46-recap\) comes before a new cycle/ })
add('calendar: a new cycle on Monday before the recap', { parent: '10-checker', step: null, today: '2026-11-16', edit: sundayScout('2026-11-16', '2026-11-15'), expect: /recap of week 46/ })
add('calendar: a new cycle on Monday after the recap', { parent: '11-recap', step: null, today: '2026-11-16', edit: sundayScout('2026-11-16', '2026-11-15'), expect: 'OK' })
add('calendar: a new cycle on Tuesday without a recap', { parent: '10-checker', step: null, today: '2026-11-17', edit: sundayScout('2026-11-17', '2026-11-16'), expect: 'OK' })
add('calendar: the recap checked on Tuesday', { parent: '10-checker', step: '11-recap', today: '2026-11-17', expect: 'OK' })
add('calendar: the recap on Wednesday', { parent: '10-checker', step: '11-recap', today: '2026-11-18', expect: /no weekly recap is due now/ })
add('calendar: --todo on Sunday asks for the recap', { parent: '10-checker', step: null, today: '2026-11-15', args: ['--todo'], expect: (out, pass) => pass && /YOUR ROLE: RECAP/.test(out) && /2026-11-15-week-46-recap/.test(out) })

// ── recap ──
const recap = (name, edit, expect) => add(`recap: ${name}`, { parent: '10-checker', step: '11-recap', today: '2026-11-15', edit, expect })
recap('covers only one story', t => json(t, `${RCP}/meta.json`, v => { v.covers.pop() }), /"covers" is \["2026-11-12-nvidia-ceo-transition","2026-11-13-google-gemini-decision-1"\]/)
recap('four sections', t => sub(t, `${RCP}/article.md`, t.get(`${RCP}/article.md`).match(/## Decision models[\s\S]*?\n\n(?=<!-- watch)/)[0], ''), /5 to 7 "## " sections before <!-- watch --> \(it has 4\)/)
recap('no watch line', t => sub(t, `${RCP}/article.md`, '<!-- watch -->\n', ''), /<!-- watch --> right before its last/)
recap('an add marker', t => sub(t, `${RCP}/article.md`, 'It costs $0.10 per million input tokens, and output tokens are free.[^2]', '<!-- add role="reviser" model="X" -->\nIt costs $0.10 per million input tokens, and output tokens are free.[^2]\n<!-- /add -->'), /no add markers/)
recap('a link to a post that does not exist', t => sub(t, `${RCP}/article.md`, '[[post:2026-11-13-google-gemini-decision-1]]', '[[post:2026-11-13-google-gemini-decision-2]]'), /\[\[post:2026-11-13-google-gemini-decision-2\]\] is not a post/)
recap('a section of 20 words', t => sub(t, `${RCP}/article.md`, '\nChief financial officer Colette Kress is interim CEO until the board names a permanent successor.[^1]\nNvidia gave no reason, while CNN and other outlets linked the exit to earlier reports that a woman close to Huang was allegedly working for China.[^7]', ''), /a recap section has 40 to 120 words \(this one has \d+\)/)
recap('corrections.json is not empty', t => t.set(`${RCP}/corrections.json`, '[{}]\n'), /is \[\] for the recap/)

// ── editor ──
const editor = (name, edit, expect) => add(`editor: ${name}`, { parent: '01-scout', step: '02-editor', edit, expect })
const MP = `${NVP}/meta.json`
editor('the trend reuses a source of the topic', t => json(t, C1, v => { v.trend[0].url = 'https://techcrunch.com/2026/11/12/nvidias-jensen-huang-resigns-chipmaker-names-cfo-colette-kress-as-interim-ceo/' }), /already a source of the topic/)
editor('the trend on two sites', t => json(t, C1, v => { v.trend[2].url = 'https://edition.cnn.com/2026/11/12/tech/nvidia-ceo-what-next' }), /at least 3 articles from 3 different sites/)
editor('a stale trend article', t => json(t, C1, v => { v.trend[1].published = '2026-11-01' }), /trend 2: "published" is a date between 2026-11-09 and 2026-11-13/)
editor('a primary source outside the topic', t => json(t, MP, v => { v.primary_source = 'https://nvidianews.nvidia.com/news/nvidia-announces-ceo-transition' }), /"primary_source" is one of the URLs of topic 1/)
editor('a tag that is not allowed', t => json(t, MP, v => { v.tags = ['nvidia', 'ai'] }), /the tag "ai" is not allowed/)
editor('six tags', t => json(t, MP, v => { v.tags = ['nvidia', 'chips', 'leadership', 'funding', 'safety', 'enterprise'] }), /1 to 5 different tags/)
editor('a type other than the topic\'s', t => json(t, MP, v => { v.type = 'funding' }), /"type" is "company", the type of topic 1/)
editor('set_aside names the wrong topic', t => json(t, C1, v => { v.set_aside[0].n = 3 }), /set_aside 1: "n" is 2/)
editor('a slug with capitals', t => { const m = t.get(MP); t.delete(MP); t.set('posts/2026-11-12-Nvidia-CEO/meta.json', m.replace('2026-11-12-nvidia-ceo-transition', '2026-11-12-Nvidia-CEO')); json(t, 'state.json', v => { v.post = '2026-11-12-Nvidia-CEO' }) }, /lower-case words joined by "-"/)
editor('the status is set to ready', t => json(t, MP, v => { v.status = 'ready' }), /the editor writes "status": "open"/)
editor('a category that is not allowed', t => json(t, MP, v => { v.category = 'business' }), /"category" is one of/)
editor('a "why" of 100 words', t => json(t, C1, v => { v.why = 'word '.repeat(100).trim() }), /"why" has at most 80 words/)
add('editor: an unconfirmed model launch', { parent: '06-scout', step: '07-editor', today: '2026-11-13', edit: t => json(t, `${GEP}/meta.json`, v => { v.unconfirmed = true }), expect: /"unconfirmed" is only for the types company and funding/ })

// ── writer ──
const writer = (name, edit, expect, extra = {}) => add(`writer: ${name}`, { parent: '02-editor', step: '03-writer', edit, expect, ...extra })
const AP = `${NVP}/article.md`
const SP = `${NVP}/sources.json`
writer('too short', t => sub(t, AP, t.get(AP).match(/\n\n## What the announcement[\s\S]*$/)[0], '\n'), /the writer writes 300 to 550 words \(you wrote \d+/)
writer('two sentences on one line', t => sub(t, AP, 'The stakes go beyond one company.\nNvidia supplies', 'The stakes go beyond one company. Nvidia supplies'), /one sentence per line; "Nvidia supplies/)
writer('a number without its citation', t => sub(t, AP, 'under her new title.[^2]', 'under her new title.'), /a sentence with a number or a quotation carries its own citation/)
writer('a citation of a missing source', t => sub(t, AP, 'ever since.[^3]', 'ever since.[^12]'), /\[\^12\] is not a source in sources\.json/)
writer('a citation in the middle of a line', t => sub(t, AP, 'Huang founded Nvidia in 1993[^3] and had led it as CEO ever since.[^3]'.replace('[^3] and', ' and'), 'Huang founded Nvidia in 1993[^3] and had led it as CEO ever since.[^3]'), /citations go together at the end of the line/)
writer('a Markdown link', t => sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from [earlier coverage](https://cnbc.com).'), /no links in the text/)
writer('a raw URL', t => sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from earlier coverage on www.cnbc.com today.'), /no URLs in the text/)
writer('a "# " title', t => sub(t, AP, '## Who runs Nvidia now', '# Who runs Nvidia now'), /headings are "## " or "### "/)
writer('HTML', t => sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from <b>earlier</b> coverage.'), /no HTML/)
writer('a table', t => sub(t, AP, 'The context comes from earlier coverage.\n', 'The context comes from earlier coverage.\n\n| a | b |\n'), /no tables/)
writer('a source never cited', t => json(t, SP, v => { v.push({ ...v[4], id: 6, url: 'https://www.cnbc.com/2026/11/09/nvidia-jensen-huang-chinese-spy-investigation.html' }) }), /source 6 is never cited in article\.md/)
writer('a quotation of 3 words', t => json(t, SP, v => { v[2].quotes[0].text = 'Huang founded Nvidia in 1993.' }), /a quotation has at least 8 words/)
writer('a quotation of 11 characters', t => json(t, SP, v => { v[2].quotes[0].text = 'Huang quit.' }), /a quotation has 20 to 300 characters \(it has 11\)/)
writer('a quotation with a cut', t => json(t, SP, v => { v[2].quotes[0].text = 'Huang founded Nvidia in 1993 … has led it as CEO ever since.' }), /copy one passage without cuts/)
writer('an add marker', t => sub(t, AP, 'The context comes from earlier coverage.', '<!-- add role="reviser" model="X" -->\nThe context comes from earlier coverage.\n<!-- /add -->'), /the writer writes plain lines/)
writer('edits meta.json', t => json(t, MP, v => { v.tags = ['nvidia'] }), /meta\.json: is not a file the writer writes/)
writer('the primary source is missing', t => json(t, SP, v => { v[0].url = 'https://www.sec.gov/Archives/edgar/data/0001045810/other.htm' }), /the primary source chosen by the editor is one of the sources/)
writer('the same page twice', t => json(t, SP, v => { v[3].url = v[2].url }), /the same page as source 3/)
writer('a press site marked filing', t => json(t, SP, v => { v[2].kind = 'filing' }), /kind "filing" is only for/)
writer('the primary source marked press', t => json(t, SP, v => { v[0].kind = 'press' }), /the primary source, has kind "filing" or "primary" for a company story/)
writer('a title of 130 characters', t => sub(t, AP, 'title: "Jensen Huang resigns', `title: "${'x'.repeat(100)} Jensen Huang resigns`), /the title has 1 to 110 characters/)
writer('a paragraph without a citation', t => sub(t, AP, 'ever since.[^3]\n', 'ever since.[^3]\n\nNvidia has not commented further.\n'), /every paragraph cites at least one source/)
writer('two blank lines', t => sub(t, AP, '\n\n## Who runs', '\n\n\n## Who runs'), /blocks are separated by exactly one blank line/)
writer('corrections.json is not empty', t => t.set(`${NVP}/corrections.json`, '[{"id": 1}]\n'), /stays \[\] at this step/)
writer('sources.json is missing', t => t.delete(SP), /sources\.json: is missing/)
writer('Windows line endings', t => t.set(AP, t.get(AP).replace(/\n/g, '\r\n')), /CR characters/)
writer('a trailing space', t => sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from earlier coverage. '), /ends with a space/)
writer('no final newline', t => t.set(AP, t.get(AP).slice(0, -1)), /must end with exactly one newline/)
writer('an executable file', null, /is executable/, { fs: dir => execFileSync('chmod', ['+x', join(dir, AP)]) })
writer('a symbolic link', null, /is a symbolic link/, { fs: dir => { rmSync(join(dir, `${NVP}/corrections.json`)); symlinkSync('sources.json', join(dir, `${NVP}/corrections.json`)) } })
writer('a file of 210 KB', t => json(t, SP, v => { v[2].quotes[0].for = 'x'.repeat(210 * 1024) }), /larger than 200 KB/)
writer('the model committed its own work', null, 'OK', { fs: dir => { execFileSync('git', ['add', '-A'], { cwd: dir }); execFileSync('git', ['-c', 'user.name=Model', '-c', 'user.email=model@example.com', 'commit', '-qm', 'my step'], { cwd: dir, env: { ...process.env, GIT_COMMITTER_EMAIL: 'model@example.com' } }) } })
add('writer: --todo', { parent: '02-editor', step: null, args: ['--todo'], expect: (out, pass) => pass && /YOUR ROLE: WRITER/.test(out) && /Primary source \(cite it, kind filing or primary\)/.test(out) })
const abandon = (issues) => t => {
  json(t, MP, v => { v.status = 'abandoned'; v.issues = issues })
  json(t, 'state.json', v => ({ contract: 1, cycle: '2026-11-12', next: 'done', post: null, history: [{ cycle: '2026-11-12', post: '2026-11-12-nvidia-ceo-transition', kind: 'story', status: 'abandoned' }] }))
}
add('writer: abandons the story', { parent: '02-editor', step: null, edit: abandon(['The filing turned out to be a draft that Nvidia withdrew.']), expect: 'OK' })
add('writer: abandons without a reason', { parent: '02-editor', step: null, edit: abandon([]), expect: /an abandoned story says why in "issues"/ })

// ── reviser ──
const CTX = lineOf(treeAt(W, '03-writer'), `${NVP}/article.md`, 'The context comes from earlier coverage.')
const reviser = (name, edit, expect) => add(`reviser: ${name}`, { parent: '03-writer', step: '04-reviser', edit, expect })
const CP = `${NVP}/corrections.json`
reviser('deletes a line', t => sub(t, AP, 'Huang founded Nvidia in 1993 and had led it as CEO ever since.[^3]\n', ''), /of the article before your step is missing, moved or changed/)
reviser('rewrites a line without a correction', t => sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from earlier press coverage.'), new RegExp(`line ${CTX} of the article before your step is missing, moved or changed`))
reviser('a new line outside its add blocks', t => sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from earlier coverage.\nIt is a fast-moving story.'), /missing, moved or changed .*found at line \d+ instead: It is a fast-moving story/)
reviser('an add block signed as the checker', t => sub(t, AP, '<!-- add role="reviser"', '<!-- add role="checker"'), /missing, moved or changed|not in the article before your step/)
reviser('swaps two lines', t => sub(t, AP, 'The board said it is starting a search and "will consider internal and external candidates".[^1]\nThe 8-K is already signed by Kress under her new title.[^2]', 'The 8-K is already signed by Kress under her new title.[^2]\nThe board said it is starting a search and "will consider internal and external candidates".[^1]'), /missing, moved or changed/)
reviser('a correction with the wrong "old"', t => json(t, CP, v => { v[0].old = v[0].old.replace('both present', 'present') }), /"old" is exactly line \d+ of the article before your step/)
reviser('a correction with the wrong line number', t => json(t, CP, v => { v[0].line += 1 }), /"old" is exactly line/)
reviser('a fact correction without support', t => json(t, CP, v => { delete v[0].support }), /"support" lists at least one/)
reviser('a support quote that is not in the source', t => json(t, CP, v => { v[0].support[0].quote = 'the resignation was caused by the affair' }), /this quote is not inside a quotation of source 3/)
reviser('a correction that drops a citation', t => { json(t, CP, v => { v[0].new = v[0].new.replace('[^3][^4]', '[^3]') }); sub(t, AP, 'has not linked the two.[^3][^4]', 'has not linked the two.[^3]') }, /"new" keeps every citation of "old" \(missing \[\^4\]\)/)
reviser('a correction that rewrites at length', t => { const extra = ' and this sentence goes on and on with many more words than any correction should ever add to a line'; json(t, CP, v => { v[0].new = v[0].new.replace('; Nvidia itself', `${extra}; Nvidia itself`) }); sub(t, AP, '; Nvidia itself has not linked', `${extra}; Nvidia itself has not linked`) }, /changes a line's length by at most 15 words/)
reviser('a style correction', t => { json(t, CP, v => { v.push({ id: 2, by: 'reviser', model: 'Claude Opus 5.5', kind: 'style', line: CTX, old: 'The context comes from earlier coverage.', new: 'The context comes from coverage published earlier.', why: 'Clearer.' }) }); sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from coverage published earlier.') }, 'OK')
reviser('a style correction that changes a number', t => { json(t, CP, v => { v.push({ id: 2, by: 'reviser', model: 'Claude Opus 5.5', kind: 'style', line: 8, old: 'Huang founded Nvidia in 1993 and had led it as CEO ever since.[^3]', new: 'Huang founded Nvidia in 1992 and had led it as CEO ever since.[^3]', why: 'Typo.' }) }); sub(t, AP, 'Huang founded Nvidia in 1993', 'Huang founded Nvidia in 1992') }, /a "style" correction changes no number \("1993" is gone\)/)
reviser('a style correction that rewrites the line', t => { json(t, CP, v => { v.push({ id: 2, by: 'reviser', model: 'Claude Opus 5.5', kind: 'style', line: CTX, old: 'The context comes from earlier coverage.', new: 'Reporters had already laid out what preceded this.', why: 'Clearer.' }) }); sub(t, AP, 'The context comes from earlier coverage.', 'Reporters had already laid out what preceded this.') }, /keeps at least 70% of the words/)
addParent('reviser: a style correction that makes a date absolute', { parent: '03-writer', step: '04-reviser',
  editParent: t => sub(t, AP, 'Nvidia said on November 12, 2026 that Jensen', 'Nvidia said on Thursday that Jensen'),
  edit: t => json(t, CP, v => { v.push({ id: 2, by: 'reviser', model: 'Claude Opus 5.5', kind: 'style', line: 6, old: 'Nvidia said on Thursday that Jensen Huang has resigned as president, chief executive officer and member of the board, "effective immediately".[^1]', new: 'Nvidia said on November 12, 2026 that Jensen Huang has resigned as president, chief executive officer and member of the board, "effective immediately".[^1]', why: 'An absolute date.' }) }),
  expect: 'OK' })
reviser('removes a source', t => json(t, SP, v => { v.length = 4 }), /source\(s\) fewer than before your step/)
reviser('removes a source of the writer', t => json(t, SP, v => { v.splice(2, 1) }), /source 3: a source already listed stays exactly as it was/)
reviser('changes a source', t => json(t, SP, v => { v[0].title = 'A better title' }), /source 1: a source already listed stays exactly as it was/)
reviser('withdraws a quotation', t => json(t, SP, v => { v[2].quotes[1].withdrawn = { by: 'reviser', why: 'Superseded by the CNN figure.' } }), 'OK')
reviser('edits a quotation', t => json(t, SP, v => { v[2].quotes[1].text = v[2].quotes[1].text.replace('nearly', 'almost') }), /a quotation already listed stays exactly as it was/)
reviser('adds a source signed by the writer', t => json(t, SP, v => { v[8].added_by = 'writer' }), /source 9: "added_by" is "reviser"/)
reviser('too few words', t => sub(t, AP, t.get(AP).match(/<!-- add role="reviser" model="Claude Opus 5\.5" -->\n## The investigation[\s\S]*?<!-- \/add -->\n/)[0], ''), /the reviser adds 80 to 350 words inside its add blocks \(you added \d+\)/)
reviser('writes key points', t => t.set(AP, `${t.get(AP)}\n<!-- keypoints model="Claude Opus 5.5" -->\n- One.[^1]\n- Two.[^1]\n- Three.[^1]\n<!-- /keypoints -->\n`), /the key points are the checker's/)
reviser('lowers "sensitive"', t => { t.set(MP, treeAt(W, '02-editor').get(MP)); json(t, MP, v => { v.sensitive = false }) }, /"sensitive" can be raised to true, never lowered/)
reviser('changes the tags', t => { t.set(MP, treeAt(W, '02-editor').get(MP)); json(t, MP, v => { v.tags = ['nvidia'] }) }, /"tags" cannot change at this step/)
add('reviser: raises "sensitive"', { parent: '08-writer', step: '09-reviser', today: '2026-11-13', edit: t => { t.set(`${GEP}/meta.json`, treeAt(W, '07-editor').get(`${GEP}/meta.json`)); json(t, `${GEP}/meta.json`, v => { v.sensitive = true }) }, expect: 'OK' })
reviser('two model names', t => json(t, CP, v => { v[0].model = 'GPT-6' }), /use the same model name everywhere in your step/)
reviser('nested add blocks', t => sub(t, AP, '<!-- add role="reviser" model="Claude Opus 5.5" -->\n## The investigation', '<!-- add role="reviser" model="Claude Opus 5.5" -->\n<!-- add role="reviser" model="Claude Opus 5.5" -->\n## The investigation'), /an add block cannot open inside another block/)
reviser('an add block never closed', t => sub(t, AP, '<!-- /add -->\n## Markets', '## Markets'), /never closed with <!-- \/add -->/)
reviser('a misspelt marker', t => sub(t, AP, '<!-- /add -->', '<!--/add-->'), /this marker or HTML comment is not allowed/)

// ── checker ──
const checker = (name, edit, expect) => add(`checker: ${name}`, { parent: '04-reviser', step: '05-checker', edit, expect })
const KP = '<!-- keypoints model="GPT-5.5" -->'
const LP = `${NVP}/claims.json`
checker('no key points', t => t.set(AP, t.get(AP).replace(/\n<!-- keypoints[\s\S]*$/, '')), /the checker ends the file with <!-- keypoints/)
checker('a key point of 40 words', t => sub(t, AP, `${KP}\n- Jensen Huang resigned`, `${KP}\n- ${'word '.repeat(30)}Jensen Huang resigned`), /a key point has at most 30 words/)
checker('two key points', t => sub(t, AP, `${KP}\n- Jensen Huang resigned as Nvidia's president, CEO and director; the board accepted on November 11, 2026 and announced it on November 12, 2026.[^1][^2]\n`, `${KP}\n`), /holds exactly 3 items \(it has 2\)/)
checker('a key point without citation', t => sub(t, AP, 'becomes the board\'s first chair.[^1][^2]', 'becomes the board\'s first chair.'), /every key point cites at least one source/)
checker('a line with a number has no claim', t => json(t, LP, v => v.filter(c => c.line !== lineOf(t, AP, 'Jones, 73, has been')).map((c, k) => ({ ...c, id: k + 1 }))), /missing: line \d+/)
checker('a claim quote not in its source', t => json(t, LP, v => { v[0].support[0].quote = 'Nvidia announced a new chip on Thursday' }), /claim 1, support 1: this quote is not inside a quotation/)
checker('an unsupported claim on a ready story', t => json(t, LP, v => { v[0].status = 'unsupported'; delete v[0].support; v[0].note = 'Not found in the release.' }), /an unsupported claim means "status": "not_ready"/)
checker('an unsupported claim on a story not ready', t => {
  json(t, LP, v => { v[0].status = 'unsupported'; delete v[0].support; v[0].note = 'Not found in the release.' })
  json(t, MP, v => { v.status = 'not_ready'; v.issues = ['The dek states a date the release does not give.'] })
  json(t, 'state.json', v => { v.history[0].status = 'not_ready' })
}, 'OK')
checker('the status stays open', t => json(t, MP, v => { v.status = 'open' }), /the checker sets "status" to "ready" or "not_ready"/)
checker('no image brief', t => json(t, MP, v => { v.image_brief = null }), /the checker writes "image_brief"/)
checker('not ready without issues', t => { json(t, MP, v => { v.status = 'not_ready' }); json(t, 'state.json', v => { v.history[0].status = 'not_ready' }) }, /with "not_ready", "issues" lists what is wrong/)
checker('changes the primary source', t => json(t, MP, v => { v.primary_source = 'https://nvidianews.nvidia.com/news/statement-from-nvidia-board-of-directors' }), /"primary_source" cannot change at this step/)
checker('a history that disagrees with meta', t => json(t, 'state.json', v => { v.history[0].status = 'not_ready' }), /state\.json: must be exactly/)
checker('a claim on a heading', t => json(t, LP, v => { v[0].line = lineOf(t, AP, '## Who runs Nvidia now') }), /claim 1: "line" is the number of a line of text/)
checker('claims.json is missing', t => t.delete(LP), /claims\.json: is missing/)
checker('a derived claim without a note', t => json(t, LP, v => { v[0].status = 'derived'; delete v[0].support }), /a "derived" claim has a "note"/)

// ── more ──
add('reviser: --todo numbers the article', { parent: '03-writer', step: null, args: ['--todo'], expect: (out, pass) => pass && /YOUR ROLE: REVISER/.test(out) && new RegExp(`\\n\\s+${CTX}  The context comes from earlier coverage\\.`).test(out) && /\[\^5\] press/.test(out) })
const TITLE_OLD = 'title: "Jensen Huang resigns as Nvidia CEO; CFO Colette Kress named interim"'
const TITLE_NEW = 'title: "Jensen Huang resigns as Nvidia CEO; CFO Colette Kress named interim chief executive"'
checker('corrects the title', t => {
  json(t, CP, v => { v.push({ id: 2, by: 'checker', model: 'GPT-5.5', kind: 'fact', line: 2, old: TITLE_OLD, new: TITLE_NEW, why: 'Names the role in full.', support: [{ source: 1, quote: 'while serving as Interim Chief Executive Officer until a permanent successor has been named' }] }) })
  sub(t, AP, TITLE_OLD, TITLE_NEW)
}, 'OK')
checker('a title correction that drops the key', t => {
  json(t, CP, v => { v.push({ id: 2, by: 'checker', model: 'GPT-5.5', kind: 'fact', line: 2, old: TITLE_OLD, new: TITLE_NEW.replace('title: ', 'headline: '), why: 'x', support: [{ source: 1, quote: 'while serving as Interim Chief Executive Officer until a permanent successor has been named' }] }) })
  sub(t, AP, TITLE_OLD, TITLE_NEW.replace('title: ', 'headline: '))
}, /a header line keeps its key and a JSON string: title: "…"/)
checker('six corrections in one step', t => json(t, CP, v => { for (let i = 0; i < 6; i++) v.push({ id: v.length + 1, by: 'checker', model: 'GPT-5.5', kind: 'style', line: 6, old: 'x', new: 'y', why: 'z' }) }), /at most 5 corrections per step \(you added 6\)/)
add('checker: abandons the story', { parent: '04-reviser', step: null, edit: t => {
  json(t, MP, v => { v.status = 'abandoned'; v.issues = ['Nvidia withdrew the release an hour later.'] })
  json(t, 'state.json', v => ({ contract: 1, cycle: '2026-11-12', next: 'done', post: null, history: [{ cycle: '2026-11-12', post: '2026-11-12-nvidia-ceo-transition', kind: 'story', status: 'abandoned' }] }))
}, expect: 'OK' })
add('checker: abandons and edits the article', { parent: '04-reviser', step: null, edit: t => {
  json(t, MP, v => { v.status = 'abandoned'; v.issues = ['Nvidia withdrew the release an hour later.'] })
  sub(t, AP, 'The context comes from earlier coverage.', 'The context comes from earlier press coverage.')
  json(t, 'state.json', v => ({ contract: 1, cycle: '2026-11-12', next: 'done', post: null, history: [{ cycle: '2026-11-12', post: '2026-11-12-nvidia-ceo-transition', kind: 'story', status: 'abandoned' }] }))
}, expect: /article\.md: is not a file the checker \(abandoning the story\) writes/ })
add('done: --todo after the week', { parent: '11-recap', step: null, today: '2026-11-16', args: ['--todo'], expect: (out, pass) => pass && /YOUR ROLE: SCOUT/.test(out) && /2026-11-13-google-gemini-decision-1: Google launches Gemini Decision 1/.test(out) })
add('done: nothing changed after the recap', { parent: '11-recap', step: null, today: '2026-11-16', expect: 'OK' })

// ── A second story the same day: the Gemini cycle replayed as 2026-11-12-2 ──
function sameDay(tree) {
  const out = new Map()
  for (const [p, v] of tree) {
    out.set(p.replace('editions/2026-11-13/', 'editions/2026-11-12-2/').replace('posts/2026-11-13-google-gemini-decision-1/', 'posts/2026-11-12-google-gemini-decision-1/'),
      v.split('"cycle": "2026-11-13"').join('"cycle": "2026-11-12-2"').split('2026-11-13-google-gemini-decision-1').join('2026-11-12-google-gemini-decision-1'))
  }
  return out
}
const second = (name, parent, step, today, expect, extra = {}) => {
  const parentTree = sameDay(treeAt(W, parent))
  CASES.push({ name: `second story: ${name}`, parents: [parentTree], child: step === null ? new Map(parentTree) : sameDay(treeAt(W, step)), today, expect, ...extra })
}
second('--todo offers <date>-2', '05-checker', null, '2026-11-12', (out, pass) => pass && /<cycle> = 2026-11-12-2 \(a second story today/.test(out), { args: ['--todo'] })
second('scout', '05-checker', '06-scout', '2026-11-12', 'OK')
second('editor', '06-scout', '07-editor', '2026-11-12', 'OK')
second('writer', '07-editor', '08-writer', '2026-11-12', 'OK')
second('reviser', '08-writer', '09-reviser', '2026-11-12', 'OK')
second('checker', '09-reviser', '10-checker', '2026-11-13', 'OK')
second('the recap covers both', '10-checker', null, '2026-11-15', (out, pass) => pass && /2026-11-12-nvidia-ceo-transition/.test(out) && /2026-11-12-google-gemini-decision-1/.test(out) && /YOUR ROLE: RECAP/.test(out), { args: ['--todo'] })
const scoutOn = (parent, date, today, expect, name) => {
  const parentTree = parent === '10-checker' ? sameDay(treeAt(W, parent)) : treeAt(W, parent)
  const child = new Map(parentTree)
  sundayScout(date, today)(child)
  CASES.push({ name: `second story: ${name}`, parents: [parentTree], child, today, expect })
}
scoutOn('10-checker', '2026-11-12', '2026-11-12', /2026-11-12 already has two stories, the most a day can have/, 'a third the same day')
scoutOn('05-checker', '2026-11-13-2', '2026-11-13', /2026-11-13-2 is the second story of 2026-11-13: the first one is the cycle 2026-11-13/, '<date>-2 without a first story that day')
scoutOn('05-checker', '2026-11-12', '2026-11-12', /a second story the same day is the cycle 2026-11-12-2/, 'the same date twice')

// ── Stories that do not all look alike (warnings, not failures) ──
const warns = re => (out, pass) => pass && re.test(out)
writer('a heading that fits any story', t => sub(t, AP, '## Who runs Nvidia now', '## Background'), warns(/warning · .*"Background" could head any story/))
add('writer: a heading a recent story used', { parent: '07-editor', step: '08-writer', today: '2026-11-13', edit: t => sub(t, `${GEP}/article.md`, '## Availability', '## Markets and the AI supply chain'), expect: warns(/"Markets and the AI supply chain" already heads a section of 2026-11-12-nvidia-ceo-transition/) })
add('writer: --todo shows how the last story opens', { parent: '07-editor', step: null, today: '2026-11-13', args: ['--todo'], expect: (out, pass) => pass && /How the last story opens/.test(out) && /2026-11-12-nvidia-ceo-transition: "Nvidia said on November 12, 2026/.test(out) && /headings: "Who runs Nvidia now"/.test(out) })
