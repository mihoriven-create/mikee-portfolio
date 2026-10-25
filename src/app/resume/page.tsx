import type { Metadata } from "next";
import type { ReactNode } from "react";
import { education, experience, type Role } from "@/data/experience";
import { projects } from "@/data/projects";
import { coreCompetencies, references, resumeSummary, technicalSkills } from "@/data/resume";
import { productionUrl, site } from "@/data/site";
import "./resume.css";

// The printable source for the downloadable PDF (exported with `npm run resume:pdf`).
export const metadata: Metadata = {
  title: "Résumé",
  robots: { index: false, follow: false },
};


function Heading({ children }: { children: ReactNode }) {
  return <h2 className="r-heading">{children}</h2>;
}

function RoleBlock({ role }: { role: Role }) {
  return (
    <article className="r-role">
      <div className="r-role-head">
        <h3>{role.title}</h3>
        <span>{role.period}</span>
      </div>
      <p className="r-company">{role.company}</p>
      <ul>
        {role.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {role.partners && <p className="r-partners">Partner organizations: {role.partners.join(" · ")}</p>}
    </article>
  );
}

export default function ResumePage() {
  // Split content so each Letter page fills without overflowing.
  const pageOneRoles = experience.slice(0, 3);
  const pageTwoRoles = experience.slice(3);
  const sidebarSkills = technicalSkills.slice(0, 4);
  const moreSkills = technicalSkills.slice(4);
  return (
    <div className="r-root">
      {/* Page 1 */}
      <section className="r-sheet">
        <header className="r-header">
          <div>
            <h1>{site.name}</h1>
            <p className="r-title">{site.title}</p>
            <p className="r-tagline">CRM Systems • Workflow Automation • System Integrations • Custom Web Applications</p>
          </div>
          <ul className="r-contact">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.whatsapp}>{site.phoneDisplay} (WhatsApp)</a>
            </li>
            <li>
              <a href={site.linkedin}>LinkedIn</a> · <a href={productionUrl}>Portfolio</a>
            </li>
            <li>{site.location} 5001</li>
          </ul>
        </header>

        <div className="r-body">
          <aside className="r-side">
            <Heading>Core Competencies</Heading>
            <ul className="r-list">
              {coreCompetencies.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <Heading>Technical Skills</Heading>
            {sidebarSkills.map((g) => (
              <div key={g.label} className="r-skill">
                <h3>{g.label}</h3>
                <p>{g.items.join(", ")}</p>
              </div>
            ))}
          </aside>

          <div className="r-main">
            <Heading>Profile</Heading>
            <p className="r-summary">{resumeSummary}</p>
            <Heading>Experience</Heading>
            {pageOneRoles.map((role) => (
              <RoleBlock key={role.title + role.company} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* Page 2 */}
      <section className="r-sheet r-sheet-2">
        <div className="r-page2-bar">
          <span>{site.name}</span>
          <span>{site.title}</span>
        </div>
        <div className="r-body r-body-2">
          <div className="r-main r-main-full">
            <Heading>Experience (continued)</Heading>
            {pageTwoRoles.map((role) => (
              <RoleBlock key={role.title + role.company} role={role} />
            ))}

            <Heading>Tools &amp; Platforms</Heading>
            <div className="r-tools">
              {moreSkills.map((g) => (
                <div key={g.label} className="r-skill">
                  <h3>{g.label}</h3>
                  <p>{g.items.join(", ")}</p>
                </div>
              ))}
            </div>

            <Heading>Selected Projects</Heading>
            <div className="r-projects">
              {projects.map((p) => (
                <article key={p.slug} className="r-project">
                  <h3>
                    {p.name}
                    {p.status === "In development" && <span className="r-badge">In development</span>}
                  </h3>
                  <p>{p.summary}</p>
                  <p className="r-stack">{p.stack.join(" · ")}</p>
                </article>
              ))}
            </div>

            <div className="r-split">
              <div>
                <Heading>Education</Heading>
                <p className="r-strong">{education.school}</p>
                <p>
                  {education.program} ({education.level})
                </p>
                <p className="r-muted">{education.period}</p>
              </div>
              <div>
                <Heading>References</Heading>
                <div className="r-refs">
                  {references.map((r) => (
                    <div key={r.name}>
                      {/* One detail per line so nothing wraps mid-phrase in the narrow column. */}
                      <p className="r-strong">{r.name}</p>
                      <p>{r.role}</p>
                      {r.company && <p>{r.company}</p>}
                      <p className="r-muted">{r.phone}</p>
                      <p className="r-muted">{r.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
