export default function ClassicTemplate({
  content,
  accentColor,
  t,
  presentLabel,
  contactDetails,
  hasEntryContent,
}) {
  const personal = content.personal;

  return (
    <>
      <header className="text-center">
        <h1
          style={{ color: accentColor }}
          className="break-words text-2xl mb-2 leading-tight font-bold"
        >
          {personal.fullName.trim() || t('yourNameLabel')}
        </h1>

        {personal.professionalTitle.trim() && (
          <p className="mt-1 text-xs font-medium text-slate-600">
            {personal.professionalTitle}
          </p>
        )}

        {contactDetails.length > 0 && (
          <ul dir="ltr" className="mt-1 flex list-none flex-wrap justify-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
            {contactDetails.map((detail, index) => (
              <li key={index} className="max-w-full break-words">
                <bdi dir="auto">{detail}</bdi>
              </li>
            ))}
          </ul>
        )}
      </header>

      <hr className="mt-2 border-slate-200" />
      {content.summary.trim() && (
        <section className="mt-2">
          <h2 style={{ color: accentColor }} className="text-xs font-bold">{t('professionalSummarySection')}</h2>
          <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-[1.45] text-slate-700">{content.summary}</p>
        </section>
      )}

      {content.experience.some((job) => [job.position, job.company, job.location, job.startDate, job.endDate, ...job.highlights].some((value) => value.trim())) && (
        <section className="mt-2">
          <h2 style={{ color: accentColor }} className="border-t border-slate-200 pt-1.5 text-xs font-bold">{t('professionalExperienceSection')}</h2>
          <div className="mt-1.5 space-y-2.5">
            {content.experience.map((job) => {
              const highlights = job.highlights.filter((line) => line.trim())
              const dates = [job.startDate, job.isCurrent ? presentLabel : job.endDate].filter(Boolean).join(' – ')
              const hasDetails = [job.position, job.company, job.location, job.startDate, job.endDate, ...highlights].some((value) => value.trim())
              if (!hasDetails) return null

              return (
                <article key={job.id} className="break-words">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold">{job.position || job.company}</h3>
                    <p className="text-xs text-slate-500">{dates}</p>
                  </div>
                  {(job.company || job.location) && <p className="mt-0.5 text-xs text-slate-600">{[job.position ? job.company : '', job.location].filter(Boolean).join(' | ')}</p>}
                  {highlights.length > 0 && (
                    <ul className="mt-1 list-disc space-y-0.5 ps-4 text-xs leading-[1.45] text-slate-700">
                      {highlights.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}
      {['education', 'projects'].map((section) => {
        const entries = content[section].filter(hasEntryContent)
        if (!entries.length) return null
        const education = section === 'education'
        return (
          <section key={section} className="mt-2">
            <h2 style={{ color: accentColor }} className="border-t border-slate-200 pt-1.5 text-xs font-bold">{education ? t('educationTrainingSection') : t('projectsLabel')}</h2>
            <div className="mt-1.5 space-y-2.5">
              {entries.map((entry) => (
                <article key={entry.id} className="break-words">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold">{education ? entry.qualification || entry.institution : entry.name}</h3>
                    <p className="text-xs text-slate-500">{[entry.startDate, entry.isCurrent ? presentLabel : entry.endDate].filter(Boolean).join(' – ')}</p>
                  </div>
                  {(education ? entry.location || (entry.qualification && entry.institution) : entry.role) && <p className="mt-0.5 text-xs text-slate-600">{education ? [entry.qualification ? entry.institution : '', entry.location].filter(Boolean).join(' | ') : entry.role}</p>}
                  {!education && entry.url.trim() && <p className="mt-1 break-all text-xs text-slate-500">{entry.url}</p>}
                  {entry.description.trim() && (
                    <ul className="mt-1 list-disc space-y-0.5 ps-4 text-xs leading-[1.45] text-slate-700">
                      {entry.description
                        .split('\n')
                        .map(line => line.trim())
                        .filter(Boolean)
                        .map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}
      {content.skills.some((group) => group.items.split(/[,\n،]/).some((item) => item.trim())) && (
        <section className="mt-2">
          <h2 style={{ color: accentColor }} className="border-t border-slate-200 pt-1.5 text-xs font-bold">{t('skillsSectionTitle')}</h2>
          <div className="mt-1 space-y-0.5 text-xs leading-[1.45] text-slate-700">
            {content.skills.map((group) => {
              const items = group.items.split(/[,\n،]/).map((item) => item.trim()).filter(Boolean)
              if (!items.length) return null
              return (
                <p key={group.id} className="break-words">
                  {group.category.trim() && <span className="font-semibold">{group.category.trim()}: </span>}
                  {items.join(', ')}
                </p>
              )
            })}
          </div>
        </section>
      )}
    </>
  );
}
