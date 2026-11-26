"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  type DailyChallengeSet,
  type DailyQuestion,
  dailyChallengeSets,
} from "@/lib/daily-challenge-data";
import { Icon } from "./ui";

type DailyCompletion = {
  completedOn: string;
  correctCount: number;
  score: number;
  selectedOptions: (string | null)[];
};

type DailyProgress = {
  version: 1;
  startedOn: string;
  currentStreak: number;
  bestStreak: number;
  lastCompletedOn: string | null;
  completedSets: Record<string, DailyCompletion>;
};

const difficultyTiers = [
  { name: "Easy", className: "easy" },
  { name: "Medium", className: "medium" },
  { name: "Hard", className: "hard" },
  { name: "Insane", className: "insane" },
  { name: "Very Insane", className: "boss" },
];

const pointsByDifficulty: Record<DailyQuestion["difficulty"], number> = {
  Easy: 10,
  Medium: 20,
  Hard: 35,
  Insane: 55,
  "Very Insane": 80,
};

function karachiDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function daysBetween(first: string, last: string) {
  const toUtc = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.floor((toUtc(last) - toUtc(first)) / 86_400_000);
}

function emptyProgress(startedOn: string): DailyProgress {
  return {
    version: 1,
    startedOn,
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedOn: null,
    completedSets: {},
  };
}

function isDailyProgress(value: unknown): value is DailyProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DailyProgress>;
  return (
    candidate.version === 1 &&
    typeof candidate.startedOn === "string" &&
    typeof candidate.currentStreak === "number" &&
    typeof candidate.bestStreak === "number" &&
    (candidate.lastCompletedOn === null ||
      typeof candidate.lastCompletedOn === "string") &&
    candidate.completedSets !== null &&
    typeof candidate.completedSets === "object"
  );
}

function shuffledQuestions(set: DailyChallengeSet) {
  return set.questions.map((question) => {
    const options = question.options.map((text, originalIndex) => ({
      text,
      originalIndex,
    }));
    for (let index = options.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
    }
    return {
      ...question,
      options: options.map((option) => option.text) as DailyQuestion["options"],
      correctIndex: options.findIndex(
        (option) => option.originalIndex === question.correctIndex,
      ),
    };
  });
}

function scoreAnswers(questions: DailyQuestion[], answers: (number | null)[]) {
  return questions.reduce(
    (score, question, index) =>
      answers[index] === question.correctIndex
        ? score + pointsByDifficulty[question.difficulty]
        : score,
    0,
  );
}

