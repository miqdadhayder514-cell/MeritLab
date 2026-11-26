"use client";

import { useMemo, useState } from "react";
import {
  type MeritCategory,
  type MeritProgram,
  type MeritUniversity,
  meritCategories,
  meritUniversities,
} from "@/lib/merit-calculator-data";
import {
  calculateMeritAggregate,
  type MeritCalculation,
  type MeritScore,
  type MeritScoreField,
  type MeritScoreInputs,
  scoreFieldGroups,
  scoreFieldLabels,
  type VerifiedMeritFormula,
  validateMeritScores,
} from "@/lib/merit-calculator-engine";
import { findMeritFormulaRecord, type MeritFormulaRecord } from "@/lib/merit-formulas";
import { Card, Eyebrow, Icon } from "./ui";

type SelectedProgram = {
  universityId: string;
  programId: string;
  campus: string;
};

type ResultItem = {
  selected: SelectedProgram;
  university: MeritUniversity;
  program: MeritProgram;
  formula?: VerifiedMeritFormula;
  formulaRecord?: MeritFormulaRecord;
  calculation?: MeritCalculation;
};

const initialScore: MeritScore = { obtained: "", total: "" };
const testFields = scoreFieldGroups[1].fields;
const academicFields = scoreFieldGroups[0].fields;

function selectionKey(selection: SelectedProgram) {
  return `${selection.universityId}:${selection.programId}:${selection.campus}`;
}

function getUniversity(universityId: string) {
  return meritUniversities.find((university) => university.id === universityId);
}

function getProgram(university: MeritUniversity, programId: string) {
  return university.programs.find((program) => program.id === programId);
}

function getFormulaRecord(universityId: string, programId: string) {
  const university = getUniversity(universityId);
  const program = university && getProgram(university, programId);
  const formulaId = program?.formulaId ?? programId;
  return findMeritFormulaRecord(universityId, formulaId);
}

function getVerifiedFormula(universityId: string, programId: string) {
  const record = getFormulaRecord(universityId, programId);
  return record?.verificationStatus === "verified" ? record : undefined;
}

