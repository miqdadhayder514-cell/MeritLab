"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { ExamListing } from "@/lib/exam-catalog";
import type { ExamTest } from "@/lib/exam-types";
import { createClient } from "@/lib/supabase/client";
import { Card, Eyebrow, Icon } from "./ui";

type MockTestAttempt = {
  answers: Record<number, number>;
  secondsRemaining: number;
  submittedAt: string;
  idempotencyKey?: string;
  serverAttemptId?: string;
  persisted?: boolean;
};

const mockTestDuration = 180 * 60;

type MockTest = ExamTest;

const listHref = (test: MockTest) => test.basePath ?? "/mock-tests";
const testHref = (test: MockTest, section: string) =>
  `${listHref(test)}/${test.slug}/${section}`;

async function persistExamAttempt(test: MockTest, attempt: MockTestAttempt) {
  if (!attempt.idempotencyKey) {
    throw new Error("The attempt identifier is unavailable.");
  }
  const { data, error } = await createClient().rpc("submit_exam_attempt", {
    p_exam_slug: test.slug,
    p_idempotency_key: attempt.idempotencyKey,
    p_answers: attempt.answers,
    p_seconds_remaining: attempt.secondsRemaining,
  });
  if (error) throw error;
  if (typeof data !== "string") {
    throw new Error("The database did not return a saved attempt identifier.");
  }
  window.dispatchEvent(new Event("meritlab-notifications-refresh"));
  return data;
}