export function DailyChallenge() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<string | null>(null);
  const [storageError, setStorageError] = useState("");
  const [view, setView] = useState<"home" | "quiz" | "summary">("home");
  const [quizQuestions, setQuizQuestions] = useState<DailyQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [mistakesOnly, setMistakesOnly] = useState(true);

  const storageKey = `meritlab.daily-challenge.v1.${user?.id ?? "guest"}`;
  const dayIndex = progress
    ? Math.min(
        Math.max(daysBetween(progress.startedOn, today ?? progress.startedOn), 0),
        dailyChallengeSets.length - 1,
      )
    : 0;
  const activeSet = dailyChallengeSets[dayIndex];
  const currentQuestion = quizQuestions[questionIndex];
  const selectedAnswer = answers[questionIndex] ?? null;
  const todayCompletion = progress?.completedSets[String(activeSet.day)];
  const maximumPoints = activeSet.questions.reduce(
    (total, question) => total + pointsByDifficulty[question.difficulty],
    0,
  );
  const questionProgress =
    ((questionIndex + (selectedAnswer === null ? 0 : 1)) / activeSet.questions.length) *
    100;

  const persistProgress = useCallback(
    (next: DailyProgress) => {
      setProgress(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        setStorageError("");
      } catch (error) {
        console.error("Could not save daily challenge progress.", error);
        setStorageError(
          "Your browser could not save progress. Your current session will still work, but completion may not persist.",
        );
      }
    },
    [storageKey],
  );

  useEffect(() => {
    const updateToday = () => setToday(karachiDate());
    updateToday();
    const intervalId = window.setInterval(updateToday, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (authLoading || !today) return;
    const initial = emptyProgress(today);
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!isDailyProgress(parsed)) {
          throw new Error("Saved daily challenge progress has an invalid format.");
        }
        setProgress(parsed);
        const index = Math.min(
          Math.max(daysBetween(parsed.startedOn, today), 0),
          dailyChallengeSets.length - 1,
        );
        if (parsed.completedSets[String(index + 1)]?.completedOn === today) {
          setView("summary");
        }
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(initial));
        setProgress(initial);
      }
    } catch (error) {
      console.error("Could not load daily challenge progress.", error);
      setProgress(initial);
      setStorageError(
        "Saved challenge progress could not be read. A new 10-day challenge schedule has started in this browser.",
      );
    } finally {
      setLoading(false);
    }
  }, [authLoading, storageKey, today]);

  useEffect(() => {
    if (!progress || !today || view !== "summary") return;
    const currentDay = Math.min(
      Math.max(daysBetween(progress.startedOn, today), 0),
      dailyChallengeSets.length - 1,
    );
    if (progress.completedSets[String(currentDay + 1)]?.completedOn !== today) {
      setView("home");
    }
  }, [progress, today, view]);

  useEffect(() => {
    if (!progress || !today || view !== "quiz") return;
    const currentDay = Math.min(
      Math.max(daysBetween(progress.startedOn, today), 0),
      dailyChallengeSets.length - 1,
    );
    if (dailyChallengeSets[currentDay].day !== activeSet.day) {
      setQuizQuestions([]);
      setAnswers([]);
      setQuestionIndex(0);
      setView("home");
    }
  }, [activeSet.day, progress, today, view]);

  useEffect(() => {
    if (view !== "quiz") return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      const keyIndex = /^[1-4]$/.test(event.key)
        ? Number(event.key) - 1
        : "abcd".indexOf(event.key.toLowerCase());
      if (keyIndex >= 0 && keyIndex < 4 && selectedAnswer === null) {
        event.preventDefault();
        chooseAnswer(keyIndex);
        return;
      }
      if (
        (event.key === "Enter" ||
          event.key === "ArrowRight" ||
          event.key === "ArrowDown") &&
        selectedAnswer !== null
      ) {
        event.preventDefault();
        advanceQuestion();
      }
      if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && questionIndex > 0) {
        event.preventDefault();
        setQuestionIndex((current) => current - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function beginChallenge() {
    if (todayCompletion) {
      setView("summary");
      return;
    }
    setQuizQuestions(shuffledQuestions(activeSet));
    setAnswers(Array(activeSet.questions.length).fill(null));
    setQuestionIndex(0);
    setView("quiz");
  }

  function chooseAnswer(index: number) {
    if (selectedAnswer !== null) return;
    setAnswers((current) =>
      current.map((answer, question) => (question === questionIndex ? index : answer)),
    );
  }

  function finishChallenge() {
    if (!progress || !today || !currentQuestion || selectedAnswer === null) return;
    const selectedAnswers = quizQuestions.map((question, index) => {
      const answerIndex = answers[index];
      return answerIndex === null ? null : question.options[answerIndex];
    });
    const correctCount = quizQuestions.reduce(
      (count, question, index) =>
        answers[index] === question.correctIndex ? count + 1 : count,
      0,
    );
    const score = scoreAnswers(quizQuestions, answers);
    const completedOn = today;
    const currentStreak =
      progress.lastCompletedOn &&
      daysBetween(progress.lastCompletedOn, completedOn) === 1
        ? progress.currentStreak + 1
        : 1;
    const completion: DailyCompletion = {
      completedOn,
      correctCount,
      score,
      selectedOptions: selectedAnswers,
    };
    const nextProgress: DailyProgress = {
      ...progress,
      currentStreak,
      bestStreak: Math.max(progress.bestStreak, currentStreak),
      lastCompletedOn: completedOn,
      completedSets: {
        ...progress.completedSets,
        [String(activeSet.day)]: completion,
      },
    };
    persistProgress(nextProgress);
    setView("summary");
  }

  function advanceQuestion() {
    if (selectedAnswer === null) return;
    if (questionIndex === quizQuestions.length - 1) {
      finishChallenge();
      return;
    }
    setQuestionIndex((current) => current + 1);
  }

  const streak = progress?.currentStreak ?? 0;
  const completion = todayCompletion;
  const correctCount =
    completion?.correctCount ??
    quizQuestions.reduce(
      (count, question, index) =>
        answers[index] === question.correctIndex ? count + 1 : count,
      0,
    );
  const score =
    completion?.score ??
    (quizQuestions.length ? scoreAnswers(quizQuestions, answers) : 0);
  const reviewQuestions = activeSet.questions
    .map((question, index) => ({
      question,
      index,
      selected: completion?.selectedOptions[index] ?? null,
    }))
    .filter(({ question, selected }) =>
      mistakesOnly ? selected !== question.options[question.correctIndex] : true,
    );

  if (loading || !progress) {
    return (
      <section className="nust-dc" aria-busy="true">
        <div className="nust-dc-loading">
          <span className="nust-dc-spinner" />
          <p>Loading your daily challenge…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="nust-dc" aria-label="Daily Challenge">
      {storageError && (
        <div className="nust-dc-alert" role="status">
          <Icon name="info" size={16} />
          <span>{storageError}</span>
        </div>
      )}
      {view === "home" && (
        <>
          <header className="nust-dc-hero">
            <div className="nust-dc-hero-copy">
              <span className="nust-dc-kicker">
                <Icon name="flame" size={15} /> DAILY CHALLENGE
              </span>
              <h1>Ten questions. One sharper you.</h1>
              <p>
                A fresh NUST NET-style set unlocks each day. Build your streak, climb
                the difficulty ramp, and finish with the Final Boss.
              </p>
              <div className="nust-dc-hero-stats">
                <span>
                  <strong>10</strong> questions
                </span>
                <i />
                <span>
                  <strong>5</strong> difficulty tiers
                </span>
                <i />
                <span className="nust-dc-streak">
                  <Icon name="flame" size={15} /> {streak}-day streak
                </span>
              </div>
            </div>
            <div className="nust-dc-hero-orbit" aria-hidden="true">
              <span className="nust-dc-orbit-ring" />
              <span className="nust-dc-orbit-core">
                <Icon name="bolt" size={34} />
              </span>
              <span className="nust-dc-orbit-dot" />
              <span className="nust-dc-orbit-spark">✦</span>
            </div>
          </header>

          <div className="nust-dc-section-heading">
            <div>
              <span className="nust-dc-eyebrow">YOUR 10-DAY RUN</span>
              <h2>One set unlocks each day</h2>
            </div>
            <span className="nust-dc-best">
              <Icon name="trophy" size={16} /> Best streak: {progress.bestStreak} days
            </span>
          </div>

          <div className="nust-dc-day-grid">
            {dailyChallengeSets.map((set, index) => {
              const isToday = index === dayIndex;
              const done = Boolean(progress.completedSets[String(set.day)]);
              const locked = !isToday && !done;
              return (
                <article
                  className={`nust-dc-day-card ${isToday ? "nust-dc-day-current" : ""} ${done ? "nust-dc-day-done" : ""} ${locked ? "nust-dc-day-locked" : ""}`}
                  key={set.day}
                  aria-label={`Day ${set.day}: ${done ? "completed" : isToday ? "unlocked today" : "locked"}`}
                >
                  <span className="nust-dc-day-icon">
                    <Icon name={done ? "check" : locked ? "lock" : "bolt"} size={18} />
                  </span>
                  <small>DAY {String(set.day).padStart(2, "0")}</small>
                  <strong>{set.title}</strong>
                  <span className="nust-dc-day-status">
                    {done ? "Completed" : isToday ? "Unlocked today" : "Locked"}
                  </span>
                </article>
              );
            })}
          </div>

          <div className="nust-dc-today-card">
            <div className="nust-dc-today-mark">
              <span>DAY {String(activeSet.day).padStart(2, "0")}</span>
              <Icon name={activeSet.day === 10 ? "trophy" : "practice"} size={25} />
            </div>
            <div className="nust-dc-today-copy">
              <span className="nust-dc-eyebrow">
                {completion ? "TODAY COMPLETE" : "TODAY’S SET"}
              </span>
              <h2>
                {activeSet.title}
                {activeSet.day === 10 && (
                  <b className="nust-dc-boss-badge">FINAL BOSS</b>
                )}
              </h2>
              <p>
                10 questions across Mathematics, Physics, and English. Earn up to{" "}
                {maximumPoints} challenge points.
              </p>
            </div>
            <button type="button" className="nust-dc-primary" onClick={beginChallenge}>
              {completion ? "View today’s result" : "Start today’s challenge"}
              <Icon name="arrow" size={17} />
            </button>
          </div>
          <p className="nust-dc-lock-note">
            <Icon name="lock" size={14} /> Future sets stay locked until their scheduled
            day. Your 10-day schedule starts on your first visit.
          </p>
        </>
      )}

      {view === "quiz" && currentQuestion && (
        <div
          className={`nust-dc-quiz nust-dc-tier-${difficultyTiers.find((tier) => tier.name === currentQuestion.difficulty)?.className ?? "easy"}`}
        >
          <div className="nust-dc-quiz-top">
            <button
              type="button"
              className="nust-dc-back"
              onClick={() => setView("home")}
            >
              <Icon name="arrow" size={15} /> Exit challenge
            </button>
            <span className="nust-dc-streak-chip">
              <Icon name="flame" size={15} /> {streak} streak
            </span>
          </div>

          <fieldset className="nust-dc-ramp">
            <legend className="nust-dc-sr-only">
              Difficulty: {currentQuestion.difficulty}
            </legend>
            <div className="nust-dc-ramp-labels">
              {difficultyTiers.map((tier) => (
                <span
                  key={tier.name}
                  className={`${tier.name === currentQuestion.difficulty ? "nust-dc-ramp-active" : ""} ${tier.className === "boss" && currentQuestion.difficulty === "Very Insane" ? "nust-dc-ramp-boss" : ""}`}
                >
                  {tier.name}
                </span>
              ))}
            </div>
            <div className="nust-dc-ramp-track">
              {difficultyTiers.map((tier) => (
                <i
                  key={tier.name}
                  className={`${currentQuestion.difficulty === tier.name || difficultyTiers.findIndex((item) => item.name === currentQuestion.difficulty) > difficultyTiers.indexOf(tier) ? "nust-dc-ramp-segment-active" : ""} ${tier.className === "boss" ? "nust-dc-ramp-segment-boss" : ""}`}
                />
              ))}
            </div>
          </fieldset>

          <div className="nust-dc-quiz-meta">
            <span>
              DAY {String(activeSet.day).padStart(2, "0")} · QUESTION{" "}
              {String(questionIndex + 1).padStart(2, "0")} / 10
            </span>
            <span
              className={`nust-dc-difficulty-tag nust-dc-tag-${difficultyTiers.find((tier) => tier.name === currentQuestion.difficulty)?.className ?? "easy"}`}
            >
              {currentQuestion.difficulty === "Very Insane"
                ? "FINAL BOSS"
                : currentQuestion.difficulty}
            </span>
          </div>
          <div className="nust-dc-question-progress">
            <span style={{ transform: `scaleX(${questionProgress / 100})` }} />
          </div>

          <article
            className="nust-dc-question-card"
            key={`${activeSet.day}-${questionIndex}`}
          >
            <div className="nust-dc-question-tags">
              <span>{currentQuestion.subject}</span>
              <span>+{pointsByDifficulty[currentQuestion.difficulty]} points</span>
            </div>
            <h1>{currentQuestion.prompt}</h1>
            <fieldset className="nust-dc-options">
              <legend className="nust-dc-sr-only">Answer choices</legend>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = currentQuestion.correctIndex === index;
                const answered = selectedAnswer !== null;
                const optionClass = answered
                  ? isCorrect
                    ? "nust-dc-option-correct"
                    : isSelected
                      ? "nust-dc-option-wrong"
                      : ""
                  : "";
                return (
                  <button
                    type="button"
                    className={`nust-dc-option ${optionClass}`}
                    key={option}
                    onClick={() => chooseAnswer(index)}
                    disabled={answered}
                    aria-pressed={isSelected}
                  >
                    <span className="nust-dc-option-key">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {answered && isCorrect && <Icon name="check" size={17} />}
                    {answered && isSelected && !isCorrect && (
                      <Icon name="close" size={17} />
                    )}
                  </button>
                );
              })}
            </fieldset>

            {selectedAnswer !== null && (
              <div
                className={`nust-dc-feedback ${selectedAnswer === currentQuestion.correctIndex ? "nust-dc-feedback-correct" : "nust-dc-feedback-wrong"}`}
              >
                <strong>
                  <Icon
                    name={
                      selectedAnswer === currentQuestion.correctIndex ? "check" : "info"
                    }
                    size={17}
                  />
                  {selectedAnswer === currentQuestion.correctIndex
                    ? "Correct — nice work!"
                    : "Not quite. Learn the idea, then move on."}
                </strong>
                <span className="nust-dc-answer-line">
                  Correct answer:{" "}
                  {String.fromCharCode(65 + currentQuestion.correctIndex)}.{" "}
                  {currentQuestion.options[currentQuestion.correctIndex]}
                </span>
                <ol>
                  {currentQuestion.explanation.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="nust-dc-question-footer">
              <span>Choose an answer · A–D or 1–4</span>
              <button
                type="button"
                className="nust-dc-primary"
                onClick={advanceQuestion}
                disabled={selectedAnswer === null}
              >
                {questionIndex === 9 ? "Finish challenge" : "Continue"}
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </article>
        </div>
      )}

      {view === "summary" && (
        <div className="nust-dc-summary">
          <header className="nust-dc-summary-hero">
            <span className="nust-dc-summary-medal">
              <Icon name="trophy" size={27} />
            </span>
            <span className="nust-dc-eyebrow">
              DAY {String(activeSet.day).padStart(2, "0")} COMPLETE
            </span>
            <h1>
              {correctCount === 10
                ? "Flawless run!"
                : correctCount >= 8
                  ? "Challenge conquered!"
                  : "Every attempt makes you sharper."}
            </h1>
            <p>
              {correctCount >= 8
                ? "You pushed through the full difficulty ramp. Keep the momentum going."
                : "Review the explanations, build on what you learned, and come back tomorrow."}
            </p>
            <div className="nust-dc-score-grid">
              <div>
                <strong>
                  {correctCount}
                  <small>/10</small>
                </strong>
                <span>Correct answers</span>
              </div>
              <div>
                <strong>
                  {Math.round((correctCount / 10) * 100)}
                  <small>%</small>
                </strong>
                <span>Accuracy</span>
              </div>
              <div>
                <strong>
                  {score}
                  <small>/{maximumPoints}</small>
                </strong>
                <span>Challenge points</span>
              </div>
              <div className="nust-dc-score-streak">
                <strong>
                  <Icon name="flame" size={18} /> {progress.currentStreak}
                </strong>
                <span>Day streak</span>
              </div>
            </div>
            <div className="nust-dc-next-note">
              {activeSet.day < dailyChallengeSets.length
                ? `Day ${String(activeSet.day + 1).padStart(2, "0")} unlocks tomorrow. See you for the next set!`
                : "You’ve reached the end of the 10-day challenge series. Incredible persistence!"}
            </div>
          </header>

          <div className="nust-dc-review-heading">
            <div>
              <span className="nust-dc-eyebrow">LEARN FROM EVERY QUESTION</span>
              <h2>Challenge review</h2>
            </div>
            <fieldset className="nust-dc-filter">
              <legend className="nust-dc-sr-only">Filter reviewed questions</legend>
              <button
                type="button"
                className={!mistakesOnly ? "nust-dc-filter-active" : ""}
                onClick={() => setMistakesOnly(false)}
              >
                All 10
              </button>
              <button
                type="button"
                className={mistakesOnly ? "nust-dc-filter-active" : ""}
                onClick={() => setMistakesOnly(true)}
              >
                Review mistakes
              </button>
            </fieldset>
          </div>
          {reviewQuestions.length ? (
            <div className="nust-dc-review-list">
              {reviewQuestions.map(({ question, index, selected }) => {
                const correctAnswer = question.options[question.correctIndex];
                const correct = selected === correctAnswer;
                return (
                  <details
                    className="nust-dc-review-item"
                    key={`${activeSet.day}-${index}`}
                  >
                    <summary>
                      <span
                        className={`nust-dc-review-mark ${correct ? "nust-dc-review-correct" : "nust-dc-review-wrong"}`}
                      >
                        <Icon name={correct ? "check" : "close"} size={15} />
                      </span>
                      <span className="nust-dc-review-title">
                        <small>
                          QUESTION {String(index + 1).padStart(2, "0")} ·{" "}
                          {question.subject}
                        </small>
                        <strong>{question.prompt}</strong>
                      </span>
                      <Icon name="chevron" size={17} />
                    </summary>
                    <div className="nust-dc-review-detail">
                      {!correct && (
                        <p>
                          Your answer: <strong>{selected ?? "Not answered"}</strong>
                        </p>
                      )}
                      <p>
                        Correct answer: <strong>{correctAnswer}</strong>
                      </p>
                      <ol>
                        {question.explanation.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <div className="nust-dc-perfect">
              <Icon name="spark" size={22} />
              <strong>Nothing to review—you got every answer right!</strong>
              <button type="button" onClick={() => setMistakesOnly(false)}>
                Show all explanations
              </button>
            </div>
          )}
          {activeSet.day <= dailyChallengeSets.length && (
            <button
              type="button"
              className="nust-dc-secondary"
              onClick={() => setView("home")}
            >
              <Icon name="arrow" size={15} /> Back to challenge calendar
            </button>
          )}
        </div>
      )}
    </section>
  );
}
