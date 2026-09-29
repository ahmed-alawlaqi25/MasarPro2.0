import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseResumeText, pdfTextLines } from './resumeImport.js'
import { readResumePdf } from './readResumePdf.js'

test('rejects unsupported, oversized, and invalid files before loading PDF code', async () => {
  await assert.rejects(readResumePdf(null), /^Error: file$/)
  await assert.rejects(readResumePdf({ name: 'cv.docx', type: 'application/msword' }), /^Error: file$/)
  await assert.rejects(readResumePdf({ name: 'cv.pdf', size: 6 * 1024 * 1024 }), /^Error: size$/)
  await assert.rejects(readResumePdf({ name: 'cv.pdf', size: 10, arrayBuffer: async () => new TextEncoder().encode('not a pdf').buffer }), /^Error: file$/)
})

test('maps English sections into the existing editor structure', () => {
  const content = parseResumeText(`Ahmed Hassan
Software Engineer
ahmed@example.com | +966 55 123 4567
Location: Riyadh
https://linkedin.com/in/ahmed https://github.com/ahmed
PROFESSIONAL SUMMARY
Developer building accessible applications.
PROFESSIONAL EXPERIENCE
Engineer | Example Ltd Jan 2024 - Present
• Built applications
• Reviewed code

Intern | Demo Ltd 06/2023 - 12/2023
• Wrote tests
EDUCATION & TRAINING
BSc Computing | Example University Sep 2019 - Jun 2023
Graduated with distinction
PROJECTS
Job Tracker Jan 2024 - Mar 2024
• Built a dashboard
TECHNICAL SKILLS
Frontend: React, CSS
SQL, Git
LANGUAGES
Arabic, English`, 'resume.pdf')
  assert.equal(content.personal.fullName, 'Ahmed Hassan')
  assert.equal(content.personal.professionalTitle, 'Software Engineer')
  assert.equal(content.personal.email, 'ahmed@example.com')
  assert.equal(content.personal.phone, '+966 55 123 4567')
  assert.equal(content.personal.location, 'Riyadh')
  assert.equal(content.experience.length, 2)
  assert.equal(content.experience[0].company, 'Example Ltd')
  assert.equal(content.experience[0].startDate, '2024-01')
  assert.equal(content.experience[0].isCurrent, true)
  assert.deepEqual(content.experience[0].highlights, ['Built applications', 'Reviewed code'])
  assert.equal(content.experience[1].endDate, '2023-12')
  assert.equal(content.education[0].institution, 'Example University')
  assert.equal(content.projects[0].name, 'Job Tracker')
  assert.deepEqual(content.skills.map(({ category, items }) => ({ category, items })), [
    { category: 'Frontend', items: 'React, CSS' }, { category: '', items: 'SQL, Git' },
  ])
  assert.match(content.importSource.text, /Arabic, English/)
  assert.ok(content.experience[0].id)
})

test('recognizes Arabic headings and preserves unsupported text', () => {
  const content = parseResumeText('أحمد حسن\nمهندس برمجيات\nالملخص المهني\nتطوير تطبيقات الويب\nالمهارات التقنية\nالبرمجة: JavaScript\nاللغات\nالعربية')
  assert.equal(content.personal.fullName, 'أحمد حسن')
  assert.equal(content.summary, 'تطوير تطبيقات الويب')
  assert.equal(content.skills[0].category, 'البرمجة')
  assert.match(content.importSource.text, /العربية/)
})

test('keeps unknown content and avoids inventing months for year-only dates', () => {
  const content = parseResumeText('Someone\nEXPERIENCE\nEngineer 2020 - 2023\n• Delivered work\nUnknown text')
  assert.equal(content.experience[0].startDate, '')
  assert.equal(content.experience[0].endDate, '')
  assert.match(content.importSource.text, /2020 - 2023/)
  assert.equal(content.personal.email, '')
})

test('joins PDF fragments and respects line breaks and vertical position', () => {
  assert.equal(pdfTextLines([
    { str: 'Ahmed', transform: [1, 0, 0, 1, 10, 100] },
    { str: 'Hassan', transform: [1, 0, 0, 1, 50, 100], hasEOL: true },
    { str: 'Engineer', transform: [1, 0, 0, 1, 10, 90] },
    { str: 'Summary', transform: [1, 0, 0, 1, 10, 70] },
  ]), 'Ahmed Hassan\nEngineer\nSummary')
})
