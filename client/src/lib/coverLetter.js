export function normalizeCoverLetter(value) {
  const source = value && typeof value === 'object' ? value : {}
  const result = {}
  for (const key of ['company', 'jobDescription', 'body', 'generatedAt']) {
    result[key] = typeof source[key] === 'string' ? source[key] : ''
  }
  result.language = source.language === 'ar' ? 'ar' : 'en'
  return result
}

// Only career details are sent to Gemini. Contact details stay in the page header.
export function candidateBackground(content) {
  const sections = [content.personal.professionalTitle, content.summary]
  for (const job of content.experience) sections.push([job.position, job.company, ...job.highlights].filter(Boolean).join(' | '))
  for (const entry of content.education) sections.push([entry.qualification, entry.institution, entry.description].filter(Boolean).join(' | '))
  for (const entry of content.projects) sections.push([entry.name, entry.role, entry.description].filter(Boolean).join(' | '))
  for (const skill of content.skills) sections.push([skill.category, skill.items].filter(Boolean).join(': '))
  return sections.filter(Boolean).join('\n')
}