function createPendingMessage(university: MeritUniversity, program: MeritProgram) {
  return `${university.name} · ${program.name}: Formula verification pending. No aggregate is shown until an official current-cycle formula can be confirmed.`;
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function getResultText(results: ResultItem[]) {
  return results
    .map((result) => {
      const { university, program, calculation, formula } = result;
      if (!formula || !calculation?.ok) {
        return `${university.name} — ${program.name}: Formula verification pending`;
      }
      return `${university.name} — ${program.name}: ${formatPercent(calculation.aggregate)} (${formula.admissionCycle})`;
    })
    .join("\n");
}

export function MeritCalculatorPage() {
  const [mode, setMode] = useState<"compare" | "individual">("compare");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MeritCategory | "All categories">(
    "All categories",
  );
  const [showAllUniversities, setShowAllUniversities] = useState(false);
  const [draftUniversityId, setDraftUniversityId] = useState("");
  const [draftProgramId, setDraftProgramId] = useState("");
  const [draftCampus, setDraftCampus] = useState("");
  const [selections, setSelections] = useState<SelectedProgram[]>([]);
  const [scores, setScores] = useState<MeritScoreInputs>({});
  const [simulation, setSimulation] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [calculated, setCalculated] = useState(false);

  const filteredUniversities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return meritUniversities.filter((university) => {
      const matchesCategory =
        category === "All categories" || university.category === category;
      const matchesQuery =
        !normalizedQuery ||
        university.name.toLowerCase().includes(normalizedQuery) ||
        university.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const visibleUniversities =
    query.trim() || category !== "All categories" || showAllUniversities
      ? filteredUniversities
      : filteredUniversities.slice(0, 6);

  const selectedUniversity = getUniversity(draftUniversityId);
  const requiredInputFields = useMemo(() => {
    const fields = new Set<MeritScoreField>();
    for (const selection of selections) {
      const formula = getVerifiedFormula(selection.universityId, selection.programId);
      for (const component of formula?.components ?? []) {
        fields.add(component.field);
        for (const alternative of component.alternativeFields ?? []) {
          fields.add(alternative);
        }
      }
    }
    return fields;
  }, [selections]);
  const requiredTestFields = useMemo(
    () =>
      new Set([...requiredInputFields].filter((field) => testFields.includes(field))),
    [requiredInputFields],
  );
  const alternativeInputFields = useMemo(() => {
    const fields = new Set<MeritScoreField>();
    for (const selection of selections) {
      const formula = getVerifiedFormula(selection.universityId, selection.programId);
      for (const component of formula?.components ?? []) {
        if (component.alternativeFields?.length) {
          fields.add(component.field);
          for (const field of component.alternativeFields) {
            fields.add(field);
          }
        }
      }
    }
    return fields;
  }, [selections]);

  function chooseUniversity(university: MeritUniversity) {
    setDraftUniversityId(university.id);
    setDraftProgramId(university.programs[0]?.id ?? "");
    setDraftCampus("");
  }

  function addSelection() {
    const university = getUniversity(draftUniversityId);
    const program = university && getProgram(university, draftProgramId);
    if (!university || !program) return;

    const selection = {
      universityId: university.id,
      programId: program.id,
      campus: draftCampus,
    };
    if (mode === "individual") setSelections([selection]);
    else if (
      !selections.some((item) => selectionKey(item) === selectionKey(selection))
    ) {
      setSelections([...selections, selection]);
    }
    setCalculated(false);
    setResults([]);
    setErrors([]);
    setNotice("");
  }

  function removeSelection(selection: SelectedProgram) {
    setSelections(
      selections.filter((item) => selectionKey(item) !== selectionKey(selection)),
    );
    setCalculated(false);
    setResults([]);
  }

  function updateScore(field: MeritScoreField, key: keyof MeritScore, value: string) {
    setScores((current) => ({
      ...current,
      [field]: { ...(current[field] ?? initialScore), [key]: value },
    }));
    setCalculated(false);
    setResults([]);
  }

  function calculate() {
    setNotice("");
    setResults([]);
    setCalculated(false);

    if (selections.length === 0) {
      setErrors(["Select at least one university and program to continue."]);
      return;
    }

    const formulas = selections.map((selection) =>
      getVerifiedFormula(selection.universityId, selection.programId),
    );
    const requiredFields = formulas.flatMap(
      (formula) =>
        formula?.components
          .filter((component) => !component.alternativeFields?.length)
          .map((component) => component.field) ?? [],
    );
    const requiredFieldGroups = formulas.flatMap(
      (formula) =>
        formula?.components
          .filter((component) => component.alternativeFields?.length)
          .map((component) => [
            component.field,
            ...(component.alternativeFields ?? []),
          ]) ?? [],
    );
    const validationErrors = validateMeritScores(
      scores,
      requiredFields,
      requiredFieldGroups,
    );
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const nextResults: ResultItem[] = selections.flatMap((selection, index) => {
      const university = getUniversity(selection.universityId);
      const program = university && getProgram(university, selection.programId);
      if (!university || !program) return [];

      const formula = formulas[index];
      const formulaRecord = getFormulaRecord(university.id, program.id);
      return [
        {
          selected: selection,
          university,
          program,
          formula,
          formulaRecord,
          calculation: formula ? calculateMeritAggregate(formula, scores) : undefined,
        },
      ];
    });
    const calculationErrors = nextResults.flatMap((result) =>
      result.calculation && !result.calculation.ok
        ? result.calculation.errors.map(
            (error) => `${result.university.name} · ${result.program.name}: ${error}`,
          )
        : [],
    );
    setErrors(calculationErrors);
    setResults(nextResults);
    setCalculated(true);
    if (nextResults.every((result) => !result.formula)) {
      setNotice(
        "All selected formulas are awaiting official verification. No aggregate has been estimated.",
      );
    }
  }

  function resetAll() {
    setQuery("");
    setCategory("All categories");
    setDraftUniversityId("");
    setDraftProgramId("");
    setDraftCampus("");
    setSelections([]);
    setScores({});
    setSimulation(false);
    setResults([]);
    setErrors([]);
    setNotice("");
    setCalculated(false);
  }

  async function copyResults() {
    if (!results.length) return;
    try {
      await navigator.clipboard.writeText(getResultText(results));
      setNotice("Results copied to your clipboard.");
    } catch {
      setNotice(
        "Clipboard access is unavailable in this browser. You can print or save the results as a PDF.",
      );
    }
  }

  const validAggregates = results.flatMap((result) =>
    result.calculation?.ok ? [result.calculation.aggregate] : [],
  );
  const highestAggregate =
    validAggregates.length > 0 ? Math.max(...validAggregates) : null;

  return (
    <main className="merit-calculator-page">
      <section className="merit-hero">
        <div className="merit-hero-orbit merit-hero-orbit-one" />
        <div className="merit-hero-orbit merit-hero-orbit-two" />
        <div className="merit-hero-copy">
          <Eyebrow>PLAN YOUR NEXT STEP WITH CLARITY</Eyebrow>
          <h1>University Merit Calculator</h1>
          <p>
            Enter your marks once, choose universities and programs, and compare
            calculations based only on officially verified admission criteria.
          </p>
          <div className="merit-hero-points">
            <span>
              <Icon name="check" size={15} /> Official-source-first formulas
            </span>
            <span>
              <Icon name="chart" size={15} /> Clear component breakdowns
            </span>
          </div>
        </div>
        <div className="merit-hero-art" aria-hidden="true">
          <div className="merit-hero-art-ring" />
          <div className="merit-hero-art-center">
            <Icon name="chart" size={35} />
          </div>
          <span className="merit-float merit-float-one">Marks</span>
          <span className="merit-float merit-float-two">Merit</span>
          <span className="merit-float merit-float-three">Your goals</span>
        </div>
      </section>

      <div className="merit-page-content">
        <fieldset className="merit-mode-switch">
          <legend className="sr-only">Calculator mode</legend>
          <button
            type="button"
            className={mode === "compare" ? "merit-mode-active" : ""}
            onClick={() => {
              setMode("compare");
              setCalculated(false);
              setResults([]);
            }}
          >
            <Icon name="chart" size={17} /> Compare universities
          </button>
          <button
            type="button"
            className={mode === "individual" ? "merit-mode-active" : ""}
            onClick={() => {
              setMode("individual");
              setSelections((current) => current.slice(0, 1));
              setCalculated(false);
              setResults([]);
            }}
          >
            <Icon name="function" size={17} /> Individual calculator
          </button>
        </fieldset>

        <div className="merit-workspace">
          <div className="merit-main-column">
            <Card className="merit-section-card">
              <div className="merit-section-title">
                <span className="merit-step">01</span>
                <div>
                  <Eyebrow>CHOOSE WHERE TO APPLY</Eyebrow>
                  <h2>Select universities & programs</h2>
                  <p>
                    Search the catalog, select a program family, and add each option to
                    your {mode === "compare" ? "comparison" : "calculation"}.
                  </p>
                </div>
              </div>

              <div className="merit-selection-controls">
                <label className="merit-search">
                  <Icon name="search" size={18} />
                  <input
                    type="search"
                    placeholder="Search universities"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <label className="merit-category-filter">
                  <span className="sr-only">Filter by study area</span>
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value as MeritCategory | "All categories",
                      )
                    }
                  >
                    <option>All categories</option>
                    {meritCategories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="merit-university-grid">
                {visibleUniversities.map((university) => (
                  <button
                    type="button"
                    key={university.id}
                    className={`merit-university-option ${draftUniversityId === university.id ? "merit-university-option-active" : ""}`}
                    onClick={() => chooseUniversity(university)}
                  >
                    <span className="merit-university-mark">
                      {university.name.slice(0, 1)}
                    </span>
                    <span>
                      <strong>{university.name}</strong>
                      <small>{university.category}</small>
                    </span>
                    <Icon name="plus" size={16} />
                  </button>
                ))}
                {visibleUniversities.length === 0 && (
                  <div className="merit-empty-search">
                    No university matches that search. Try another name or category.
                  </div>
                )}
              </div>
              {!query.trim() &&
                category === "All categories" &&
                filteredUniversities.length > 6 && (
                  <button
                    type="button"
                    className="merit-show-all"
                    onClick={() => setShowAllUniversities((current) => !current)}
                  >
                    {showAllUniversities
                      ? "Show fewer universities"
                      : `Browse all ${filteredUniversities.length} institutions`}
                    <Icon name="chevron" size={15} />
                  </button>
                )}

              {selectedUniversity && (
                <div className="merit-add-panel">
                  <div>
                    <strong>{selectedUniversity.name}</strong>
                    <span>
                      Choose the matching program category; confirm the exact degree in
                      its prospectus.
                    </span>
                  </div>
                  <label>
                    <span className="sr-only">Program</span>
                    <select
                      value={draftProgramId}
                      onChange={(event) => setDraftProgramId(event.target.value)}
                    >
                      {selectedUniversity.programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="merit-campus-input">
                    <span className="sr-only">Campus, optional</span>
                    <input
                      type="text"
                      list={`merit-campus-options-${selectedUniversity.id}`}
                      placeholder="Campus (optional)"
                      value={draftCampus}
                      onChange={(event) => setDraftCampus(event.target.value)}
                    />
                    <datalist id={`merit-campus-options-${selectedUniversity.id}`}>
                      {selectedUniversity.campuses?.map((campus) => (
                        <option key={campus} value={campus} />
                      ))}
                    </datalist>
                  </label>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={addSelection}
                  >
                    Add program <Icon name="plus" size={16} />
                  </button>
                  <small className="merit-campus-note">
                    {selectedUniversity.campusesSourceUrl ? (
                      <a
                        href={selectedUniversity.campusesSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Official campus list
                      </a>
                    ) : (
                      "Enter a campus if applicable."
                    )}{" "}
                    Campus-specific criteria still require official confirmation.
                  </small>
                </div>
              )}

              <div className="merit-selected-heading">
                <div>
                  <strong>Selected programs</strong>
                  <span>{selections.length} added</span>
                </div>
              </div>
              {selections.length > 0 ? (
                <div className="merit-selected-list">
                  {selections.map((selection) => {
                    const university = getUniversity(selection.universityId);
                    const program =
                      university && getProgram(university, selection.programId);
                    if (!university || !program) return null;
                    const formula = getVerifiedFormula(university.id, program.id);
                    return (
                      <div
                        className="merit-selected-item"
                        key={selectionKey(selection)}
                      >
                        <span className="merit-selected-icon">
                          <Icon name="book" size={16} />
                        </span>
                        <span className="merit-selected-copy">
                          <strong>{university.name}</strong>
                          <small>
                            {program.name}
                            {selection.campus ? ` · ${selection.campus}` : ""}
                          </small>
                        </span>
                        <span
                          className={`merit-status-pill ${formula ? "merit-status-verified" : "merit-status-pending"}`}
                        >
                          {formula ? "Verified" : "Verification pending"}
                        </span>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => removeSelection(selection)}
                          aria-label={`Remove ${university.name} ${program.name}`}
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="merit-empty-selection">
                  <Icon name="function" size={19} />
                  <span>Choose a university above to get started.</span>
                </div>
              )}
            </Card>

            <Card className="merit-section-card">
              <div className="merit-section-title">
                <span className="merit-step">02</span>
                <div>
                  <Eyebrow>ENTER YOUR SCORES</Eyebrow>
                  <h2>Academic & entry-test marks</h2>
                  <p>
                    Enter obtained and total marks as shown on your result or test score
                    report. Test maximums vary—use your test’s actual total.
                  </p>
                </div>
              </div>
              <div className="merit-score-group">
                <h3>School & college marks</h3>
                <div className="merit-score-grid">
                  {academicFields.map((field) => (
                    <ScoreInput
                      key={field}
                      field={field}
                      score={scores[field] ?? initialScore}
                      onChange={updateScore}
                      required={requiredInputFields.has(field)}
                      requiredLabel={
                        alternativeInputFields.has(field) ? "Use one" : undefined
                      }
                    />
                  ))}
                </div>
                <p className="merit-score-hint">
                  Complete HSSC marks and Part-I marks are separate. The selected
                  official formula determines which one is used.
                </p>
              </div>
              <details
                className="merit-test-details"
                open={requiredTestFields.size > 0}
              >
                <summary>
                  Entry-test scores{" "}
                  <span>Optional unless required by a verified formula</span>
                </summary>
                <div className="merit-score-grid">
                  {testFields.map((field) => (
                    <ScoreInput
                      key={field}
                      field={field}
                      score={scores[field] ?? initialScore}
                      onChange={updateScore}
                      required={requiredTestFields.has(field)}
                      simulation={simulation}
                    />
                  ))}
                </div>
                {requiredTestFields.size === 0 && (
                  <p className="merit-score-hint">
                    No selected program currently has a verified score requirement.
                    Scores are not used to invent pending formulas.
                  </p>
                )}
              </details>
              {requiredTestFields.size > 0 && (
                <label className="merit-simulation-toggle">
                  <input
                    type="checkbox"
                    checked={simulation}
                    onChange={(event) => {
                      setSimulation(event.target.checked);
                      setCalculated(false);
                      setResults([]);
                    }}
                  />
                  <span>
                    <strong>These are target scores, not actual results</strong>
                    <small>
                      Label the output as a projection simulation using the same
                      verified formula.
                    </small>
                  </span>
                </label>
              )}
            </Card>

            {errors.length > 0 && (
              <div className="merit-error-box" role="alert">
                <Icon name="info" size={18} />
                <div>
                  <strong>Please review these items</strong>
                  <ul>
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {notice && (
              <div className="merit-notice-box" role="status">
                <Icon name="info" size={17} /> {notice}
              </div>
            )}

            <div className="merit-primary-actions">
              <button
                type="button"
                className="button button-primary button-large"
                onClick={calculate}
              >
                <Icon name="chart" size={17} /> Calculate my aggregates
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={resetAll}
              >
                <Icon name="close" size={15} /> Reset all
              </button>
            </div>

            {calculated && results.length > 0 && (
              <ResultsDashboard
                results={results}
                highestAggregate={highestAggregate}
                simulation={simulation}
                onCopy={copyResults}
                onPrint={() => window.print()}
              />
            )}
          </div>

          <aside className="merit-side-column">
            <Card className="merit-integrity-card">
              <span className="merit-integrity-icon">
                <Icon name="check" size={20} />
              </span>
              <h2>Accuracy over guesswork</h2>
              <p>
                An aggregate appears only when a current official formula is documented.
                Pending and holistic admissions are not assigned made-up percentages.
              </p>
              <div className="merit-integrity-key">
                <span className="merit-status-pill merit-status-verified">
                  Verified formula
                </span>
                <span>Published criteria with a primary source</span>
                <span className="merit-status-pill merit-status-pending">
                  Verification pending
                </span>
                <span>No aggregate is calculated until verified</span>
              </div>
            </Card>
            <Card className="merit-side-tip">
              <Eyebrow>KEEP IN MIND</Eyebrow>
              <h3>Aggregate is not a guarantee of admission.</h3>
              <p>
                Closing merit changes by program, campus, quota, and admission cycle. We
                do not estimate or promise admission chances.
              </p>
            </Card>
          </aside>
        </div>

        <section className="merit-guide-section">
          <Eyebrow>MAKE SENSE OF YOUR RESULT</Eyebrow>
          <h2>How university aggregates work</h2>
          <p className="merit-guide-intro">
            An aggregate is a weighted summary of selected academic and test
            percentages. Its ingredients and weights are set by each university’s
            published admission policy.
          </p>
          <div className="merit-guide-grid">
            <GuideCard
              number="01"
              title="What is an admission aggregate?"
              text="It is a combined merit score calculated from the components and weights in a specific admission policy. The percentage is meaningful only alongside that university's formula."
            />
            <GuideCard
              number="02"
              title="Why formulas differ"
              text="Universities and programs set their own eligibility rules, tests, and weightages. The same marks can therefore produce different aggregates under different official formulas."
            />
            <GuideCard
              number="03"
              title="Part-I or complete FSc?"
              text="Some policies accept Part-I marks temporarily; others require complete HSSC results. We use only the exact academic component named by the verified formula."
            />
            <GuideCard
              number="04"
              title="How test weightage matters"
              text="A test component contributes in proportion to its published weight. Test score totals vary, so enter the obtained and maximum marks shown on your report."
            />
            <GuideCard
              number="05"
              title="Aggregate vs closing merit"
              text="Your aggregate is your calculated score. Closing merit is the last admitted candidate's score for a particular program, category, campus, and cycle; it is not a prediction."
            />
            <GuideCard
              number="06"
              title="Verify before applying"
              text="Admission policies can change. Check the linked official prospectus or admissions page for your cycle, program, campus, and applicant category before relying on a calculation."
            />
          </div>
          <div className="merit-example">
            <div className="merit-example-icon">
              <Icon name="function" size={21} />
            </div>
            <div>
              <strong>Illustrative example only · not a university formula</strong>
              <p>
                If an imaginary policy used 70% academics and 30% test, with percentages
                of 90% and 80%, the example aggregate would be (90 × 0.70) + (80 × 0.30)
                = 87%. Actual universities may use completely different rules.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ScoreInput({
  field,
  score,
  onChange,
  required,
  requiredLabel,
  simulation = false,
}: {
  field: MeritScoreField;
  score: MeritScore;
  onChange: (field: MeritScoreField, key: keyof MeritScore, value: string) => void;
  required: boolean;
  requiredLabel?: string;
  simulation?: boolean;
}) {
  return (
    <fieldset className="merit-score-field">
      <legend>
        {scoreFieldLabels[field]}
        {required && <span>{requiredLabel ?? "Required"}</span>}
      </legend>
      <label>
        <span className="sr-only">Obtained marks for {scoreFieldLabels[field]}</span>
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder={simulation ? "Target score" : "Obtained"}
          value={score.obtained}
          onChange={(event) => onChange(field, "obtained", event.target.value)}
        />
      </label>
      <span className="merit-score-divider">/</span>
      <label>
        <span className="sr-only">Total marks for {scoreFieldLabels[field]}</span>
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="Test maximum"
          value={score.total}
          onChange={(event) => onChange(field, "total", event.target.value)}
        />
      </label>
    </fieldset>
  );
}

function ResultsDashboard({
  results,
  highestAggregate,
  simulation,
  onCopy,
  onPrint,
}: {
  results: ResultItem[];
  highestAggregate: number | null;
  simulation: boolean;
  onCopy: () => void;
  onPrint: () => void;
}) {
  const calculatedResults = results.filter(
    (result) => result.formula && result.calculation?.ok,
  );
  return (
    <section className="merit-results-section" aria-live="polite">
      <div className="merit-results-heading">
        <div>
          <Eyebrow>{simulation ? "PROJECTED SCENARIO" : "YOUR CALCULATIONS"}</Eyebrow>
          <h2>{simulation ? "Target-score simulation" : "Aggregate comparison"}</h2>
          <p>
            {simulation
              ? "Simulation only—target test marks are not actual results."
              : "Calculated from the verified criteria shown on each program card."}
          </p>
        </div>
        <div className="merit-results-actions">
          <button type="button" className="button button-outline" onClick={onCopy}>
            <Icon name="book" size={15} /> Copy
          </button>
          <button type="button" className="button button-outline" onClick={onPrint}>
            <Icon name="chart" size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {highestAggregate !== null && (
        <div className="merit-highest-callout">
          <span className="merit-highest-icon">
            <Icon name="trophy" size={19} />
          </span>
          <span>
            <small>Highest numeric aggregate in this selection</small>
            <strong>{formatPercent(highestAggregate)}</strong>
          </span>
          <p>
            Different universities use different merit scales; this is not an admission
            ranking.
          </p>
        </div>
      )}

      {calculatedResults.length > 1 && (
        <Card className="merit-chart-card">
          <div className="merit-chart-heading">
            <h3>Calculated aggregates</h3>
            <span>Each bar follows its university’s own verified formula</span>
          </div>
          <div className="merit-chart-list">
            {calculatedResults.map((result) => {
              if (!result.calculation?.ok) return null;
              return (
                <div className="merit-chart-row" key={selectionKey(result.selected)}>
                  <span>{result.university.name}</span>
                  <div className="merit-chart-track">
                    <i
                      style={{
                        width: `${Math.min(100, result.calculation.aggregate)}%`,
                      }}
                    />
                  </div>
                  <strong>{formatPercent(result.calculation.aggregate)}</strong>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="merit-result-list">
        {results.map((result) => (
          <ResultCard
            key={selectionKey(result.selected)}
            result={result}
            simulation={simulation}
          />
        ))}
      </div>
      <p className="merit-comparison-disclaimer">
        A larger percentage at one university does not mean a higher chance of admission
        than at another. Merit lists depend on each institution’s own program, campus,
        category, and admission cycle.
      </p>
    </section>
  );
}

function ResultCard({
  result,
  simulation,
}: {
  result: ResultItem;
  simulation: boolean;
}) {
  const { university, program, formula, calculation, selected } = result;
  if (!formula) {
    return (
      <Card className="merit-result-card merit-result-pending">
        <div className="merit-result-card-heading">
          <div>
            <span className="merit-result-institution">{university.name}</span>
            <h3>{program.name}</h3>
          </div>
          <span className="merit-status-pill merit-status-pending">
            Formula verification pending
          </span>
        </div>
        <p>{createPendingMessage(university, program)}</p>
        {result.formulaRecord?.verificationStatus === "pending" && (
          <>
            <p>
              Admission cycle: {result.formulaRecord.admissionCycle}. No aggregate is
              shown until the current official formula is verified.
            </p>
            <p>{result.formulaRecord.officialRule}</p>
            <p>Source checked: {result.formulaRecord.lastVerified}</p>
            <FormulaRecordSource record={result.formulaRecord} />
          </>
        )}
        {selected.campus && <small>Campus: {selected.campus}</small>}
      </Card>
    );
  }

  if (!calculation?.ok) {
    return (
      <Card className="merit-result-card">
        <div className="merit-result-card-heading">
          <div>
            <span className="merit-result-institution">{university.name}</span>
            <h3>{program.name}</h3>
          </div>
          <span className="merit-status-pill merit-status-verified">
            Verified formula
          </span>
        </div>
        <p>Enter all required scores to calculate this aggregate.</p>
        <FormulaSource formula={formula} />
      </Card>
    );
  }

  return (
    <Card className="merit-result-card">
      <div className="merit-result-card-heading">
        <div>
          <span className="merit-result-institution">{university.name}</span>
          <h3>{program.name}</h3>
        </div>
        <span className="merit-status-pill merit-status-verified">
          Verified formula
        </span>
      </div>
      <div className="merit-aggregate-display">
        <span>{simulation ? "Projected aggregate" : "Calculated aggregate"}</span>
        <strong>{formatPercent(calculation.aggregate)}</strong>
      </div>
      <div className="merit-contribution-list">
        {calculation.contributions.map((component) => (
          <div className="merit-contribution-row" key={component.field}>
            <div>
              <strong>{component.label}</strong>
              <small>
                {formatPercent(component.percentage)} × {component.weight}% weight ·
                from {scoreFieldLabels[component.inputField]}
              </small>
            </div>
            <b>{component.contribution.toFixed(2)} points</b>
          </div>
        ))}
      </div>
      <details className="merit-explanation">
        <summary>How this aggregate was calculated</summary>
        <p>{formula.officialRule}</p>
        <p>
          Cycle: <strong>{formula.admissionCycle}</strong> · Last verified:{" "}
          <strong>{formula.lastVerified}</strong>
        </p>
        {formula.eligibilityNotes.length > 0 && (
          <ul>
            {formula.eligibilityNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
        <FormulaSource formula={formula} />
      </details>
    </Card>
  );
}

function FormulaSource({ formula }: { formula: VerifiedMeritFormula }) {
  return <FormulaRecordSource record={formula} />;
}

function FormulaRecordSource({ record }: { record: MeritFormulaRecord }) {
  return (
    <div className="merit-source-list">
      <a
        className="merit-source-link"
        href={record.sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        Official source: {record.sourceTitle} <Icon name="arrow" size={14} />
      </a>
      {record.additionalSources?.map((source) => (
        <a
          className="merit-source-link"
          href={source.url}
          target="_blank"
          rel="noreferrer"
          key={source.url}
        >
          {source.title} <Icon name="arrow" size={14} />
        </a>
      ))}
    </div>
  );
}

function GuideCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <Card className="merit-guide-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </Card>
  );
}
