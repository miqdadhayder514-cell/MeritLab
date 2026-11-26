import { CrackNetBadge } from "./formula-sheet-page";
import { Card, Eyebrow, Icon } from "./ui";

const conics = [
  {
    name: "Circle",
    mark: "C",
    className: "conic-circle",
    summary:
      "Equal squared terms, no xy term; every point is a fixed distance r from the centre.",
    formulas: [
      ["Centre-radius form", "(x − h)² + (y − k)² = r²"],
      ["General form", "x² + y² + 2gx + 2fy + c = 0"],
      ["Centre and radius", "Centre (−g, −f);  r = √(g² + f² − c)"],
      ["Diameter endpoints P₁, P₂", "(x − x₁)(x − x₂) + (y − y₁)(y − y₂) = 0"],
      ["Parametric point", "(h + r cos θ, k + r sin θ)"],
      ["Point position", "S₁ = x₁² + y₁² + 2gx₁ + 2fy₁ + c"],
      ["Tangent at (x₁, y₁)", "xx₁ + yy₁ + g(x + x₁) + f(y + y₁) + c = 0"],
      ["Origin-centred tangent", "xx₁ + yy₁ = r²"],
      ["Normal", "The normal at any point passes through the circle's centre"],
      ["Tangent with slope m", "y = mx ± r√(1 + m²)"],
      ["Line y = mx + k touches", "k² = r²(1 + m²)"],
      ["Tangent length from P", "L = √S₁"],
      [
        "Concentric circles",
        "Same centre: same g and f; only the constant term may differ",
      ],
      ["Orthogonal circles", "2g₁g₂ + 2f₁f₂ = c₁ + c₂"],
    ],
    note: "S₁ < 0: point inside · S₁ = 0: on the circle · S₁ > 0: outside. Tangents from the same external point have equal lengths.",
  },
  {
    name: "Parabola",
    mark: "P",
    className: "conic-parabola",
    summary:
      "Eccentricity e = 1. The focus is a units from the vertex; the latus rectum has length 4a.",
    formulas: [
      [
        "y² = 4ax",
        "Opens right · vertex (0,0) · focus (a,0) · directrix x = −a · LR ends (a, ±2a)",
      ],
      [
        "y² = −4ax",
        "Opens left · vertex (0,0) · focus (−a,0) · directrix x = a · LR ends (−a, ±2a)",
      ],
      [
        "x² = 4ay",
        "Opens up · vertex (0,0) · focus (0,a) · directrix y = −a · LR ends (±2a, a)",
      ],
      [
        "x² = −4ay",
        "Opens down · vertex (0,0) · focus (0,−a) · directrix y = a · LR ends (±2a, −a)",
      ],
      [
        "Shifted horizontal",
        "(y − k)² = 4a(x − h) · focus (h + a,k) · directrix x = h − a",
      ],
      [
        "Shifted vertical",
        "(x − h)² = 4a(y − k) · focus (h,k + a) · directrix y = k − a",
      ],
      ["Parametric point", "(at², 2at)"],
      ["Focal distance", "SP = x + a = a(1 + t²)"],
      ["Focal chord endpoints", "t₁t₂ = −1; length = a(t₁ − t₂)²"],
      ["Focal segments", "For a focal chord of length L:  2/L = 1/SP + 1/SQ"],
      ["Tangent at (x₁, y₁)", "yy₁ = 2a(x + x₁)"],
      ["Parametric tangent", "ty = x + at²"],
      ["Tangent with slope m", "y = mx + a/m"],
      ["Normal at (at², 2at)", "y + tx = 2at + at³"],
      ["Normal with slope m", "y = mx − 2am − am³"],
      [
        "Second intersection of a normal",
        "If the normal at parameter t₁ meets the parabola again at t₂: t₂ = −t₁ − 2/t₁",
      ],
      ["Latus-rectum-end tangents", "Meet on the directrix at 90°"],
    ],
    note: "For a focal chord, the endpoint parameters multiply to −1. Tangents from a point on the directrix are perpendicular.",
  },
  {
    name: "Ellipse",
    mark: "E",
    className: "conic-ellipse",
    summary:
      "0 < e < 1. The sum of distances from any point on the ellipse to its foci is 2a.",
    formulas: [
      ["Horizontal major axis", "(x − h)²/a² + (y − k)²/b² = 1,  a > b"],
      ["Vertical major axis", "(x − h)²/b² + (y − k)²/a² = 1,  a > b"],
      ["Focal relation", "c = ae;  b² = a²(1 − e²);  e = √(1 − b²/a²)"],
      ["Horizontal vertices / foci", "(h ± a, k)  /  (h ± ae, k)"],
      ["Vertical vertices / foci", "(h, k ± a)  /  (h, k ± ae)"],
      ["Directrices", "Horizontal: x = h ± a/e · Vertical: y = k ± a/e"],
      ["Latus rectum", "Length 2b²/a"],
      ["Focal distance sum", "PF₁ + PF₂ = 2a"],
      ["Parametric point", "(a cos θ, b sin θ)"],
      ["Tangent at (x₁, y₁)", "xx₁/a² + yy₁/b² = 1"],
      ["Parametric tangent", "x cos θ/a + y sin θ/b = 1"],
      ["Tangent with slope m", "y = mx ± √(a²m² + b²)"],
      ["Tangency condition", "For y = mx + c:  c² = a²m² + b²"],
      ["Normal at (x₁, y₁)", "a²x/x₁ − b²y/y₁ = a² − b²"],
      ["Parametric normal", "ax sec θ − by cosec θ = a² − b²"],
      ["Focal radii (horizontal)", "a − ex and a + ex; their sum is 2a"],
      ["Director circle", "x² + y² = a² + b² (for a centre at the origin)"],
    ],
    note: "The larger denominator gives the direction of the major axis. The sum of focal distances is constant.",
  },
  {
    name: "Hyperbola",
    mark: "H",
    className: "conic-hyperbola",
    summary:
      "e > 1. The absolute difference of distances from any point to the foci is 2a.",
    formulas: [
      ["Horizontal transverse axis", "(x − h)²/a² − (y − k)²/b² = 1"],
      ["Vertical transverse axis", "(y − k)²/a² − (x − h)²/b² = 1"],
      ["Focal relation", "c = ae;  b² = a²(e² − 1);  e = √(1 + b²/a²)"],
      ["Horizontal vertices / foci", "(h ± a, k)  /  (h ± ae, k)"],
      ["Vertical vertices / foci", "(h, k ± a)  /  (h, k ± ae)"],
      ["Directrices", "Horizontal: x = h ± a/e · Vertical: y = k ± a/e"],
      ["Latus rectum", "Length 2b²/a"],
      ["Focal distance difference", "|PF₁ − PF₂| = 2a"],
      ["Horizontal asymptotes", "y − k = ±(b/a)(x − h)"],
      ["Vertical asymptotes", "y − k = ±(a/b)(x − h)"],
      ["Parametric point", "(a sec θ, b tan θ)"],
      ["Tangent at (x₁, y₁)", "xx₁/a² − yy₁/b² = 1"],
      ["Tangent with slope m", "y = mx ± √(a²m² − b²)"],
      ["Tangency condition", "For y = mx + c:  c² = a²m² − b²"],
      ["Normal at (x₁, y₁)", "a²x/x₁ + b²y/y₁ = a² + b²"],
      ["Parametric normal", "ax cos θ + by cot θ = a² + b²"],
      [
        "Conjugate hyperbola",
        "x²/a² − y²/b² = −1; same asymptotes y = ±(b/a)x; 1/e₁² + 1/e₂² = 1",
      ],
      ["Rectangular hyperbola", "If a = b: e = √2 and LR = 2a"],
      ["Rotated rectangular form", "xy = c²; point (ct, c/t); tangent xy₁ + yx₁ = 2c²"],
      ["Director circle at origin", "x² + y² = a² − b² (real when a > b)"],
    ],
    note: "The positive squared term identifies the transverse axis and determines a. The negative term determines b.",
  },
];