function ExamList({
  tests,
  hasPlusAccess,
}: {
  tests: ExamListing[];
  hasPlusAccess: boolean;
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow>EXAM SIMULATIONS</Eyebrow>
          <h1>Mock tests</h1>
          <p>Build exam-day confidence with full-length NET-Engineering tests.</p>
        </div>
        <a href="/analytics" className="button button-outline">
          <Icon name="chart" size={16} /> View results
        </a>
      </div>
      <div className="mock-intro">
        <div className="mock-intro-icon">
          <Icon name="clock" size={24} />
        </div>
        <div>
          <h2>Practice in a realistic test-day flow.</h2>
          <p>
            Work through 200 questions in each paper, keep an eye on the clock, then
            review your score and every correct answer.
          </p>
        </div>
      </div>
      <div className="mock-test-list">
        {tests.map((test) => {
          const locked = !hasPlusAccess && test.slug !== "net-engineering";
          return (
            <Card className="mock-tests-empty" key={test.slug}>
              <span className="mock-intro-icon">
                <Icon name={locked ? "lock" : "clock"} size={24} />
              </span>
              <Eyebrow>
                {locked ? "PLUS · LOCKED" : "FULL-LENGTH · NET-ENGINEERING"}
              </Eyebrow>
              <h2>{test.title}</h2>
              <p>
                {test.questionCount} questions · 180 minutes · Mathematics, Physics, and
                English
              </p>
              <a
                href={locked ? "/pricing" : `/mock-tests/${test.slug}/instructions`}
                className={locked ? "button button-outline" : "button button-primary"}
              >
                {locked ? "View Plus plans" : "View instructions"}{" "}
                <Icon name={locked ? "lock" : "arrow"} size={15} />
              </a>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function PastPaperList({
  tests,
  hasPlusAccess,
}: {
  tests: ExamListing[];
  hasPlusAccess: boolean;
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow>PAST PAPER PRACTICE</Eyebrow>
          <h1>NUST NET-Engineering papers</h1>
          <p>
            Attempt all 13 supplied compilations, including lettered supplemental
            questions, in a 180-minute exam flow. Review your score and every answer
            afterward.
          </p>
        </div>
      </div>
      <div className="mock-intro past-paper-intro">
        <div className="mock-intro-icon">
          <Icon name="info" size={22} />
        </div>
        <div>
          <h2>Memory-based compilations, not official NUST-released booklets</h2>
          <p>
            These are memory-based practice compilations, not official NUST-released
            booklets. The main answer keys are copied from the supplied PDFs and have
            not been certified by NUST; supplemental items are answered with
            explanations. One supplied filename is dated 09 Dec 2026, so verify it
            before treating it as a completed sitting.
          </p>
        </div>
      </div>
      <div className="past-paper-list">
        {tests.map((test) => (
          <Card className="past-paper-card" key={test.slug}>
            <span className="past-paper-badge">
              {hasPlusAccess ? "Attempt this paper" : "PLUS · LOCKED"}
            </span>
            <Eyebrow>{test.volume ? `${test.volume} · ` : ""}NET-ENGINEERING</Eyebrow>
            <h2>{test.title}</h2>
            <p className="past-paper-meta">
              {test.period} · {test.questionCount} questions · 180 minutes
            </p>
            <p className="past-paper-topics">Mathematics · Physics · English</p>
            <a
              href={
                hasPlusAccess ? `/past-papers/${test.slug}/instructions` : "/pricing"
              }
              className={
                hasPlusAccess ? "button button-primary" : "button button-outline"
              }
            >
              {hasPlusAccess ? "Read instructions" : "View Plus plans"}{" "}
              <Icon name={hasPlusAccess ? "arrow" : "lock"} size={15} />
            </a>
          </Card>
        ))}
      </div>
    </>
  );
}

function Instructions({ test }: { test: MockTest }) {
  return (
    <>
      <div className="exam-back-link">
        <a href={listHref(test)}>
          <Icon name="arrow" size={15} />{" "}
          {test.basePath === "/past-papers" ? "All past papers" : "All mock tests"}
        </a>
      </div>
      <Card className="instructions-card">
        <div className="instructions-heading">
          <span className="instructions-icon">
            <Icon name="orbit" size={24} />
          </span>
          <div>
            <Eyebrow>MERITLAB PRACTICE SIMULATION</Eyebrow>
            <h1>{test.title}</h1>
            <p>Read through the instructions before beginning your practice run.</p>
          </div>
        </div>
        <div className="instructions-stats">
          <div>
            <Icon name="practice" />
            <strong>{test.questions.length}</strong>
            <small>questions</small>
          </div>
          <div>
            <Icon name="clock" />
            <strong>180 min</strong>
            <small>time limit</small>
          </div>
          <div>
            <Icon name="bookmark" />
            <strong>Anytime</strong>
            <small>review marked items</small>
          </div>
        </div>
        <div className="instruction-body">
          <h2>Before you begin</h2>
          <div className="instruction-row">
            <span>01</span>
            <p>
              {test.sourceNote ?? (
                <>
                  This is a <strong>practice simulation</strong> based on the provided
                  NET full mock PDF. It is not an official NUST test.
                </>
              )}
            </p>
          </div>
          <div className="instruction-row">
            <span>02</span>
            <p>
              Use the question palette to move between questions. Your selected answers
              and review markers are kept in this browser session.
            </p>
          </div>
          <div className="instruction-row">
            <span>03</span>
            <p>
              You can change your answers at any time before submitting. Questions left
              unanswered will be counted as unattempted.
            </p>
          </div>
          <div className="instruction-row">
            <span>04</span>
            <p>
              You have 180 minutes. Your submitted answers and result will be saved to
              your MeritLab account.
            </p>
          </div>
          {test.correctionNotes?.map((note) => (
            <div className="past-paper-correction" key={note}>
              <strong>Source correction</strong>
              <p>{note}</p>
            </div>
          ))}
        </div>
        <div className="instructions-actions">
          <a href={listHref(test)} className="button button-outline">
            Not now
          </a>
          <a href={testHref(test, "exam")} className="button button-primary">
            Begin practice exam <Icon name="arrow" size={16} />
          </a>
        </div>
      </Card>
    </>
  );
}

function ExamInterface({ test }: { test: MockTest }) {
  const router = useRouter();
  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(mockTestDuration);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savingAttempt, setSavingAttempt] = useState(false);
  const [immediateAttempt, setImmediateAttempt] = useState<MockTestAttempt | null>(
    null,
  );
  const [storageError, setStorageError] = useState(false);
  const submittedRef = useRef(false);
  const total = test.questions.length;
  const item = test.questions[current - 1];
  const optionOccurrences = new Map<string, number>();
  let answerIndex = 0;

  const finishExam = useCallback(
    async (finalAnswers: Record<number, number>, secondsRemaining: number) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitted(true);
      setSavingAttempt(true);
      const attempt: MockTestAttempt = {
        answers: finalAnswers,
        secondsRemaining,
        submittedAt: new Date().toISOString(),
        idempotencyKey: window.crypto.randomUUID(),
        persisted: false,
      };
      let browserStorageAvailable = true;
      try {
        window.sessionStorage.setItem(test.attemptKey, JSON.stringify(attempt));
      } catch {
        browserStorageAvailable = false;
        setStorageError(true);
      }
      try {
        attempt.serverAttemptId = await persistExamAttempt(test, attempt);
        attempt.persisted = true;
      } catch (error) {
        console.error("Could not save the submitted exam attempt.", error);
      }
      if (browserStorageAvailable) {
        try {
          window.sessionStorage.setItem(test.attemptKey, JSON.stringify(attempt));
          router.replace(testHref(test, "results"));
          return;
        } catch {
          setStorageError(true);
        }
      }
      setSavingAttempt(false);
      setImmediateAttempt(attempt);
    },
    [router, test],
  );

  useEffect(() => {
    try {
      window.sessionStorage.removeItem(test.attemptKey);
    } catch {
      setStorageError(true);
    }
  }, [test.attemptKey]);

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    if (seconds === 0) void finishExam(answers, 0);
  }, [answers, finishExam, seconds]);

  if (immediateAttempt) {
    return (
      <ExamResult
        test={test}
        initialAttempt={immediateAttempt}
        storageError={storageError}
      />
    );
  }

  const toggleMark = () =>
    setMarked((items) =>
      items.includes(current)
        ? items.filter((n) => n !== current)
        : [...items, current],
    );
  const formatted = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <div className="exam-workspace">
      <header className="exam-header">
        <a className="exam-logo" href={listHref(test)}>
          <span>
            <Icon name="orbit" size={19} />
          </span>
          <b>
            merit<span>lab</span>
          </b>
        </a>
        <div className="exam-titlebar">
          <strong>{test.title}</strong>
          <small>
            {test.basePath === "/past-papers"
              ? "Memory-based practice paper"
              : "Practice simulation"}
          </small>
        </div>
        <div className={`exam-timer ${seconds < 300 ? "timer-warning" : ""}`}>
          <Icon name="clock" size={18} />
          <span>
            <small>TIME REMAINING</small>
            <strong>{formatted}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSubmit(true)}
          className="button button-primary exam-submit-top"
        >
          Submit exam <Icon name="arrow" size={15} />
        </button>
      </header>
      <main className="exam-main">
        <section className="exam-question-panel">
          <div className="exam-q-meta">
            <span>
              QUESTION {String(current).padStart(2, "0")} <i /> {total}
            </span>
            {item.sourceNumber && (
              <span className="exam-source-number">PDF Q.{item.sourceNumber}</span>
            )}
            <span className="exam-subject-tag">{item.subject}</span>
            <span className="exam-difficulty-tag">{item.difficulty}</span>
          </div>
          <div className="exam-question-progress">
            <span style={{ width: `${(current / total) * 100}%` }} />
          </div>
          {item.context && (
            <section className="exam-reading-passage" aria-label="Reading passage">
              <strong>Reading passage</strong>
              <p>{item.context}</p>
            </section>
          )}
          <h1 key={current}>{item.prompt}</h1>
          <div className="exam-answer-options">
            {item.options.map((option) => {
              const occurrence = optionOccurrences.get(option) ?? 0;
              optionOccurrences.set(option, occurrence + 1);
              const currentAnswerIndex = answerIndex++;
              return (
                <button
                  type="button"
                  key={`${current}-${option}-${occurrence}`}
                  onClick={() => {
                    const nextAnswers = {
                      ...answers,
                      [current]: currentAnswerIndex,
                    };
                    setAnswers(nextAnswers);
                    if (Object.keys(nextAnswers).length === total) {
                      void finishExam(nextAnswers, seconds);
                    }
                  }}
                  className={`exam-answer ${answers[current] === currentAnswerIndex ? "exam-answer-selected" : ""}`}
                >
                  <span>{String.fromCharCode(65 + currentAnswerIndex)}</span>
                  {option}
                  {answers[current] === currentAnswerIndex && (
                    <Icon name="check" size={18} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="exam-utility-actions">
            <button
              type="button"
              onClick={toggleMark}
              className={marked.includes(current) ? "marked-action" : ""}
            >
              <Icon name="bookmark" size={16} />
              {marked.includes(current) ? "Marked for review" : "Mark for review"}
            </button>
            <button
              type="button"
              onClick={() => {
                const next = { ...answers };
                delete next[current];
                setAnswers(next);
              }}
            >
              <Icon name="close" size={15} />
              Clear response
            </button>
          </div>
          <div className="exam-bottom-nav">
            <button
              type="button"
              onClick={() => setCurrent(Math.max(1, current - 1))}
              disabled={current === 1}
              className="button button-outline"
            >
              ← Previous
            </button>
            <span>
              Question {current} of {total}
            </span>
            <button
              type="button"
              onClick={() => setCurrent(Math.min(total, current + 1))}
              disabled={current === total}
              className="button button-primary"
            >
              Next question <Icon name="arrow" size={15} />
            </button>
          </div>
        </section>
        <aside className="exam-palette-panel">
          <div className="palette-title">
            <div>
              <h2>Question palette</h2>
              <p>Click a number to navigate</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="More exam options"
            >
              <Icon name="more" size={18} />
            </button>
          </div>
          <div className="exam-palette">
            {Array.from({ length: total }, (_, i) => {
              const n = i + 1;
              return (
                <button
                  type="button"
                  aria-label={`Question ${n}${answers[n] !== undefined ? ", answered" : ", unanswered"}${marked.includes(n) ? ", marked for review" : ""}`}
                  onClick={() => setCurrent(n)}
                  className={`${n === current ? "palette-active" : ""} ${answers[n] !== undefined ? "palette-answered" : ""} ${marked.includes(n) ? "palette-marked" : ""}`}
                  key={n}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="palette-key">
            <span>
              <i className="key-answered" /> Answered{" "}
              <strong>{Object.keys(answers).length}</strong>
            </span>
            <span>
              <i className="key-unanswered" /> Unanswered{" "}
              <strong>{total - Object.keys(answers).length}</strong>
            </span>
            <span>
              <i className="key-marked" /> Marked for review{" "}
              <strong>{marked.length}</strong>
            </span>
          </div>
          <div className="exam-palette-bottom">
            <p>Review marked questions before submitting.</p>
            <button
              type="button"
              className="button button-outline button-block"
              onClick={() => setShowSubmit(true)}
            >
              Submit examination
            </button>
            <button
              type="button"
              className="exit-exam"
              onClick={() => setShowSubmit(true)}
            >
              Exit exam
            </button>
          </div>
        </aside>
      </main>
      {showSubmit && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-title"
          >
            <button
              type="button"
              className="modal-close icon-button"
              onClick={() => setShowSubmit(false)}
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
            <span className="modal-icon">
              <Icon name="check" size={22} />
            </span>
            <h2 id="submit-title">Submit this practice exam?</h2>
            <p>
              You have answered <strong>{Object.keys(answers).length}</strong> of{" "}
              {total} questions and marked <strong>{marked.length}</strong> for review.
              You can still go back and review before submitting.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setShowSubmit(false)}
              >
                Keep reviewing
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setShowSubmit(false);
                  void finishExam(answers, seconds);
                }}
                disabled={savingAttempt}
              >
                {savingAttempt ? "Saving result..." : "Submit exam"}{" "}
                {!savingAttempt && <Icon name="arrow" size={15} />}
              </button>
            </div>
            <small>
              Results are checked and saved to your account when you submit. Keep this
              page open until saving finishes.
            </small>
          </section>
        </div>
      )}
      {storageError && (
        <p className="exam-storage-warning" role="status">
          Browser storage is unavailable. Your result will be shown now but may not
          persist if you leave this page.
        </p>
      )}
      {savingAttempt && (
        <p className="exam-storage-warning" role="status">
          Checking your answers and saving the result to your MeritLab account...
        </p>
      )}
    </div>
  );
}

function Celebration() {
  return (
    <div className="score-celebration" aria-hidden="true">
      <span className="score-bomb">💣</span>
      <span className="score-bomb-burst">BOOM!</span>
      {Array.from({ length: 42 }, (_, piece) => piece + 1).map((piece) => (
        <span
          className={`score-confetti score-confetti-${(piece - 1) % 6}`}
          key={piece}
          style={{
            left: `${((piece - 1) * 37) % 100}%`,
            animationDelay: `${((piece - 1) % 12) * 0.11}s`,
          }}
        />
      ))}
    </div>
  );
}

function readSavedAttempt(test: MockTest): MockTestAttempt | null {
  try {
    const saved = window.sessionStorage.getItem(test.attemptKey);
    if (!saved) return null;
    const value: unknown = JSON.parse(saved);
    if (typeof value !== "object" || value === null) return null;
    const attempt = value as Partial<MockTestAttempt>;
    if (
      typeof attempt.answers !== "object" ||
      attempt.answers === null ||
      typeof attempt.secondsRemaining !== "number" ||
      typeof attempt.submittedAt !== "string"
    ) {
      return null;
    }

    const answers: Record<number, number> = {};
    for (const [questionNumber, selectedOption] of Object.entries(attempt.answers)) {
      const question = test.questions[Number(questionNumber) - 1];
      if (
        question &&
        Number.isInteger(selectedOption) &&
        selectedOption >= 0 &&
        selectedOption < question.options.length
      ) {
        answers[question.number] = selectedOption;
      }
    }
    return {
      answers,
      secondsRemaining: Math.min(
        mockTestDuration,
        Math.max(0, attempt.secondsRemaining),
      ),
      submittedAt: attempt.submittedAt,
      idempotencyKey: attempt.idempotencyKey,
      serverAttemptId: attempt.serverAttemptId,
      persisted: attempt.persisted,
    };
  } catch {
    return null;
  }
}

function ExamResult({
  test,
  initialAttempt,
  storageError = false,
  showAllInitially = false,
}: {
  test: MockTest;
  initialAttempt?: MockTestAttempt;
  storageError?: boolean;
  showAllInitially?: boolean;
}) {
  const [showAnswers, setShowAnswers] = useState(showAllInitially);
  const [attempt, setAttempt] = useState<MockTestAttempt | null>(
    initialAttempt ?? null,
  );
  const [loaded, setLoaded] = useState(Boolean(initialAttempt));
  const [savingResult, setSavingResult] = useState(false);
  const [persistenceError, setPersistenceError] = useState(
    initialAttempt?.persisted !== true,
  );
  const { profile, user } = useAuth();
  const studentName = profile?.full_name || user?.user_metadata?.full_name || "Student";
  useEffect(() => {
    if (initialAttempt) return;
    const savedAttempt = readSavedAttempt(test);
    setAttempt(savedAttempt);
    setPersistenceError(savedAttempt !== null && savedAttempt.persisted !== true);
    setLoaded(true);
  }, [initialAttempt, test]);

  const retrySave = async () => {
    if (!attempt?.idempotencyKey) return;
    setSavingResult(true);
    try {
      const serverAttemptId = await persistExamAttempt(test, attempt);
      const savedAttempt = { ...attempt, serverAttemptId, persisted: true };
      setAttempt(savedAttempt);
      setPersistenceError(false);
      try {
        window.sessionStorage.setItem(test.attemptKey, JSON.stringify(savedAttempt));
      } catch (error) {
        console.error("Could not update the browser copy of the saved attempt.", error);
      }
    } catch (error) {
      console.error("Could not save the submitted exam attempt.", error);
      setPersistenceError(true);
    } finally {
      setSavingResult(false);
    }
  };

  if (!loaded) {
    return (
      <div className="exam-finished">
        <Card>
          <p>Loading your result...</p>
        </Card>
      </div>
    );
  }
  if (!attempt) {
    return (
      <div className="exam-finished">
        <Card>
          <span className="finish-icon">
            <Icon name="info" size={25} />
          </span>
          <Eyebrow>NO RESULT FOUND</Eyebrow>
          <h1>
            Complete the {test.basePath === "/past-papers" ? "paper" : "mock test"} to
            see your result.
          </h1>
          <p>Your submitted answers are stored in this browser session.</p>
          <a href={testHref(test, "instructions")} className="button button-primary">
            Start the {test.basePath === "/past-papers" ? "paper" : "mock test"}{" "}
            <Icon name="arrow" size={15} />
          </a>
        </Card>
      </div>
    );
  }

  const attempted = Object.keys(attempt.answers).length;
  const correct = test.questions.filter(
    (question) => attempt.answers[question.number] === question.answer,
  ).length;
  const incorrect = attempted - correct;
  const unanswered = test.questions.length - attempted;
  const percentage = (correct / test.questions.length) * 100;
  const passedThreshold = percentage > 80;
  const timeUsed = mockTestDuration - attempt.secondsRemaining;
  const formattedTimeUsed = `${Math.floor(timeUsed / 3600)}h ${String(
    Math.floor((timeUsed % 3600) / 60),
  ).padStart(2, "0")}m`;

  return (
    <>
      {passedThreshold && <Celebration />}
      <div className="page-heading">
        <div>
          <Eyebrow>
            {test.basePath === "/past-papers"
              ? "PAST PAPER RESULT"
              : "MOCK TEST RESULT"}
          </Eyebrow>
          <h1>{passedThreshold ? "Congratulations!" : "Keep building your score."}</h1>
          <p>
            {passedThreshold
              ? "Excellent work — you scored more than 80%. Keep up this strong preparation."
              : "Every completed practice test is progress. Review the answers, learn from missed questions, and try again."}
          </p>
        </div>
        <a href={testHref(test, "instructions")} className="button button-primary">
          {test.basePath === "/past-papers" ? "Retake paper" : "Retake mock test"}{" "}
          <Icon name="arrow" size={16} />
        </a>
      </div>
      <Card className="exam-result-hero">
        <div className="exam-result-medal">
          <Icon name="trophy" size={27} />
        </div>
        <div>
          <Eyebrow>{test.title}</Eyebrow>
          <h2>
            {passedThreshold
              ? `Well done, ${studentName.split(" ")[0]}!`
              : `Keep going, ${studentName.split(" ")[0]}.`}
          </h2>
          <p>
            Submitted{" "}
            {new Date(attempt.submittedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="exam-result-score">
          <strong>
            {correct}
            <span>/{test.questions.length}</span>
          </strong>
          <small>{percentage.toFixed(1)}% score</small>
        </div>
      </Card>
      {persistenceError && (
        <p className="exam-storage-warning" role="status">
          This result is available, but has not been saved to your account. Confirm that
          both new student activity migrations have been applied in Supabase, then
          {attempt.idempotencyKey ? (
            <>
              {" "}
              <button
                type="button"
                className="text-link"
                onClick={() => void retrySave()}
                disabled={savingResult}
              >
                {savingResult ? "Saving..." : "try saving again"}
              </button>
              .
            </>
          ) : (
            <> take the exam again after the migrations are applied.</>
          )}
        </p>
      )}
      <div className="stat-grid">
        <div className="result-stat-box">
          <Icon name="check" />
          <small>Correct answers</small>
          <strong>{correct}</strong>
        </div>
        <div className="result-stat-box result-incorrect">
          <Icon name="close" />
          <small>Incorrect answers (no negative marking)</small>
          <strong>{incorrect}</strong>
        </div>
        <div className="result-stat-box result-unanswered">
          <Icon name="minus" />
          <small>Unanswered</small>
          <strong>{unanswered}</strong>
        </div>
        <div className="result-stat-box result-time">
          <Icon name="clock" />
          <small>Time used</small>
          <strong>{formattedTimeUsed}</strong>
        </div>
      </div>
      <div className="dashboard-secondary-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Subject breakdown</h2>
              <p>Correct answers by subject</p>
            </div>
          </div>
          {["Mathematics", "Physics", "English"].map((subject) => {
            const subjectQuestions = test.questions.filter(
              (question) => question.subject === subject,
            );
            const subjectCorrect = subjectQuestions.filter(
              (question) => attempt.answers[question.number] === question.answer,
            ).length;
            const subjectPercentage = (subjectCorrect / subjectQuestions.length) * 100;
            return (
              <div className="subject-performance result-subject" key={subject}>
                <span>{subject}</span>
                <div className="mini-bar">
                  <i style={{ width: `${subjectPercentage}%` }} />
                </div>
                <strong>{subjectPercentage.toFixed(0)}%</strong>
              </div>
            );
          })}
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>Suggested next steps</h2>
              <p>Turn this review into a study plan</p>
            </div>
          </div>
          <div className="next-step">
            <span>
              <Icon name="book" />
            </span>
            <div>
              <strong>Review motion & forces</strong>
              <small>Strengthen concepts before another timed run.</small>
            </div>
            <a href="/preparation">
              Explore <Icon name="arrow" size={14} />
            </a>
          </div>
          <div className="next-step">
            <span>
              <Icon name="practice" />
            </span>
            <div>
              <strong>Try focused practice</strong>
              <small>Work through questions at your own pace.</small>
            </div>
            <a href="/practice">
              Practice <Icon name="arrow" size={14} />
            </a>
          </div>
        </Card>
      </div>
      <div className="exam-result-actions">
        <button
          type="button"
          className="button button-outline"
          onClick={() => setShowAnswers(!showAnswers)}
        >
          {showAnswers ? "Hide all answers" : "Show all answers"}{" "}
          <Icon name="chevron" size={15} />
        </button>
        <a href={listHref(test)} className="subtle-link">
          {test.basePath === "/past-papers"
            ? "Back to past papers"
            : "Back to mock tests"}
        </a>
      </div>
      {showAnswers && (
        <Card className="quick-answer-list">
          <div className="mock-answer-list-heading">
            <div>
              <Eyebrow>COMPLETE QUESTION REVIEW</Eyebrow>
              <h2>All answers and explanations</h2>
            </div>
            <span>{test.questions.length} questions</span>
          </div>
          {test.questions.map((question) => {
            const selected = attempt.answers[question.number];
            const isCorrect = selected === question.answer;
            const optionOccurrences = new Map<string, number>();
            let optionIndex = 0;
            return (
              <article
                className={`mock-answer-review ${isCorrect ? "mock-answer-correct" : selected === undefined ? "mock-answer-unanswered" : "mock-answer-incorrect"}`}
                key={question.number}
              >
                <div className="mock-answer-heading">
                  <div className="mock-answer-topic">
                    <span className="mock-answer-number">
                      Q
                      {question.sourceNumber ??
                        String(question.number).padStart(3, "0")}
                    </span>
                    <span className="mock-answer-subject">{question.subject}</span>
                  </div>
                  <span className="mock-answer-status">
                    {isCorrect
                      ? "Correct"
                      : selected === undefined
                        ? "Unanswered"
                        : "Incorrect"}
                  </span>
                </div>
                {question.context && (
                  <div className="mock-answer-passage">
                    <strong>Reading passage</strong>
                    <p>{question.context}</p>
                  </div>
                )}
                <p className="mock-answer-prompt">{question.prompt}</p>
                <div className="mock-answer-options">
                  {question.options.map((option) => {
                    const occurrence = optionOccurrences.get(option) ?? 0;
                    optionOccurrences.set(option, occurrence + 1);
                    const index = optionIndex++;
                    const isAnswer = index === question.answer;
                    const isSelected = selected === index;
                    return (
                      <div
                        className={`mock-answer-option ${isAnswer ? "mock-option-answer" : ""} ${isSelected && !isCorrect ? "mock-option-selected-wrong" : ""}`}
                        key={`${question.number}-${option}-${occurrence}`}
                      >
                        <span className="mock-option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="mock-option-text">{option}</span>
                        <span className="mock-option-labels">
                          {isAnswer && (
                            <span className="mock-option-correct-label">
                              Correct answer
                            </span>
                          )}
                          {isSelected && (
                            <span className="mock-option-selected-label">
                              Your answer
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mock-answer-explanation">
                  <strong>Explanation</strong>
                  <p>{question.explanation}</p>
                </div>
              </article>
            );
          })}
        </Card>
      )}
      {storageError && (
        <p className="demo-notice" role="status">
          Your result is shown for this page but could not be saved in browser storage.
        </p>
      )}
    </>
  );
}

function AnswerReview({ test }: { test: MockTest }) {
  return <ExamResult test={test} showAllInitially />;
}

function TestCollectionPage({
  path,
  test,
  listPage,
}: {
  path: string[];
  test: ExamTest | undefined;
  listPage: ReactNode;
}) {
  if (path.length === 0) return listPage;
  if (!test) return listPage;
  if (path[1] === "instructions") return <Instructions test={test} />;
  if (path[1] === "exam") return <ExamInterface key={test.slug} test={test} />;
  if (path[1] === "results") return <ExamResult key={test.slug} test={test} />;
  if (path[1] === "review") return <AnswerReview key={test.slug} test={test} />;
  return listPage;
}

export function ExamPage({
  path,
  test,
  tests,
  hasPlusAccess,
}: {
  path: string[];
  test?: ExamTest;
  tests: ExamListing[];
  hasPlusAccess: boolean;
}) {
  return (
    <TestCollectionPage
      path={path}
      test={test}
      listPage={<ExamList tests={tests} hasPlusAccess={hasPlusAccess} />}
    />
  );
}

export function PastPaperPage({
  path,
  test,
  tests,
  hasPlusAccess,
}: {
  path: string[];
  test?: ExamTest;
  tests: ExamListing[];
  hasPlusAccess: boolean;
}) {
  return (
    <TestCollectionPage
      path={path}
      test={test}
      listPage={<PastPaperList tests={tests} hasPlusAccess={hasPlusAccess} />}
    />
  );
}
