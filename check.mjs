#!/usr/bin/env node
// AI Newsroom · the check of a step (check v1.1.0, contract 1).
//
//   node check.mjs          checks what your step changed: prints OK, or what to fix
//   node check.mjs --todo   prints whose turn it is, the files to write and the rules
//
// The rules are in CONTRACT.md; this script is the authority. A Relay step runs
// the copy pinned in the capsule (bash ../check.sh), never the one in its own
// tree. The script compares the working tree with the commit the step started
// from and only reads. It passes when nothing has changed yet, so the platform
// can tell a step that broke the check from one that found it broken.
// No dependencies: plain Node 18 or later.

import { execFileSync } from 'node:child_process'
import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const VERSION = '1.1.0'
const CONTRACT = 1
const RELAY_EMAIL = 'relay@llmtimemachine.com' // committer of every step the platform replays or pushes

/* ── Lists: only the owner changes them, with a new version pinned in the capsule ── */

const CATEGORIES = ['models', 'research', 'products', 'industry', 'open-source', 'policy', 'recap']
const TAGS = [
  'openai', 'anthropic', 'google', 'meta', 'microsoft', 'apple', 'amazon', 'nvidia', 'deepseek', 'mistral', 'xai', 'qwen', 'alibaba',
  'agents', 'reasoning', 'coding', 'open-weights', 'pricing', 'api', 'benchmarks', 'multimodal', 'robotics', 'chips', 'data-centers',
  'energy', 'regulation', 'safety', 'copyright', 'privacy', 'funding', 'leadership', 'startups', 'enterprise', 'healthcare', 'education',
]
// A story's type: the advised category, the kinds its primary_source may have,
// the trend minimum, and whether it may run as unconfirmed (press only).
const TYPES = {
  model_launch: { category: 'models', primary: ['primary'], trend: 3 },
  product: { category: 'products', primary: ['primary'], trend: 3 },
  open_source: { category: 'open-source', primary: ['primary'], trend: 2 },
  research: { category: 'research', primary: ['paper', 'primary'], trend: 2 },
  company: { category: 'industry', primary: ['filing', 'primary'], trend: 3, unconfirmed: true },
  funding: { category: 'industry', primary: ['filing', 'primary'], trend: 3, unconfirmed: true },
  policy: { category: 'policy', primary: ['primary'], trend: 3 },
}
const KINDS = ['primary', 'filing', 'docs', 'paper', 'press', 'data', 'changelog', 'listing', 'other']
// kind "filing" and kind "paper" only on these hosts (and their subdomains).
const FILING_HOSTS = [
  'sec.gov', 'sedarplus.ca', 'company-information.service.gov.uk', 'hkexnews.hk', 'sse.com.cn', 'szse.cn', 'dart.fss.or.kr',
  'edinet-fsa.go.jp', 'amf-france.org', 'uscourts.gov', 'courtlistener.com', 'supremecourt.gov', 'curia.europa.eu',
]
const PAPER_HOSTS = [
  'arxiv.org', 'doi.org', 'openreview.net', 'aclanthology.org', 'nature.com', 'science.org', 'proceedings.neurips.cc', 'papers.nips.cc',
  'proceedings.mlr.press', 'jmlr.org', 'ieeexplore.ieee.org', 'dl.acm.org', 'openaccess.thecvf.com', 'ojs.aaai.org', 'ijcai.org',
  'biorxiv.org', 'medrxiv.org', 'ssrn.com', 'pnas.org', 'cell.com', 'thelancet.com', 'nejm.org', 'jamanetwork.com',
]
// Not sources: aggregators, search pages, social networks, video sites, URL
// shorteners and archives. Cite the page they point to.
const BLOCKED_EXACT = ['google.com', 'www.google.com', 'news.google.com', 'news.yahoo.com']
const BLOCKED_DOMAINS = [
  'bing.com', 'duckduckgo.com', 'msn.com', 'flipboard.com', 'feedly.com', 'ground.news', 'techmeme.com', 'newsnow.co.uk',
  'x.com', 'twitter.com', 'facebook.com', 'fb.com', 'instagram.com', 'threads.net', 'threads.com', 'tiktok.com', 'linkedin.com',
  'reddit.com', 'bsky.app', 'mastodon.social', 't.me', 'youtube.com', 'youtu.be',
  't.co', 'bit.ly', 'tinyurl.com', 'ow.ly', 'buff.ly', 'lnkd.in', 'goo.gl', 'dlvr.it', 'is.gd', 'rebrand.ly', 'shorturl.at', 'cutt.ly', 'tiny.cc',
  'archive.org', 'archive.today', 'archive.ph', 'archive.is', 'archive.li',
]
const BLOCKED_PARTS = ['llm-stats', 'evolink', 'codersera', 'cometapi', 'techasoft'] // AI-written SEO sites
// Two registrable domains are the same when their last two labels are equal,
// or their last three under these suffixes.
const TWO_LEVEL = new Set([
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'com.au', 'net.au', 'org.au', 'gov.au', 'co.jp', 'ne.jp', 'or.jp', 'go.jp', 'ac.jp',
  'com.br', 'gov.br', 'co.in', 'gov.in', 'co.kr', 'or.kr', 'go.kr', 'com.cn', 'gov.cn', 'com.tw', 'gov.tw', 'co.nz', 'com.sg',
  'gov.sg', 'com.hk', 'gov.hk', 'co.za', 'com.mx', 'gob.mx', 'com.tr', 'co.il', 'com.ar', 'gob.ar', 'fss.or.kr',
])

const BUDGET = { writer: [300, 550], reviser: [80, 350], checker: [40, 200], keypoint: 30, total: 1200 }
const TITLE_MAX = 110
const DEK_WORDS = 40
const SUMMARY_WORDS = 60
const WHY_WORDS = 80
const ASIDE_WORDS = 30
const ISSUE_WORDS = 30
const BRIEF_WORDS = 60
const MAX_CORRECTIONS = 5 // per step
const CORRECTION_WORD_DELTA = 15
const STYLE_KEEP = 0.7 // a style correction keeps this share of the old line's words
const MAX_FILE = 200 * 1024
const FRESH = [-3, 1] // days around the cycle for fresh sources and trend articles
const RECENT_DAYS = 14
const RECENT_STORIES = 5 // whose openings and headings --todo shows, so stories do not all look alike
// Headings that fit any story: a story's headings say what is specific to it.
const GENERIC_HEADING = /^(?:why (?:it|this) matters|background|context|what happened|the news|the details|details|the (?:bottom line|big picture)|bottom line|big picture|conclusion|overview|summary|analysis|key takeaways|takeaways|what'?s next|looking ahead|reactions?)$/i
// A cycle is a UTC date; a second story the same day is <date>-2 (at most two a day).
const CYCLE = /^(\d{4}-\d{2}-\d{2})(?:-2)?$/
const RECAP_SECTIONS = [5, 7]
const RECAP_SECTION_WORDS = [40, 120]

const ID = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/
const SLUG_MAX = 60
const STORY_ROLES = ['writer', 'reviser', 'checker']
const UNKNOWN_HEADING = /\b(?:don['’]t|do not|doesn['’]t|does not) (?:yet |still )?know|\bunknowns?\b|\bunanswered\b|\bopen questions\b|\b(?:still|remains?) unclear\b/i

const TODAY = /^\d{4}-\d{2}-\d{2}$/.test(process.env.NEWSROOM_TODAY || '') ? process.env.NEWSROOM_TODAY : new Date().toISOString().slice(0, 10)

/* ── Output ── */

const errors = []
const warnings = []
const fail = (where, msg) => { errors.push(where ? `${where}: ${msg}` : msg) }
const warn = (where, msg) => { warnings.push(where ? `${where}: ${msg}` : msg) }
const short = (s, n = 100) => { s = String(s); return s.length > n ? `${s.slice(0, n - 1)}…` : s }
const plural = (n, w, p = `${w}s`) => `${n} ${n === 1 ? w : p}`

/* ── Git ── */

const ROOT = (() => {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null }
})()
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 })
const tryGit = (...args) => { try { return git(...args) } catch { return null } }
// The command the messages tell the model to run: this file when it sits in
// the tree, else the pinned copy the capsule writes next to the clone.
const CMD = ROOT && resolve(process.argv[1] || '').startsWith(`${ROOT}/`) ? 'node check.mjs' : 'bash ../check.sh'

// The commit this step started from: the last step the platform replayed or
// pushed (committed as RELAY_EMAIL), else the Relay's base commit, else the
// commit that was cloned. A model that commits its own work does not move it.
function stepBase() {
  if (/^[0-9a-f]{40}$/.test(process.env.NEWSROOM_BASE || '')) return process.env.NEWSROOM_BASE
  const log = tryGit('log', '--format=%H %ce', '-n', '2000')
  if (log == null) return null
  for (const line of log.trim().split('\n')) {
    const [sha, email] = line.split(' ')
    if (email === RELAY_EMAIL) return sha
  }
  const env = /^[0-9a-f]{40}$/.test(process.env.REPO_BASE || '') ? process.env.REPO_BASE : null
  return env || tryGit('rev-parse', '--verify', '-q', '@{upstream}')?.trim() || tryGit('rev-parse', 'HEAD')?.trim() || null
}

// path -> A (added), M (modified), D (deleted), T (type changed)
function stepChanges(base) {
  const changes = new Map()
  const diff = git('diff', '--no-renames', '--no-ext-diff', '--name-status', '-z', base).split('\0')
  for (let i = 0; i + 1 < diff.length; i += 2) changes.set(diff[i + 1], diff[i][0])
  for (const p of git('ls-files', '-o', '--exclude-standard', '-z').split('\0')) if (p) changes.set(p, 'A')
  return changes
}

const atBase = (base, path) => tryGit('show', `${base}:${path}`)
const baseFiles = base => git('ls-tree', '-r', '-z', '--name-only', base).split('\0').filter(Boolean)
function jsonAtBase(base, path) {
  const s = atBase(base, path)
  if (s == null) return undefined
  try { return JSON.parse(s) } catch { return undefined }
}

/* ── Values ── */

const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v)
const isStr = (v, min = 1, max = Infinity) => typeof v === 'string' && v.trim().length >= min && v.length <= max
const canon = v => Array.isArray(v) ? v.map(canon) : isObj(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canon(v[k])])) : v
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))

function keys(file, obj, where, required, optional = []) {
  if (!isObj(obj)) { fail(file, `${where} must be a JSON object`); return false }
  let ok = true
  for (const k of required) if (!Object.hasOwn(obj, k)) { fail(file, `${where}: "${k}" is missing`); ok = false }
  for (const k of Object.keys(obj)) if (!required.includes(k) && !optional.includes(k)) { fail(file, `${where}: unknown key "${k}"`); ok = false }
  return ok
}

const DATE = /^\d{4}-\d{2}-\d{2}$/
const isDate = s => typeof s === 'string' && DATE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s
const addDays = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10)
const weekday = d => new Date(`${d}T00:00:00Z`).getUTCDay() // 0 = Sunday
function isoWeek(d) {
  const dow = (weekday(d) + 6) % 7 // Monday = 0
  const thursday = addDays(d, 3 - dow)
  const year = Number(thursday.slice(0, 4))
  const week = Math.ceil(((Date.parse(`${thursday}T00:00:00Z`) - Date.UTC(year, 0, 1)) / 864e5 + 1) / 7)
  return { year, week, monday: addDays(d, -dow), sunday: addDays(d, 6 - dow) }
}
const cycleDate = c => String(c).slice(0, 10)
const isCycle = c => typeof c === 'string' && CYCLE.test(c) && isDate(c.slice(0, 10))
const cycleKey = c => c.length === 10 ? `${c}-1` : c // orders 2026-11-13 < 2026-11-13-2 < 2026-11-14
const windowOf = cycle => [addDays(cycleDate(cycle), FRESH[0]), addDays(cycleDate(cycle), FRESH[1])]
const inWindow = (d, cycle) => isDate(d) && d >= windowOf(cycle)[0] && d <= windowOf(cycle)[1]

