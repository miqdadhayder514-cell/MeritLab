"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  chapters,
  leaderboard,
  netCategories,
  netCategoryOptions,
  resources,
  subjects,
} from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import { Bars, Sparkline } from "./charts";
import { ConicCheatSheet } from "./conic-cheat-sheet";
import { CrackNetBadge } from "./crack-net-badge";
import { DailyChallenge } from "./daily-challenge";
import { StudentPaymentsPage } from "./payment-pages";
import { Button, Card, Eyebrow, Icon, Progress } from "./ui";

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
  icon,
  trend,
  color = "blue",
}: {
  title: React.ReactNode;
  value: string;
  note: string;
  icon: string;
  trend?: number[];
  color?: string;
}) {
  const count = value.match(/^([\d,]+)(.*)$/);
  return (
    <Card className="stat-card">
      <div className={`stat-icon stat-${color}`}>
        <Icon name={icon} size={19} />
      </div>
      <div className="stat-title">
        {title}
        <span className="stat-more">
          <Icon name="more" size={18} />
        </span>
      </div>
      <strong
        className="stat-value"
        data-count-target={count ? Number(count[1].replaceAll(",", "")) : undefined}
        data-count-suffix={count?.[2] ?? ""}
      >
        {value}
      </strong>
      <div className="stat-note">
        <span className="trend-positive">{note.split(" ")[0]}</span>{" "}
        {note.split(" ").slice(1).join(" ")}
      </div>
      {trend && (
        <Sparkline values={trend} color={color === "teal" ? "#16a085" : "#2563eb"} />
      )}
    </Card>
  );
}

type DashboardActivity = {
  title: string;
  exam_type: "mock_test" | "past_paper";
  completed_at: string;
  total_questions: number;
  attempted_questions: number;
  correct_answers: number;
  accuracy: number;
};

