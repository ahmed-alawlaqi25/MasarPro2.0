const text = value => typeof value === 'string' ? value : ''
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {}

export function normalizeResumeContent(value) {
  const source = object(value)
  const personal = object(source.personal)
  const defaults = {
    experience: { company: '', position: '', location: '', startDate: '', endDate: '', isCurrent: false, highlights: [] },
    education: { qualification: '', institution: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' },
    projects: { name: '', role: '', url: '', startDate: '', endDate: '', isCurrent: false, description: '' },
    skills: { category: '', items: '' },
  }
  const result = {
    ...source,
    personal: { ...personal },
    summary: text(source.summary),
    accentColor: /^#[0-9a-f]{6}$/i.test(source.accentColor || '') ? source.accentColor : '#0c1945',
  }
  for (const key of ['fullName', 'professionalTitle', 'email', 'phone', 'location', 'website', 'linkedin']) {
    result.personal[key] = text(personal[key])
  }
  for (const [section, fields] of Object.entries(defaults)) {
    result[section] = (Array.isArray(source[section]) ? source[section] : []).map(value => {
      const entry = object(value)
      const normalized = { ...entry, id: text(entry.id) || crypto.randomUUID() }
      for (const [key, fallback] of Object.entries(fields)) {
        normalized[key] = Array.isArray(fallback)
          ? (Array.isArray(entry[key]) ? entry[key].filter(item => typeof item === 'string') : [])
          : typeof fallback === 'boolean' ? entry[key] === true : text(entry[key])
      }
      return normalized
    })
  }
  return result
}
