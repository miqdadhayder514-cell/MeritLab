export type FormulaSheetFormula = {
  label: string;
  formula: string;
  note?: string;
};

export type FormulaSheetSection = {
  title: string;
  intro?: string;
  formulas: FormulaSheetFormula[];
  callout?: string;
};

export type FormulaSheetContent = {
  slug: string;
  title: string;
  subject: string;
  subtitle: string;
  summary: string;
  pdf: string;
  sections: FormulaSheetSection[];
};

export const formulaSheets: FormulaSheetContent[] = [
  {
    slug: "analytical-geometry",
    title: "Analytical Geometry",
    subject: "Mathematics",
    subtitle: "Coordinates, straight lines, distances, and loci",
    summary:
      "A clear coordinate-geometry reference for section formulae, line equations, angles, distances, pair of lines, triangle centres, and loci.",
    pdf: "/formula-sheets/analytical-geometry.pdf",
    sections: [
      {
        title: "Coordinates & section formulae",
        formulas: [
          {
            label: "Distance between points",
            formula: "d = √[(x₂ − x₁)² + (y₂ − y₁)²]",
          },
          {
            label: "Internal division (m : n)",
            formula: "P = ((mx₂ + nx₁)/(m + n), (my₂ + ny₁)/(m + n))",
          },
          {
            label: "External division (m : n)",
            formula: "P = ((mx₂ − nx₁)/(m − n), (my₂ − ny₁)/(m − n))",
          },
          { label: "Midpoint", formula: "M = ((x₁ + x₂)/2, (y₁ + y₂)/2)" },
          {
            label: "Shift origin to (h, k)",
            formula: "x = X + h, y = Y + k;  X = x − h, Y = y − k",
          },
          {
            label: "Rotate axes by θ",
            formula: "x = X cos θ − Y sin θ;  y = X sin θ + Y cos θ",
          },
        ],
        callout:
          "For a ratio k : 1, k > 0 gives internal division; k < 0 gives external division (when k ≠ −1).",
      },
      {
        title: "Slopes, angles & line forms",
        formulas: [
          { label: "Slope through two points", formula: "m = (y₂ − y₁)/(x₂ − x₁)" },
          { label: "Slope of ax + by + c = 0", formula: "m = −a/b  (b ≠ 0)" },
          { label: "Angle between lines", formula: "tan θ = |(m₂ − m₁)/(1 + m₁m₂)|" },
          { label: "Parallel lines", formula: "m₁ = m₂" },
          {
            label: "Perpendicular lines",
            formula: "m₁m₂ = −1; equivalently a₁a₂ + b₁b₂ = 0",
          },
          { label: "Point-slope form", formula: "y − y₁ = m(x − x₁)" },
          { label: "Two-intercept form", formula: "x/a + y/b = 1" },
          { label: "Normal form", formula: "x cos α + y sin α = p  (p ≥ 0)" },
        ],
        callout:
          "For a parallel line through (x₁, y₁), use ax + by = ax₁ + by₁. For a perpendicular line, use bx − ay = bx₁ − ay₁.",
      },
      {
        title: "Distances, reflections & pair of lines",
        formulas: [
          {
            label: "Point-to-line distance",
            formula: "d = |ax₁ + by₁ + c|/√(a² + b²)",
          },
          {
            label: "Distance between parallel lines",
            formula: "d = |c₁ − c₂|/√(a² + b²)",
          },
          {
            label: "Intersection of two lines",
            formula:
              "x = (b₁c₂ − b₂c₁)/(a₁b₂ − a₂b₁);  y = (c₁a₂ − c₂a₁)/(a₁b₂ − a₂b₁)",
          },
          {
            label: "Pair ax² + 2hxy + by² = 0",
            formula: "m₁ + m₂ = −2h/b;  m₁m₂ = a/b",
          },
          {
            label: "Angle between pair of lines",
            formula: "tan θ = 2√(h² − ab)/|a + b|",
          },
          {
            label: "Perpendicular pair condition",
            formula: "a + b = 0",
          },
          {
            label: "Real and distinct pair",
            formula: "h² − ab > 0",
          },
        ],
        callout:
          "Reflection across y = x swaps coordinates: (x, y) → (y, x). Reflection across y = −x gives (x, y) → (−y, −x).",
      },
      {
        title: "Triangle geometry & loci",
        formulas: [
          {
            label: "Triangle area",
            formula: "Δ = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|",
          },
          {
            label: "Collinearity",
            formula: "Three points are collinear exactly when Δ = 0",
          },
          {
            label: "Centroid",
            formula: "G = ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3)",
          },
          {
            label: "Incenter",
            formula:
              "I = ((ax₁ + bx₂ + cx₃)/(a + b + c), (ay₁ + by₂ + cy₃)/(a + b + c))",
          },
          {
            label: "Euler line",
            formula:
              "Circumcentre O, centroid G, and orthocentre H are collinear; OG : GH = 1 : 2",
          },
          {
            label: "Line through intersection of L₁ = 0 and L₂ = 0",
            formula: "L₁ + kL₂ = 0",
          },
        ],
        callout:
          "For a locus, assign the moving point coordinates (x, y), translate the geometric condition into an equation, then eliminate any extra parameters.",
      },
    ],
  },
  {
    slug: "differential-equations",
    title: "Differential Equations",
    subject: "Mathematics",
    subtitle: "Order, degree, solution methods & applications",
    summary:
      "Recognise an ODE quickly and choose the right method: separation, homogeneous substitution, integrating factors, Bernoulli, exact equations, or constant-coefficient methods.",
    pdf: "/formula-sheets/differential-equations.pdf",
    sections: [
      {
        title: "Order, degree & formation",
        formulas: [
          {
            label: "Order",
            formula: "Order = order of the highest derivative present",
          },
          {
            label: "Degree",
            formula:
              "Degree = power of the highest derivative after clearing radicals and fractions",
          },
          {
            label: "Forming an ODE",
            formula: "Differentiate enough times to eliminate all arbitrary constants",
          },
          {
            label: "Example: y = Ae²ˣ",
            formula: "dy/dx − 2y = 0",
          },
          {
            label: "Curvature-style trap",
            formula: "[1 + (dy/dx)²]³ = k²(d²y/dx²)²",
            note: "If the original equation has square roots, square both sides before identifying degree.",
          },
        ],
      },
      {
        title: "First-order solution methods",
        formulas: [
          {
            label: "Separable",
            formula: "dy/dx = f(x)g(y)  →  ∫dy/g(y) = ∫f(x)dx + C",
          },
          {
            label: "Homogeneous",
            formula: "Set y = vx, so dy/dx = v + x(dv/dx)",
          },
          {
            label: "Linear in y",
            formula: "dy/dx + P(x)y = Q(x);  I.F. = e^(∫P(x)dx)",
          },
          {
            label: "Linear solution",
            formula: "y · I.F. = ∫Q(x) · I.F. dx + C",
          },
          {
            label: "Bernoulli",
            formula: "dy/dx + Py = Qyⁿ; set z = y^(1−n)",
          },
          {
            label: "Exact equation",
            formula: "M dx + N dy = 0 is exact when ∂M/∂y = ∂N/∂x",
          },
          {
            label: "Reducible form",
            formula: "For dy/dx = f(ax + by + c), set u = ax + by + c",
          },
        ],
        callout:
          "For a homogeneous equation, use y = vx. For a linear equation, first make the coefficient of dy/dx equal to 1, then calculate the integrating factor.",
      },
      {
        title: "Recognise standard solution pairs",
        formulas: [
          { label: "Exponential growth or decay", formula: "dy/dx = ky  →  y = Ceᵏˣ" },
          {
            label: "Logarithmic derivative",
            formula: "dy/dx = f′(x)/f(x)  →  y = ln|f(x)| + C",
          },
          { label: "Product differential", formula: "x dy + y dx = 0  →  xy = C" },
          {
            label: "Quotient differential",
            formula: "(y dx − x dy)/y² = 0  →  x/y = C",
          },
          {
            label: "Newton cooling",
            formula: "dT/dt = −k(T − Tₛ)  →  T − Tₛ = (T₀ − Tₛ)e^(−kt)",
          },
        ],
      },
      {
        title: "Higher-order equations & trajectories",
        formulas: [
          {
            label: "Distinct real roots m₁, m₂",
            formula: "y_c = C1 e^(m1 x) + C2 e^(m2 x)",
          },
          { label: "Repeated root m", formula: "y_c = (C1 + C2x)e^(mx)" },
          {
            label: "Complex roots α ± iβ",
            formula: "y_c = e^(αx)(C1 cos(βx) + C2 sin(βx))",
          },
          {
            label: "Orthogonal trajectories",
            formula: "Replace dy/dx by −dx/dy in the family’s differential equation",
          },
          { label: "Circles x² + y² = r²", formula: "Orthogonal trajectories: y = mx" },
          { label: "Lines y = mx", formula: "Orthogonal trajectories: x² + y² = c²" },
        ],
      },
    ],
  },
  {
    slug: "further-differentiation",
    title: "Further Differentiation",
    subject: "Mathematics",
    subtitle: "Derivative rules, implicit methods & approximations",
    summary:
      "A readable guide to chain, product, quotient, trigonometric, inverse-trigonometric, exponential, and logarithmic derivatives, plus tangents and approximation.",
    pdf: "/formula-sheets/further-differentiation.pdf",
    sections: [
      {
        title: "Core derivative rules",
        formulas: [
          { label: "Power and chain rule", formula: "d[uⁿ]/dx = n uⁿ⁻¹ · du/dx" },
          { label: "Product rule", formula: "(uv)′ = u′v + uv′" },
          { label: "Quotient rule", formula: "(u/v)′ = (u′v − uv′)/v²" },
          {
            label: "Sine and cosine",
            formula: "(sin u)′ = cos u·u′;  (cos u)′ = −sin u·u′",
          },
          {
            label: "Tangent and cotangent",
            formula: "(tan u)′ = sec²u·u′;  (cot u)′ = −cosec²u·u′",
          },
          {
            label: "Secant and cosecant",
            formula: "(sec u)′ = sec u tan u·u′;  (cosec u)′ = −cosec u cot u·u′",
          },
          {
            label: "Inverse sine and cosine",
            formula: "(sin⁻¹u)′ = u′/√(1 − u²);  (cos⁻¹u)′ = −u′/√(1 − u²)",
          },
          {
            label: "Inverse tangent and cotangent",
            formula: "(tan⁻¹u)′ = u′/(1 + u²);  (cot⁻¹u)′ = −u′/(1 + u²)",
          },
          {
            label: "Inverse secant and cosecant",
            formula: "(sec⁻¹u)′ = u′/[|u|√(u² − 1)];  (cosec⁻¹u)′ = −u′/[|u|√(u² − 1)]",
          },
          { label: "Exponential", formula: "(eᵘ)′ = eᵘu′;  (aᵘ)′ = aᵘ ln(a)·u′" },
          {
            label: "Logarithmic",
            formula: "(ln|u|)′ = u′/u;  (logₐ|u|)′ = u′/[u ln(a)]",
          },
        ],
        callout:
          "Inverse-trig notation sin⁻¹u means arcsin(u), not 1/sin(u). Standard calculus angles are in radians.",
      },
      {
        title: "Parametric, implicit & logarithmic methods",
        formulas: [
          { label: "Parametric first derivative", formula: "dy/dx = (dy/dt)/(dx/dt)" },
          {
            label: "Parametric second derivative",
            formula: "d²y/dx² = [d/dt(dy/dx)]/(dx/dt)",
          },
          {
            label: "Implicit derivative",
            formula: "For F(x,y) = 0: dy/dx = −Fₓ/Fᵧ",
          },
          {
            label: "Logarithmic differentiation",
            formula: "For y = f(x)^g(x): y′ = f^g[g′ ln(f) + g f′/f]",
          },
        ],
        callout:
          "Do not divide d²y/dt² by d²x/dt² for a parametric second derivative. Differentiate dy/dx with respect to t, then divide by dx/dt.",
      },
      {
        title: "Higher derivatives, tangents & normals",
        formulas: [
          { label: "Exponential nth derivative", formula: "dⁿ(eᵃˣ)/dxⁿ = aⁿeᵃˣ" },
          {
            label: "Sine nth derivative",
            formula: "dⁿ[sin(ax + b)]/dxⁿ = aⁿ sin(ax + b + nπ/2)",
          },
          {
            label: "Cosine nth derivative",
            formula: "dⁿ[cos(ax + b)]/dxⁿ = aⁿ cos(ax + b + nπ/2)",
          },
          { label: "Tangent at (x₁, y₁)", formula: "y − y₁ = f′(x₁)(x − x₁)" },
          { label: "Normal at (x₁, y₁)", formula: "y − y₁ = −[1/f′(x₁)](x − x₁)" },
          { label: "Horizontal tangent", formula: "dy/dx = 0" },
          {
            label: "Vertical tangent",
            formula: "dx/dy = 0 (equivalently dy/dx becomes unbounded)",
          },
        ],
      },
      {
        title: "Linear approximation & error",
        formulas: [
          { label: "Differential", formula: "dy = f′(x) dx" },
          {
            label: "Linear approximation near a",
            formula: "L(x) = f(a) + f′(a)(x − a)",
          },
          { label: "Approximate nearby value", formula: "f(a + Δx) ≈ f(a) + f′(a)Δx" },
          {
            label: "Relative / percentage error",
            formula: "Relative: df/f;  percentage: 100(df/f)%",
          },
          { label: "Power error rule", formula: "For y = xⁿ: dy/y = n(dx/x)" },
          {
            label: "Sphere volume error rule",
            formula: "For V = ⁴⁄₃πr³: dV/V = 3(dr/r)",
          },
        ],
        callout: "For √26, expand √x near a = 25: √26 ≈ 5 + (1/10) = 5.1.",
      },
    ],
  },
  {
    slug: "graphical-representation-of-functions",
    title: "Graphical Representation of Functions",
    subject: "Mathematics",
    subtitle: "Quadratics, exponential/log graphs & transformations",
    summary:
      "Quickly identify intercepts, vertices, asymptotes, graph transformations, hyperbolic functions, and applied growth/decay models.",
    pdf: "/formula-sheets/graphical-representation-of-functions.pdf",
    sections: [
      {
        title: "Quadratic graphs",
        formulas: [
          { label: "Factor form", formula: "y = a(x − h)(x − k)" },
          { label: "x-intercepts", formula: "(h, 0) and (k, 0)" },
          { label: "Axis of symmetry", formula: "x = (h + k)/2" },
          { label: "Vertex form", formula: "y = a(x − h)² + k;  vertex (h, k)" },
          { label: "Standard form", formula: "y = ax² + bx + c;  xᵥ = −b/(2a)" },
          { label: "Find leading coefficient", formula: "a = y₀/[(x₀ − x₁)(x₀ − x₂)]" },
        ],
        callout:
          "When x-intercepts and another point are given, solve for a; do not assume the parabola is monic.",
      },
      {
        title: "Exponential & logarithmic graphs",
        formulas: [
          {
            label: "Exponential function",
            formula: "y = aˣ (a > 0, a ≠ 1); domain ℝ; range (0, ∞)",
          },
          {
            label: "Exponential intercept/asymptote",
            formula: "y-intercept (0, 1); horizontal asymptote y = 0",
          },
          {
            label: "Logarithmic function",
            formula: "y = logₐx; domain (0, ∞); range ℝ",
          },
          {
            label: "Logarithm intercept/asymptote",
            formula: "x-intercept (1, 0); vertical asymptote x = 0",
          },
          {
            label: "Product / quotient",
            formula: "logₐ(xy) = logₐx + logₐy;  logₐ(x/y) = logₐx − logₐy",
          },
          {
            label: "Power / change of base",
            formula: "logₐ(xʳ) = r logₐx;  logₐx = ln(x)/ln(a)",
          },
        ],
        callout:
          "Logarithm arguments must be positive. If 0 < a < 1, the graph decreases and logarithmic inequalities reverse direction.",
      },
      {
        title: "Hyperbolic & inverse-hyperbolic forms",
        formulas: [
          {
            label: "Hyperbolic sine / cosine",
            formula: "sinh x = (eˣ − e⁻ˣ)/2;  cosh x = (eˣ + e⁻ˣ)/2",
          },
          { label: "Core identity", formula: "cosh²x − sinh²x = 1" },
          { label: "Hyperbolic tangent", formula: "tanh x = (eˣ − e⁻ˣ)/(eˣ + e⁻ˣ)" },
          { label: "Inverse sinh", formula: "sinh⁻¹x = ln(x + √(x² + 1))" },
          { label: "Inverse cosh", formula: "cosh⁻¹x = ln(x + √(x² − 1)),  x ≥ 1" },
          {
            label: "Inverse tanh",
            formula: "tanh⁻¹x = ½ ln[(1 + x)/(1 − x)],  |x| < 1",
          },
        ],
      },
      {
        title: "Transformations & applied models",
        formulas: [
          { label: "Translation", formula: "y = f(x − h) + k: shift right h and up k" },
          {
            label: "Reflections",
            formula: "−f(x): reflect across x-axis;  f(−x): reflect across y-axis",
          },
          {
            label: "Inverse graph",
            formula: "Reflect y = f(x) across y = x to obtain y = f⁻¹(x)",
          },
          {
            label: "Exponential growth / decay",
            formula: "N = N₀eᵏᵗ;  k > 0 growth, k < 0 decay",
          },
          {
            label: "Compound interest",
            formula: "A = P(1 + r/n)ⁿᵗ;  continuously: A = Peʳᵗ",
          },
          { label: "Sound level", formula: "β = 10 log₁₀(I/I₀);  I₀ = 10⁻¹² W/m²" },
        ],
      },
    ],
  },
  {
    slug: "integration",
    title: "Integration",
    subject: "Mathematics",
    subtitle: "Antiderivatives, substitutions, definite integrals & area",
    summary:
      "An organised integration reference for standard antiderivatives, radical substitutions, integration by parts, partial fractions, symmetry, and area.",
    pdf: "/formula-sheets/integration.pdf",
    sections: [
      {
        title: "Basic antiderivatives",
        formulas: [
          { label: "Power rule", formula: "∫xⁿ dx = xⁿ⁺¹/(n + 1) + C,  n ≠ −1" },
          { label: "Log case", formula: "∫dx/x = ln|x| + C" },
          {
            label: "Composite power",
            formula: "∫[f(x)]ⁿ f′(x) dx = [f(x)]ⁿ⁺¹/(n + 1) + C",
          },
          { label: "Logarithmic derivative", formula: "∫f′(x)/f(x) dx = ln|f(x)| + C" },
          {
            label: "Exponential",
            formula: "∫eᵃˣ dx = eᵃˣ/a + C;  ∫aᵏˣ dx = aᵏˣ/(k ln a) + C",
          },
          {
            label: "Sine / cosine",
            formula: "∫sin(ax)dx = −cos(ax)/a;  ∫cos(ax)dx = sin(ax)/a",
          },
          {
            label: "Sec² / cosec²",
            formula: "∫sec²(ax)dx = tan(ax)/a;  ∫cosec²(ax)dx = −cot(ax)/a",
          },
          {
            label: "Tangent / cotangent",
            formula: "∫tan x dx = ln|sec x| + C;  ∫cot x dx = ln|sin x| + C",
          },
          {
            label: "Secant / cosecant",
            formula:
              "∫sec x dx = ln|sec x + tan x| + C;  ∫cosec x dx = ln|cosec x − cot x| + C",
          },
        ],
        callout:
          "For an argument ax + b, divide by the inner derivative a. Add +C to every indefinite integral.",
      },
      {
        title: "Substitution & standard radical forms",
        formulas: [
          {
            label: "Quadratic denominator",
            formula: "∫dx/(x² + a²) = (1/a)tan⁻¹(x/a) + C",
          },
          { label: "Square root a² − x²", formula: "∫dx/√(a² − x²) = sin⁻¹(x/a) + C" },
          {
            label: "Square root x² + a²",
            formula: "∫dx/√(x² + a²) = ln|x + √(x² + a²)| + C",
          },
          {
            label: "Square root x² − a²",
            formula: "Use x = a sec θ; check the domain |x| > a",
          },
          {
            label: "Difference of squares",
            formula: "∫dx/(x² − a²) = [1/(2a)] ln|(x − a)/(x + a)| + C",
          },
          {
            label: "Radical-area form",
            formula: "∫√(a² − x²)dx = (x/2)√(a² − x²) + (a²/2)sin⁻¹(x/a) + C",
          },
          {
            label: "Useful substitutions",
            formula:
              "a² − x²: x = a sin θ;  x² + a²: x = a tan θ;  x² − a²: x = a sec θ",
          },
        ],
      },
      {
        title: "Parts, partial fractions & definite integrals",
        formulas: [
          { label: "Integration by parts", formula: "∫u dv = uv − ∫v du" },
          {
            label: "LIATE order for u",
            formula:
              "Logarithmic → Inverse trig → Algebraic → Trigonometric → Exponential",
          },
          {
            label: "Exponential shortcut",
            formula: "∫eˣ[f(x) + f′(x)]dx = eˣf(x) + C",
          },
          { label: "Repeated linear fraction", formula: "A/(x − a) + B/(x − a)²" },
          {
            label: "Fundamental theorem",
            formula: "∫ₐᵇ f(x)dx = F(b) − F(a), where F′ = f",
          },
          { label: "King's rule", formula: "∫₀ᵃf(x)dx = ∫₀ᵃf(a − x)dx" },
          {
            label: "Even / odd symmetry",
            formula: "Even f: ∫₋ₐᵃ f = 2∫₀ᵃf;  odd f: ∫₋ₐᵃf = 0",
          },
          { label: "Area between curves", formula: "A = ∫ₐᵇ |f(x) − g(x)|dx" },
        ],
        callout:
          "For area, split the interval at roots or curve intersections so regions below the x-axis do not cancel positive area.",
      },
    ],
  },
  {
    slug: "inverse-trigonometric-functions",
    title: "Inverse Trigonometric Functions & Their Graphs",
    subject: "Mathematics",
    subtitle: "Principal values, domains, identities & angle formulas",
    summary:
      "A principal-value-first guide to inverse-trig domains, ranges, graphs, complementary identities, sums, and multiple-angle forms.",
    pdf: "/formula-sheets/inverse-trigonometric-functions.pdf",
    sections: [
      {
        title: "Principal-value branches",
        formulas: [
          {
            label: "arcsin x",
            formula: "Domain [−1, 1]; range [−π/2, π/2]; increasing",
          },
          { label: "arccos x", formula: "Domain [−1, 1]; range [0, π]; decreasing" },
          {
            label: "arctan x",
            formula: "Domain ℝ; range (−π/2, π/2); horizontal asymptotes ±π/2",
          },
          { label: "arccot x", formula: "Domain ℝ; range (0, π); decreasing" },
          { label: "arcsec x", formula: "Domain |x| ≥ 1; range [0, π/2) ∪ (π/2, π]" },
          {
            label: "arccosec x",
            formula: "Domain |x| ≥ 1; range [−π/2, 0) ∪ (0, π/2]",
          },
        ],
        callout:
          "sin⁻¹x means arcsin(x), not cosec(x). Before simplifying sin⁻¹(sin θ), move the result into the principal range.",
      },
      {
        title: "Negative arguments & complementary pairs",
        formulas: [
          {
            label: "Odd inverse functions",
            formula: "sin⁻¹(−x) = −sin⁻¹x;  tan⁻¹(−x) = −tan⁻¹x",
          },
          {
            label: "π-shift identities",
            formula: "cos⁻¹(−x) = π − cos⁻¹x;  cot⁻¹(−x) = π − cot⁻¹x",
          },
          { label: "Sine / cosine pair", formula: "sin⁻¹x + cos⁻¹x = π/2,  |x| ≤ 1" },
          { label: "Tangent / cotangent pair", formula: "tan⁻¹x + cot⁻¹x = π/2" },
          {
            label: "Secant / cosecant pair",
            formula: "sec⁻¹x + cosec⁻¹x = π/2,  |x| ≥ 1",
          },
          {
            label: "Reciprocal argument",
            formula: "sec⁻¹x = cos⁻¹(1/x);  cosec⁻¹x = sin⁻¹(1/x)",
          },
        ],
      },
      {
        title: "Sum, difference & multiple-angle identities",
        formulas: [
          {
            label: "arctan sum",
            formula:
              "tan⁻¹x + tan⁻¹y = tan⁻¹[(x + y)/(1 − xy)] (adjust by π as needed)",
          },
          {
            label: "arctan difference",
            formula:
              "tan⁻¹x − tan⁻¹y = tan⁻¹[(x − y)/(1 + xy)] (respect principal values)",
          },
          {
            label: "arcsin sum",
            formula:
              "sin⁻¹x + sin⁻¹y = sin⁻¹[x√(1 − y²) + y√(1 − x²)] (within principal range)",
          },
          {
            label: "Double arctan",
            formula: "2tan⁻¹x = tan⁻¹[2x/(1 − x²)] (with branch adjustment)",
          },
          {
            label: "Double-angle sine form",
            formula: "2tan⁻¹x = sin⁻¹[2x/(1 + x²)],  |x| ≤ 1",
          },
          { label: "Triple-angle sine", formula: "sin(3θ) = 3sin θ − 4sin³θ" },
          { label: "Triple-angle cosine", formula: "cos(3θ) = 4cos³θ − 3cos θ" },
        ],
        callout:
          "For inverse-trig sum identities, verify the principal range; the tangent formula may require adding or subtracting π.",
      },
    ],
  },
  {
    slug: "kinematics",
    title: "Kinematics",
    subject: "Mathematics",
    subtitle: "Straight-line motion, acceleration, gravity & graphs",
    summary:
      "Keep distance versus displacement, speed versus velocity, constant acceleration, vertical motion, calculus, and motion graphs straight.",
    pdf: "/formula-sheets/kinematics.pdf",
    sections: [
      {
        title: "Position, distance & rates",
        formulas: [
          { label: "Displacement", formula: "Δx = x(t₂) − x(t₁)" },
          { label: "Average velocity", formula: "v_avg = Δx/Δt" },
          { label: "Average speed", formula: "Total distance/Δt" },
          { label: "Instantaneous velocity", formula: "v = dx/dt" },
          { label: "Speed", formula: "|v|" },
          { label: "Acceleration", formula: "a = dv/dt = d²x/dt² = v(dv/dx)" },
          {
            label: "Speed conversion",
            formula: "1 km/h = 5/18 m/s;  1 m/s = 3.6 km/h",
          },
        ],
        callout:
          "If velocity changes sign, find where v(t) = 0 and add the absolute displacements on each interval to get total distance.",
      },
      {
        title: "Constant acceleration & gravity",
        formulas: [
          { label: "Velocity-time", formula: "v = u + at" },
          { label: "Displacement-time", formula: "s = ut + ½at²" },
          { label: "Velocity-displacement", formula: "v² = u² + 2as" },
          { label: "Average-velocity displacement", formula: "s = [(u + v)/2]t" },
          { label: "Upward motion", formula: "a = −g;  v = u − gt;  s = ut − ½gt²" },
          {
            label: "At the highest point",
            formula: "v = 0;  t_up = u/g;  H_max = u²/(2g)",
          },
          { label: "Return to launch level", formula: "Total flight time = 2u/g" },
        ],
      },
      {
        title: "Variable acceleration & motion graphs",
        formulas: [
          { label: "Integrate acceleration", formula: "v(t) = ∫a(t)dt + C₁" },
          { label: "Integrate velocity", formula: "x(t) = ∫v(t)dt + C₂" },
          { label: "Position-time graph slope", formula: "dx/dt = v" },
          { label: "Velocity-time graph slope", formula: "dv/dt = a" },
          { label: "Velocity-time signed area", formula: "Displacement = A₁ − A₂" },
          { label: "Velocity-time total area", formula: "Distance = A₁ + A₂" },
        ],
        callout:
          "Area below the time axis is negative for displacement, but contributes positively to total distance.",
      },
    ],
  },
  {
    slug: "solution-of-trigonometric-equations",
    title: "Solution of Trigonometric Equations",
    subject: "Mathematics",
    subtitle: "General solutions, auxiliary angles & applied problems",
    summary:
      "Find principal and general solutions, count roots on intervals, solve a cos x + b sin x equations, and avoid losing roots.",
    pdf: "/formula-sheets/solution-of-trigonometric-equations.pdf",
    sections: [
      {
        title: "Principal & general solutions",
        formulas: [
          { label: "Sine equation", formula: "sin x = sin α  →  x = nπ + (−1)ⁿα" },
          { label: "Cosine equation", formula: "cos x = cos α  →  x = 2nπ ± α" },
          { label: "Tangent equation", formula: "tan x = tan α  →  x = nπ + α" },
          {
            label: "Zeros",
            formula: "sin x = 0, tan x = 0: x = nπ;  cos x = 0: x = (2n + 1)π/2",
          },
          {
            label: "Squared trig equation",
            formula: "sin²x = sin²α (or cos²/tan²)  →  x = nπ ± α",
          },
          {
            label: "Integer parameter",
            formula: "n ∈ ℤ; retain only values in the requested interval",
          },
        ],
        callout:
          "Never divide by sin x, cos x, or another variable trig expression without checking when it equals zero; those values may be solutions.",
      },
      {
        title: "Auxiliary-angle form",
        formulas: [
          { label: "Amplitude", formula: "R = √(a² + b²)" },
          { label: "Cosine form", formula: "a cos θ + b sin θ = R cos(θ − φ)" },
          { label: "Choose φ", formula: "cos φ = a/R;  sin φ = b/R" },
          {
            label: "Solve equals c",
            formula: "R cos(θ − φ) = c; real solutions iff |c| ≤ R",
          },
          { label: "Range", formula: "a cos θ + b sin θ ∈ [−R, R]" },
        ],
      },
      {
        title: "Identities & applied problems",
        formulas: [
          {
            label: "Sine sum",
            formula: "sin A + sin B = 2sin[(A + B)/2]cos[(A − B)/2]",
          },
          {
            label: "Cosine sum",
            formula: "cos A + cos B = 2cos[(A + B)/2]cos[(A − B)/2]",
          },
          {
            label: "Double angle",
            formula: "sin 2θ = 2sin θ cos θ;  cos 2θ = 1 − 2sin²θ",
          },
          { label: "Tangent double angle", formula: "tan 2θ = 2tan θ/(1 − tan²θ)" },
          { label: "Elevation / depression", formula: "tan θ = height/distance" },
          { label: "Work by a constant force", formula: "W = Fd cos θ" },
          {
            label: "Graphical solutions",
            formula: "Roots of f(x) = g(x) are x-coordinates of graph intersections",
          },
        ],
        callout:
          "For 3cos x + 4sin x, R = √(3² + 4²) = 5, so the expression stays between −5 and 5.",
      },
    ],
  },
  {
    slug: "vector-valued-functions",
    title: "Vector-Valued Functions & Their Differentiations",
    subject: "Mathematics",
    subtitle: "Domains, vector derivatives & motion in space",
    summary:
      "A visual reference for vector-function domains, componentwise derivatives, dot/cross product rules, tangent directions, velocity, speed, and acceleration.",
    pdf: "/formula-sheets/vector-valued-functions.pdf",
    sections: [
      {
        title: "Vector functions, domains & limits",
        formulas: [
          { label: "Vector-valued function", formula: "r(t) = ⟨f(t), g(t), h(t)⟩" },
          { label: "Domain", formula: "Domain(r) = Domain(f) ∩ Domain(g) ∩ Domain(h)" },
          { label: "Limit", formula: "lim r(t) = ⟨lim f(t), lim g(t), lim h(t)⟩" },
          {
            label: "Continuity",
            formula: "r is continuous at a when limₜ→ₐ r(t) = r(a)",
          },
          {
            label: "Constant-length property",
            formula: "If r·r = constant, then r·r′ = 0",
          },
        ],
        callout:
          "Use the intersection—not the union—of the component domains. Every component must be defined at the same parameter value.",
      },
      {
        title: "Vector differentiation rules",
        formulas: [
          {
            label: "Componentwise derivative",
            formula: "r′(t) = ⟨x′(t), y′(t), z′(t)⟩",
          },
          { label: "Second derivative", formula: "r″(t) = ⟨x″(t), y″(t), z″(t)⟩" },
          { label: "Sum / difference", formula: "(u ± v)′ = u′ ± v′" },
          { label: "Scalar multiple", formula: "(cu)′ = cu′" },
          { label: "Scalar function product", formula: "(fu)′ = f′u + fu′" },
          { label: "Dot product", formula: "(u·v)′ = u′·v + u·v′" },
          { label: "Cross product", formula: "(u×v)′ = u′×v + u×v′" },
          { label: "Chain rule", formula: "d[r(s(t))]/dt = r′(s(t))s′(t)" },
        ],
        callout: "Cross-product order matters: keep u′×v first and u×v′ second.",
      },
      {
        title: "Tangent direction & motion",
        formulas: [
          { label: "Tangent vector", formula: "r′(t)" },
          { label: "Unit tangent", formula: "T(t) = r′(t)/‖r′(t)‖" },
          { label: "Velocity", formula: "v(t) = r′(t)" },
          { label: "Speed", formula: "‖v(t)‖ = √[(x′)² + (y′)² + (z′)²]" },
          { label: "Acceleration", formula: "a(t) = v′(t) = r″(t)" },
          {
            label: "Acceleration magnitude",
            formula: "‖a(t)‖ = √[(x″)² + (y″)² + (z″)²]",
          },
        ],
        callout:
          "Direction of motion is the unit vector v/‖v‖. Speed is the scalar magnitude ‖v‖, not the velocity vector.",
      },
    ],
  },
];