const CITE = /\[\^([1-9][0-9]*)\]/g
const CITE_TAIL = /((?:\[\^[1-9][0-9]*\])+)$/
const POST_LINK = /\[\[post:([^\]]*)\]\]/g
const citesOf = s => [...s.matchAll(CITE)].map(m => Number(m[1]))
const stripCites = s => s.replace(CITE, '')
const wordsOf = s => s.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w))
const countWords = s => wordsOf(s).length
const lineWords = line => countWords(stripCites(line).replace(/^(?:- |#{2,3} )/, ''))
const normText = s => s.normalize('NFC').replace(/[‘’‛′]/g, "'").replace(/[“”‟″]/g, '"')
  .replace(/[–—]/g, '-').replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
const MONTH = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?'
const DATE_TEXT = new RegExp(`\\b${MONTH}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,\\s*\\d{4})?|\\b\\d{1,2}\\s+${MONTH}(?:\\s+\\d{4})?|\\b\\d{4}-\\d{2}-\\d{2}\\b|\\b\\d{1,2}/\\d{1,2}/\\d{2,4}\\b`, 'g')
const hasDate = s => new RegExp(DATE_TEXT.source).test(s) || /\b(?:19|20)\d{2}\b/.test(s)

/* ── URLs ── */

const parseUrl = u => { try { return new URL(u) } catch { return null } }
const hostOf = u => (parseUrl(u)?.hostname || '').toLowerCase().replace(/\.$/, '')
const onHost = (u, list) => { const h = hostOf(u); return list.some(d => h === d || h.endsWith(`.${d}`)) }
function domainOf(u) {
  const h = hostOf(u).replace(/^www\./, '')
  const p = h.split('.')
  if (p.length <= 2) return h
  return TWO_LEVEL.has(p.slice(-2).join('.')) ? p.slice(-3).join('.') : p.slice(-2).join('.')
}
const TRACKING = /^(?:utm_.*|fbclid|gclid|dclid|mc_cid|mc_eid|ref|ref_src|cmpid|smid|guccounter|guce_referrer.*|sh|mod|taid|ncid|ocid|cid|src)$/i
function normUrl(u) {
  const x = parseUrl(u)
  if (!x) return String(u)
  const q = [...x.searchParams].filter(([k]) => !TRACKING.test(k)).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
  const path = x.pathname.replace(/\/+$/, '')
  return `${x.hostname.toLowerCase().replace(/^www\./, '')}${path}${q.length ? `?${new URLSearchParams(q)}` : ''}`
}
// What is wrong with a source URL, or null.
function urlProblem(u) {
  if (typeof u !== 'string' || !u) return 'is empty'
  if (u.length > 600) return 'is longer than 600 characters'
  if (/\s/.test(u)) return 'contains a space'
  const x = parseUrl(u)
  if (!x) return 'is not a valid URL'
  if (x.protocol !== 'https:') return 'must start with https://'
  if (x.username || x.password) return 'must not carry a user name or password'
  const h = hostOf(u)
  if (/^[\d.]+$/.test(h) || h.includes(':') || !h.includes('.')) return 'must use a domain name'
  if (BLOCKED_EXACT.includes(h) || BLOCKED_DOMAINS.some(d => h === d || h.endsWith(`.${d}`)) || BLOCKED_PARTS.some(p => h.includes(p)))
    return `is on ${h}: aggregators, search pages, social networks, video sites, URL shorteners and archives are not sources; cite the page itself`
  return null
}

/* ── Files in the working tree ── */

const textCache = new Map()
// A changed text file: UTF-8, LF, no BOM, no trailing space, one final newline.
function textNow(path) {
  if (textCache.has(path)) return textCache.get(path)
  const full = join(ROOT, path)
  let s = null
  if (existsSync(full)) {
    const buf = readFileSync(full)
    try { s = new TextDecoder('utf-8', { fatal: true }).decode(buf) } catch { fail(path, 'is not valid UTF-8') }
    if (s != null) {
      if (s.charCodeAt(0) === 0xFEFF) { fail(path, 'starts with a byte order mark (BOM): remove it'); s = s.slice(1) }
      if (s.includes('\r')) fail(path, 'has CR characters: use LF line endings')
      if (!s.endsWith('\n') || s.endsWith('\n\n')) fail(path, 'must end with exactly one newline')
      const bad = s.split('\n').map((l, i) => /[ \t]$/.test(l) ? i + 1 : 0).filter(Boolean)
      if (bad.length) fail(path, `line ${bad.slice(0, 5).join(', ')} ${bad.length > 1 ? 'end' : 'ends'} with a space or a tab`)
    }
  }
  textCache.set(path, s)
  return s
}
function jsonNow(path) {
  const s = textNow(path)
  if (s == null) return undefined
  try { return JSON.parse(s) } catch (e) { fail(path, `is not valid JSON (${short(e.message, 80)})`); return undefined }
}
// The same file read quietly, to tell which role a step plays.
function peekJson(path) {
  try { return JSON.parse(readFileSync(join(ROOT, path), 'utf8')) } catch { return undefined }
}

/* ── article.md ── */

const MARK_ADD = /^<!-- add role="([a-z]+)" model="([^"<>]{1,80})" -->$/
const MARK_ADD_END = '<!-- /add -->'
const MARK_KP = /^<!-- keypoints model="([^"<>]{1,80})" -->$/
const MARK_KP_END = '<!-- /keypoints -->'
const MARK_WATCH = '<!-- watch -->'
const isMarker = t => MARK_ADD.test(t) || t === MARK_ADD_END || MARK_KP.test(t) || t === MARK_KP_END || t === MARK_WATCH
const toLines = text => (text.endsWith('\n') ? text.slice(0, -1) : text).split('\n')
const ABBREV = new Set(['mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'inc', 'corp', 'co', 'ltd', 'vs', 'etc', 'approx', 'gen', 'gov', 'sen',
  'rep', 'lt', 'col', 'sgt', 'no', 'vol', 'fig', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec', 'est', 'dept', 'univ'])

// Splits the file into its header, the rows of visible text (markers removed)
// and the blocks; reports what breaks the grammar of CONTRACT.md §7.
function parseArticle(text, file) {
  const lines = toLines(text)
  const art = { lines, title: null, dek: null, rows: [], adds: [], kp: null, watch: -1, blocks: [] }
  const err = msg => fail(file, msg)
  if (lines[0] !== '---' || lines[3] !== '---' || lines[4] !== '')
    err('the file starts with exactly 4 header lines (---, title: "…", dek: "…", ---), then one blank line')
  for (const [i, key] of [[1, 'title'], [2, 'dek']]) {
    const m = (lines[i] || '').match(new RegExp(`^${key}: (".*")$`))
    let v = null
    if (m) try { v = JSON.parse(m[1]) } catch { /* reported below */ }
    if (typeof v !== 'string') { err(`line ${i + 1} must be ${key}: "…" with the value as a JSON string`); continue }
    art[key] = v
    if (/\[\^|\]\(|<[A-Za-z!/]|https?:\/\/|\n/.test(v)) err(`the ${key} holds no citation, link, HTML or line break`)
  }
  if (art.title != null && (!art.title.trim() || art.title.length > TITLE_MAX)) err(`the title has 1 to ${TITLE_MAX} characters (it has ${art.title.length})`)
  if (art.dek != null) { const n = countWords(art.dek); if (n < 1 || n > DEK_WORDS) err(`the dek has 1 to ${DEK_WORDS} words (it has ${n})`) }

  let add = null
  let kp = null
  for (let i = 5; i < lines.length; i++) {
    const t = lines[i]
    let m
    if ((m = t.match(MARK_ADD))) {
      if (add || kp) err(`line ${i + 1}: an add block cannot open inside another block`)
      else { add = { start: i, end: -1, role: m[1], model: m[2] }; art.adds.push(add) }
      continue
    }
    if (t === MARK_ADD_END) {
      if (!add) err(`line ${i + 1}: <!-- /add --> closes no add block`)
      else { add.end = i; add = null }
      continue
    }
    if ((m = t.match(MARK_KP))) {
      if (add || kp || art.kp) err(`line ${i + 1}: the keypoints block comes once, outside any other block, at the end of the file`)
      else { kp = { start: i, end: -1, model: m[1], items: [] }; art.kp = kp }
      continue
    }
    if (t === MARK_KP_END) {
      if (!kp) err(`line ${i + 1}: <!-- /keypoints --> closes no keypoints block`)
      else { kp.end = i; kp = null }
      continue
    }
    if (t === MARK_WATCH) {
      if (add || kp || art.watch >= 0) err(`line ${i + 1}: <!-- watch --> comes once, outside any block`)
      else art.watch = i
      continue
    }
    if (t.includes('<!--') || t.includes('-->')) { err(`line ${i + 1}: this marker or HTML comment is not allowed; markers are whole lines, written exactly as in CONTRACT.md §7`); continue }
    art.rows.push({ i, text: t, blank: t === '', add, kp: !!kp })
    if (kp && !/^- \S/.test(t)) err(`line ${i + 1}: every line of the keypoints block is a "- " item`)
    if (kp && /^- \S/.test(t)) kp.items.push(i)
  }
  if (add) err(`line ${add.start + 1}: this add block is never closed with <!-- /add -->`)
  if (kp) err(`line ${kp.start + 1}: the keypoints block is never closed with <!-- /keypoints -->`)
  for (const b of art.adds) if (b.end > 0 && !art.rows.some(r => r.add === b && !r.blank)) err(`line ${b.start + 1}: this add block is empty`)
  if (art.kp && art.kp.end > 0) {
    if (art.kp.end !== lines.length - 1) err('the keypoints block is the last thing in the file')
    if (art.kp.items.length !== 3) err(`the keypoints block holds exactly 3 items (it has ${art.kp.items.length})`)
    if (lines[art.kp.start - 1] !== '') err(`line ${art.kp.start}: leave one blank line before the keypoints block`)
  }
  if (art.watch >= 0 && !/^## \S/.test(lines[art.watch + 1] || '')) err(`line ${art.watch + 2}: <!-- watch --> is followed directly by a "## " heading`)

  // Blocks of visible text, separated by exactly one blank line.
  let cur = null
  let prevBlank = true // the blank line under the header
  for (const r of art.rows) {
    if (r.blank) {
      if (prevBlank) err(`line ${r.i + 1}: blocks are separated by exactly one blank line (once the markers are left out)`)
      prevBlank = true
      cur = null
      continue
    }
    if (!cur) { cur = { rows: [] }; art.blocks.push(cur) }
    cur.rows.push(r)
    prevBlank = false
  }
  if (art.rows.length && art.rows[art.rows.length - 1].blank) err('the file does not end with a blank line (once the markers are left out)')
  if (!art.blocks.length) err('the article has no text')

  let heading = ''
  for (const b of art.blocks) {
    const first = b.rows[0].text
    b.kp = b.rows.every(r => r.kp)
    if (b.rows.some(r => r.kp) && !b.kp) err(`line ${b.rows[0].i + 1}: leave one blank line before the keypoints block`)
    if (first.startsWith('#')) {
      b.type = 'heading'
      if (!/^#{2,3} \S/.test(first)) err(`line ${b.rows[0].i + 1}: headings are "## " or "### " (no "# " title: the title is in the header)`)
      if (/#\s*$/.test(first.slice(3))) err(`line ${b.rows[0].i + 1}: a heading does not end with #`)
      if (b.rows.length > 1) err(`line ${b.rows[1].i + 1}: a heading stands alone; leave a blank line after it`)
      if (citesOf(first).length) err(`line ${b.rows[0].i + 1}: a heading carries no citation`)
      heading = first.replace(/^#+ /, '')
    } else if (first.startsWith('- ')) {
      b.type = 'list'
      for (const r of b.rows) if (!/^- \S/.test(r.text)) err(`line ${r.i + 1}: a list holds only "- " items, one per line; leave a blank line before a paragraph`)
    } else {
      b.type = 'para'
    }
    b.heading = heading
    for (const r of b.rows) lineRules(r, b, err)
    if (b.type === 'para' && !b.rows.some(r => citesOf(r.text).length)) err(`line ${b.rows[0].i + 1}: every paragraph cites at least one source ([^n])`)
  }
  art.textRows = art.rows.filter(r => !r.blank)
  art.words = art.textRows.reduce((n, r) => n + lineWords(r.text), 0)
  return art
}

function lineRules(r, b, err) {
  const t = r.text
  const at = `line ${r.i + 1}`
  if (/^\s/.test(t)) err(`${at}: a line never starts with a space (no indented code)`)
  if (t.includes('\t')) err(`${at}: no tab characters`)
  if (/<[A-Za-z!/?]/.test(t)) err(`${at}: no HTML in the article (only the markers)`)
  if (/!\[/.test(t)) err(`${at}: no images in the article: the image is chosen by the editorial team`)
  if (/\]\(/.test(t) || /^\s*\[[^\]]+\]:\s/.test(t)) err(`${at}: no links in the text: sources are cited with [^n]`)
  if (/https?:\/\/|\bwww\.[a-z0-9-]+\./i.test(t)) err(`${at}: no URLs in the text: sources are cited with [^n]`)
  if (/^(?:```|~~~)/.test(t)) err(`${at}: no code blocks`)
  if (/^\|/.test(t)) err(`${at}: no tables`)
  if (/^>/.test(t)) err(`${at}: no block quotes: quote inside a sentence, between quotation marks`)
  if (/^\[\^\d+\]:/.test(t)) err(`${at}: no footnote definitions: the platform builds the source list from sources.json`)
  if (/\[\[(?!post:)/.test(t)) err(`${at}: the only double-bracket syntax is [[post:<id>]]`)
  if (/\[\^(?![1-9][0-9]*\])/.test(t)) err(`${at}: a citation is written [^n], with n the id of a source`)
  if (b.type === 'para' && /^(?:[-*+] |\d+[.)] |-{3,}|={3,}|\*{3,}|_{3,}|#)/.test(t)) err(`${at}: a paragraph line cannot start like a list, a heading or a rule`)
  if (b.type === 'heading') return
  const plain = t.replace(POST_LINK, 'post').replace(/^- /, '')
  const cites = citesOf(t)
  if (cites.length) {
    const tail = t.match(CITE_TAIL)
    const before = tail ? t.slice(0, -tail[1].length) : t
    if (!tail || before.includes('[^')) err(`${at}: citations go together at the end of the line`)
    else if (!/[.!?"”’)]$/.test(before)) err(`${at}: citations come after the final punctuation: "…end.[^1]"`)
  } else if (/\d/.test(stripCites(plain)) || /["“”]/.test(plain)) {
    err(`${at}: a sentence with a number or a quotation carries its own citation ([^n] at the end)`)
  } else if (r.kp) {
    err(`${at}: every key point cites at least one source`)
  } else if (b.type === 'list' && !UNKNOWN_HEADING.test(b.heading)) {
    err(`${at}: every list item cites at least one source (only the items of a "What we don't know yet" list may go without, when they state an absence)`)
  }
  if (r.kp && lineWords(t) > BUDGET.keypoint) err(`${at}: a key point has at most ${BUDGET.keypoint} words (it has ${lineWords(t)})`)
  if (b.type === 'para') {
    const split = twoSentences(stripCites(t))
    if (split) err(`${at}: one sentence per line; "${short(split, 60)}" starts a new sentence: put it on its own line`)
  }
}

// The start of a second sentence on the line, or null. Careful with
// abbreviations (U.S., Inc., Nov.) and initials (Harvey C. Jones).
function twoSentences(t) {
  const re = /(\S+?)([.!?])(["”’)]?)\s+(["“(]?[A-Z][a-z]\S*)/g
  let m
  while ((m = re.exec(t))) {
    const word = m[1].replace(/^["“(]+/, '')
    if (m[2] === '.') {
      if (ABBREV.has(word.toLowerCase()) || /^[A-Z]$/.test(word) || /^(?:[A-Za-z]\.)+[A-Za-z]?$/.test(word) || /^[A-Z][A-Za-z]*[A-Z]/.test(word)) continue
      if (!/[a-z0-9%)"”’]$/.test(word) && !m[3]) continue
    }
    return t.slice(m.index + m[0].length - m[4].length)
  }
  return null
}

const stepWords = (art, keep) => art.textRows.filter(keep).reduce((n, r) => n + lineWords(r.text), 0)

/* ── sources.json ── */

const ADDERS = ['writer', 'reviser', 'checker', 'recap']
const SOURCE_KEYS = ['id', 'url', 'title', 'publisher', 'kind', 'published', 'retrieved', 'added_by', 'quotes']
const QUOTE_KEYS = { text: ['text', 'for', 'by'], date: ['type', 'text', 'for', 'by'], image: ['type', 'image_url', 'transcript', 'for', 'by'] }

function checkQuote(file, q, where) {
  if (!isObj(q)) { fail(file, `${where} must be a JSON object`); return }
  const type = q.type === undefined ? 'text' : q.type
  if (!['date', 'image'].includes(q.type) && q.type !== undefined) { fail(file, `${where}: "type" is "date" or "image", or absent for a normal quotation`); return }
  if (!keys(file, q, where, QUOTE_KEYS[type], ['withdrawn'])) return
  if (!isStr(q.for, 1, 200)) fail(file, `${where}: "for" says what the quotation proves, in at most 200 characters`)
  if (!ADDERS.includes(q.by)) fail(file, `${where}: "by" is the role that added it (${ADDERS.join(', ')})`)
  if (type === 'image') {
    const p = urlProblem(q.image_url)
    if (p) fail(file, `${where}: image_url ${p}`)
    if (!isStr(q.transcript, 1, 300)) fail(file, `${where}: "transcript" copies what the image shows, in at most 300 characters`)
  } else if (typeof q.text !== 'string' || q.text.includes('\n')) {
    fail(file, `${where}: "text" is the quotation, on one line`)
  } else if (type === 'date') {
    if (q.text.length < 6 || q.text.length > 300 || !hasDate(q.text)) fail(file, `${where}: a "date" quotation has 6 to 300 characters and contains the date it proves`)
  } else {
    const t = q.text
    if (t.length < 20 || t.length > 300) fail(file, `${where}: a quotation has 20 to 300 characters (it has ${t.length}), copied exactly from the page`)
    else if (countWords(t) < 8) fail(file, `${where}: a quotation has at least 8 words (to prove a date, use "type": "date")`)
    if (/…|\.\.\.|\[\s*(?:…|\.\.\.)\s*\]/.test(t)) fail(file, `${where}: copy one passage without cuts ("…", "[...]"); write two quotations instead`)
    if (/\]\(|\[\^/.test(t)) fail(file, `${where}: copy the page's text, not Markdown`)
  }
  if (q.withdrawn !== undefined && keys(file, q.withdrawn, `${where}, withdrawn`, ['by', 'why'])) {
    if (!ADDERS.includes(q.withdrawn.by)) fail(file, `${where}, withdrawn: "by" is your role`)
    if (!isStr(q.withdrawn.why, 1, 200)) fail(file, `${where}, withdrawn: "why" says in at most 200 characters why the quotation is withdrawn`)
  }
}

// Checks the list, and what the step changed against `before` (append only).
// Returns the sources by id.
function checkSources(file, list, before, role) {
  const byId = new Map()
  if (!Array.isArray(list)) { fail(file, 'is a JSON array of sources'); return byId }
  const seen = new Map()
  list.forEach((s, k) => {
    const where = `source ${k + 1}`
    if (isObj(s) && Number.isInteger(s.id)) byId.set(s.id, s)
    if (!keys(file, s, where, SOURCE_KEYS)) return
    if (s.id !== k + 1) fail(file, `${where}: "id" is ${k + 1} (sources are numbered 1, 2, 3… in order)`)
    const p = urlProblem(s.url)
    if (p) fail(file, `${where}: url ${p}`)
    else {
      const n = normUrl(s.url)
      if (seen.has(n)) fail(file, `${where}: the same page as source ${seen.get(n)}; cite that source instead`)
      else seen.set(n, k + 1)
    }
    if (!isStr(s.title, 1, 300)) fail(file, `${where}: "title" is the page's title`)
    if (!isStr(s.publisher, 1, 120)) fail(file, `${where}: "publisher" is who published the page`)
    if (!KINDS.includes(s.kind)) fail(file, `${where}: "kind" is one of ${KINDS.join(', ')}`)
    else if (s.kind === 'filing' && !p && !onHost(s.url, FILING_HOSTS)) fail(file, `${where}: kind "filing" is only for ${FILING_HOSTS.join(', ')}; a company's own page is "primary"`)
    else if (s.kind === 'paper' && !p && !onHost(s.url, PAPER_HOSTS)) fail(file, `${where}: kind "paper" is only for ${PAPER_HOSTS.join(', ')}; a paper on a lab's own site is "primary"`)
    if (s.published !== null && !isDate(s.published)) fail(file, `${where}: "published" is the page's date (YYYY-MM-DD, UTC), or null for a living page`)
    if (!isDate(s.retrieved)) fail(file, `${where}: "retrieved" is the date you read the page (YYYY-MM-DD, UTC)`)
    else if (isDate(s.published) && s.published > s.retrieved) fail(file, `${where}: "published" comes after "retrieved"`)
    if (!ADDERS.includes(s.added_by)) fail(file, `${where}: "added_by" is the role that added it`)
    if (!Array.isArray(s.quotes) || !s.quotes.length) { fail(file, `${where}: "quotes" lists at least one quotation copied from the page`); return }
    s.quotes.forEach((q, j) => checkQuote(file, q, `${where}, quote ${j + 1}`))
    if (s.quotes.every(q => isObj(q) && q.withdrawn)) fail(file, `${where}: keep at least one quotation that is not withdrawn`)
  })
  if (!Array.isArray(before)) return byId
  if (list.length < before.length) fail(file, `has ${before.length - list.length} source(s) fewer than before your step: a source is never removed`)
  before.forEach((old, k) => {
    const now = list[k]
    if (!isObj(now) || !isObj(old)) return
    const where = `source ${k + 1}`
    const { quotes: oq, ...orest } = old
    const { quotes: nq, ...nrest } = now
    if (!same(orest, nrest)) fail(file, `${where}: a source already listed stays exactly as it was; you may only add quotations, or mark one "withdrawn"`)
    if (!Array.isArray(oq) || !Array.isArray(nq)) return
    if (nq.length < oq.length) fail(file, `${where}: a quotation is never removed; mark it "withdrawn" instead`)
    oq.forEach((q, j) => {
      const n = nq[j]
      if (!isObj(n) || !isObj(q) || same(q, n)) return
      const { withdrawn, ...rest } = n
      if (!q.withdrawn && withdrawn && same(q, rest)) {
        if (isObj(withdrawn) && withdrawn.by !== role) fail(file, `${where}, quote ${j + 1}: "withdrawn.by" is "${role}"`)
        return
      }
      fail(file, `${where}, quote ${j + 1}: a quotation already listed stays exactly as it was (you may only add "withdrawn")`)
    })
    nq.slice(oq.length).forEach((q, j) => { if (isObj(q) && q.by !== role) fail(file, `${where}, quote ${oq.length + j + 1}: "by" is "${role}"`) })
  })
  list.slice(before.length).forEach((s, j) => {
    if (!isObj(s)) return
    const where = `source ${before.length + j + 1}`
    if (s.added_by !== role) fail(file, `${where}: "added_by" is "${role}"`)
    if (Array.isArray(s.quotes)) s.quotes.forEach((q, i) => { if (isObj(q) && q.by !== role) fail(file, `${where}, quote ${i + 1}: "by" is "${role}"`) })
  })
  return byId
}

// A support quote must sit inside a quotation (or an image transcript) of its
// source that is not withdrawn: the platform checks those against the page.
function quoteIn(source, quote) {
  if (!isObj(source) || !Array.isArray(source.quotes)) return false
  const q = normText(quote)
  return source.quotes.some(x => isObj(x) && !x.withdrawn && normText(String((x.type === 'image' ? x.transcript : x.text) || '')).includes(q))
}
function checkSupport(file, list, where, byId) {
  if (!Array.isArray(list) || !list.length) { fail(file, `${where}: "support" lists at least one {"source", "quote"}`); return }
  list.forEach((s, j) => {
    const w = `${where}, support ${j + 1}`
    if (!keys(file, s, w, ['source', 'quote'])) return
    const src = byId.get(s.source)
    if (!src) fail(file, `${w}: source ${s.source} is not in sources.json`)
    else if (!isStr(s.quote, 8, 300)) fail(file, `${w}: "quote" has 8 to 300 characters`)
    else if (!quoteIn(src, s.quote)) fail(file, `${w}: this quote is not inside a quotation of source ${s.source}; first add the passage to that source's "quotes", copied exactly from the page`)
  })
}

/* ── corrections.json ── */

const CORRECTION_KEYS = ['id', 'by', 'model', 'kind', 'line', 'old', 'new', 'why']
// Checks the corrections the step added; returns them.
function checkCorrections(file, list, before, role, P, byId) {
  const added = []
  if (!Array.isArray(list)) { fail(file, 'is a JSON array (write [] when there is no correction)'); return added }
  const prior = Array.isArray(before) ? before : []
  if (list.length < prior.length || !prior.every((c, k) => same(c, list[k]))) {
    fail(file, 'only add corrections at the end: the ones already there stay exactly as they were')
    return added
  }
  const fresh = list.slice(prior.length)
  if (fresh.length && !P) { fail(file, 'stays [] at this step: there is no earlier text to correct'); return added }
  if (fresh.length > MAX_CORRECTIONS) fail(file, `at most ${MAX_CORRECTIONS} corrections per step (you added ${fresh.length})`)
  const lines = new Set()
  fresh.forEach((c, j) => {
    const k = prior.length + j
    const where = `correction ${k + 1}`
    if (!keys(file, c, where, CORRECTION_KEYS, ['support'])) return
    if (c.id !== k + 1) fail(file, `${where}: "id" is ${k + 1}`)
    if (c.by !== role) fail(file, `${where}: "by" is "${role}"`)
    if (!isStr(c.model, 1, 80)) fail(file, `${where}: "model" is the name the brief gives you`)
    if (!['fact', 'style'].includes(c.kind)) fail(file, `${where}: "kind" is "fact" or "style"`)
    if (!isStr(c.why, 1, 300)) fail(file, `${where}: "why" explains the correction in at most 300 characters`)
    if (!Number.isInteger(c.line) || c.line < 1 || c.line > P.length) { fail(file, `${where}: "line" is a line number of the article before your step (1 to ${P.length})`); return }
    if (lines.has(c.line)) fail(file, `${where}: one correction per line in a step`)
    lines.add(c.line)
    if (typeof c.old !== 'string' || typeof c.new !== 'string' || c.old.includes('\n') || c.new.includes('\n')) { fail(file, `${where}: "old" and "new" are single lines`); return }
    if (c.old !== P[c.line - 1]) { fail(file, `${where}: "old" is exactly line ${c.line} of the article before your step, which reads: ${short(P[c.line - 1], 140)}`); return }
    if ((c.line <= 5 && c.line !== 2 && c.line !== 3) || isMarker(c.old) || c.old === '') { fail(file, `${where}: line ${c.line} cannot be corrected (a marker, a blank line or the header frame)`); return }
    if (c.old === c.new) fail(file, `${where}: "new" is the same as "old"`)
    if (/<!--|-->/.test(c.new)) fail(file, `${where}: "new" holds no marker`)
    if (c.line === 2 || c.line === 3) {
      const key = c.line === 2 ? 'title' : 'dek'
      let v
      try { v = JSON.parse(c.new.slice(key.length + 2)) } catch { /* reported below */ }
      if (!c.new.startsWith(`${key}: "`) || typeof v !== 'string') fail(file, `${where}: a header line keeps its key and a JSON string: ${key}: "…"`)
    }
    const missing = citesOf(c.old).filter(n => !citesOf(c.new).includes(n))
    if (missing.length) fail(file, `${where}: "new" keeps every citation of "old" (missing ${missing.map(n => `[^${n}]`).join('')})`)
    for (const n of citesOf(c.new)) if (!byId.has(n)) fail(file, `${where}: [^${n}] is not a source in sources.json`)
    const delta = Math.abs(lineWords(c.new) - lineWords(c.old))
    if (delta > CORRECTION_WORD_DELTA) fail(file, `${where}: a correction changes a line's length by at most ${CORRECTION_WORD_DELTA} words (this one by ${delta}); add a sentence of your own instead`)
    if (c.kind === 'fact') checkSupport(file, c.support, where, byId)
    if (c.kind === 'style') {
      if (c.support !== undefined && !(Array.isArray(c.support) && !c.support.length)) fail(file, `${where}: a "style" correction has no "support"; correcting a fact is kind "fact"`)
      styleRules(file, where, c.old, c.new)
    }
    added.push(c)
  })
  return added
}

const numbersOf = s => stripCites(s).match(/\d+(?:[.,]\d+)*/g) || []
const quotedOf = s => [...normText(stripCites(s)).matchAll(/"([^"]+)"/g)].map(m => m[1])
const plainWords = s => wordsOf(normText(stripCites(s)).toLowerCase().replace(/[^\p{L}\p{N}\s'-]/gu, ' '))
// A style correction changes the form only: no number goes or comes (except
// in a date it makes absolute), quotations and citations stay, most words stay.
function styleRules(file, where, old, neu) {
  const rest = numbersOf(neu)
  for (const n of numbersOf(old)) {
    const i = rest.indexOf(n)
    if (i < 0) { fail(file, `${where}: a "style" correction changes no number ("${n}" is gone); correct a fact with kind "fact" and a source`); return }
    rest.splice(i, 1)
  }
  const inDates = [...neu.matchAll(DATE_TEXT)].flatMap(m => m[0].match(/\d+/g) || [])
  for (const n of rest) {
    const i = inDates.indexOf(n)
    if (i < 0) { fail(file, `${where}: a "style" correction adds no number, except in a date it makes absolute ("${n}")`); return }
    inDates.splice(i, 1)
  }
  if (!same(citesOf(old), citesOf(neu))) fail(file, `${where}: a "style" correction keeps the citations as they are`)
  if (!same(quotedOf(old), quotedOf(neu))) fail(file, `${where}: a "style" correction keeps every quotation as it is`)
  const ow = plainWords(old)
  const pool = plainWords(neu)
  let kept = 0
  for (const w of ow) { const i = pool.indexOf(w); if (i >= 0) { kept++; pool.splice(i, 1) } }
  if (ow.length && kept / ow.length < STYLE_KEEP) fail(file, `${where}: a "style" correction keeps at least ${Math.round(STYLE_KEEP * 100)}% of the words; this is a rewrite (correct a fact with kind "fact", or add a sentence)`)
}

/* ── claims.json ── */

const CLAIM_STATUS = ['supported', 'absence', 'derived', 'unsupported']
function checkClaims(file, list, art, byId, meta, correctedLines) {
  if (!Array.isArray(list) || !list.length) { fail(file, 'is a JSON array with at least one claim'); return }
  const lines = new Set(art.textRows.filter(r => !r.text.startsWith('#')).map(r => r.i + 1))
  lines.add(2)
  lines.add(3)
  const covered = new Set()
  list.forEach((c, k) => {
    const where = `claim ${k + 1}`
    if (!keys(file, c, where, ['id', 'line', 'claim', 'status'], ['support', 'note'])) return
    if (c.id !== k + 1) fail(file, `${where}: "id" is ${k + 1}`)
    if (!Number.isInteger(c.line) || !lines.has(c.line)) fail(file, `${where}: "line" is the number of a line of text in article.md (the title is line 2, the dek line 3; not a heading, a marker or a blank line)`)
    else covered.add(c.line)
    if (!isStr(c.claim, 1, 300)) fail(file, `${where}: "claim" states the claim in at most 300 characters`)
    if (!CLAIM_STATUS.includes(c.status)) { fail(file, `${where}: "status" is one of ${CLAIM_STATUS.join(', ')}`); return }
    if (c.status === 'supported') checkSupport(file, c.support, where, byId)
    else if (c.support !== undefined && !(Array.isArray(c.support) && !c.support.length)) checkSupport(file, c.support, where, byId)
    if (c.note !== undefined && !isStr(c.note, 1, 300)) fail(file, `${where}: "note" has at most 300 characters`)
    else if ((c.status === 'derived' || c.status === 'unsupported') && c.note === undefined) fail(file, `${where}: a "${c.status}" claim has a "note": how you got it, or what is missing`)
    if (c.status === 'unsupported' && meta?.status !== 'not_ready' && !correctedLines.has(c.line))
      fail(file, `${where}: an unsupported claim means "status": "not_ready" in meta.json (or a correction of that line in this step)`)
  })
  const need = art.textRows.filter(r => !r.text.startsWith('#') && (r.kp || /\d/.test(stripCites(r.text.replace(POST_LINK, 'post'))))).map(r => r.i + 1)
  if (/\d/.test(art.title || '')) need.push(2)
  if (/\d/.test(art.dek || '')) need.push(3)
  const missing = need.filter(n => !covered.has(n)).sort((a, b) => a - b)
  if (missing.length) fail(file, `every line with a number, and every key point, is the "line" of at least one claim; missing: line ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? ', …' : ''}`)
}

/* ── meta.json ── */

const META_KEYS = ['contract', 'id', 'cycle', 'kind', 'type', 'category', 'tags', 'primary_source', 'follow_up_of', 'sensitive', 'unconfirmed', 'covers', 'status', 'issues', 'image_brief']
function checkMeta(file, m) {
  if (!keys(file, m, 'meta.json', META_KEYS)) return false
  if (m.contract !== CONTRACT) fail(file, `"contract" is ${CONTRACT}`)
  const id = typeof m.id === 'string' ? m.id.match(ID) : null
  if (!id || !isDate(id[1]) || id[2].length > SLUG_MAX) fail(file, `"id" is YYYY-MM-DD-<slug>: lower-case words joined by "-", at most ${SLUG_MAX} characters after the date`)
  if (!isCycle(m.cycle)) fail(file, '"cycle" is the cycle: a date (YYYY-MM-DD), or <date>-2 for the second story of a day')
  else if (id && id[1] !== cycleDate(m.cycle)) fail(file, '"id" starts with the cycle date')
  if (!['story', 'recap'].includes(m.kind)) fail(file, '"kind" is "story" or "recap"')
  if (!CATEGORIES.includes(m.category)) fail(file, `"category" is one of ${CATEGORIES.join(', ')}`)
  if (!Array.isArray(m.tags) || m.tags.length < 1 || m.tags.length > 5 || new Set(m.tags).size !== m.tags.length) fail(file, '"tags" lists 1 to 5 different tags')
  else for (const t of m.tags) if (!TAGS.includes(t)) fail(file, `the tag "${t}" is not allowed; the tags are: ${TAGS.join(', ')}`)
  if (typeof m.sensitive !== 'boolean') fail(file, '"sensitive" is true or false')
  if (typeof m.unconfirmed !== 'boolean') fail(file, '"unconfirmed" is true or false')
  if (!['open', 'ready', 'not_ready', 'abandoned'].includes(m.status)) fail(file, '"status" is "open", "ready", "not_ready" or "abandoned"')
  if (!Array.isArray(m.issues)) fail(file, '"issues" is a list of short sentences')
  else m.issues.forEach((s, i) => { if (!isStr(s, 1) || countWords(s) > ISSUE_WORDS) fail(file, `issue ${i + 1} is a sentence of at most ${ISSUE_WORDS} words`) })
  if (m.image_brief !== null && (!isStr(m.image_brief, 1) || countWords(m.image_brief) > BRIEF_WORDS)) fail(file, `"image_brief" has at most ${BRIEF_WORDS} words`)
  if (m.kind === 'story') {
    if (!Object.hasOwn(TYPES, m.type)) fail(file, `"type" is one of ${Object.keys(TYPES).join(', ')}`)
    if (m.category === 'recap') fail(file, 'the category "recap" is for the weekly recap only')
    const p = urlProblem(m.primary_source)
    if (p) fail(file, `"primary_source" ${p}`)
    if (m.follow_up_of !== null && !(typeof m.follow_up_of === 'string' && ID.test(m.follow_up_of))) fail(file, '"follow_up_of" is null or the id of an earlier post')
    if (m.covers !== null) fail(file, '"covers" is null (it is for the recap)')
    if (m.unconfirmed === true && !TYPES[m.type]?.unconfirmed) fail(file, '"unconfirmed" is only for the types company and funding')
  } else if (m.kind === 'recap') {
    if (m.type !== 'recap' || m.category !== 'recap') fail(file, 'a recap has "type": "recap" and "category": "recap"')
    if (m.primary_source !== null || m.follow_up_of !== null || m.unconfirmed !== false) fail(file, 'a recap has "primary_source": null, "follow_up_of": null and "unconfirmed": false')
    if (!Array.isArray(m.covers)) fail(file, '"covers" lists the ids of the week\'s stories')
  }
  return true
}

/* ── topics.json and choice.json ── */

function checkTopics(file, t, cycle, primaries, followable) {
  if (!keys(file, t, 'topics.json', ['cycle', 'model', 'topics'])) return null
  if (t.cycle !== cycle) fail(file, `"cycle" is "${cycle}", the date in the folder name`)
  if (!isStr(t.model, 1, 80) || t.model.includes('"')) fail(file, '"model" is the name the brief gives you')
  if (!Array.isArray(t.topics) || t.topics.length !== 3) { fail(file, '"topics" holds exactly 3 topics'); return null }
  t.topics.forEach((x, k) => {
    const where = `topic ${k + 1}`
    if (!keys(file, x, where, ['n', 'title', 'type', 'summary', 'follow_up_of', 'sources'])) return
    if (x.n !== k + 1) fail(file, `${where}: "n" is ${k + 1}`)
    if (!isStr(x.title, 1, TITLE_MAX)) fail(file, `${where}: "title" has 1 to ${TITLE_MAX} characters`)
    if (!Object.hasOwn(TYPES, x.type)) fail(file, `${where}: "type" is one of ${Object.keys(TYPES).join(', ')}`)
    if (!isStr(x.summary, 1) || countWords(x.summary) > SUMMARY_WORDS) fail(file, `${where}: "summary" has at most ${SUMMARY_WORDS} words`)
    if (x.follow_up_of !== null && !followable.has(x.follow_up_of)) fail(file, `${where}: "follow_up_of" is null, or the id of a finished story in posts/`)
    if (!Array.isArray(x.sources) || x.sources.length < 2) { fail(file, `${where}: "sources" lists at least 2 pages`); return }
    const seen = new Set()
    let fresh = 0
    const domains = new Set()
    x.sources.forEach((s, j) => {
      const w = `${where}, source ${j + 1}`
      if (!keys(file, s, w, ['url', 'publisher', 'published'])) return
      if (!isStr(s.publisher, 1, 120)) fail(file, `${w}: "publisher" is who published the page`)
      if (s.published !== null && !isDate(s.published)) fail(file, `${w}: "published" is the page's date (YYYY-MM-DD, UTC) or null`)
      if (inWindow(s.published, cycle)) fresh++
      const p = urlProblem(s.url)
      if (p) { fail(file, `${w}: url ${p}`); return }
      const n = normUrl(s.url)
      if (seen.has(n)) fail(file, `${w}: the same page twice`)
      seen.add(n)
      domains.add(domainOf(s.url))
      if (x.follow_up_of === null && primaries.has(n)) fail(file, `${w}: this page is the primary source of ${primaries.get(n)}, already covered; pick another story, or set "follow_up_of" when it truly brings something new`)
    })
    if (domains.size < 2) fail(file, `${where}: the sources come from at least 2 different sites`)
    if (fresh < 2) fail(file, `${where}: at least 2 sources published between ${windowOf(cycle)[0]} and ${windowOf(cycle)[1]}: this is news of the day`)
  })
  return t
}

function checkChoice(file, c, cycle, topics) {
  if (!keys(file, c, 'choice.json', ['cycle', 'model', 'picked', 'why', 'trend', 'set_aside'])) return null
  if (c.cycle !== cycle) fail(file, `"cycle" is "${cycle}"`)
  if (!isStr(c.model, 1, 80) || c.model.includes('"')) fail(file, '"model" is the name the brief gives you')
  if (![1, 2, 3].includes(c.picked)) { fail(file, '"picked" is 1, 2 or 3'); return null }
  const topic = topics?.topics?.[c.picked - 1]
  if (!isObj(topic)) return null
  if (!isStr(c.why, 1) || countWords(c.why) > WHY_WORDS) fail(file, `"why" has at most ${WHY_WORDS} words`)
  const own = new Set((Array.isArray(topic.sources) ? topic.sources : []).map(s => normUrl(s?.url)))
  const min = TYPES[topic.type]?.trend ?? 3
  const domains = new Set()
  if (!Array.isArray(c.trend)) fail(file, '"trend" lists the articles that show the story is trending')
  else c.trend.forEach((s, j) => {
    const w = `trend ${j + 1}`
    if (!keys(file, s, w, ['url', 'publisher', 'published'])) return
    if (!isStr(s.publisher, 1, 120)) fail(file, `${w}: "publisher" is who published the page`)
    if (!inWindow(s.published, cycle)) fail(file, `${w}: "published" is a date between ${windowOf(cycle)[0]} and ${windowOf(cycle)[1]}`)
    const p = urlProblem(s.url)
    if (p) { fail(file, `${w}: url ${p}`); return }
    if (own.has(normUrl(s.url))) { fail(file, `${w}: this page is already a source of the topic; the trend shows other coverage`); return }
    domains.add(domainOf(s.url))
  })
  if (domains.size < min) fail(file, `"trend" lists at least ${min} articles from ${min} different sites, not already sources of topic ${c.picked} (found ${domains.size} site${domains.size === 1 ? '' : 's'})`)
  const others = [1, 2, 3].filter(n => n !== c.picked)
  if (!Array.isArray(c.set_aside) || c.set_aside.length !== 2) fail(file, `"set_aside" holds the 2 other topics (${others.join(' and ')})`)
  else c.set_aside.forEach((s, j) => {
    const w = `set_aside ${j + 1}`
    if (!keys(file, s, w, ['n', 'why'])) return
    if (s.n !== others[j]) fail(file, `${w}: "n" is ${others[j]}`)
    if (!isStr(s.why, 1) || countWords(s.why) > ASIDE_WORDS) fail(file, `${w}: "why" has at most ${ASIDE_WORDS} words`)
  })
  return topic
}

/* ── The repository at the step's base ── */

function postsAt(base) {
  const ids = [...new Set(baseFiles(base).map(f => f.match(/^posts\/([^/]+)\/meta\.json$/)?.[1]).filter(Boolean))]
  return ids.map(id => ({ id, meta: jsonAtBase(base, `posts/${id}/meta.json`) })).filter(p => isObj(p.meta))
}
function titleAt(base, id) {
  const m = (atBase(base, `posts/${id}/article.md`) || '').split('\n')[1]?.match(/^title: (".*")$/)
  try { return m ? JSON.parse(m[1]) : null } catch { return null }
}
function recentStories(base, S, ref) {
  return S.history.filter(h => h.kind === 'story' && h.status !== 'abandoned' && cycleDate(h.cycle) >= addDays(cycleDate(ref), -RECENT_DAYS))
    .map(h => ({ id: h.post, title: titleAt(base, h.post) || '(no title)', primary: jsonAtBase(base, `posts/${h.post}/meta.json`)?.primary_source }))
}
// The cycle a scout opens today: the date, or <date>-2 once today's first story is done.
function scoutCycle(S) {
  if (S.cycle === `${TODAY}-2`) return `${addDays(TODAY, 1)} (tomorrow: today already has two stories, the most a day can have)`
  if (S.cycle === TODAY) return `${TODAY}-2 (a second story today; at most two a day)`
  return `${TODAY} (or ${addDays(TODAY, -1)} when yesterday has no story yet)`
}
// How the last stories open and what their headings say, so a new one does not copy them.
function lastLooks(base, S) {
  const last = S.history.filter(h => h.kind === 'story' && h.status !== 'abandoned').slice(-RECENT_STORIES).reverse()
  if (!last.length) return []
  const out = ['', `How the last ${last.length === 1 ? 'story opens' : `${last.length} stories open`}, and their headings. Do not copy them: open on what is specific to this story, and write headings only it could have.`]
  for (const h of last) {
    const lines = toLines(atBase(base, `posts/${h.post}/article.md`) || '')
    const first = lines.slice(5).find(l => l && !l.startsWith('<!--') && !l.startsWith('#'))
    const heads = lines.filter(l => /^#{2,3} /.test(l)).map(l => `"${l.replace(/^#+ /, '')}"`)
    out.push(`  - ${h.post}: "${short(stripCites(first || ''), 110)}"`, `      headings: ${heads.length ? heads.join(', ') : '(none)'}`)
  }
  return out
}
// A warning, not a failure: a heading that fits any story, or one a recent story already used.
function headingWarnings(file, base, S, art, mine) {
  const used = new Map()
  for (const h of S.history.filter(x => x.kind === 'story' && x.status !== 'abandoned').slice(-2 * RECENT_STORIES)) {
    for (const l of toLines(atBase(base, `posts/${h.post}/article.md`) || '')) if (/^#{2,3} /.test(l)) used.set(l.replace(/^#+ /, '').trim().toLowerCase(), h.post)
  }
  for (const r of art.textRows) {
    if (!/^#{2,3} /.test(r.text) || !mine(r)) continue
    const h = r.text.replace(/^#+ /, '').trim()
    if (GENERIC_HEADING.test(h)) warn(file, `line ${r.i + 1}: "${h}" could head any story; say what is specific to this one`)
    else if (used.has(h.toLowerCase())) warn(file, `line ${r.i + 1}: "${h}" already heads a section of ${used.get(h.toLowerCase())}; vary the structure from one story to the next`)
  }
}

const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 'about', 'its', 'new', 'says', 'said', 'will', 'has', 'have', 'are', 'was', 'were', 'been', 'than', 'more'])
const keyWords = s => new Set(wordsOf(normText(s).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ')).filter(w => w.length > 2 && !STOP.has(w)))
function similarity(a, b) {
  const A = keyWords(a)
  const B = keyWords(b)
  return [...A].filter(w => B.has(w)).length / Math.max(1, Math.min(A.size, B.size))
}

// The weekly recap: due on the Sunday that ends the ISO week of the last story
// and on the Monday after; a recap step is still accepted one day later.
function recapPlan(S) {
  const stories = S.history.filter(h => h.kind === 'story')
  if (!stories.length) return null
  const wk = isoWeek(cycleDate(stories[stories.length - 1].cycle))
  const covers = stories.filter(h => h.status !== 'abandoned' && isoWeek(cycleDate(h.cycle)).sunday === wk.sunday).map(h => h.post)
  if (!covers.length) return null
  const id = `${wk.sunday}-week-${String(wk.week).padStart(2, '0')}-recap`
  if (S.history.some(h => h.post === id)) return null
  return { id, covers, week: wk.week, sunday: wk.sunday, due: TODAY >= wk.sunday && TODAY <= addDays(wk.sunday, 1), open: TODAY >= wk.sunday && TODAY <= addDays(wk.sunday, 2) }
}

function stateOk(S) {
  return isObj(S) && S.contract === CONTRACT && Array.isArray(S.history) && ['scout', 'editor', 'writer', 'reviser', 'checker', 'done'].includes(S.next)
    && (S.cycle === null || isCycle(S.cycle)) && (S.post === null || typeof S.post === 'string')
}
const nextRole = S => S.next === 'done' ? (recapPlan(S)?.due ? 'recap' : 'scout') : S.next

/* ── What a step may change ── */

function genericFiles(changes) {
  for (const [p, st] of changes) {
    if (st === 'D') { fail(p, 'was deleted: nothing is ever deleted here; restore it (git checkout <base> -- <file>)'); continue }
    if (st === 'T') { fail(p, 'changed type: write plain files only'); continue }
    let s
    try { s = lstatSync(join(ROOT, p)) } catch { continue }
    if (s.isSymbolicLink()) fail(p, 'is a symbolic link: write a plain file')
    else if (s.mode & 0o111) fail(p, 'is executable: remove the x permission (chmod -x)')
    if (s.size > MAX_FILE) fail(p, `is larger than ${MAX_FILE / 1024} KB`)
  }
}
function expectFiles(role, req, opt, changes) {
  for (const [p, st] of changes) {
    if (st === 'D' || st === 'T') continue
    const want = req.get(p) || opt.get(p)
    if (!want) fail(p, `is not a file the ${role} writes: undo this change`)
    else if (want !== st) fail(p, want === 'A' ? 'already existed before your step: this step creates a new file' : 'does not exist before your step')
  }
  for (const [p, st] of req) if (!changes.has(p)) fail(p, st === 'A' ? `is missing: the ${role} creates it` : `is unchanged: the ${role} updates it`)
}
function checkState(expected) {
  const now = jsonNow('state.json')
  if (now !== undefined && !same(now, expected)) fail('state.json', `must be exactly ${JSON.stringify(expected)}`)
}
function metaDiff(file, before, after, allowed) {
  for (const k of META_KEYS) if (!allowed.includes(k) && !same(before[k], after[k])) fail(file, `"${k}" cannot change at this step (it was ${JSON.stringify(before[k])})`)
  if (allowed.includes('sensitive') && before.sensitive === true && after.sensitive !== true) fail(file, '"sensitive" can be raised to true, never lowered')
}
function oneModel(file, names) {
  const set = new Set(names.filter(Boolean))
  if (set.size > 1) fail(file, `use the same model name everywhere in your step (found ${[...set].map(n => `"${n}"`).join(', ')})`)
}

/* ── The article across a step ── */

// Rule §10: the article after the step, without the step's own lines, is the
// article before it with the step's corrections applied. Returns, for each
// line before the step (0-based), its line after; null when the rule breaks.
function insertion(file, P, art, role, added) {
  const before = P.slice()
  for (const c of added) before[c.line - 1] = c.new
  const mine = new Set()
  for (const b of art.adds) if (b.role === role && b.end > 0) for (let i = b.start; i <= b.end; i++) mine.add(i)
  if (role === 'checker' && art.kp && art.kp.end > 0) for (let i = art.kp.start; i <= art.kp.end; i++) mine.add(i)
  const collapse = list => {
    const out = []
    for (const x of list) if (!(x.text === '' && out.length && out[out.length - 1].text === '')) out.push(x)
    while (out.length && out[out.length - 1].text === '') out.pop()
    return out
  }
  const a = collapse(art.lines.map((text, i) => ({ text, i })).filter(x => !mine.has(x.i)))
  const b = collapse(before.map((text, i) => ({ text, i })))
  const map = new Map()
  for (let k = 0; k < Math.max(a.length, b.length); k++) {
    if (a[k] && b[k] && a[k].text === b[k].text) { map.set(b[k].i, a[k].i); continue }
    const wrap = `<!-- add role="${role}" model="…" --> … <!-- /add -->`
    if (!b[k]) fail(file, `line ${a[k].i + 1} is not in the article before your step: your own lines go inside ${wrap}`)
    else if (!a[k]) fail(file, `line ${b[k].i + 1} of the article before your step is missing: ${short(b[k].text, 120)}`)
    else fail(file, `line ${b[k].i + 1} of the article before your step is missing, moved or changed (${short(b[k].text, 90)}); found at line ${a[k].i + 1} instead: ${short(a[k].text, 90)}. Keep every earlier line exactly, change one only through corrections.json, and put your own lines inside ${wrap}`)
    return null
  }
  return map
}

function citations(file, art, byId, sources, sourcesFile, postIds) {
  const used = new Set()
  for (const r of art.textRows) {
    for (const n of citesOf(r.text)) {
      used.add(n)
      if (!byId.has(n)) fail(file, `line ${r.i + 1}: [^${n}] is not a source in sources.json`)
    }
    for (const m of r.text.matchAll(POST_LINK)) if (!postIds.has(m[1])) fail(file, `line ${r.i + 1}: [[post:${m[1]}]] is not a post of this blog`)
  }
  if (Array.isArray(sources)) for (const s of sources) if (isObj(s) && Number.isInteger(s.id) && !used.has(s.id)) fail(sourcesFile, `source ${s.id} is never cited in article.md: cite it where it supports a sentence`)
}

function storySources(file, articleFile, art, sources, meta) {
  if (!Array.isArray(sources) || !isObj(meta)) return
  const valid = sources.filter(s => isObj(s) && !urlProblem(s.url))
  const domains = new Set(valid.map(s => domainOf(s.url)))
  if (sources.length < 3 || domains.size < 3) fail(file, `a story has at least 3 sources from 3 different sites (now ${sources.length} from ${domains.size})`)
  const prim = valid.find(s => normUrl(s.url) === normUrl(meta.primary_source))
  if (!prim) { fail(file, `the primary source chosen by the editor is one of the sources: ${short(meta.primary_source, 120)}`); return }
  const kinds = meta.unconfirmed ? ['press'] : TYPES[meta.type]?.primary || []
  if (!kinds.includes(prim.kind)) fail(file, `source ${prim.id}, the primary source, has kind ${kinds.map(k => `"${k}"`).join(' or ')} for a ${meta.type} story${meta.unconfirmed ? ' marked unconfirmed' : ''}`)
  if (!art.textRows.some(r => !r.add && !r.kp && citesOf(r.text).includes(prim.id))) fail(articleFile, `the writer's lines cite the primary source, [^${prim.id}]`)
  if (meta.unconfirmed) {
    if (new Set(valid.filter(s => s.kind === 'press').map(s => domainOf(s.url))).size < 2) fail(file, 'an unconfirmed story has at least 2 "press" sources from different sites')
    if (!/confirm|comment/i.test(art.dek || '')) fail(articleFile, 'the dek of an unconfirmed story says the company has not confirmed it')
    if (valid.some(s => s.kind === 'filing' || s.kind === 'primary')) warn(file, 'the story is marked unconfirmed but cites a filing or a primary source; if the company has confirmed it, say so in meta "issues"')
  }
}

/* ── The steps ── */

function scoutStep(base, S, changes) {
  const paths = [...changes.keys()].filter(p => /^editions\/[^/]+\/topics\.json$/.test(p))
  if (paths.length !== 1) {
    fail('editions/', `the scout writes one file, editions/<cycle>/topics.json, with <cycle> today's date (${TODAY}) or yesterday's, UTC (<date>-2 for a second story the same day)`)
    expectFiles('scout', new Map([['state.json', 'M']]), new Map(paths.map(p => [p, 'A'])), changes)
    return
  }
  const path = paths[0]
  const cycle = path.split('/')[1]
  expectFiles('scout', new Map([[path, 'A'], ['state.json', 'M']]), new Map(), changes)
  if (!isCycle(cycle)) { fail(path, 'the folder is named after the cycle: its date (YYYY-MM-DD), or <date>-2 for a second story the same day'); return }
  const day = cycleDate(cycle)
  if (day !== TODAY && day !== addDays(TODAY, -1)) fail(path, `the cycle is today (${TODAY}) or yesterday (${addDays(TODAY, -1)}), UTC`)
  if (S.cycle && cycleDate(S.cycle) === day && S.cycle.endsWith('-2')) fail(path, `${day} already has two stories, the most a day can have`)
  else if (cycle.endsWith('-2') && (!S.cycle || cycleDate(S.cycle) !== day)) fail(path, `${cycle} is the second story of ${day}: the first one is the cycle ${day}`)
  else if (S.cycle && cycleKey(cycle) <= cycleKey(S.cycle)) fail(path, `the cycle comes after the last one (${S.cycle})${cycleDate(S.cycle) === day ? `; a second story the same day is the cycle ${day}-2` : ''}`)
  const posts = postsAt(base).filter(p => p.meta.kind === 'story')
  const primaries = new Map(posts.filter(p => p.meta.status !== 'abandoned').map(p => [normUrl(p.meta.primary_source), p.id]))
  const followable = new Set(posts.filter(p => ['ready', 'not_ready'].includes(p.meta.status)).map(p => p.id))
  const t = jsonNow(path)
  if (t !== undefined) checkTopics(path, t, cycle, primaries, followable)
  checkState({ contract: CONTRACT, cycle, next: 'editor', post: null, history: S.history })
}

function editorStep(base, S, changes) {
  const cycle = S.cycle
  const choicePath = `editions/${cycle}/choice.json`
  const metaPaths = [...changes.keys()].filter(p => /^posts\/[^/]+\/meta\.json$/.test(p))
  const mp = metaPaths.length === 1 ? metaPaths[0] : null
  if (!mp) fail('posts/', `the editor creates one file posts/<id>/meta.json, with <id> = ${cycleDate(cycle)}-<slug>`)
  expectFiles('editor', new Map([[choicePath, 'A'], ['state.json', 'M'], ...(mp ? [[mp, 'A']] : [])]), new Map(), changes)
  const topics = jsonAtBase(base, `editions/${cycle}/topics.json`)
  const choice = jsonNow(choicePath)
  const topic = choice !== undefined ? checkChoice(choicePath, choice, cycle, topics) : null
  if (!mp) return
  const id = mp.split('/')[1]
  const m = id.match(ID)
  if (!m || m[1] !== cycleDate(cycle) || m[2].length > SLUG_MAX) fail(mp, `the folder is <id> = ${cycleDate(cycle)}-<slug>: lower-case words joined by "-", at most ${SLUG_MAX} characters after the date`)
  const meta = jsonNow(mp)
  if (meta !== undefined && checkMeta(mp, meta) && topic) {
    if (meta.id !== id) fail(mp, `"id" is "${id}", the folder name`)
    if (meta.cycle !== cycle) fail(mp, `"cycle" is "${cycle}"`)
    if (meta.kind !== 'story') fail(mp, '"kind" is "story"')
    if (meta.type !== topic.type) fail(mp, `"type" is "${topic.type}", the type of topic ${choice.picked}`)
    if (!same(meta.follow_up_of, topic.follow_up_of)) fail(mp, `"follow_up_of" is ${JSON.stringify(topic.follow_up_of)}, as in topic ${choice.picked}`)
    const urls = (Array.isArray(topic.sources) ? topic.sources : []).map(s => normUrl(s?.url))
    if (!urls.includes(normUrl(meta.primary_source))) fail(mp, `"primary_source" is one of the URLs of topic ${choice.picked}`)
    if (meta.status !== 'open' || meta.issues?.length || meta.image_brief !== null || meta.covers !== null)
      fail(mp, 'the editor writes "status": "open", "issues": [], "image_brief": null and "covers": null')
    if (TYPES[meta.type] && meta.category !== TYPES[meta.type].category) warn(mp, `the usual category of a ${meta.type} story is "${TYPES[meta.type].category}"`)
  }
  if (topic && isStr(topic.title)) for (const r of recentStories(base, S, cycle)) {
    if (similarity(topic.title, r.title) >= 0.6) warn(choicePath, `topic ${choice.picked} looks close to ${r.id} ("${short(r.title, 80)}"): make sure it is new`)
  }
  checkState({ contract: CONTRACT, cycle, next: 'writer', post: id, history: S.history })
}

function storyStep(base, S, role, changes) {
  const dir = `posts/${S.post}`
  const F = { meta: `${dir}/meta.json`, art: `${dir}/article.md`, src: `${dir}/sources.json`, corr: `${dir}/corrections.json`, claims: `${dir}/claims.json` }
  const req = new Map([['state.json', 'M']])
  const opt = new Map()
  if (role === 'writer') for (const f of [F.art, F.src, F.corr]) req.set(f, 'A')
  if (role === 'reviser') { req.set(F.art, 'M'); for (const f of [F.src, F.corr, F.meta]) opt.set(f, 'M') }
  if (role === 'checker') { req.set(F.art, 'M'); req.set(F.meta, 'M'); req.set(F.claims, 'A'); for (const f of [F.src, F.corr]) opt.set(f, 'M') }
  expectFiles(role, req, opt, changes)

  const metaBefore = jsonAtBase(base, F.meta)
  if (!isObj(metaBefore)) { fail(F.meta, 'is missing or unreadable at the commit your step started from'); return }
  const meta = changes.has(F.meta) ? jsonNow(F.meta) : metaBefore
  if (changes.has(F.meta) && meta !== undefined && checkMeta(F.meta, meta)) {
    if (role === 'reviser') metaDiff(F.meta, metaBefore, meta, ['sensitive'])
    if (role === 'checker') {
      metaDiff(F.meta, metaBefore, meta, ['sensitive', 'status', 'issues', 'image_brief'])
      if (!['ready', 'not_ready'].includes(meta.status)) fail(F.meta, 'the checker sets "status" to "ready" or "not_ready"')
      if (meta.status === 'not_ready' && !meta.issues?.length) fail(F.meta, 'with "not_ready", "issues" lists what is wrong')
      if (meta.image_brief === null) fail(F.meta, `the checker writes "image_brief": an abstract image in at most ${BRIEF_WORDS} words, no text, no logo, no real person`)
    }
  }
  const srcBefore = role === 'writer' ? [] : jsonAtBase(base, F.src)
  const sources = changes.has(F.src) ? jsonNow(F.src) : srcBefore
  const corrBefore = role === 'writer' ? [] : jsonAtBase(base, F.corr)
  const corrections = changes.has(F.corr) ? jsonNow(F.corr) : corrBefore
  const text = textNow(F.art)
  if (text == null || sources === undefined || corrections === undefined || meta === undefined) return
  const byId = checkSources(F.src, sources, srcBefore, role)
  const P = role === 'writer' ? null : toLines(atBase(base, F.art) || '')
  const added = checkCorrections(F.corr, corrections, corrBefore, role, P, byId)
  const art = parseArticle(text, F.art)
  citations(F.art, art, byId, sources, F.src, new Set(postsAt(base).map(p => p.id)))
  storySources(F.src, F.art, art, sources, meta)
  headingWarnings(F.art, base, S, art, role === 'writer' ? r => !r.add && !r.kp : r => r.add?.role === role)
  if (meta.sensitive !== metaBefore.sensitive && role === 'writer') fail(F.meta, 'the writer does not change meta.json')

  let map = new Map()
  if (role === 'writer') {
    if (art.adds.length || art.kp || art.watch >= 0) fail(F.art, 'the writer writes plain lines: no add, keypoints or watch markers')
    const n = art.words
    if (n < BUDGET.writer[0] || n > BUDGET.writer[1]) fail(F.art, `the writer writes ${BUDGET.writer[0]} to ${BUDGET.writer[1]} words (you wrote ${n}, headings included, citations left out)`)
  } else {
    for (const b of art.adds) if (!['reviser', 'checker'].includes(b.role)) fail(F.art, `line ${b.start + 1}: an add block's role is "reviser" or "checker"`)
    if (art.watch >= 0) fail(F.art, `line ${art.watch + 1}: <!-- watch --> is for the weekly recap`)
    map = insertion(F.art, P, art, role, added) || new Map()
    const mine = r => r.add?.role === role
    const n = stepWords(art, mine)
    const [lo, hi] = BUDGET[role]
    if (n < lo || n > hi) fail(F.art, `the ${role} adds ${lo} to ${hi} words inside its add blocks (you added ${n}${role === 'checker' ? ', key points left out' : ''})`)
    oneModel(F.art, [...art.adds.filter(b => b.role === role).map(b => b.model), ...(role === 'checker' ? [art.kp?.model] : []), ...added.map(c => c.model)])
    if (role === 'reviser' && art.kp) fail(F.art, 'the key points are the checker\'s')
    if (role === 'checker' && !art.kp) fail(F.art, `the checker ends the file with <!-- keypoints model="…" -->, 3 "- " key points, <!-- /keypoints -->`)
  }
  if (art.words > BUDGET.total) fail(F.art, `the whole article has at most ${BUDGET.total} words (it has ${art.words})`)

  if (role === 'checker') {
    const claims = jsonNow(F.claims)
    const corrected = new Set(added.map(c => (map.get(c.line - 1) ?? -2) + 1))
    if (claims !== undefined) checkClaims(F.claims, claims, art, byId, meta, corrected)
    checkState({ contract: CONTRACT, cycle: S.cycle, next: 'done', post: null, history: [...S.history, { cycle: S.cycle, post: S.post, kind: 'story', status: meta.status }] })
  } else {
    checkState({ ...S, next: role === 'writer' ? 'reviser' : 'checker' })
  }
}

function abandonStep(base, S, changes) {
  const mp = `posts/${S.post}/meta.json`
  expectFiles(`${S.next} (abandoning the story)`, new Map([[mp, 'M'], ['state.json', 'M']]), new Map(), changes)
  const before = jsonAtBase(base, mp)
  const meta = jsonNow(mp)
  if (!isObj(before) || meta === undefined || !checkMeta(mp, meta)) return
  metaDiff(mp, before, meta, ['status', 'issues'])
  if (!meta.issues?.length) fail(mp, 'an abandoned story says why in "issues"')
  checkState({ contract: CONTRACT, cycle: S.cycle, next: 'done', post: null, history: [...S.history, { cycle: S.cycle, post: S.post, kind: 'story', status: 'abandoned' }] })
}

function recapStep(base, S, changes, plan) {
  const dir = `posts/${plan.id}`
  const F = { meta: `${dir}/meta.json`, art: `${dir}/article.md`, src: `${dir}/sources.json`, corr: `${dir}/corrections.json`, claims: `${dir}/claims.json` }
  expectFiles('recap', new Map([['state.json', 'M'], ...Object.values(F).map(f => [f, 'A'])]), new Map(), changes)
  const meta = jsonNow(F.meta)
  if (meta !== undefined && checkMeta(F.meta, meta)) {
    if (meta.id !== plan.id) fail(F.meta, `"id" is "${plan.id}"`)
    if (meta.cycle !== plan.sunday) fail(F.meta, `"cycle" is "${plan.sunday}", the Sunday of the week`)
    if (meta.kind !== 'recap') fail(F.meta, '"kind" is "recap"')
    if (!same(meta.covers, plan.covers)) fail(F.meta, `"covers" is ${JSON.stringify(plan.covers)}`)
    if (!['ready', 'not_ready'].includes(meta.status)) fail(F.meta, '"status" is "ready" or "not_ready"')
    if (meta.status === 'not_ready' && !meta.issues?.length) fail(F.meta, 'with "not_ready", "issues" lists what is wrong')
    if (meta.image_brief === null) fail(F.meta, `"image_brief" describes an abstract image in at most ${BRIEF_WORDS} words`)
  }
  const sources = jsonNow(F.src)
  const corrections = jsonNow(F.corr)
  const text = textNow(F.art)
  if (corrections !== undefined && !(Array.isArray(corrections) && !corrections.length)) fail(F.corr, 'is [] for the recap')
  if (text == null || sources === undefined || meta === undefined) return
  const byId = checkSources(F.src, sources, [], 'recap')
  const domains = new Set((Array.isArray(sources) ? sources : []).filter(s => isObj(s) && !urlProblem(s.url)).map(s => domainOf(s.url)))
  if (!Array.isArray(sources) || sources.length < 3 || domains.size < 3) fail(F.src, 'the recap has at least 3 sources from 3 different sites')
  const art = parseArticle(text, F.art)
  citations(F.art, art, byId, sources, F.src, new Set(postsAt(base).map(p => p.id)))
  if (art.adds.length) fail(F.art, 'the recap is written in one step: no add markers')
  if (!art.kp) fail(F.art, 'the recap ends with <!-- keypoints model="…" -->, 3 "- " key points, <!-- /keypoints -->')
  if (art.watch < 0) fail(F.art, 'the recap has the line <!-- watch --> right before its last "## " section')
  else {
    const sections = []
    let cur = null
    for (const b of art.blocks) {
      if (b.kp) continue
      if (b.type === 'heading' && b.rows[0].text.startsWith('## ')) { cur = { at: b.rows[0].i, words: 0, cites: 0, after: b.rows[0].i > art.watch }; sections.push(cur); continue }
      if (!cur) { fail(F.art, `line ${b.rows[0].i + 1}: the recap starts with a "## " section heading`); cur = { at: b.rows[0].i, words: 0, cites: 0, after: false, lead: true }; continue }
      for (const r of b.rows) { cur.words += lineWords(r.text); cur.cites += citesOf(r.text).length }
    }
    const main = sections.filter(s => !s.after)
    if (main.length < RECAP_SECTIONS[0] || main.length > RECAP_SECTIONS[1]) fail(F.art, `the recap has ${RECAP_SECTIONS[0]} to ${RECAP_SECTIONS[1]} "## " sections before <!-- watch --> (it has ${main.length})`)
    if (sections.filter(s => s.after).length !== 1) fail(F.art, 'after <!-- watch --> comes exactly one "## " section: the story to watch')
    for (const s of sections) {
      if (s.words < RECAP_SECTION_WORDS[0] || s.words > RECAP_SECTION_WORDS[1]) fail(F.art, `line ${s.at + 1}: a recap section has ${RECAP_SECTION_WORDS[0]} to ${RECAP_SECTION_WORDS[1]} words (this one has ${s.words})`)
      if (!s.cites) fail(F.art, `line ${s.at + 1}: every recap section cites at least one source`)
    }
  }
  if (art.words > BUDGET.total) fail(F.art, `the recap has at most ${BUDGET.total} words (it has ${art.words})`)
  const claims = jsonNow(F.claims)
  if (claims !== undefined) checkClaims(F.claims, claims, art, byId, meta, new Set())
  checkState({ contract: CONTRACT, cycle: S.cycle, next: 'done', post: null, history: [...S.history, { cycle: plan.sunday, post: plan.id, kind: 'recap', status: meta?.status }] })
}

/* ── --todo ── */

function todo(base, S) {
  const L = []
  const p = (...s) => L.push(...s)
  const json = v => JSON.stringify(v)
  const role = nextRole(S)
  const plan = S.next === 'done' ? recapPlan(S) : null
  p(`AI Newsroom · check ${VERSION} · contract ${CONTRACT} · today ${TODAY} (UTC)`, '', `YOUR ROLE: ${role.toUpperCase()}`)
  if (S.cycle && role !== 'scout') p(`Cycle: ${S.cycle}`)
  if (S.post) p(`Story: posts/${S.post}/`)
  p('')
  const recent = recentStories(base, S, S.cycle && role !== 'scout' ? S.cycle : TODAY)
  const recentList = () => recent.length ? recent.map(r => `  - ${r.id}: ${r.title}${r.primary ? `\n      primary source: ${r.primary}` : ''}`) : ['  (none)']
  const meta = S.post ? jsonAtBase(base, `posts/${S.post}/meta.json`) : null

  if (role === 'scout') {
    p('Find 3 candidate AI news stories of the last 3 days. Write:',
      `  A editions/<cycle>/topics.json   <cycle> = ${scoutCycle(S)}`,
      '  M state.json',
      '', 'Rules:',
      '  - exactly 3 topics, "n" 1 to 3; "summary" at most 60 words; "follow_up_of" null or the id of a finished story',
      `  - "type": ${Object.keys(TYPES).join(', ')}`,
      '  - each topic has at least 2 sources (https) from 2 different sites, and at least 2 of them published',
      '    between <cycle> - 3 days and <cycle> + 1 day; "published" is the page\'s own date (UTC) or null',
      '  - not sources: aggregators, search pages, social networks, video sites, URL shorteners, archives',
      '  - a topic whose source is the primary source of a story already covered is refused (unless follow_up_of)',
      '', `Stories of the last ${RECENT_DAYS} days:`, ...recentList(),
      '', `state.json after your step: ${json({ contract: CONTRACT, cycle: scoutCycle(S).split(' ')[0], next: 'editor', post: null, history: S.history })}`)
  } else if (role === 'editor') {
    const topics = jsonAtBase(base, `editions/${S.cycle}/topics.json`)
    p('Pick the most trending topic that is not already covered. Write:',
      `  A editions/${S.cycle}/choice.json`, `  A posts/${cycleDate(S.cycle)}-<slug>/meta.json   <slug>: lower-case words joined by "-", at most ${SLUG_MAX} characters`, '  M state.json',
      '', 'The topics:')
    for (const t of topics?.topics || []) p(`  ${t.n}. [${t.type}] ${t.title}`, ...(t.sources || []).map(s => `       ${s.published || 'no date'}  ${s.url}`))
    p('', 'Rules:',
      '  - choice.json: "picked" 1 to 3; "why" at most 80 words; "set_aside" gives the 2 other topics, each with a "why" of at most 30 words',
      `  - "trend": at least 3 articles from 3 different sites (2 for research and open_source), published between ${windowOf(S.cycle)[0]} and ${windowOf(S.cycle)[1]}, none of them already a source of the topic`,
      '  - meta.json: "type" and "follow_up_of" as in the topic; "primary_source" is one of its URLs, of the kind its type needs:')
    for (const [t, v] of Object.entries(TYPES)) p(`      ${t.padEnd(13)} ${v.primary.join(' or ')}${v.unconfirmed ? ' (or "unconfirmed": true, press only)' : ''}   category ${v.category}`)
    p('  - "sensitive": true when the story is about people or accusations', '  - 1 to 5 tags:', `      ${TAGS.join(', ')}`,
      '', `Stories of the last ${RECENT_DAYS} days:`, ...recentList(),
      '', 'meta.json:', `  ${json({ contract: CONTRACT, id: `${cycleDate(S.cycle)}-<slug>`, cycle: S.cycle, kind: 'story', type: '<type of the topic>', category: '<category>', tags: ['<tag>'], primary_source: '<url>', follow_up_of: null, sensitive: false, unconfirmed: false, covers: null, status: 'open', issues: [], image_brief: null })}`,
      '', `state.json after your step: ${json({ ...S, next: 'writer', post: `${cycleDate(S.cycle)}-<slug>` })}`)
  } else if (role === 'writer') {
    const choice = jsonAtBase(base, `editions/${S.cycle}/choice.json`)
    const topic = jsonAtBase(base, `editions/${S.cycle}/topics.json`)?.topics?.[(choice?.picked || 1) - 1]
    p(`Write the story: ${topic?.title || S.post}`, `  ${topic?.summary || ''}`,
      '', `  A posts/${S.post}/article.md`, `  A posts/${S.post}/sources.json`, `  A posts/${S.post}/corrections.json   (write [])`, '  M state.json',
      '', `Type ${meta?.type}, category ${meta?.category}${meta?.sensitive ? ', SENSITIVE (people or accusations: right of reply, attribute every allegation)' : ''}${meta?.unconfirmed ? ', UNCONFIRMED (press only: say so in the title and the dek)' : ''}.`,
      `Primary source (cite it, kind ${meta?.unconfirmed ? 'press' : TYPES[meta?.type]?.primary.join(' or ')}): ${meta?.primary_source}`,
      '', 'Rules:',
      '  - header: 4 lines (---, title: "…" at most 110 characters, dek: "…" at most 40 words, ---), then a blank line',
      `  - ${BUDGET.writer[0]} to ${BUDGET.writer[1]} words; "## " or "### " headings; blocks separated by one blank line; ONE SENTENCE PER LINE`,
      '  - every paragraph cites a source; every sentence with a number or a quotation ends with its own [^n]',
      '  - no links, URLs, HTML, images, tables, code blocks or "> " quotes',
      '  - at least 3 sources from 3 different sites; every quotation copied exactly from the page (8+ words, 20-300 characters)',
      '  - if the story turns out false or not news, abandon it: set meta "status": "abandoned" with "issues", and state "next": "done"',
      ...lastLooks(base, S),
      '', `state.json after your step: ${json({ ...S, next: 'reviser' })}`)
  } else if (role === 'reviser' || role === 'checker') {
    const lines = toLines(atBase(base, `posts/${S.post}/article.md`) || '')
    const sources = jsonAtBase(base, `posts/${S.post}/sources.json`) || []
    const [lo, hi] = BUDGET[role]
    p(role === 'reviser'
      ? 'Revise the story: check it against its sources, add what is missing where it belongs, correct what is wrong.'
      : 'Check every claim of the story, add what readers still do not know, and write the key points.',
      '', `  M posts/${S.post}/article.md`, `  M posts/${S.post}/sources.json       (optional: new sources, new quotations, "withdrawn")`,
      `  M posts/${S.post}/corrections.json   (optional: at most ${MAX_CORRECTIONS})`,
      ...(role === 'checker' ? [`  M posts/${S.post}/meta.json   ("status" ready or not_ready, "issues", "image_brief")`, `  A posts/${S.post}/claims.json`] : [`  M posts/${S.post}/meta.json   (optional: only "sensitive" false -> true)`]),
      '  M state.json',
      '', 'Rules:',
      `  - insert your sentences anywhere, one per line, inside <!-- add role="${role}" model="<your name>" --> … <!-- /add --> (whole lines)`,
      `  - add ${lo} to ${hi} words; never delete, move or retype a line of the article below`,
      '  - change a line only with a correction in corrections.json: {"id", "by", "model", "kind": "fact"|"style", "line", "old", "new", "why", "support"}',
      '    "line" and "old" come from the numbered article below; a "fact" correction needs "support": [{"source", "quote"}], the quote inside that source\'s quotations')
    if (role === 'checker') p(
      '  - end the file with a blank line, <!-- keypoints model="<your name>" -->, 3 "- " key points (at most 30 words, cited), <!-- /keypoints -->',
      '  - claims.json: every line with a number and every key point is the "line" of a claim (line numbers of the article AFTER your step):',
      '    {"id", "line", "claim", "status": "supported"|"absence"|"derived"|"unsupported", "support": [{"source", "quote"}], "note"}',
      '  - an unsupported claim means "status": "not_ready" (unless you correct that line now)')
    p('  - if the story turns out false, abandon it: meta "status": "abandoned" with "issues", state "next": "done"',
      ...(role === 'reviser' ? lastLooks(base, S) : []),
      '', `The article now (${lines.length} lines):`, ...lines.map((l, i) => `${String(i + 1).padStart(4)}  ${l}`),
      '', 'The sources:', ...sources.map(s => `  [^${s.id}] ${s.kind.padEnd(9)} ${s.publisher} · ${s.published || 'no date'} · ${s.url} (${plural(s.quotes?.length || 0, 'quotation')})`),
      '', `state.json after your step: ${role === 'reviser' ? json({ ...S, next: 'checker' }) : json({ contract: CONTRACT, cycle: S.cycle, next: 'done', post: null, history: [...S.history, { cycle: S.cycle, post: S.post, kind: 'story', status: '<ready|not_ready>' }] })}`)
  } else if (role === 'recap') {
    p(`Write the recap of week ${plan.week} (Monday ${addDays(plan.sunday, -6)} to Sunday ${plan.sunday}):`,
      ...['meta.json', 'article.md', 'sources.json', 'corrections.json   (write [])', 'claims.json'].map(f => `  A posts/${plan.id}/${f}`), '  M state.json',
      '', 'The stories of the week ("covers"):', ...plan.covers.map(id => `  - ${id}: ${titleAt(base, id) || ''}`))
    const asides = []
    for (const f of baseFiles(base)) {
      const m = f.match(/^editions\/(\d{4}-\d{2}-\d{2})\/choice\.json$/)
      if (!m || isoWeek(m[1]).sunday !== plan.sunday) continue
      const c = jsonAtBase(base, f)
      const t = jsonAtBase(base, `editions/${m[1]}/topics.json`)
      for (const s of c?.set_aside || []) asides.push(`  - ${m[1]}: ${t?.topics?.[s.n - 1]?.title || '?'}`)
    }
    p('', 'Topics set aside this week (you may use them):', ...(asides.length ? asides : ['  (none)']),
      '', 'Rules:',
      `  - ${RECAP_SECTIONS[0]} to ${RECAP_SECTIONS[1]} "## " sections of ${RECAP_SECTION_WORDS[0]} to ${RECAP_SECTION_WORDS[1]} words, each citing a source; then the line <!-- watch --> and one last "## " section: the story to watch`,
      '  - then a blank line and <!-- keypoints model="<your name>" -->, 3 "- " key points, <!-- /keypoints -->; no add markers',
      '  - link a story of the blog with [[post:<id>]]; at least 3 sources from 3 sites; claims.json as for the checker',
      '', 'meta.json:', `  ${json({ contract: CONTRACT, id: plan.id, cycle: plan.sunday, kind: 'recap', type: 'recap', category: 'recap', tags: ['<tag>'], primary_source: null, follow_up_of: null, sensitive: false, unconfirmed: false, covers: plan.covers, status: '<ready|not_ready>', issues: [], image_brief: '<abstract image, at most 60 words>' })}`,
      '', `state.json after your step: ${json({ contract: CONTRACT, cycle: S.cycle, next: 'done', post: null, history: [...S.history, { cycle: plan.sunday, post: plan.id, kind: 'recap', status: '<ready|not_ready>' }] })}`)
  }
  p('', `Before you finish: ${CMD} must print OK. It compares your files with the commit your step started from.`)
  console.log(L.join('\n'))
}

/* ── Main ── */

function main() {
  if (!ROOT) { console.log('FAIL · not inside a git repository: run the check from the newsroom repository'); process.exitCode = 1; return }
  const base = stepBase()
  const S = base ? jsonAtBase(base, 'state.json') : undefined
  if (!stateOk(S)) { console.log(`FAIL · state.json at the commit your step started from (${(base || 'none').slice(0, 7)}) is missing or unreadable`); process.exitCode = 1; return }
  if (process.argv.includes('--todo')) { todo(base, S); return }
  const changes = stepChanges(base)
  if (!changes.size) { console.log(`OK · nothing has changed yet (check ${VERSION}). Next step: the ${nextRole(S)}. Run ${CMD} --todo for the worklist.`); return }
  genericFiles(changes)
  let role = S.next
  if (S.next === 'scout' || S.next === 'done') {
    const plan = S.next === 'done' ? recapPlan(S) : null
    if ([...changes.keys()].some(p => /^posts\/[^/]+-recap\//.test(p))) {
      role = 'recap'
      if (!plan?.open) fail(null, `no weekly recap is due now: run ${CMD} --todo`)
      else recapStep(base, S, changes, plan)
    } else {
      role = 'scout'
      if (plan?.due) fail(null, `the recap of week ${plan.week} (${plan.id}) comes before a new cycle today: run ${CMD} --todo`)
      scoutStep(base, S, changes)
    }
  } else if (S.next === 'editor') {
    editorStep(base, S, changes)
  } else {
    const mp = `posts/${S.post}/meta.json`
    const m = peekJson(mp)
    if (changes.has(mp) && isObj(m) && m.status === 'abandoned') { role = `${S.next} (abandon)`; abandonStep(base, S, changes) }
    else storyStep(base, S, S.next, changes)
  }
  for (const w of warnings) console.log(`warning · ${w}`)
  if (!errors.length) { console.log(`OK · the ${role} step follows the contract (check ${VERSION}).`); return }
  console.log(`FAIL · the ${role} step breaks ${plural(errors.length, 'rule')} (check ${VERSION}). Fix them, then run ${CMD} again:`)
  for (const e of errors.slice(0, 40)) console.log(`- ${e}`)
  if (errors.length > 40) console.log(`- … and ${errors.length - 40} more`)
  process.exitCode = 1
}

main()
