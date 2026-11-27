import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { createPageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

const pageTitle = "NUST Entry Test Preparation: A Practical Study Guide";
const pageDescription =
  "A practical NUST NET preparation guide for Pakistani students: start with official NUST information, build a study routine, practise deliberately, and review mistakes.";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/nust-entry-test-preparation",
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: pageTitle,
  description: pageDescription,
  mainEntityOfPage: new URL("/nust-entry-test-preparation", SITE_URL).toString(),
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL.toString(),
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL.toString(),
  },
  inLanguage: "en-PK",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL.toString(),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "NUST Entry Test Preparation",
      item: new URL("/nust-entry-test-preparation", SITE_URL).toString(),
    },
  ],
};

export default function NustEntryTestPreparationPage() {
  return (
    <SiteShell isPublic>
      <script type="application/ld+json">
        {JSON.stringify([articleSchema, breadcrumbSchema]).replace(/</g, "\\u003c")}
      </script>
      <main className="seo-article wrap">
        <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">NUST Entry Test Preparation</span>
        </nav>

        <article>
          <header className="seo-article-header">
            <p className="eyebrow">MERITLAB STUDY GUIDE</p>
            <h1>NUST Entry Test Preparation: A Practical Study Guide</h1>
            <p className="seo-article-lead">
              Preparing for the NUST Entry Test (NET) is easier to manage when you turn
              the syllabus into small study goals, practise actively, and use mistakes
              to decide what to revise next. This guide gives you a flexible
              approach—not a promise of admission or a substitute for current official
              NUST instructions.
            </p>
            <a className="button button-primary" href="/register">
              Explore MeritLab preparation tools
            </a>
            <p className="seo-note">
              MeritLab is an independent preparation platform. Some tests and resources
              require an account; always check what is currently available after signing
              in.
            </p>
          </header>

          <nav className="seo-toc" aria-label="On this page">
            <h2>On this page</h2>
            <ul>
              <li>
                <a href="#official-information">Start with official information</a>
              </li>
              <li>
                <a href="#study-cycle">Build a repeatable study cycle</a>
              </li>
              <li>
                <a href="#subject-practice">Practise by subject</a>
              </li>
              <li>
                <a href="#sample-plan">Use a flexible four-week plan</a>
              </li>
              <li>
                <a href="#mock-tests">Use mock tests to learn</a>
              </li>
              <li>
                <a href="#questions">Common questions</a>
              </li>
            </ul>
          </nav>

          <section>
            <h2 id="official-information">Start with current official information</h2>
            <p>
              First identify the NET category that matches the programme you intend to
              apply for and your academic background. NUST publishes category and
              subject-weighting information; use that material to decide what belongs in
              your study plan. Admission criteria, schedules, eligibility and test
              instructions can change, so confirm them directly with NUST rather than
              relying on an old article or an unofficial summary.
            </p>
            <ul>
              <li>
                <a
                  href="https://nust.edu.pk/admissions/undergraduates/"
                  target="_blank"
                  rel="noreferrer"
                >
                  NUST undergraduate admissions
                </a>{" "}
                for current admission guidance.
              </li>
              <li>
                <a
                  href="https://nust.edu.pk/admissions/undergraduates/subjects-included-in-net-with-weightings/"
                  target="_blank"
                  rel="noreferrer"
                >
                  NUST NET subjects and weightings
                </a>{" "}
                for the published subject information.
              </li>
              <li>
                Check NUST’s admissions portal for any current test instructions and
                official sample material.
              </li>
            </ul>
            <p>
              Write down your category, the subjects it covers, and the official source
              you used. If your target programme or subject combination is unclear,
              resolve that before spending time on a mismatched preparation plan.
            </p>
          </section>

          <section>
            <h2 id="study-cycle">Build a repeatable NET study cycle</h2>
            <ol>
              <li>
                <strong>Check your starting point.</strong> Try a short set of
                representative questions or a sample test. Record topics that felt
                unfamiliar, answers you guessed, and errors caused by rushing.
              </li>
              <li>
                <strong>Choose one narrow topic.</strong> Review the concept and worked
                examples before attempting questions. Avoid treating passive rereading
                as proof that you can solve a problem independently.
              </li>
              <li>
                <strong>Practise from memory.</strong> Solve questions without looking
                at the explanation first. When possible, mix a few earlier topics into a
                new practice session so you keep retrieving them.
              </li>
              <li>
                <strong>Keep an error log.</strong> Note the topic, the reason for the
                error, and the next action. Common useful labels include a missing
                concept, an incorrect method, a calculation slip, or a misread question.
              </li>
              <li>
                <strong>Revisit and adjust.</strong> Return to missed questions after a
                gap, then use the result to choose the next topic. Spend more time where
                your understanding is weak instead of repeating only comfortable
                material.
              </li>
            </ol>
          </section>

          <section>
            <h2 id="subject-practice">
              Practise by subject, not just by total questions
            </h2>
            <p>
              Match your subjects to your selected NET category and NUST’s current
              published information. The suggestions below are study techniques, not a
              statement of the official test format or subject weighting.
            </p>
            <ul>
              <li>
                <strong>Mathematics:</strong> practise identifying which concept a
                question tests, write out the reasoning, and check calculations before
                reviewing the answer.
              </li>
              <li>
                <strong>Physics:</strong> connect each formula to the conditions in
                which it applies. Draw a quick diagram where it helps, track units, and
                explain why the chosen relationship fits the question.
              </li>
              <li>
                <strong>Chemistry:</strong> separate facts that need recall from ideas
                that need application. Use short recall prompts, then answer questions
                that require you to apply the concept.
              </li>
              <li>
                <strong>Computer Science:</strong> practise tracing logic one step at a
                time and explain why each option is correct or incorrect.
              </li>
              <li>
                <strong>English:</strong> practise reading for the main idea and
                context, then review why a word or grammar choice fits the sentence.
              </li>
            </ul>
            <p>
              Not every subject applies to every candidate. Check the official category
              information before using this list as a personal checklist.
            </p>
          </section>

          <section>
            <h2 id="sample-plan">A flexible four-week NET preparation plan</h2>
            <p>
              This is a sample structure, not an official timetable. Stretch or compress
              it to fit the time you have and the topics in your category.
            </p>
            <div className="seo-plan-grid">
              <div>
                <h3>Week 1 · Map and diagnose</h3>
                <p>
                  Confirm the official subject list, try a short diagnostic, and divide
                  the syllabus into topics you can track.
                </p>
              </div>
              <div>
                <h3>Week 2 · Rebuild weak areas</h3>
                <p>
                  Review priority concepts, solve focused questions, and start an error
                  log instead of only counting completed questions.
                </p>
              </div>
              <div>
                <h3>Week 3 · Mix and retrieve</h3>
                <p>
                  Revisit earlier topics and practise mixed sets so you have to choose a
                  method, not just repeat the last lesson.
                </p>
              </div>
              <div>
                <h3>Week 4 · Practise and review</h3>
                <p>
                  Use timed practice where available, review every uncertain answer, and
                  reserve time for topics your error log still flags.
                </p>
              </div>
            </div>
            <p>
              If your exam is further away, repeat the learning and mixed-practice
              weeks. If it is closer, prioritise the official syllabus, your weakest
              topics, and a manageable routine rather than trying to cover everything in
              one sitting.
            </p>
          </section>

          <section>
            <h2 id="mock-tests">Use mock tests to learn, not only to score</h2>
            <p>
              A mock test can help you practise sustained focus, question selection, and
              pacing. Read the instructions for the specific test you are taking; do not
              assume a third-party test has the same rules or content as the current
              official NET.
            </p>
            <ol>
              <li>Attempt the test without checking answers mid-way.</li>
              <li>Mark questions where you guessed or felt unsure.</li>
              <li>
                Review wrong and uncertain answers, even when your guess was right.
              </li>
              <li>
                Turn the review into a short list of topics for the next study cycle.
              </li>
            </ol>
            <p>
              MeritLab’s exam pages label memory-based compilations as such; they are
              not official NUST-released papers. For official instructions and sample
              material, use NUST’s own admissions channels.
            </p>
            <div className="seo-related-links">
              <a href="/mock-tests">Explore MeritLab mock tests</a>
              <a href="/merit-calculator">Open the university merit calculator</a>
            </div>
          </section>

          <section>
            <h2 id="questions">Common questions about NUST NET preparation</h2>
            <h3>Can I prepare for the NUST Entry Test from home?</h3>
            <p>
              Yes. You can study from home by following the current official subject
              information, practising questions regularly, and reviewing mistakes. Keep
              a simple schedule and use credible sources for any admission or
              test-policy questions.
            </p>
            <h3>Where should I check the NUST NET syllabus and subject information?</h3>
            <p>
              Start with the{" "}
              <a href="https://nust.edu.pk/admissions/undergraduates/">
                official NUST undergraduate admissions pages
              </a>{" "}
              and its{" "}
              <a href="https://nust.edu.pk/admissions/undergraduates/subjects-included-in-net-with-weightings/">
                published NET subject information
              </a>
              . Verify details again for your application cycle.
            </p>
            <h3>Are MeritLab’s past-paper resources official NUST papers?</h3>
            <p>
              No. MeritLab identifies its memory-based compilations as unofficial. Use
              official NUST material for authoritative instructions and sample content.
            </p>
            <h3>Does this guide guarantee a particular NET score or admission?</h3>
            <p>
              No. It offers general study guidance only. Results depend on each
              student’s preparation and the current admissions process; MeritLab cannot
              guarantee a score or selection.
            </p>
          </section>

          <section className="seo-article-cta">
            <h2>Make your next study session focused</h2>
            <p>
              Explore MeritLab’s preparation tools, check which resources are currently
              available, and build a routine around your own NET category.
            </p>
            <a className="button button-primary" href="/register">
              Create a MeritLab account
            </a>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
