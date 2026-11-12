export default function ExecutiveTemplate({
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
      {/* HEADER: Centered name in elegant serif + centered contact line */}
      <header className="text-center">
        <h1
          style={{ color: accentColor }}
          className="font-serif text-3xl font-bold tracking-tight break-words leading-tight"
        >
          {personal.fullName.trim() || t('yourNameLabel')}
        </h1>

        {contactDetails.length > 0 && (
          <ul
            dir="ltr"
            className="mt-1.5 flex list-none flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-600"
          >
            {contactDetails.map((detail, index) => (
              <li key={index} className="flex items-center gap-x-2 max-w-full break-words">
                {index > 0 && <span className="text-slate-400 select-none" aria-hidden="true">•</span>}
                <bdi dir="auto">{detail}</bdi>
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Horizontal Divider */}
      <hr className="mt-2.5 mb-3 border-slate-300" />

      {/* Professional Title & Summary Block */}
      {(personal.professionalTitle.trim() || content.summary.trim()) && (
        <section className="mb-3.5">
          {personal.professionalTitle.trim() && (
            <h2 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
              {personal.professionalTitle}
            </h2>
          )}
          {content.summary.trim() && (
            <p className="mt-1 whitespace-pre-wrap break-words text-[11px] leading-[1.55] text-slate-700">
              {content.summary}
            </p>
          )}
        </section>
      )}

      {/* Two-Column Split Grid */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-4">
        {/* Main Column (Experience & Projects) */}
        <div className="col-span-8 min-w-0 space-y-4">
          {hasExperience && (
            <section>
              <h3
                style={{ color: accentColor }}
                className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2"
              >
                {t('professionalExperienceSection')}
              </h3>

              <div className="space-y-3">
                {content.experience.map((job) => {
                  const highlights = job.highlights.filter((line) => line.trim());
                  const dates = [job.startDate, job.isCurrent ? presentLabel : job.endDate].filter(Boolean).join(' – ');
                  const hasDetails = [job.position, job.company, job.location, job.startDate, job.endDate, ...highlights].some((value) => value.trim());
                  if (!hasDetails) return null;

                  return (
                    <article key={job.id} className="break-words">
                      <div className="text-xs leading-snug">
                        <span className="font-bold text-slate-900">{job.company || job.position}</span>
                        {job.location && <span className="text-slate-600"> • {job.location}</span>}
                        {dates && <span className="text-slate-500"> • {dates}</span>}
                      </div>

                      {job.position && job.company && (
                        <p className="font-semibold text-xs text-slate-800 mt-0.5">{job.position}</p>
                      )}

                      {highlights.length > 0 && (
                        <ul className="mt-1 list-disc space-y-0.5 ps-4 text-[11px] leading-[1.45] text-slate-700">
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

          {hasProjects && (
            <section>
              <h3
                style={{ color: accentColor }}
                className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2"
              >
                {t('projectsLabel')}
              </h3>

              <div className="space-y-3">
                {projects.map((project) => {
                  const dates = [project.startDate, project.isCurrent ? presentLabel : project.endDate].filter(Boolean).join(' – ');
                  return (
                    <article key={project.id} className="break-words">
                      <div className="text-xs leading-snug">
                        <span className="font-bold text-slate-900">{project.name}</span>
                        {project.role && <span className="text-slate-600"> • {project.role}</span>}
                        {dates && <span className="text-slate-500"> • {dates}</span>}
                      </div>

                      {project.url.trim() && (
                        <p className="mt-0.5 break-all text-[11px] text-teal-700">{project.url}</p>
                      )}

                      {project.description.trim() && (
                        <ul className="mt-1 list-disc space-y-0.5 ps-4 text-[11px] leading-[1.45] text-slate-700">
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

        {/* Side Column (Skills & Education) */}
        <div className="col-span-4 min-w-0 space-y-4">
          {hasSkills && (
            <section>
              <h3
                style={{ color: accentColor }}
                className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2"
              >
                {t('skillsSectionTitle')}
              </h3>

              <div className="space-y-2 text-[11px] leading-relaxed text-slate-700">
                {content.skills.map((group) => {
                  const items = group.items
                    .split(/[,\n،]/)
                    .map((item) => item.trim())
                    .filter(Boolean);
                  if (!items.length) return null;
                  return (
                    <div key={group.id} className="break-words">
                      {group.category.trim() && (
                        <p className="font-bold text-slate-900 text-[11px] mb-0.5">{group.category.trim()}</p>
                      )}
                      <p className="text-slate-700 leading-snug">{items.join(', ')}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {hasEducation && (
            <section>
              <h3
                style={{ color: accentColor }}
                className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2"
              >
                {t('educationLabel')}
              </h3>

              <div className="space-y-3">
                {education.map((entry) => {
                  const dates = [entry.startDate, entry.isCurrent ? presentLabel : entry.endDate].filter(Boolean).join(' – ');
                  return (
                    <article key={entry.id} className="break-words text-[11px]">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {entry.qualification || entry.institution}
                      </h4>

                      {(entry.qualification ? entry.institution : '') && (
                        <p className="text-slate-700 mt-0.5">{entry.institution}</p>
                      )}

                      {(entry.location || dates) && (
                        <p className="text-slate-500 mt-0.5">
                          {[entry.location, dates].filter(Boolean).join(' • ')}
                        </p>
                      )}

                      {entry.description.trim() && (
                        <ul className="mt-1 list-disc space-y-0.5 ps-3.5 text-slate-700">
                          {entry.description
                            .split('\n')
                            .map((l) => l.trim())
                            .filter(Boolean)
                            .map((line, index) => (
                              <li key={index}>{line}</li>
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
      </div>
    </div>
  );
}