type DashboardSubject = {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

type DashboardDay = {
  date: string;
  attempts: number;
  questions: number;
  correct: number;
};

type StudentDashboardSummary = {
  questions_attempted: number;
  correct_answers: number;
  accuracy: number;
  mock_tests_completed: number;
  past_papers_completed: number;
  questions_this_week: number;
  current_streak: number;
  best_streak: number;
  recent_activity: DashboardActivity[];
  weekly_activity: DashboardDay[];
  subject_performance: DashboardSubject[];
};

function Dashboard() {
  const { profile, user, session, loading: authLoading, identityError } = useAuth();
  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const requestId = useRef(0);
  const studentName = profile?.full_name || user?.user_metadata?.full_name || "Student";
  const targetCategory = profile?.target_net_category || "your NET category";
  const today = new Intl.DateTimeFormat("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Karachi",
  }).format(new Date());

  const loadSummary = useCallback(async () => {
    const request = ++requestId.current;
    if (authLoading) return;

    if (!user?.id || session?.user.id !== user.id) {
      setSummary(null);
      setLoadError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(false);
    try {
      const { data, error } = await createClient().rpc("student_dashboard");
      if (error) throw error;
      if (!data || typeof data !== "object") {
        throw new Error("The dashboard response was empty.");
      }
      if (request === requestId.current) setSummary(data as StudentDashboardSummary);
    } catch (error) {
      const errorFields =
        error !== null && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      console.error(
        `Could not load student dashboard activity: ${JSON.stringify({
          code: errorFields.code ?? null,
          message:
            errorFields.message ??
            (error instanceof Error ? error.message : String(error)),
          details: errorFields.details ?? null,
          hint: errorFields.hint ?? null,
        })}`,
      );
      if (request === requestId.current) setLoadError(true);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [authLoading, session?.user.id, user?.id]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const activity = summary?.recent_activity ?? [];
  const subjectPerformance = summary?.subject_performance ?? [];
  const weeklyActivity = summary?.weekly_activity ?? [];
  const answerAccuracy = summary?.accuracy ?? 0;
  const streakDays = summary?.current_streak ?? 0;
  const weekQuestions = summary?.questions_this_week ?? 0;
  const formatActivityDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    });

  return (
    <>
      <PageHeading
        eyebrow={today.toUpperCase()}
        title={
          <>
            Welcome, {studentName.split(" ")[0]}{" "}
            <span className="heading-spark">✦</span>
          </>
        }
        description="A little progress today adds up to a lot of confidence tomorrow."
        action={
          <Button href="/mock-tests">
            <Icon name="plus" size={17} /> Start a mock test
          </Button>
        }
      />
      {identityError && (
        <p className="form-alert form-alert-error" role="status">
          Account details could not be loaded. Refresh the page or try again shortly.
        </p>
      )}
      {loadError && (
        <p className="form-alert form-alert-error" role="alert">
          Your live activity could not be loaded. Check your connection and confirm that
          both student activity SQL migrations have been applied in Supabase.{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => void loadSummary()}
          >
            Try again
          </button>
        </p>
      )}
      <div className="stat-grid">
        <StatCard
          title="Questions attempted"
          value={loading ? "—" : (summary?.questions_attempted ?? 0).toLocaleString()}
          note={loading ? "Loading activity" : `${weekQuestions} this week`}
          icon="practice"
          trend={weeklyActivity.map((day) => day.questions)}
        />
        <StatCard
          title="Answer accuracy"
          value={loading ? "—" : `${answerAccuracy.toFixed(0)}%`}
          note={
            loading
              ? "Loading activity"
              : `From ${summary?.questions_attempted ?? 0} answers`
          }
          icon="chart"
          color="teal"
          trend={weeklyActivity.map((day) =>
            day.questions ? Math.round((day.correct / day.questions) * 100) : 0,
          )}
        />
        <StatCard
          title="Mock tests completed"
          value={loading ? "—" : String(summary?.mock_tests_completed ?? 0)}
          note={
            loading
              ? "Loading activity"
              : `${summary?.past_papers_completed ?? 0} past papers`
          }
          icon="clock"
          color="violet"
        />
        <StatCard
          title="Study streak"
          value={loading ? "—" : `${streakDays} days`}
          note={
            loading ? "Loading activity" : `Best: ${summary?.best_streak ?? 0} days`
          }
          icon="flame"
          color="amber"
        />
      </div>
      <div className="dashboard-main-grid">
        <Card className="dashboard-progress-card">
          <div className="card-heading">
            <div>
              <h2>Your exam performance</h2>
              <p>
                {targetCategory} · {summary?.mock_tests_completed ?? 0} mock tests ·{" "}
                {summary?.past_papers_completed ?? 0} past papers
              </p>
            </div>
            <a href="/analytics" className="subtle-link">
              Analytics <Icon name="arrow" size={15} />
            </a>
          </div>
          <div className="preparation-summary">
            <div
              className="prep-ring"
              style={{
                background: `conic-gradient(#2563eb 0 ${answerAccuracy}%, #eaf0f7 ${answerAccuracy}% 100%)`,
              }}
            >
              <span>
                <strong>{loading ? "—" : `${answerAccuracy.toFixed(0)}%`}</strong>
                <small>accuracy</small>
              </span>
            </div>
            <div className="prep-subjects">
              {subjectPerformance.slice(0, 4).map((subject) => (
                <div className="prep-subject" key={subject.subject}>
                  <div>
                    <span>{subject.subject}</span>
                    <strong>{subject.accuracy.toFixed(0)}%</strong>
                  </div>
                  <Progress value={subject.accuracy} />
                </div>
              ))}
              {!loading && subjectPerformance.length === 0 && (
                <p className="dashboard-empty-copy">
                  Complete a mock test or past paper to see your subject performance.
                </p>
              )}
            </div>
          </div>
          <a href="/mock-tests" className="full-card-link">
            Continue with a mock test <Icon name="arrow" size={16} />
          </a>
        </Card>
        <Card className="streak-card">
          <div className="streak-top">
            <div>
              <span className="streak-icon">
                <Icon name="flame" size={22} />
              </span>
              <span className="streak-label">CURRENT STREAK</span>
            </div>
            <span className="streak-days">
              {loading ? "—" : streakDays} <small>days</small>
            </span>
          </div>
          <p>
            {loading
              ? "Loading your activity..."
              : streakDays > 0
                ? `You have studied ${streakDays} consecutive ${streakDays === 1 ? "day" : "days"}. Your personal best is ${summary?.best_streak ?? 0} days.`
                : "Complete a mock test or past paper to start building your study streak."}
          </p>
          <div className="streak-week">
            {weeklyActivity.map((day) => {
              const date = new Date(`${day.date}T12:00:00+05:00`);
              const label = new Intl.DateTimeFormat(undefined, {
                weekday: "narrow",
                timeZone: "Asia/Karachi",
              }).format(date);
              return (
                <span
                  key={day.date}
                  className={day.attempts > 0 ? "streak-day-done" : ""}
                  title={`${day.date}: ${day.attempts} completed exams`}
                >
                  {day.attempts > 0 ? <Icon name="check" size={14} /> : label}
                </span>
              );
            })}
          </div>
          <a href="/past-papers" className="text-link">
            Try a past paper <Icon name="arrow" size={15} />
          </a>
        </Card>
      </div>
      <div className="dashboard-secondary-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Your submitted mock tests and past papers</p>
            </div>
            <a href="/mock-tests" className="subtle-link">
              Practice again <Icon name="arrow" size={15} />
            </a>
          </div>
          <div className="activity-list">
            {activity.map((item, index) => (
              <div className="activity-row" key={`${item.completed_at}-${item.title}`}>
                <span className={`activity-icon activity-${index % 3}`}>
                  <Icon
                    name={item.exam_type === "mock_test" ? "clock" : "book"}
                    size={18}
                  />
                </span>
                <div className="activity-details">
                  <strong>{item.title}</strong>
                  <small>
                    {formatActivityDate(item.completed_at)} · {item.attempted_questions}
                    /{item.total_questions} answered
                  </small>
                </div>
                <span className="activity-score">
                  {item.accuracy.toFixed(0)}%
                  <small>{item.correct_answers} correct</small>
                </span>
              </div>
            ))}
            {!loading && activity.length === 0 && (
              <p className="dashboard-empty-copy">
                Your completed exams will appear here. Start a mock test or past paper
                to record your first result.
              </p>
            )}
          </div>
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>Subjects to revisit</h2>
              <p>Based on your submitted answers</p>
            </div>
            <span className="weak-count">
              {subjectPerformance.filter((item) => item.attempted > 0).length} subjects
            </span>
          </div>
          <div className="weak-topics">
            {[...subjectPerformance]
              .sort((left, right) => left.accuracy - right.accuracy)
              .slice(0, 3)
              .map((item) => (
                <div className="weak-topic" key={item.subject}>
                  <span className="topic-alert">
                    <Icon name="chart" size={15} />
                  </span>
                  <div>
                    <strong>{item.subject}</strong>
                    <small>
                      {item.attempted} answers · {item.correct} correct
                    </small>
                  </div>
                </div>
              ))}
            {!loading && subjectPerformance.length === 0 && (
              <p className="dashboard-empty-copy">
                Subject insights will appear after you complete an exam.
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

function Preparation({ categorySlug = "" }: { categorySlug?: string }) {
  const [selected, setSelected] = useState(
    netCategories.find((category) => category.id === categorySlug) ?? netCategories[0],
  );
  const [activeSubject, setActiveSubject] = useState(selected.subjects[0]);
  const selectedSubject = selected.subjects.includes(activeSubject)
    ? activeSubject
    : selected.subjects[0];
  return (
    <>
      <PageHeading
        eyebrow="YOUR LEARNING PATH"
        title="NET preparation"
        description="Explore your category, pick a subject, and move through the syllabus one topic at a time."
        action={
          <Button href="/practice">
            <Icon name="practice" size={17} /> Daily Challenge
          </Button>
        }
      />
      <Card className="category-selector-card">
        <div className="card-heading">
          <div>
            <h2>Choose a NET category</h2>
            <p>Category and programme eligibility can depend on academic background.</p>
          </div>
          <span className="verified-tag">
            <Icon name="check" size={14} /> NUST categories
          </span>
        </div>
        <div className="category-tabs">
          {netCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={
                selected.id === category.id
                  ? `category-tab active tint-${category.tint}`
                  : "category-tab"
              }
              onClick={() => {
                setSelected(category);
                setActiveSubject(category.subjects[0]);
              }}
            >
              <Icon name={category.icon} size={19} />
              <span>{category.title}</span>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </div>
        <p className="official-note">
          Listed subject groupings are based on NUST’s published guidance. Please
          confirm current eligibility and requirements with{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://nust.edu.pk/admissions/undergraduates/"
          >
            official NUST admissions
          </a>
          .
        </p>
      </Card>
      <div className="prep-content-heading">
        <div>
          <Eyebrow>{selected.title}</Eyebrow>
          <h2>Study by subject</h2>
        </div>
        <div className="prep-weights">{selected.weights}</div>
      </div>
      <div className="subject-tabs">
        {selected.subjects.map((subject) => (
          <button
            type="button"
            onClick={() => setActiveSubject(subject)}
            className={
              selectedSubject === subject ? "subject-tab active" : "subject-tab"
            }
            key={subject}
          >
            {subject}
          </button>
        ))}
      </div>
      <div className="subject-overview">
        <div className="subject-overview-main">
          <span className={`subject-large-icon tint-${selected.tint}`}>
            <Icon name={selected.icon} size={25} />
          </span>
          <div>
            <small>YOUR SELECTED SUBJECT</small>
            <h2>{selectedSubject}</h2>
            <p>
              Work through chapters in order, or jump to a topic you’d like to
              strengthen.
            </p>
          </div>
        </div>
        <div className="subject-overview-stats">
          <span>
            <strong>{selectedSubject === "English" ? 10 : 16}</strong>
            <small>chapters</small>
          </span>
          <span>
            <strong>{selectedSubject === "English" ? 188 : 342}</strong>
            <small>practice questions</small>
          </span>
          <span>
            <strong>{selectedSubject === "English" ? 81 : 58}%</strong>
            <small>completed</small>
          </span>
        </div>
      </div>
      <div className="chapter-list">
        {chapters.map((chapter, i) => (
          <div className="chapter-row" key={chapter.name}>
            <span className={`chapter-number ${i < 2 ? "chapter-number-done" : ""}`}>
              {i < 2 ? <Icon name="check" size={16} /> : `0${i + 1}`}
            </span>
            <div className="chapter-info">
              <div>
                <h3>
                  {selectedSubject === "Physics" && i === 0
                    ? "Vectors & Equilibrium"
                    : selectedSubject === "English" && i === 0
                      ? "Vocabulary & Word Usage"
                      : chapter.name}
                </h3>
                <span>
                  {chapter.topics} topics · {chapter.questions} practice questions
                </span>
              </div>
              <div className="chapter-progress">
                <Progress value={Math.round((chapter.done / chapter.topics) * 100)} />
                <small>
                  {chapter.done}/{chapter.topics} topics
                </small>
              </div>
            </div>
            <div className="chapter-actions">
              <a
                className="button button-quiet button-small"
                href={`/preparation/${selected.id}/${selectedSubject.toLowerCase().replaceAll(" ", "-")}/${chapter.name.toLowerCase().replaceAll(" ", "-")}`}
              >
                Explore topics
              </a>
              <a
                className="icon-button"
                href="/practice"
                aria-label={`Practice ${chapter.name}`}
              >
                <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="syllabus-disclaimer">
        <Icon name="info" size={16} />
        <p>
          Chapter and topic organization is a study aid, not a complete official
          syllabus. Use the latest NUST guidance and your prescribed textbooks when
          planning preparation.
        </p>
      </div>
    </>
  );
}

function Bookmarks() {
  const [items, setItems] = useState<string[]>([]);
  return (
    <>
      <PageHeading
        eyebrow="YOUR REVIEW LIST"
        title="Bookmarked questions"
        description="Keep the questions you want to understand better close at hand."
      />
      <Card>
        <div className="card-heading">
          <div>
            <h2>{items.length} saved questions</h2>
            <p>Use your review list to make your next session more focused.</p>
          </div>
          <Button href="/practice">
            <Icon name="practice" size={16} /> Practice
          </Button>
        </div>
        {items.length ? (
          items.map((item, index) => (
            <div className="bookmark-row" key={item}>
              <span className="bookmark-index">0{index + 1}</span>
              <div>
                <strong>{item.split(" · ")[0]}</strong>
                <small>{item.split(" · ")[1]} · Original practice question</small>
              </div>
              <a href="/practice" className="button button-quiet button-small">
                Review <Icon name="arrow" size={14} />
              </a>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove ${item}`}
                onClick={() => setItems(items.filter((current) => current !== item))}
              >
                <Icon name="close" size={17} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span>
              <Icon name="bookmark" size={22} />
            </span>
            <h3>Your review list is clear.</h3>
            <p>Bookmark questions during practice to revisit them here.</p>
            <Button href="/practice">
              Explore practice <Icon name="arrow" size={15} />
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}

type AnalyticsDay = {
  date: string;
  accuracy: number | null;
  questions_attempted: number;
};

type AnalyticsSubject = {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

type AnalyticsAttempt = DashboardActivity;

type AnalyticsResponse = {
  period_days: number;
  summary: {
    exams_completed: number;
    questions_attempted: number;
    correct_answers: number;
    accuracy: number | null;
    average_test_score: number | null;
    average_pace_seconds: number | null;
  };
  previous_period: {
    exams_completed: number;
    questions_attempted: number;
    accuracy: number | null;
    average_test_score: number | null;
    average_pace_seconds: number | null;
  };
  accuracy_over_time: AnalyticsDay[];
  subject_performance: AnalyticsSubject[];
  recent_activity: AnalyticsAttempt[];
};

function AnalyticsTrendChart({ days }: { days: AnalyticsDay[] }) {
  const activePoints = days.flatMap((day, index) =>
    day.accuracy === null
      ? []
      : [
          {
            x: days.length > 1 ? (index / (days.length - 1)) * 100 : 50,
            y: 90 - day.accuracy * 0.8,
          },
        ],
  );
  const line = activePoints.map((point) => `${point.x},${point.y}`).join(" ");
  const tickIndexes = Array.from(
    new Set([
      0,
      Math.round((days.length - 1) / 4),
      Math.round((days.length - 1) / 2),
      Math.round(((days.length - 1) * 3) / 4),
      days.length - 1,
    ]),
  );
  const formatDay = (date: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Karachi",
    }).format(new Date(`${date}T12:00:00+05:00`));

  return (
    <div className="performance-chart analytics-live-chart">
      <div className="chart-y-labels" aria-hidden="true">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label="Daily answer accuracy for selected period"
      >
        <defs>
          <linearGradient id="analyticsChartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity=".18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[10, 30, 50, 70, 90].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="#edf1f6"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {activePoints.length > 1 && (
          <>
            <polygon points={`0,95 ${line} 100,95`} fill="url(#analyticsChartFill)" />
            <polyline
              points={line}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
        {activePoints.length === 1 && (
          <circle
            cx={activePoints[0].x}
            cy={activePoints[0].y}
            r="2"
            fill="#fff"
            stroke="#2563eb"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {activePoints.length > 1 && (
          <circle
            cx={activePoints.at(-1)?.x}
            cy={activePoints.at(-1)?.y}
            r="2"
            fill="#fff"
            stroke="#2563eb"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      <div className="chart-x-labels">
        {tickIndexes.map((index) => (
          <span key={index}>{formatDay(days[index].date)}</span>
        ))}
      </div>
      {activePoints.length === 0 && (
        <p className="analytics-chart-empty">
          No completed exam activity in this period yet.
        </p>
      )}
    </div>
  );
}

function Analytics() {
  const { user, session, loading: authLoading } = useAuth();
  const [periodDays, setPeriodDays] = useState(30);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const requestId = useRef(0);

  const loadAnalytics = useCallback(async () => {
    const request = ++requestId.current;
    if (authLoading) return;
    if (!user?.id || session?.user.id !== user.id) {
      setAnalytics(null);
      setLoadError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(false);
    try {
      const { data, error } = await createClient().rpc("student_analytics", {
        p_period_days: periodDays,
      });
      if (error) throw error;
      if (!data || typeof data !== "object") {
        throw new Error("The analytics response was empty.");
      }
      if (request === requestId.current) setAnalytics(data as AnalyticsResponse);
    } catch (error) {
      const errorFields =
        error !== null && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      console.error(
        `Could not load student analytics: ${JSON.stringify({
          code: errorFields.code ?? null,
          message:
            errorFields.message ??
            (error instanceof Error ? error.message : String(error)),
          details: errorFields.details ?? null,
          hint: errorFields.hint ?? null,
        })}`,
      );
      if (request === requestId.current) setLoadError(true);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [authLoading, periodDays, session?.user.id, user?.id]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const summary = analytics?.summary;
  const previous = analytics?.previous_period;
  const accuracy = summary?.accuracy ?? null;
  const accuracyChange =
    accuracy !== null && previous?.accuracy !== null && previous?.accuracy !== undefined
      ? accuracy - previous.accuracy
      : null;
  const subjectsByAccuracy = [...(analytics?.subject_performance ?? [])].sort(
    (first, second) => second.accuracy - first.accuracy,
  );
  const strongestSubjects = subjectsByAccuracy.slice(0, 3);
  const subjectsToReview = [...subjectsByAccuracy].reverse().slice(0, 3);
  const accuracyTrend = (analytics?.accuracy_over_time ?? []).flatMap((day) =>
    day.accuracy === null ? [] : [day.accuracy],
  );
  const periodLabel = `Last ${periodDays} days`;
  const loadingNote = loading ? "Loading your activity" : "No completed exams yet";
  const accuracyNote =
    accuracyChange === null
      ? loading
        ? loadingNote
        : summary?.exams_completed
          ? "No results in the previous period"
          : "No completed exams in this period"
      : `${accuracyChange > 0 ? "+" : ""}${accuracyChange.toFixed(1)} pts vs previous period`;
  const subjectColors = ["blue", "violet", "teal", "amber", "rose"];
  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    });

  return (
    <>
      <PageHeading
        eyebrow="YOUR LEARNING DATA"
        title="Performance analytics"
        description="Review saved mock-test and past-paper results to guide your next study sessions."
        action={
          <select
            className="select-control"
            aria-label="Analytics date range"
            value={periodDays}
            onChange={(event) => setPeriodDays(Number(event.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }
      />
      {loadError && (
        <p className="form-alert form-alert-error" role="alert">
          Your analytics could not be loaded. Confirm that the student analytics SQL
          migration has been applied in Supabase, then{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => void loadAnalytics()}
          >
            try again
          </button>
          .
        </p>
      )}
      <div className="stat-grid">
        <StatCard
          title="Overall accuracy"
          value={loading || accuracy === null ? "—" : `${accuracy.toFixed(1)}%`}
          note={loading ? "Loading activity" : accuracyNote}
          icon="chart"
          color="teal"
          trend={accuracyTrend.length ? accuracyTrend : undefined}
        />
        <StatCard
          title="Questions attempted"
          value={loading ? "—" : (summary?.questions_attempted ?? 0).toLocaleString()}
          note={
            loading
              ? "Loading activity"
              : `${summary?.exams_completed ?? 0} completed exams`
          }
          icon="practice"
          trend={(analytics?.accuracy_over_time ?? []).map(
            (day) => day.questions_attempted,
          )}
        />
        <StatCard
          title="Average test score"
          value={
            loading
              ? "—"
              : summary?.average_test_score === null ||
                  summary?.average_test_score === undefined
                ? "—"
                : `${summary.average_test_score.toFixed(1)} / 100`
          }
          note={loading ? "Loading activity" : `For ${periodLabel.toLowerCase()}`}
          icon="trophy"
          color="violet"
        />
        <StatCard
          title="Average pace"
          value={
            loading
              ? "—"
              : summary?.average_pace_seconds === null ||
                  summary?.average_pace_seconds === undefined
                ? "—"
                : `${Math.round(summary.average_pace_seconds)} sec`
          }
          note={loading ? "Loading activity" : "Per attempted question"}
          icon="clock"
          color="amber"
        />
      </div>
      <div className="dashboard-main-grid">
        <Card className="chart-card">
          <div className="card-heading">
            <div>
              <h2>Accuracy over time</h2>
              <p>Daily accuracy from completed exams · {periodLabel.toLowerCase()}</p>
            </div>
            <span className="chart-legend">
              <i /> Accuracy
            </span>
          </div>
          {loading ? (
            <p className="dashboard-empty-copy">Loading your saved exam activity...</p>
          ) : (
            <AnalyticsTrendChart days={analytics?.accuracy_over_time ?? []} />
          )}
        </Card>
        <Card className="subject-performance-card">
          <div className="card-heading">
            <div>
              <h2>Subject performance</h2>
              <p>Based on answered questions in completed exams</p>
            </div>
          </div>
          {loading ? (
            <p className="dashboard-empty-copy">Loading subject results...</p>
          ) : subjectsByAccuracy.length ? (
            <div className="subject-performance-list">
              {analytics?.subject_performance.map((item, index) => (
                <div className="subject-performance" key={item.subject}>
                  <span
                    className={`subject-dot dot-${subjectColors[index % subjectColors.length]}`}
                  />
                  <span>{item.subject}</span>
                  <Progress
                    value={item.accuracy}
                    color={subjectColors[index % subjectColors.length]}
                  />
                  <strong>{item.accuracy.toFixed(0)}%</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty-copy">
              Complete a mock test or past paper to see your subject breakdown.
            </p>
          )}
          <div className="analytics-scope-note">
            {summary?.questions_attempted ?? 0} questions answered across{" "}
            {summary?.exams_completed ?? 0} completed exams in this period.
          </div>
        </Card>
      </div>
      <div className="dashboard-secondary-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Strongest subjects</h2>
              <p>Highest accuracy in this period</p>
            </div>
          </div>
          {loading ? (
            <p className="dashboard-empty-copy">Loading subject results...</p>
          ) : strongestSubjects.length ? (
            strongestSubjects.map((item) => (
              <div className="insight-row" key={item.subject}>
                <span className="insight-positive">
                  <Icon name="arrow" size={15} />
                </span>
                <strong>{item.subject}</strong>
                <span>{item.accuracy.toFixed(0)}%</span>
              </div>
            ))
          ) : (
            <p className="dashboard-empty-copy">
              Complete an exam to discover your strongest subjects.
            </p>
          )}
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>Subjects to revisit</h2>
              <p>Lowest accuracy in this period</p>
            </div>
          </div>
          {loading ? (
            <p className="dashboard-empty-copy">Loading subject results...</p>
          ) : subjectsToReview.length ? (
            subjectsToReview.map((item) => (
              <div className="insight-row" key={item.subject}>
                <span className="insight-review">
                  <Icon name="chart" size={15} />
                </span>
                <strong>{item.subject}</strong>
                <span>{item.accuracy.toFixed(0)}%</span>
              </div>
            ))
          ) : (
            <p className="dashboard-empty-copy">
              Subject review suggestions will appear after your first completed exam.
            </p>
          )}
        </Card>
      </div>
      <Card className="analytics-attempts-card">
        <div className="card-heading">
          <div>
            <h2>Recent completed exams</h2>
            <p>Your latest saved results in the selected period</p>
          </div>
        </div>
        {loading ? (
          <p className="dashboard-empty-copy">Loading your recent results...</p>
        ) : analytics?.recent_activity.length ? (
          <div className="activity-list">
            {analytics.recent_activity.map((attempt, index) => (
              <div
                className="activity-row"
                key={`${attempt.title}-${attempt.completed_at}`}
              >
                <span className={`activity-icon activity-${index % 3}`}>
                  <Icon
                    name={attempt.exam_type === "past_paper" ? "book" : "clock"}
                    size={17}
                  />
                </span>
                <span className="activity-details">
                  <strong>{attempt.title}</strong>
                  <small>
                    {formatDate(attempt.completed_at)} · {attempt.attempted_questions}{" "}
                    of {attempt.total_questions} questions answered
                  </small>
                </span>
                <span className="activity-score">
                  {attempt.correct_answers}/{attempt.attempted_questions}
                  <small>{attempt.accuracy.toFixed(1)}%</small>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty-copy">
            No completed exams recorded for this period. Your saved results will appear
            here after you finish a mock test or past paper.
          </p>
        )}
      </Card>
      <Card className="time-insight">
        <span className="time-insight-icon">
          <Icon name="clock" size={21} />
        </span>
        <div>
          <Eyebrow>TIME MANAGEMENT</Eyebrow>
          <h3>
            {summary?.average_pace_seconds == null
              ? "Your exam pace will appear after your first saved result."
              : `Your average pace is ${Math.round(summary.average_pace_seconds)} seconds per attempted question.`}
          </h3>
          <p>
            Calculated from elapsed time and answered questions in your completed timed
            mock tests and past papers. Practice MCQ activity is not included.
          </p>
        </div>
        <a href="/mock-tests" className="text-link">
          Try a mock exam <Icon name="arrow" size={15} />
        </a>
      </Card>
      <p className="demo-notice">
        <Icon name="info" size={14} /> Analytics reflect completed mock tests and past
        papers saved to your MeritLab account, not unsaved browser-only results.
      </p>
    </>
  );
}

function Resources({
  initialType = "All resources",
  hasPlusAccess,
}: {
  initialType?: string;
  hasPlusAccess: boolean;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(initialType);
  const [subject, setSubject] = useState("All subjects");
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<
    (typeof resources)[number] | null
  >(null);
  const filtered = useMemo(
    () =>
      resources.filter(
        (resource) =>
          (type === "All resources" || resource.type === type) &&
          (subject === "All subjects" || resource.subject === subject) &&
          `${resource.title} ${resource.type} ${resource.subject} ${"summary" in resource ? resource.summary : ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, subject, type],
  );
  return (
    <>
      <PageHeading
        eyebrow={
          initialType === "Formula sheet"
            ? "FORMULA SHEETS"
            : "LEARN BEYOND THE QUESTIONS"
        }
        title={initialType === "Formula sheet" ? "Formula sheets" : "Study resources"}
        description="Clear, focused revision references to help you recognise formulas and solve questions with confidence."
        action={
          <a
            href="https://nust.edu.pk/admissions/undergraduates/"
            target="_blank"
            rel="noreferrer"
            className="button button-outline"
          >
            Official NUST admissions <Icon name="arrow" size={15} />
          </a>
        }
      />
      <div className="resource-controls">
        <label className="resource-search">
          <Icon name="search" size={18} />
          <input
            placeholder="Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="filter-control">
          <Icon name="filter" size={17} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>All resources</option>
            <option>Formula sheet</option>
            <option>Revision notes</option>
            <option>Important concepts</option>
            <option>Study guide</option>
            <option>Past paper</option>
          </select>
        </label>
        <select
          className="filter-control"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option>All subjects</option>
          {subjects.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="resource-feature">
        <div className="resource-feature-copy">
          <div className="resource-feature-labels">
            <span className="eyebrow eyebrow-light">MeritLab resource library</span>
            <CrackNetBadge />
          </div>
          <h2>
            Useful resources.
            <br />
            Added with care.
          </h2>
          <p>
            Browse carefully grouped Mathematics formula sheets. Choose a topic to
            review key ideas in textbook notation or download its complete PDF.
          </p>
          <a href="/resources/formula-sheets" className="button button-white">
            Browse formula sheets <Icon name="arrow" size={15} />
          </a>
        </div>
        <div className="resource-feature-art">
          <span className="feature-paper paper-back">
            <Icon name="book" size={23} />
          </span>
          <span className="feature-paper paper-front">
            <Icon name="book" size={25} />
            <b>STUDY RESOURCES</b>
            <small>MERITLAB LIBRARY</small>
          </span>
          <span className="resource-star">✳</span>
        </div>
      </div>
      <div className="resource-list-header">
        <div>
          <h2>Browse resources</h2>
          <p>
            {filtered.length} resources <span>·</span> Formula sheets & study references
          </p>
        </div>
        <button
          type="button"
          className="subtle-link"
          onClick={() => {
            setType("All resources");
            setSubject("All subjects");
            setQuery("");
          }}
        >
          Reset filters <Icon name="close" size={15} />
        </button>
      </div>
      <div className="resource-grid">
        {filtered.map((resource, i) => {
          const locked =
            !hasPlusAccess &&
            resource.type === "Formula sheet" &&
            resource.href !== "/resources/formula-sheets/conic-sections";
          return (
            <Card
              className={`resource-card ${resource.type === "Formula sheet" ? "resource-card-formula" : ""}`}
              key={resource.title}
            >
              <div className="resource-card-heading">
                <div className={`resource-icon resource-icon-${i % 5}`}>
                  <Icon name={resource.icon} size={21} />
                </div>
                {resource.type === "Formula sheet" &&
                  (locked ? (
                    <span className="crack-net-badge">
                      <Icon name="lock" size={13} /> Plus
                    </span>
                  ) : (
                    <CrackNetBadge />
                  ))}
              </div>
              <div className="resource-card-top">
                <span>{resource.type}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSaved(
                      saved.includes(resource.title)
                        ? saved.filter((title) => title !== resource.title)
                        : [...saved, resource.title],
                    )
                  }
                  className={`icon-button ${saved.includes(resource.title) ? "saved" : ""}`}
                  aria-label={
                    saved.includes(resource.title)
                      ? "Remove bookmark"
                      : "Bookmark resource"
                  }
                >
                  <Icon name="bookmark" size={17} />
                </button>
              </div>
              <h3
                className={
                  resource.type === "Formula sheet" ? "formula-sheet-topic" : undefined
                }
              >
                {resource.title}
              </h3>
              <p>
                {resource.subject} <i /> {resource.read}
              </p>
              <button
                type="button"
                className="resource-open"
                onClick={() => setSelectedResource(resource)}
              >
                {locked ? "Unlock with Plus" : "View details"}{" "}
                <Icon name={locked ? "lock" : "arrow"} size={15} />
              </button>
            </Card>
          );
        })}
      </div>
      {selectedResource && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-dialog-title"
          >
            <button
              type="button"
              className="modal-close icon-button"
              onClick={() => setSelectedResource(null)}
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
            <span className="modal-icon">
              <Icon name={selectedResource.icon} size={22} />
            </span>
            <Eyebrow>{selectedResource.type}</Eyebrow>
            <h2 id="resource-dialog-title">{selectedResource.title}</h2>
            <p>
              {selectedResource.subject} · {selectedResource.read}.{" "}
              {"summary" in selectedResource
                ? selectedResource.summary
                : "This is a demonstration listing; the complete study material is not included in this frontend."}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setSelectedResource(null)}
              >
                Close
              </button>
              {"href" in selectedResource ? (
                hasPlusAccess ||
                selectedResource.href === "/resources/formula-sheets/conic-sections" ? (
                  <>
                    <a
                      href={selectedResource.downloadHref}
                      className="button button-outline"
                      download
                    >
                      Download PDF <Icon name="book" size={15} />
                    </a>
                    <a href={selectedResource.href} className="button button-primary">
                      Open formatted sheet <Icon name="arrow" size={15} />
                    </a>
                  </>
                ) : (
                  <a href="/pricing" className="button button-primary">
                    View Plus plans <Icon name="lock" size={15} />
                  </a>
                )
              ) : (
                <a href="/practice" className="button button-primary">
                  Browse practice <Icon name="arrow" size={15} />
                </a>
              )}
            </div>
          </section>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>
            {type === "Past paper"
              ? "No verified past papers are available here yet."
              : type === "Formula sheet"
                ? "No formula sheets are available yet."
                : "No resources match those filters."}
          </h3>
          <p>
            {type === "Formula sheet" ? (
              "Your formula sheets will appear here after you add them."
            ) : type === "Past paper" ? (
              <>
                We won’t label unverified material as authentic. Check current
                admissions information on{" "}
                <a
                  href="https://nust.edu.pk/admissions/undergraduates/"
                  target="_blank"
                  rel="noreferrer"
                >
                  the official NUST website
                </a>
                .
              </>
            ) : (
              "Try another subject or search term."
            )}
          </p>
        </div>
      )}
      <p className="demo-notice">
        <Icon name="info" size={14} /> Formula sheets and study guides are provided for
        revision. Always check official NUST sources for current admissions information.
      </p>
    </>
  );
}

function Leaderboard({ challenges = false }: { challenges?: boolean }) {
  const [view, setView] = useState("This week");
  if (challenges)
    return (
      <>
        <PageHeading
          eyebrow="A LITTLE PRACTICE, EVERY DAY"
          title="Daily challenges"
          description="Small, achievable sessions can help build a lasting study routine."
          action={
            <a href="/leaderboard" className="button button-outline">
              <Icon name="trophy" size={16} /> Weekly leaderboard
            </a>
          }
        />
        <Card className="challenge-hero">
          <div className="challenge-hero-art">
            <div className="challenge-sun">✦</div>
            <div className="challenge-stack">
              <span>
                <Icon name="practice" />
              </span>
              <span>
                <Icon name="book" />
              </span>
              <span>
                <Icon name="bolt" />
              </span>
            </div>
          </div>
          <div className="challenge-hero-copy">
            <span className="challenge-pill">
              <Icon name="flame" size={14} /> TODAY’S CHALLENGE
            </span>
            <h2>
              15 questions.
              <br />
              One focused session.
            </h2>
            <p>
              Try a short Mathematics set and give yourself a moment to review the
              explanations.
            </p>
            <div className="challenge-meta">
              <span>
                <Icon name="clock" size={16} /> About 12 min
              </span>
              <span>
                <Icon name="spark" size={16} /> +50 points
              </span>
            </div>
            <Button href="/practice">
              Start today’s challenge <Icon name="arrow" size={16} />
            </Button>
          </div>
        </Card>
        <div className="dashboard-main-grid">
          <Card>
            <div className="card-heading">
              <div>
                <h2>Your weekly consistency</h2>
                <p>Demonstration view · this week</p>
              </div>
              <span className="streak-badge">
                <Icon name="flame" size={16} /> 12 day streak
              </span>
            </div>
            <Bars
              values={[56, 83, 47, 92, 68, 34, 18]}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"]}
            />
            <div className="challenge-progress">
              <Progress value={80} color="teal" />
              <span>4 of 5 weekly goal days</span>
            </div>
          </Card>
          <Card>
            <div className="card-heading">
              <div>
                <h2>Recent achievements</h2>
                <p>Celebrate the steps you’re taking</p>
              </div>
            </div>
            <div className="badges-grid">
              <span className="badge-item badge-blue">
                <Icon name="bolt" size={22} />
                <strong>Quick start</strong>
                <small>First practice set</small>
              </span>
              <span className="badge-item badge-teal">
                <Icon name="flame" size={22} />
                <strong>On a roll</strong>
                <small>7-day streak</small>
              </span>
              <span className="badge-item badge-gold">
                <Icon name="book" size={22} />
                <strong>Page turner</strong>
                <small>10 topics explored</small>
              </span>
            </div>
          </Card>
        </div>
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="COMMUNITY & CONSISTENCY"
        title="Weekly leaderboard"
        description="A friendly look at this week’s illustrative practice points. Your preparation is personal—use this as motivation, not pressure."
        action={
          <a href="/challenges" className="button button-primary">
            <Icon name="bolt" size={16} /> Daily challenge
          </a>
        }
      />
      <div className="leaderboard-tabs">
        {["This week", "Overall"].map((item) => (
          <button
            type="button"
            onClick={() => setView(item)}
            className={view === item ? "active" : ""}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="leaderboard-layout">
        <Card className="leaderboard-card">
          <div className="leaderboard-head">
            <div>
              <h2>{view} learners</h2>
              <p>Points earned through practice and learning goals</p>
            </div>
            <span className="week-range">NOV 18 – NOV 25</span>
          </div>
          <div className="leaderboard-podium">
            {leaderboard.slice(0, 3).map((person, _i) => (
              <div className={`podium-person podium-${person.rank}`} key={person.name}>
                <span className={`avatar podium-avatar podium-avatar-${person.rank}`}>
                  {person.initials}
                </span>
                <strong>{person.name}</strong>
                <small>{person.points.toLocaleString()} pts</small>
                <i>{person.rank}</i>
              </div>
            ))}
          </div>
          <div className="ranking-list">
            {leaderboard.slice(3).map((person) => (
              <div
                className={`ranking-row ${person.name === "You" ? "ranking-you" : ""}`}
                key={person.name}
              >
                <span className="rank-number">{person.rank}</span>
                <span className="avatar avatar-soft">{person.initials}</span>
                <strong>{person.name === "You" ? "You" : person.name}</strong>
                <span className="rank-streak">
                  <Icon name="flame" size={15} /> {person.streak} days
                </span>
                <strong className="rank-points">
                  {person.points.toLocaleString()} pts
                </strong>
              </div>
            ))}
          </div>
          <p className="leaderboard-note">
            <Icon name="info" size={14} /> Demo profiles and points are illustrative,
            not real student rankings.
          </p>
        </Card>
        <Card className="leaderboard-side">
          <span className="leader-side-icon">
            <Icon name="trophy" size={22} />
          </span>
          <Eyebrow>YOUR POSITION</Eyebrow>
          <h2>
            #4 <small>this week</small>
          </h2>
          <p>
            You’re 150 points from the next place. A daily practice set is a good way to
            keep moving.
          </p>
          <Progress value={78} color="teal" />
          <a href="/challenges" className="text-link">
            See today’s challenge <Icon name="arrow" size={15} />
          </a>
        </Card>
      </div>
    </>
  );
}

function Profile({ settings = false }: { settings?: boolean }) {
  const { profile, user, updateProfile, identityError } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [targetCategory, setTargetCategory] = useState("NET-Engineering");

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name);
    setPhone(profile.phone ?? "");
    setTargetCategory(profile.target_net_category || "NET-Engineering");
  }, [profile]);

  async function saveProfile() {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        target_net_category: targetCategory,
      });
      setSaved(true);
    } catch {
      setSaveError(
        "Your profile could not be saved. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (settings)
    return (
      <>
        <PageHeading
          eyebrow="MAKE MERITLAB YOURS"
          title="Account settings"
          description="Manage your preferences and how you stay informed."
        />
        <div className="settings-layout">
          <div className="settings-nav">
            <a className="active" href="#preferences">
              Preferences
            </a>
            <a href="#notifications">Notifications</a>
            <a href="#security">Security</a>
          </div>
          <div className="settings-panels">
            <Card id="preferences">
              <Eyebrow>LEARNING PREFERENCES</Eyebrow>
              <h2>Preparation preferences</h2>
              <p className="settings-desc">
                Keep your study experience aligned with your current goal.
              </p>
              <label className="field-label">
                Preferred NET category
                <select
                  className="form-input"
                  value={targetCategory}
                  onChange={(event) => setTargetCategory(event.target.value)}
                >
                  {netCategoryOptions.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Weekly study goal
                <select className="form-input">
                  <option>5 days a week</option>
                  <option>3 days a week</option>
                  <option>7 days a week</option>
                </select>
              </label>
            </Card>
            <Card id="notifications">
              <Eyebrow>NOTIFICATIONS</Eyebrow>
              <h2>Stay up to date</h2>
              <p className="settings-desc">
                MeritLab sends in-app notifications when your exam results are ready and
                when an administrator shares an announcement. Open the bell in the top
                bar to read them and manage unread items.
              </p>
              <div className="notification-preference-list">
                <div>
                  <Icon name="trophy" size={17} />
                  <span>
                    <strong>Exam results</strong>
                    <small>Receive a notice after a completed result is saved.</small>
                  </span>
                </div>
                <div>
                  <Icon name="bell" size={17} />
                  <span>
                    <strong>MeritLab announcements</strong>
                    <small>See updates shared by the MeritLab team.</small>
                  </span>
                </div>
              </div>
            </Card>
            <Card id="security">
              <Eyebrow>SECURITY</Eyebrow>
              <h2>Password & account</h2>
              <p className="settings-desc">
                Use a secure password and request a password reset if you need to regain
                access.
              </p>
              <a href="/forgot-password" className="button button-outline">
                Reset password <Icon name="arrow" size={15} />
              </a>
            </Card>
            {saveError && (
              <p className="form-alert form-alert-error" role="alert">
                {saveError}
              </p>
            )}
            <Button
              onClick={() => void saveProfile()}
              disabled={saving || fullName.trim().length < 2}
            >
              {saved ? (
                <>
                  <Icon name="check" size={16} /> Preferences saved
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                "Save preferences"
              )}
            </Button>
          </div>
        </div>
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="YOUR STUDENT PROFILE"
        title="Your profile"
        description="A little context helps make your preparation path more relevant."
        action={
          <Button href="/settings" variant="outline">
            <Icon name="settings" size={16} /> Account settings
          </Button>
        }
      />
      {identityError && (
        <p className="form-alert form-alert-error" role="status">
          Account details could not be loaded. Refresh the page or try again shortly.
        </p>
      )}
      <Card className="profile-hero">
        <div className="profile-avatar-large">
          {(profile?.full_name || user?.email || "S")
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
          <span>
            <Icon name="plus" size={14} />
          </span>
        </div>
        <div className="profile-hero-text">
          <Eyebrow>MERITLAB STUDENT</Eyebrow>
          <h2>{profile?.full_name || user?.email || "Student"}</h2>
          <p>
            {user?.email} · Preparing for{" "}
            {profile?.target_net_category || "a NET category"}
          </p>
          <small>
            Account created{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })
              : "—"}
          </small>
        </div>
        <button
          type="button"
          className="button button-outline"
          onClick={() =>
            document
              .getElementById("profile-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Edit profile <Icon name="user" size={15} />
        </button>
      </Card>
      <div className="dashboard-main-grid">
        <Card id="profile-form">
          <div className="card-heading">
            <div>
              <h2>Personal details</h2>
              <p>Update your learning profile</p>
            </div>
          </div>
          <div className="profile-form-grid">
            <label className="field-label">
              Full name
              <input
                className="form-input"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                minLength={2}
                required
              />
            </label>
            <label className="field-label">
              Email address
              <input
                className="form-input"
                type="email"
                value={user?.email ?? ""}
                readOnly
              />
            </label>
            <label className="field-label">
              Phone number
              <input
                className="form-input"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={32}
              />
            </label>
            <label className="field-label">
              Preferred NET category
              <select
                className="form-input"
                value={targetCategory}
                onChange={(event) => setTargetCategory(event.target.value)}
              >
                {netCategoryOptions.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          {saveError && <p className="form-alert form-alert-error">{saveError}</p>}
          <Button
            onClick={() => void saveProfile()}
            className="profile-save"
            disabled={saving || fullName.trim().length < 2}
          >
            {saved ? (
              <>
                <Icon name="check" size={16} /> Changes saved
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              "Save changes"
            )}
          </Button>
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>Learning snapshot</h2>
              <p>Your recent study activity</p>
            </div>
          </div>
          <div className="profile-snapshot">
            <div>
              <span>
                <Icon name="practice" />
              </span>
              <strong>248</strong>
              <small>Questions practiced</small>
            </div>
            <div>
              <span>
                <Icon name="flame" />
              </span>
              <strong>12 days</strong>
              <small>Current streak</small>
            </div>
            <div>
              <span>
                <Icon name="chart" />
              </span>
              <strong>72%</strong>
              <small>Practice accuracy</small>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <PageHeading
        eyebrow="ABOUT MERITLAB"
        title="A calmer, clearer way to prepare."
        description="We’re building a focused learning experience for students preparing for NUST’s Entry Test—one that helps make the next study step feel doable."
      />
      <Card className="about-mission">
        <span className="about-mission-icon">
          <Icon name="orbit" size={28} />
        </span>
        <div>
          <Eyebrow>OUR MISSION</Eyebrow>
          <h2>Help students prepare with intention.</h2>
          <p>
            MeritLab brings structured learning, purposeful question practice, mock-exam
            simulations, and progress insights into one thoughtful experience. We
            believe good preparation starts with useful feedback and a plan you can
            follow.
          </p>
        </div>
      </Card>
      <div className="dashboard-secondary-grid">
        <Card>
          <span className="about-card-icon">
            <Icon name="book" />
          </span>
          <h2>Grounded in the syllabus</h2>
          <p>
            We organize preparation around the NET categories and subjects NUST
            publishes, and encourage students to verify current eligibility and official
            requirements directly.
          </p>
        </Card>
        <Card>
          <span className="about-card-icon about-green">
            <Icon name="spark" />
          </span>
          <h2>Clear about what’s real</h2>
          <p>
            MeritLab is an independent preparation platform, not affiliated with NUST.
            Original practice material is not represented as authentic past-paper
            content.
          </p>
        </Card>
      </div>
      <div className="about-callout">
        <Icon name="info" />
        <p>
          MeritLab uses Supabase for authentication and profile data when configured.
          Practice attempts and results currently remain in the browser session, and
          some learning content and analytics use demonstration data.
        </p>
      </div>
      <a href="/" className="text-link">
        Back to home <Icon name="arrow" size={16} />
      </a>
    </>
  );
}

function GenericInfo({ title }: { title: string }) {
  return (
    <>
      <PageHeading
        eyebrow="MERITLAB"
        title={title}
        description="We’re building a focused, reliable preparation experience for students."
      />
      <Card className="empty-state">
        <span>
          <Icon name="book" size={24} />
        </span>
        <h2>{title} information</h2>
        <p>
          This section will be available as MeritLab grows. Student-facing pages
          currently use demonstration data only.
        </p>
        <Button href="/">
          Return home <Icon name="arrow" size={15} />
        </Button>
      </Card>
    </>
  );
}

export function StudentPage({
  path,
  hasPlusAccess,
}: {
  path: string[];
  hasPlusAccess: boolean;
}) {
  const root = path[0] ?? "";
  if (root === "dashboard" || root === "app") return <Dashboard />;
  if (root === "payments") return <StudentPaymentsPage />;
  if (root === "preparation") return <Preparation categorySlug={path[1] ?? ""} />;
  if (root === "practice" || root === "challenges") return <DailyChallenge />;
  if (root === "bookmarks") return <Bookmarks />;
  if (root === "analytics") return <Analytics />;
  if (
    root === "resources" &&
    path[1] === "formula-sheets" &&
    path[2] === "conic-sections"
  )
    return <ConicCheatSheet />;
  if (root === "resources")
    return (
      <Resources
        initialType={path[1] === "formula-sheets" ? "Formula sheet" : undefined}
        hasPlusAccess={hasPlusAccess}
      />
    );
  if (root === "leaderboard") return <Leaderboard />;
  if (root === "profile") return <Profile />;
  if (root === "settings") return <Profile settings />;
  if (root === "about") return <About />;
  if (root === "faq" || root === "privacy" || root === "terms")
    return (
      <GenericInfo
        title={
          root === "faq"
            ? "Frequently asked questions"
            : root === "privacy"
              ? "Privacy"
              : "Terms of use"
        }
      />
    );
  return <Dashboard />;
}
