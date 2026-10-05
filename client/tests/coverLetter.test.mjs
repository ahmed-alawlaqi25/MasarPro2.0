import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeResumeContent } from '../src/lib/resumeContent.js'
import { candidateBackground } from '../src/lib/coverLetter.js'

test('older resumes receive a usable letter draft without losing CV fields', () => {
  const value = normalizeResumeContent({ summary: 'Existing summary', custom: 'keep me' })
  assert.equal(value.coverLetter.body, '')
  assert.equal(value.coverLetter.language, 'en')
  assert.equal(value.summary, 'Existing summary')
  assert.equal(value.custom, 'keep me')
})

test('saved cover letters survive reopening and unrelated CV edits', () => {
  const coverLetter = { company: 'شركة مسار', jobDescription: 'مطور', language: 'ar', body: 'خطابي المعدل', generatedAt: '2026-10-05T10:00:00Z' }
  const reopened = normalizeResumeContent({ summary: 'Original', coverLetter })
  assert.deepEqual(normalizeResumeContent({ ...reopened, summary: 'Improved' }).coverLetter, coverLetter)
})

test('AI background includes career evidence without contact fields or imported raw text', () => {
  const content = normalizeResumeContent({ personal: { fullName: 'Private Name', email: 'private@example.com', phone: '12345', professionalTitle: 'Developer' }, summary: 'Built web apps', experience: [{ position: 'Engineer', company: 'Example', highlights: ['Delivered a React project'] }], importSource: { text: 'Private imported source' } })
  const background = candidateBackground(content)
  assert.match(background, /Developer/)
  assert.match(background, /Delivered a React project/)
  for (const value of ['private@example.com', '12345', 'Private Name', 'Private imported source']) assert.ok(!background.includes(value))
})
