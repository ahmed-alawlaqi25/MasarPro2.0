export default function ModernTemplate({
  content,
  accentColor,
  t,
  presentLabel,
  contactDetails,
  hasEntryContent,
}) {
  const personal = content.personal;

  const hasExperience = content.experience.some((job) =>
    [job.position, job.company, job.location, job.startDate, job.endDate, ...job.highlights].some((value) => value.trim())
  );
  const projects = content.projects.filter(hasEntryContent);
  const hasProjects = projects.length > 0;
  const education = content.education.filter(hasEntryContent);
  const hasEducation = education.length > 0;
  const hasSkills = content.skills.some((group) =>
    group.items.split(/[,\n،]/).some((item) => item.trim())
  );

  return (
    <div className="font-sans text-[#111827]">
      {/* HEADER: Modern split header with vertical contact divider */}
      <header className="flex flex-wrap items-start justify-between gap-4 pb-2">
        <div className="min-w-0 flex-1">
          <h1
            style={{ color: accentColor }}
            className="text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight"
          >
            {personal.fullName.trim() || t('yourNameLabel')}
          </h1>
          {personal.professionalTitle.trim() && (
            <p className="mt-1 text-sm font-medium text-slate-500 break-words">
              {personal.professionalTitle}
            </p>
          )}
        </div>

        {contactDetails.length > 0 && (
          <div
            style={{ borderColor: accentColor }}
            className="border-s-2 ps-3.5 py-0.5 text-xs text-slate-700 space-y-0.5 text-start shrink-0 max-w-full"
          >
            {personal.location.trim() && <p className="break-words">{personal.location.trim()}</p>}
            {personal.phone.trim() && <p dir="ltr" className="break-words">{personal.phone.trim()}</p>}
            {personal.email.trim() && <p dir="ltr" className="break-words">{personal.email.trim()}</p>}
            {personal.website.trim() && <p dir="ltr" className="break-words break-all">{personal.website.trim()}</p>}
            {personal.linkedin.trim() && <p dir="ltr" className="break-words break-all">{personal.linkedin.trim()}</p>}
          </div>
        )}
      </header>

      {/* SUMMARY / PERSONAL STATEMENT */}
      {content.summary.trim() && (
        <section className="mt-5">
          <h2
            style={{ color: accentColor }}
            className="text-sm font-bold tracking-tight"
          >
            {t('professionalSummarySection')}
          </h2>
          <p className="mt-1.5 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700">
            {content.summary}
          </p>
        </section>
      )}

      {/* WORK EXPERIENCE */}
      {hasExperience && (
        <section className="mt-5">
          <h2
            style={{ color: accentColor }}
            className="text-sm font-bold tracking-tight"
          >
            {t('professionalExperienceSection')}
          </h2>

          <div className="mt-2.5 space-y-3.5">
            {content.experience.map((job) => {
              const highlights = job.highlights.filter((line) => line.trim());
              const dates = [job.startDate, job.isCurrent ? presentLabel : job.endDate].filter(Boolean).join(' – ');
              const hasDetails = [job.position, job.company, job.location, job.startDate, job.endDate, ...highlights].some((value) => value.trim());
              if (!hasDetails) return null;

              const title = job.position || job.company;
              const subtitle = job.position ? [job.company, job.location].filter(Boolean).join(', ') : job.location;

              return (
                <article key={job.id} className="break-words">
                  <h3 className="font-bold text-xs text-slate-900 leading-snug">{title}</h3>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-600 mt-0.5">
                    {subtitle ? <span>{subtitle}</span> : <span />}
                    {dates && <span className="font-medium text-slate-500">{dates}</span>}
                  </div>

                  {highlights.length > 0 && (
                    <ul className="mt-1.5 list-disc space-y-1 ps-4 text-xs leading-relaxed text-slate-700">
                      {highlights.map((line, index) => (
                        <li key={index} className="ps-0.5">{line}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {hasEducation && (
        <section className="mt-5">
          <h2
            style={{ color: accentColor }}
            className="text-sm font-bold tracking-tight"
          >
            {t('educationLabel')}
          </h2>

          <div className="mt-2.5 space-y-3">
            {education.map((entry) => {
              const dates = [entry.startDate, entry.isCurrent ? presentLabel : entry.endDate].filter(Boolean).join(' – ');
              const title = entry.qualification || entry.institution;
              const subtitle = [entry.qualification ? entry.institution : '', entry.location].filter(Boolean).join(', ');

              return (
                <article key={entry.id} className="break-words">
                  <h3 className="font-bold text-xs text-slate-900 leading-snug">{title}</h3>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-600 mt-0.5">
                    {subtitle ? <span>{subtitle}</span> : <span />}
                    {dates && <span className="font-medium text-slate-500">{dates}</span>}
                  </div>

                  {entry.description.trim() && (
                    <ul className="mt-1.5 list-disc space-y-0.5 ps-4 text-xs leading-relaxed text-slate-700">
                      {entry.description
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((line, index) => (
                          <li key={index} className="ps-0.5">{line}</li>
                        ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {hasSkills && (
        <section className="mt-5">
          <h2
            style={{ color: accentColor }}
            className="text-sm font-bold tracking-tight"
          >
            {t('skillsSectionTitle')}
          </h2>

          <div className="mt-2 space-y-1.5 text-xs text-slate-700">
            {content.skills.map((group) => {
              const items = group.items
                .split(/[,\n،]/)
                .map((item) => item.trim())
                .filter(Boolean);
              if (!items.length) return null;

              return (
                <div key={group.id} className="flex flex-wrap items-baseline gap-x-1.5 leading-relaxed break-words">
                  {group.category.trim() && (
                    <span className="font-semibold text-slate-900">{group.category.trim()}:</span>
                  )}
                  <span>{items.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {hasProjects && (
        <section className="mt-5">
          <h2
            style={{ color: accentColor }}
            className="text-sm font-bold tracking-tight"
          >
            {t('projectsLabel')}
          </h2>

          <div className="mt-2.5 space-y-3">
            {projects.map((project) => {
              const dates = [project.startDate, project.isCurrent ? presentLabel : project.endDate].filter(Boolean).join(' – ');

              return (
                <article key={project.id} className="break-words">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-xs text-slate-900 leading-snug">{project.name}</h3>
                    {dates && <span className="text-xs font-medium text-slate-500">{dates}</span>}
                  </div>

                  {(project.role || project.url.trim()) && (
                    <p className="mt-0.5 text-xs text-slate-600">
                      {project.role}
                      {project.role && project.url.trim() && ' • '}
                      {project.url.trim() && (
                        <span className="break-all text-teal-700">{project.url}</span>
                      )}
                    </p>
                  )}

                  {project.description.trim() && (
                    <ul className="mt-1.5 list-disc space-y-0.5 ps-4 text-xs leading-relaxed text-slate-700">
                      {project.description
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((line, index) => (
                          <li key={index} className="ps-0.5">{line}</li>
                        ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
