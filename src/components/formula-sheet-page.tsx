import { type FormulaSheetContent, formulaSheets } from "@/lib/formula-sheet-data";
import { Card, Eyebrow, Icon } from "./ui";

export function CrackNetBadge() {
  return (
    <span className="crack-net-badge">
      <span className="crack-net-spark" aria-hidden="true">
        ✦
      </span>
      Crack NET
    </span>
  );
}

export function FormulaSheetPage({ slug }: { slug: string }) {
  const sheet = formulaSheets.find((item) => item.slug === slug);
  if (!sheet) return null;

  return <FormulaSheetContentView sheet={sheet} />;
}

function FormulaSheetContentView({ sheet }: { sheet: FormulaSheetContent }) {
  return (
    <div className="conic-sheet formula-sheet-page">
      <div className="conic-sheet-heading">
        <div>
          <div className="formula-sheet-eyebrow">
            <Eyebrow>NET ENGINEERING · RAPID REVISION</Eyebrow>
            <CrackNetBadge />
          </div>
          <h1>{sheet.title}</h1>
          <p>{sheet.subtitle}</p>
        </div>
        <div className="conic-sheet-actions">
          <a className="button button-outline" href="/resources/formula-sheets">
            <Icon name="arrow" size={15} /> Formula sheets
          </a>
          <a className="button button-primary" href={sheet.pdf} download>
            <Icon name="book" size={15} /> Download full PDF
          </a>
        </div>
      </div>

      <Card className="conic-encouragement">
        <span className="conic-encouragement-mark" aria-hidden="true">
          ✦
        </span>
        <div>
          <strong>Learn the pattern, then choose the formula</strong>
          <p>
            {sheet.summary} Work through one highlighted section at a time—steady
            revision makes even challenging topics feel manageable.
          </p>
        </div>
        <CrackNetBadge />
      </Card>

      <nav className="conic-jump-links" aria-label={`${sheet.title} sections`}>
        {sheet.sections.map((section, index) => (
          <a href={`#formula-section-${index + 1}`} key={section.title}>
            {String(index + 1).padStart(2, "0")} · {section.title}
          </a>
        ))}
      </nav>

      {sheet.sections.map((section, sectionIndex) => (
        <section
          className="conic-sheet-section formula-sheet-section"
          id={`formula-section-${sectionIndex + 1}`}
          key={section.title}
        >
          <div className="conic-section-heading">
            <span className="conic-section-number">
              {String(sectionIndex + 1).padStart(2, "0")}
            </span>
            <div>
              <Eyebrow>
                FORMULA GROUP {String(sectionIndex + 1).padStart(2, "0")}
              </Eyebrow>
              <h2>{section.title}</h2>
              {section.intro && <p>{section.intro}</p>}
            </div>
          </div>
          <div className="conic-formula-grid">
            {section.formulas.map((formula, formulaIndex) => (
              <Card className="conic-formula-card" key={formula.label}>
                <span className="conic-formula-index">
                  {String(formulaIndex + 1).padStart(2, "0")}
                </span>
                <div>
                  <small>{formula.label}</small>
                  <strong>{formula.formula}</strong>
                  {formula.note && <p>{formula.note}</p>}
                </div>
              </Card>
            ))}
          </div>
          {section.callout && (
            <div className="conic-highlight conic-highlight-warning">
              <Icon name="info" size={16} />
              <span>{section.callout}</span>
            </div>
          )}
        </section>
      ))}

      <Card className="conic-sheet-footer">
        <div>
          <Eyebrow>CRACK NET · ONE STEP AT A TIME</Eyebrow>
          <h2>You’re building the right habits.</h2>
          <p>
            Review the formulas, practise a few questions, and return to the ideas that
            need another look.
          </p>
        </div>
        <div className="conic-sheet-actions">
          <a className="button button-outline" href="/resources/formula-sheets">
            More formula sheets
          </a>
          <a className="button button-primary" href={sheet.pdf} download>
            Download original PDF <Icon name="book" size={15} />
          </a>
        </div>
      </Card>
    </div>
  );
}

export { formulaSheets };
