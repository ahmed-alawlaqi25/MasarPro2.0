import { normalizeResumeContent } from './resumeContent.js'

const headings = {
  summary: /^(professional summary|summary|profile|about me|objective|career objective|نبذة شخصية|الملخص المهني|نبذة عني|الهدف المهني)$/i,
  experience: /^(professional experience|work experience|employment history|experience|الخبرات المهنية|الخبرات العملية|الخبرة العملية)$/i,
  education: /^(education(?:\s*(?:&|and)\s*training)?|education and qualifications|qualifications|certifications|training|التعليم والتدريب|التعليم|المؤهلات العلمية|الدورات التدريبية)$/i,
  projects: /^(projects|personal projects|selected projects|المشاريع|المشروعات)$/i,
  skills: /^(technical skills|skills|core skills|core competencies|المهارات|المهارات التقنية)$/i,
  other: /^(languages|additional information|additional experience|references|interests|awards|publications|اللغات|معلومات إضافية|المراجع|الاهتمامات)$/i,
}
const bullet = /^[•●▪◦*\-–]\s*/
const month = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'
const dateToken = `(?:${month}\\.?\\s+\\d{4}|\\d{4}[-/]\\d{1,2}|\\d{1,2}/\\d{4}|(?:19|20)\\d{2})`
const rangePattern = new RegExp(`(${dateToken})\\s*(?:-|–|—|to|إلى)\\s*(${dateToken}|present|current|now|حتى الآن|الآن)`, 'i')
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

function monthValue(value) {
  const english = value.match(/^([a-z]+)\.?\s+(\d{4})$/i)
  if (english) return `${english[2]}-${String(months.indexOf(english[1].slice(0, 3).toLowerCase()) + 1).padStart(2, '0')}`
  const numeric = /^(?:\d{4}[-/]\d{1,2}|\d{1,2}\/\d{4})$/.test(value)
  if (numeric) {
    // Year-only dates stay in the source. Do not invent a month.
    const parts = value.split(/[-/]/)
    const [year, number] = parts[0].length === 4 ? parts : [parts[1], parts[0]]
    if (+number >= 1 && +number <= 12) return `${year}-${number.padStart(2, '0')}`
  }
  return ''
}

function dates(line) {
  const match = line.match(rangePattern)
  return match ? {
    startDate: monthValue(match[1]), endDate: monthValue(match[2]),
    isCurrent: /present|current|now|الآن/i.test(match[2]),
  } : {}
}

function entries(lines, section) {
  const groups = []
  let group = []
  let dated = false
  let hasBullets = false
  for (const line of lines) {
    const hasDate = rangePattern.test(line)
    const isBullet = bullet.test(line)
    if ((!line || (hasDate && dated) || (hasBullets && !isBullet)) && group.length) {
      groups.push(group)
      group = []
      dated = false
      hasBullets = false
    }
    if (line) group.push(line)
    dated ||= hasDate
    hasBullets ||= isBullet
  }
  if (group.length) groups.push(group)
  return groups.map(lines => {
    const dateLine = lines.find(line => rangePattern.test(line)) || ''
    const cleaned = lines.map(line => line.replace(rangePattern, '').replace(/\s*[|,]\s*$/, '').trim()).filter(Boolean)
    const first = (cleaned.shift() || '').replace(bullet, '')
    const parts = first.split(/\s+(?:\||@|at)\s+/i)
    const details = cleaned.map(line => line.replace(bullet, ''))
    const common = { ...dates(dateLine) }
    if (section === 'experience') return { ...common, position: parts[0], company: parts.slice(1).join(' | '), highlights: details }
    if (section === 'education') return { ...common, qualification: parts[0], institution: parts.slice(1).join(' | '), description: details.join('\n') }
    return { ...common, name: first, description: details.join('\n'), url: lines.join(' ').match(/https?:\/\/[^\s|]+/i)?.[0] || '' }
  })
}

export function parseResumeText(rawText, fileName = '') {
  const source = rawText.replace(/\r/g, '').trim()
  const sections = { header: [], summary: [], experience: [], education: [], projects: [], skills: [], other: [] }
  let current = 'header'
  for (const raw of source.split('\n')) {
    const line = raw.trim()
    const label = line.replace(/[:：]\s*$/, '').replace(/\s+/g, ' ')
    const section = Object.keys(headings).find(key => headings[key].test(label))
    if (section) current = section
    else sections[current].push(line)
  }
  const header = sections.header.filter(Boolean)
  const headerText = header.join('\n')
  const email = headerText.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] || ''
  const phone = headerText.match(/(?:\+?\d[\d ().-]{6,}\d)/)?.[0]?.trim() || ''
  const links = headerText.match(/(?:https?:\/\/|www\.|linkedin\.com\/|github\.com\/)[^\s|]+/gi) || []
  const names = header.filter(line => !/[@\d]|https?:|www\.|linkedin\.|github\./i.test(line) && !/^(resume|curriculum vitae|cv|السيرة الذاتية)$/i.test(line) && line.length < 100)
  const labelled = label => header.find(line => label.test(line))?.replace(label, '').trim() || ''
  const content = normalizeResumeContent({
    personal: {
      fullName: labelled(/^(?:name|full name|الاسم)\s*[:：]\s*/i) || names[0] || '',
      professionalTitle: names[1] || '', email, phone,
      location: labelled(/^(?:location|address|الموقع|العنوان)\s*[:：]\s*/i),
      linkedin: links.find(link => /linkedin\.com/i.test(link)) || '',
      website: links.find(link => !/linkedin\.com/i.test(link)) || '',
    },
    summary: sections.summary.filter(Boolean).join('\n'),
    experience: entries(sections.experience, 'experience'),
    education: entries(sections.education, 'education'),
    projects: entries(sections.projects, 'projects'),
    skills: sections.skills.filter(Boolean).map(line => {
      const cleaned = line.replace(bullet, '')
      const separator = cleaned.search(/[:：]/)
      return separator < 0 ? { category: '', items: cleaned } : { category: cleaned.slice(0, separator), items: cleaned.slice(separator + 1).trim() }
    }),
    importSource: { fileName, text: source },
  })
  return content
}

// Respect PDF line boundaries and vertical positions. Column layouts still need review.
export function pdfTextLines(items) {
  const lines = []
  let line = ''
  let y
  for (const item of items) {
    if (typeof item.str !== 'string') continue
    const nextY = item.transform?.[5]
    if (line && y !== undefined && nextY !== undefined && Math.abs(nextY - y) > 3) {
      lines.push(line.trim())
      line = ''
    }
    line += `${line && !/\s$/.test(line) ? ' ' : ''}${item.str}`
    y = nextY
    if (item.hasEOL) {
      lines.push(line.trim())
      line = ''
    }
  }
  if (line.trim()) lines.push(line.trim())
  return lines.join('\n')
}