const rapidPatterns = [
  {
    cue: "Given eccentricity and latus rectum",
    use: "Ellipse / hyperbola",
    formula: "LR = 2b²/a;  b² = a²|1 − e²|;  distance between foci = 2ae",
  },
  {
    cue: "A line y = mx + c is tangent",
    use: "Circle / parabola / ellipse / hyperbola",
    formula:
      "Circle: c² = r²(1 + m²) · Parabola: c = a/m · Ellipse: c² = a²m² + b² · Hyperbola: c² = a²m² − b²",
  },
  {
    cue: "Endpoints of a focal chord",
    use: "Parabola y² = 4ax",
    formula: "Parameters t₁t₂ = −1; chord length = a(t₁ − t₂)²",
  },
  {
    cue: "Sum or difference of distances to two fixed points",
    use: "Ellipse / hyperbola",
    formula: "Sum = 2a gives an ellipse; absolute difference = 2a gives a hyperbola",
  },
  {
    cue: "Chord midpoint or polar from an external point",
    use: "All conics",
    formula: "Midpoint chord: T = S₁ · Polar / chord of contact: T = 0",
  },
];

export function ConicCheatSheet() {
  return (
    <div className="conic-sheet">
      <div className="conic-sheet-heading">
        <div>
          <div className="formula-sheet-eyebrow">
            <Eyebrow>NET ENGINEERING · RAPID REVISION</Eyebrow>
            <CrackNetBadge />
          </div>
          <h1>Conic Sections Cheat Sheet</h1>
          <p>
            Crack the most difficult chapter with clear forms, focal properties, and
            exam-ready shortcuts.
          </p>
        </div>
        <div className="conic-sheet-actions">
          <a className="button button-outline" href="/resources/formula-sheets">
            <Icon name="arrow" size={15} /> Formula sheets
          </a>
          <a
            className="button button-primary"
            href="/formula-sheets/conic-sections-cheat-sheet.pdf"
            download
          >
            <Icon name="book" size={15} /> Download PDF
          </a>
        </div>
      </div>

      <Card className="conic-encouragement">
        <span className="conic-encouragement-mark">✦</span>
        <div>
          <strong>A simple game plan</strong>
          <p>
            Identify the conic first, locate its centre or vertex, then apply the
            matching formula. You do not need to memorise every derivation to solve NET
            questions confidently.
          </p>
        </div>
        <span className="conic-progress-label">ONE FORMULA AT A TIME</span>
      </Card>

      <nav className="conic-jump-links" aria-label="Cheat sheet sections">
        <a href="#quick-map">Quick map</a>
        {conics.map((conic) => (
          <a href={`#${conic.className}`} key={conic.name}>
            {conic.name}
          </a>
        ))}
        <a href="#rapid-patterns">NET shortcuts</a>
      </nav>

      <section id="quick-map" className="conic-sheet-section">
        <div className="conic-section-heading">
          <span className="conic-section-number">01</span>
          <div>
            <Eyebrow>START HERE</Eyebrow>
            <h2>Recognise the conic at a glance</h2>
          </div>
        </div>
        <div className="conic-recognition-grid">
          {[
            [
              "Circle",
              "A = B, H = 0",
              "Equal x² and y² coefficients; no xy term.",
              "conic-circle",
            ],
            [
              "Parabola",
              "H² − AB = 0",
              "One squared variable in an axis-aligned form.",
              "conic-parabola",
            ],
            [
              "Ellipse",
              "H² − AB < 0",
              "Squared terms have the same sign.",
              "conic-ellipse",
            ],
            [
              "Hyperbola",
              "H² − AB > 0",
              "Squared terms have opposite signs.",
              "conic-hyperbola",
            ],
          ].map(([name, condition, description, color]) => (
            <Card className={`conic-recognition-card ${color}`} key={name}>
              <span>{name}</span>
              <strong>{condition}</strong>
              <p>{description}</p>
            </Card>
          ))}
        </div>
        <div className="conic-highlight conic-highlight-warning">
          <strong>Trap alert</strong>
          <span>
            For x² + y² + 2gx + 2fy + c = 0, check g² + f² − c: positive means a real
            circle, zero a point circle, and negative no real graph.
          </span>
        </div>
        <Card className="conic-general-form">
          <span>General second-degree equation</span>
          <strong>Ax² + 2Hxy + By² + 2Gx + 2Fy + C = 0</strong>
          <small>
            A pair of straight lines occurs when ABC + 2FGH − AF² − BG² − CH² = 0. Their
            angle satisfies tan θ = 2√(H² − AB)/|A + B|.
          </small>
        </Card>
      </section>

      {conics.map((conic, sectionIndex) => (
        <section
          id={conic.className}
          className={`conic-sheet-section ${conic.className}`}
          key={conic.name}
        >
          <div className="conic-section-heading">
            <span className="conic-section-number">
              {String(sectionIndex + 2).padStart(2, "0")}
            </span>
            <div>
              <Eyebrow>FORMULAS & KEY PROPERTIES</Eyebrow>
              <h2>{conic.name}</h2>
              <p>{conic.summary}</p>
            </div>
            <span className="conic-mark" aria-hidden="true">
              {conic.mark}
            </span>
          </div>
          <div className="conic-formula-grid">
            {conic.formulas.map(([label, formula], index) => (
              <Card className="conic-formula-card" key={label}>
                <span className="conic-formula-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <small>{label}</small>
                  <strong>{formula}</strong>
                </div>
              </Card>
            ))}
          </div>
          <div className="conic-highlight">
            <Icon name="info" size={16} />
            <span>{conic.note}</span>
          </div>
        </section>
      ))}

      <section id="rapid-patterns" className="conic-sheet-section">
        <div className="conic-section-heading">
          <span className="conic-section-number">06</span>
          <div>
            <Eyebrow>EXAM-DAY REFERENCE</Eyebrow>
            <h2>NET question patterns & shortcuts</h2>
          </div>
        </div>
        <div className="conic-pattern-list">
          {rapidPatterns.map((pattern, index) => (
            <Card className="conic-pattern-card" key={pattern.cue}>
              <span className="conic-pattern-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <small>{pattern.use}</small>
                <h3>{pattern.cue}</h3>
                <p>{pattern.formula}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="conic-highlight conic-highlight-success">
          <strong>Remember the sign flip</strong>
          <span>
            Ellipse: e² = 1 − b²/a² and tangent term +b². Hyperbola: e² = 1 + b²/a² and
            tangent term −b². Check the conic before substituting.
          </span>
        </div>
      </section>

      <Card className="conic-sheet-footer">
        <div>
          <Eyebrow>KEEP GOING</Eyebrow>
          <h2>Small revisions make hard chapters manageable.</h2>
          <p>
            Review a section, try a few questions, and come back to the formulas you
            need.
          </p>
        </div>
        <a href="/practice" className="button button-primary">
          Practise Mathematics <Icon name="arrow" size={15} />
        </a>
      </Card>
    </div>
  );
}
