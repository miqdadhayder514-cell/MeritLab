"use client";

import { useState } from "react";
import { netCategories } from "@/lib/demo-data";
import { Icon, Logo } from "./ui";

const faqs = [
  [
    "Which NET category should I prepare for?",
    "It depends on your HSSC subject combination and the NUST programme you plan to apply for. MeritLab presents the official category information as a starting point; always confirm your programme eligibility on NUST’s current admissions pages.",
  ],
  [
    "Are MeritLab questions official NUST questions?",
    "No. Practice questions on MeritLab are original practice material unless a question is explicitly identified with a verifiable source. NUST does not sponsor or provide MeritLab preparation material.",
  ],
  [
    "Can I practice more than one NET category?",
    "Yes. You can explore multiple categories and switch your preparation path whenever you need. The categories and subject combinations shown are based on current publicly listed NUST information.",
  ],
  [
    "Does MeritLab save my progress?",
    "This frontend uses local demo state only. Account synchronization and durable progress saving will be available after backend services are implemented.",
  ],
];

const steps = [
  {
    n: "01",
    title: "Choose your NET path",
    desc: "Find the category that fits your intended programme and academic background.",
    icon: "compass",
  },
  {
    n: "02",
    title: "Learn one topic at a time",
    desc: "Follow a clear chapter structure, then reinforce concepts with focused MCQs.",
    icon: "book",
  },
  {
    n: "03",
    title: "Practice with purpose",
    desc: "Answer focused MCQs and understand the reasoning behind each answer.",
    icon: "practice",
  },
  {
    n: "04",
    title: "Try a mock exam",
    desc: "Get comfortable with timing, question navigation, and reviewing responses.",
    icon: "clock",
  },
  {
    n: "05",
    title: "Analyze your results",
    desc: "Spot strong areas and identify topics that deserve another look.",
    icon: "chart",
  },
  {
    n: "06",
    title: "Improve your next session",
    desc: "Use what you learned to make your next study hour more focused.",
    icon: "bolt",
  },
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid wrap">
          <div className="hero-copy">
            <div className="announcement">
              <span className="announcement-dot" /> A smarter way to prepare for NET{" "}
              <Icon name="arrow" size={14} />
            </div>
            <h1>
              <span className="hero-word">Make</span>{" "}
              <span className="hero-word">every</span>{" "}
              <span className="hero-word">study</span>{" "}
              <span className="hero-word">session</span>{" "}
              <span className="hero-word hero-word-accent">count.</span>
            </h1>
            <p className="hero-description">
              A thoughtful, structured preparation experience for the NUST Entry Test.
              Learn concepts, practice with purpose, and see where you’re improving.
            </p>
            <div className="hero-buttons">
              <a className="button button-primary button-large" href="/register">
                Start preparing <Icon name="arrow" size={18} />
              </a>
              <a className="button button-outline button-large" href="/mock-tests">
                Explore mock tests
              </a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span className="avatar avatar-blue">A</span>
                <span className="avatar avatar-teal">H</span>
                <span className="avatar avatar-gold">Z</span>
                <span className="avatar avatar-rose">M</span>
              </div>
              <p>
                <strong>A focused routine makes a difference.</strong>
                <br />
                <span>Build confidence, one session at a time.</span>
              </p>
            </div>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label="Illustration preview of MeritLab learning dashboard"
          >
            <div className="art-glow" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-mini-card hero-mini-top">
              <span className="mini-icon mini-icon-teal">
                <Icon name="chart" size={17} />
              </span>
              <span>
                <strong>Steady progress</strong>
                <small>7-day learning streak</small>
              </span>
              <i className="mini-trend">↗</i>
            </div>
            <div className="hero-dashboard">
              <div className="mock-top">
                <span className="mock-brand-dot">
                  <Icon name="orbit" size={14} />
                </span>
                <span className="mock-dots">•••</span>
              </div>
              <div className="mock-welcome">
                <small>ILLUSTRATIVE DEMO · SAMPLE DASHBOARD</small>
                <strong>
                  Good morning, Miqdad <span>✦</span>
                </strong>
                <p>You’re making great progress.</p>
              </div>
              <div className="mock-stat-row">
                <div>
                  <small>Questions practiced</small>
                  <strong data-count-target={248}>248</strong>
                  <span className="mock-up">↑ 18 this week</span>
                </div>
                <div className="mock-ring">
                  <span>
                    72<small>%</small>
                  </span>
                </div>
              </div>
              <div className="mock-chart-title">
                <strong>Weekly accuracy</strong>
                <small>Last 7 days</small>
              </div>
              <svg
                className="mock-chart"
                viewBox="0 0 280 92"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 75 C25 65 29 69 50 54 S75 62 96 48 S120 54 142 30 S170 42 190 24 S220 39 240 19 S260 22 280 10"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                />
                <path
                  d="M0 75 C25 65 29 69 50 54 S75 62 96 48 S120 54 142 30 S170 42 190 24 S220 39 240 19 S260 22 280 10 L280 92 L0 92Z"
                  fill="url(#heroFill)"
                />
                <defs>
                  <linearGradient id="heroFill" x1="0" x2="0" y1="0" y2="1">
                    <stop stopColor="#2563eb" stopOpacity=".16" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="mock-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="hero-mini-card hero-mini-bottom">
              <span className="mini-icon mini-icon-blue">
                <Icon name="check" size={18} />
              </span>
              <span>
                <strong>Topic completed</strong>
                <small>Quadratic equations</small>
              </span>
              <i className="mini-check">
                <Icon name="check" size={14} />
              </i>
            </div>
            <div className="formula-chip formula-chip-one" aria-hidden="true">
              <span>∫</span> f(x) dx
            </div>
            <div className="formula-chip formula-chip-two" aria-hidden="true">
              <span>Σ</span> F = ma
            </div>
            <div className="formula-chip formula-chip-three" aria-hidden="true">
              <span>π</span> E = mc²
            </div>
          </div>
        </div>
        <div className="hero-bottom-line wrap">
          <span>Structured around NUST’s published NET categories</span>
          <div>
            <span>NET-Engineering</span>
            <span>Applied Sciences</span>
            <span>Business & Social Sciences</span>
          </div>
        </div>
      </section>

      <section className="section section-white" id="categories">
        <div className="wrap">
          <div className="section-heading centered">
            <span className="eyebrow">A path that fits your goals</span>
            <h2>
              Start with the right <span>NET category.</span>
            </h2>
            <p>
              NET structure differs by programme and academic background. Explore the
              categories listed by NUST, then confirm your own eligibility with official
              admissions guidance.
            </p>
          </div>
          <div className="category-grid">
            {netCategories.map((category) => (
              <a
                href={`/preparation/${category.id}`}
                className={`category-card tint-${category.tint}`}
                key={category.id}
              >
                <div className="category-card-top">
                  <span className="category-icon">
                    <Icon name={category.icon} size={22} />
                  </span>
                  <Icon name="arrow" className="category-arrow" size={18} />
                </div>
                <small>{category.eyebrow}</small>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <div className="category-weight">{category.weights}</div>
              </a>
            ))}
          </div>
          <div className="home-metrics">
            <div className="home-metric">
              <strong data-count-target={netCategories.length}>
                {netCategories.length}
              </strong>
              <span>NET pathways to explore</span>
            </div>
            <div className="home-metric">
              <strong data-count-target={4}>4</strong>
              <span>levels in your learning map</span>
            </div>
            <div className="home-metric">
              <strong data-count-target={0}>0</strong>
              <span>practice questions available</span>
            </div>
            <div className="home-metric">
              <strong data-count-target={steps.length}>{steps.length}</strong>
              <span>steps from plan to progress</span>
            </div>
          </div>
          <p className="metrics-caption">
            Product preview figures based on MeritLab’s current sample content—not live
            student or platform usage statistics.
          </p>
          <p className="source-note">
            <Icon name="spark" size={15} /> Category descriptions and subject weightings
            reflect publicly listed NUST admissions information. Requirements may
            change; verify before applying.{" "}
            <a
              href="https://nust.edu.pk/admissions/undergraduates/subjects-included-in-net-with-weightings/"
              target="_blank"
              rel="noreferrer"
            >
              Official NUST source <Icon name="arrow" size={13} />
            </a>
          </p>
        </div>
      </section>

      <section className="section why-section">
        <div className="wrap why-grid">
          <div className="why-copy">
            <span className="eyebrow">A better way to study</span>
            <h2>
              Less guessing.
              <br />
              <span>More meaningful progress.</span>
            </h2>
            <p>
              Good preparation isn’t about doing everything at once. It’s about
              understanding what matters, practicing it, and using feedback to make the
              next session count.
            </p>
            <a className="text-link" href="/about">
              Get to know MeritLab <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="benefit-list">
            {[
              [
                "book",
                "Structured preparation",
                "A navigable path from NET category to subject, chapter, and topic.",
              ],
              [
                "practice",
                "Focused MCQ practice",
                "Practice by topic or difficulty and review every answer with context.",
              ],
              [
                "clock",
                "Purposeful mock exams",
                "A distraction-free exam flow with question navigation and review marking.",
              ],
              [
                "chart",
                "Insightful progress",
                "Understand your accuracy and find the topics that need another look.",
              ],
            ].map(([icon, title, description], i) => (
              <div className="benefit-row" key={title}>
                <span className={`benefit-icon benefit-${i}`}>
                  <Icon name={icon} size={20} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <Icon name="check" size={17} className="benefit-check" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="wrap">
          <div className="section-heading centered">
            <span className="eyebrow">Simple by design</span>
            <h2>
              A study rhythm that <span>works for you.</span>
            </h2>
            <p>
              From your first topic to your final review, your next step is always
              clear.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.n}>
                <div className="step-top">
                  <span>{step.n}</span>
                  <Icon name={step.icon} size={23} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="step-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="wrap featured-grid">
          <div className="featured-visual practice-library-visual">
            <div className="practice-library-orbit practice-orbit-one" />
            <div className="practice-library-orbit practice-orbit-two" />
            <div className="practice-library-mark">
              <Icon name="practice" size={31} />
            </div>
            <span className="practice-library-chip">ORIGINAL CONTENT</span>
            <span className="practice-library-note">A thoughtful question bank</span>
          </div>
          <div className="featured-copy">
            <span className="eyebrow">Daily Challenge</span>
            <h2>
              Ten questions.
              <br />
              <span>A fresh set each day.</span>
            </h2>
            <p>
              Build a steady NET preparation habit with daily Mathematics, Physics, and
              English questions, worked explanations, and a 10-day streak.
            </p>
            <a href="/practice" className="button button-primary">
              Start Daily Challenge <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="mock-promo-section">
        <div className="wrap mock-promo">
          <div className="mock-promo-copy">
            <span className="eyebrow eyebrow-light">Make exam day feel familiar</span>
            <h2>
              Practice the process.
              <br />
              Walk in prepared.
            </h2>
            <p>
              Use a timed mock interface with a countdown, answer palette, and review
              markers. Learn to pace yourself before test day.
            </p>
            <a href="/mock-tests" className="button button-white">
              Explore mock tests <Icon name="arrow" size={16} />
            </a>
            <span className="mock-promo-note">
              <Icon name="info" size={14} /> Mock tests are practice simulations, not
              official NUST papers.
            </span>
          </div>
          <div className="exam-preview">
            <div className="exam-preview-top">
              <span>
                <i /> NET-Engineering · Practice
              </span>
              <strong>01:24:38</strong>
            </div>
            <div className="exam-preview-content">
              <div>
                <small>QUESTION 12 OF 80</small>
                <h3>
                  A body moves with constant acceleration. Which quantity changes
                  linearly with time?
                </h3>
                <div className="exam-option active">
                  <i>A</i> Velocity <Icon name="check" size={15} />
                </div>
                <div className="exam-option">
                  <i>B</i> Acceleration
                </div>
                <div className="exam-option">
                  <i>C</i> Displacement
                </div>
              </div>
              <aside>
                <small>QUESTION PALETTE</small>
                <div className="palette-preview">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((number) => (
                    <i
                      className={
                        number === 1 || number === 2 || number === 6 || number === 10
                          ? "palette-done"
                          : number === 12
                            ? "palette-current"
                            : ""
                      }
                      key={number}
                    >
                      {number}
                    </i>
                  ))}
                </div>
                <span className="palette-legend">
                  <i /> Answered <i /> Marked
                </span>
              </aside>
            </div>
            <div className="exam-preview-bottom">
              <span>
                10 answered <i /> 2 marked <i /> 68 remaining
              </span>
              <button type="button">
                Next question <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white analytics-preview">
        <div className="wrap analytics-preview-grid">
          <div className="analytics-copy">
            <span className="eyebrow">See the bigger picture</span>
            <h2>
              Progress you can
              <br />
              <span>actually learn from.</span>
            </h2>
            <p>
              Review trends across subjects and topics. MeritLab turns your practice
              history into useful signals—not pressure to chase a number.
            </p>
            <a href="/analytics" className="text-link">
              Preview analytics <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="analytics-card">
            <div className="analytics-card-head">
              <div>
                <strong>Learning overview</strong>
                <small>Demonstration data</small>
              </div>
              <button type="button">
                This week <Icon name="chevron" size={14} />
              </button>
            </div>
            <div className="analytics-metrics">
              <div>
                <small>Practice accuracy</small>
                <strong>
                  72% <em>+6%</em>
                </strong>
              </div>
              <div>
                <small>Study time</small>
                <strong>8h 24m</strong>
              </div>
              <div>
                <small>Topics reviewed</small>
                <strong>14</strong>
              </div>
            </div>
            <div className="analytics-mini-chart">
              <div className="analytics-chart-label">
                <strong>Accuracy trend</strong>
                <span>Last 7 days</span>
              </div>
              <svg viewBox="0 0 420 150" preserveAspectRatio="none" aria-hidden="true">
                <title>Illustrative weekly accuracy trend</title>
                <path
                  d="M0 116 C45 95 55 110 92 80 S150 104 182 67 S240 79 270 42 S330 60 355 28 S390 38 420 15"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                />
                <path
                  d="M0 116 C45 95 55 110 92 80 S150 104 182 67 S240 79 270 42 S330 60 355 28 S390 38 420 15 L420 150 L0 150Z"
                  fill="url(#area)"
                />
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop stopColor="#2563eb" stopOpacity=".14" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="analytics-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="wrap faq-grid">
          <div className="faq-intro">
            <span className="eyebrow">Good to know</span>
            <h2>
              Questions, <span>answered.</span>
            </h2>
            <p>We want to make your preparation journey clear from the start.</p>
            <a href="mailto:hello@meritlab.pk" className="text-link">
              Ask us a question <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map(([questionText, answer], i) => (
              <div
                className={`faq-item ${openFaq === i ? "faq-open" : ""}`}
                key={questionText}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{questionText}</span>
                  <i>{openFaq === i ? "−" : "+"}</i>
                </button>
                {openFaq === i && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap final-cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">One focused session at a time</span>
            <h2>Your next step starts here.</h2>
            <p>
              Explore your preparation path and build a routine that feels achievable.
            </p>
          </div>
          <a href="/register" className="button button-white">
            Get started <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <Logo />
          <p>
            A thoughtful way to prepare for the NUST Entry Test.
            <br />
            Prepare smarter. Score higher.
          </p>
          <a href="mailto:hello@meritlab.pk">hello@meritlab.pk</a>
        </div>
        <div className="footer-col">
          <strong>Explore</strong>
          <a href="/preparation">NET preparation</a>
          <a href="/practice">Daily Challenge</a>
          <a href="/mock-tests">Mock tests</a>
          <a href="/resources">Study resources</a>
          <a href="/pricing">Pricing</a>
        </div>
        <div className="footer-col">
          <strong>Your workspace</strong>
          <a href="/dashboard">Dashboard</a>
          <a href="/analytics">Performance</a>
          <a href="/leaderboard">Leaderboard</a>
          <a href="/profile">Your profile</a>
        </div>
        <div className="footer-col">
          <strong>MeritLab</strong>
          <a href="/about">About us</a>
          <a href="/faq">FAQs</a>
          <a href="/settings">Settings</a>
          <a href="/admin">Admin preview</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 MeritLab. Independent preparation platform.</span>
        <span>Not affiliated with or endorsed by NUST.</span>
        <span>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </span>
      </div>
    </footer>
  );
}
