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
  {
    slug: "complex-numbers",
    title: "Complex Numbers",
    subject: "Mathematics",
    subtitle: "Imaginary unit, algebra, modulus, argument, and polar form",
    summary:
      "A topic-first guide to powers of i, complex arithmetic, conjugates, modulus, polar form, and De Moivre’s theorem.",
    pdf: "/formula-sheets/complex-numbers.pdf",
    sections: [
      {
        title: "Imaginary unit & standard form",
        formulas: [
          { label: "Imaginary unit", formula: "i² = −1;  i = √−1" },
          {
            label: "Standard form",
            formula: "z = a + ib,  a, b ∈ ℝ",
            note: "The real part is Re(z) = a; the imaginary part is Im(z) = b.",
          },
          {
            label: "Powers of i",
            formula: "i⁰ = 1,  i¹ = i,  i² = −1,  i³ = −i;  i⁴ = 1",
            note: "The powers repeat every four; reduce the exponent modulo 4.",
          },
          {
            label: "Equality",
            formula: "a + ib = c + id  ⇔  a = c and b = d",
          },
        ],
      },
      {
        title: "Operations & conjugates",
        formulas: [
          {
            label: "Addition / subtraction",
            formula: "(a + ib) ± (c + id) = (a ± c) + i(b ± d)",
          },
          {
            label: "Multiplication",
            formula: "(a + ib)(c + id) = (ac − bd) + i(ad + bc)",
          },
          { label: "Conjugate", formula: "If z = a + ib, then z̄ = a − ib" },
          { label: "Conjugate product", formula: "z z̄ = a² + b² = |z|²" },
          {
            label: "Division",
            formula: "(a + ib)/(c + id) = [(ac + bd) + i(bc − ad)]/(c² + d²)",
            note: "Multiply numerator and denominator by the denominator’s conjugate; c + id ≠ 0.",
          },
        ],
      },
      {
        title: "Modulus, polar form & powers",
        formulas: [
          { label: "Modulus", formula: "|z| = √(a² + b²)" },
          {
            label: "Argument",
            formula: "θ = arg(z),  tan θ = b/a  (choose the correct quadrant)",
          },
          { label: "Polar form", formula: "z = r(cos θ + i sin θ),  r = |z|" },
          {
            label: "De Moivre’s theorem",
            formula: "[r(cos θ + i sin θ)]ⁿ = rⁿ[cos(nθ) + i sin(nθ)]",
          },
          {
            label: "n-th roots",
            formula:
              "zₖ = r¹⁄ⁿ[cos((θ + 2kπ)/n) + i sin((θ + 2kπ)/n)],  k = 0, …, n − 1",
          },
        ],
        callout:
          "Use radians for arguments in polar-form identities. When finding arg(z), locate the point (a, b) first so the angle is in the correct quadrant.",
      },
    ],
  },
  {
    slug: "differentiation",
    title: "Differentiation",
    subject: "Mathematics",
    subtitle: "Derivative rules, standard derivatives, and curve applications",
    summary:
      "A well-ordered reference from the definition of a derivative through standard rules, implicit differentiation, and tangent or normal equations.",
    pdf: "/formula-sheets/differentiation.pdf",
    sections: [
      {
        title: "Meaning & basic rules",
        formulas: [
          { label: "First principle", formula: "f′(x) = limₕ→₀ [f(x + h) − f(x)]/h" },
          { label: "Constant", formula: "d(c)/dx = 0" },
          { label: "Power rule", formula: "d(xⁿ)/dx = nxⁿ⁻¹" },
          { label: "Constant multiple", formula: "d[cf(x)]/dx = cf′(x)" },
          { label: "Sum / difference", formula: "(f ± g)′ = f′ ± g′" },
        ],
      },
      {
        title: "Product, quotient & chain rules",
        formulas: [
          { label: "Product rule", formula: "(uv)′ = u′v + uv′" },
          { label: "Quotient rule", formula: "(u/v)′ = (u′v − uv′)/v²,  v ≠ 0" },
          { label: "Chain rule", formula: "d[f(g(x))]/dx = f′(g(x))g′(x)" },
          {
            label: "Implicit differentiation",
            formula: "Differentiate both sides with respect to x; treat y as y(x)",
          },
          {
            label: "Parametric derivative",
            formula: "dy/dx = (dy/dt)/(dx/dt),  dx/dt ≠ 0",
          },
        ],
      },
      {
        title: "Standard derivatives & curve geometry",
        formulas: [
          {
            label: "Trigonometric",
            formula: "(sin x)′ = cos x;  (cos x)′ = −sin x;  (tan x)′ = sec²x",
          },
          {
            label: "Exponential / logarithmic",
            formula: "(eˣ)′ = eˣ;  (aˣ)′ = aˣ ln a (a > 0);  (ln x)′ = 1/x",
          },
          {
            label: "Inverse trigonometric",
            formula: "(sin⁻¹x)′ = 1/√(1 − x²), |x| < 1;  (tan⁻¹x)′ = 1/(1 + x²)",
          },
          { label: "Tangent at (x₁, y₁)", formula: "y − y₁ = f′(x₁)(x − x₁)" },
          {
            label: "Normal at (x₁, y₁)",
            formula: "y − y₁ = −[1/f′(x₁)](x − x₁),  f′(x₁) ≠ 0",
          },
        ],
        callout:
          "Trigonometric derivative formulae assume angles are measured in radians. For a normal, handle a horizontal tangent separately: its normal is vertical.",
      },
    ],
  },
  {
    slug: "division-of-polynomials",
    title: "Division of Polynomials",
    subject: "Mathematics",
    subtitle: "Division algorithm, remainder theorem, and factor tests",
    summary:
      "A step-by-step order for polynomial division, checking remainders, identifying factors, and testing possible rational roots.",
    pdf: "/formula-sheets/division-of-polynomials.pdf",
    sections: [
      {
        title: "Polynomial division algorithm",
        formulas: [
          { label: "Division identity", formula: "P(x) = D(x)Q(x) + R(x)" },
          {
            label: "Remainder condition",
            formula: "R(x) = 0 or deg R < deg D",
            note: "For division by a non-zero constant, the remainder is zero.",
          },
          {
            label: "Quotient and remainder",
            formula: "Q(x) = quotient;  R(x) = remainder",
          },
          {
            label: "Leading-term step",
            formula:
              "Divide the leading term of the current dividend by the leading term of D(x)",
            note: "Multiply back, subtract, and repeat until the remainder has lower degree than the divisor.",
          },
        ],
      },
      {
        title: "Remainder & factor theorems",
        formulas: [
          {
            label: "Remainder theorem",
            formula: "Remainder on division by (x − a) is P(a)",
          },
          {
            label: "Factor theorem",
            formula: "(x − a) is a factor of P(x)  ⇔  P(a) = 0",
          },
          { label: "Linear divisor", formula: "P(x) = (x − a)Q(x) + P(a)" },
          {
            label: "Repeated factor",
            formula:
              "(x − a)ᵐ divides P(x) when a is a root of multiplicity at least m",
          },
        ],
      },
      {
        title: "Synthetic division & rational roots",
        formulas: [
          {
            label: "Synthetic divisor",
            formula: "For divisor (x − a), use the number a in synthetic division",
          },
          {
            label: "Rational root candidates",
            formula:
              "If p/q is a reduced rational root, p divides the constant term and q divides the leading coefficient",
          },
          {
            label: "Factor a polynomial",
            formula: "Find a root a; divide by (x − a); repeat on the quotient",
          },
        ],
        callout:
          "Always verify the final result by checking P(x) = D(x)Q(x) + R(x). The remainder must have lower degree than the divisor.",
      },
    ],
  },
  {
    slug: "functions-and-graphs",
    title: "Functions and Graphs",
    subject: "Mathematics",
    subtitle: "Domains, transformations, standard graphs, and inverses",
    summary:
      "A clear order for reading function notation, finding domains and ranges, transforming graphs, and working with inverse and composite functions.",
    pdf: "/formula-sheets/functions-and-graphs.pdf",
    sections: [
      {
        title: "Function notation, domain & range",
        formulas: [
          { label: "Function value", formula: "y = f(x)" },
          { label: "Composite function", formula: "(f ∘ g)(x) = f(g(x))" },
          { label: "Inverse function", formula: "f⁻¹(f(x)) = x;  f(f⁻¹(x)) = x" },
          { label: "Domain of a quotient", formula: "For f(x)/g(x), require g(x) ≠ 0" },
          { label: "Even / odd", formula: "Even: f(−x) = f(x);  odd: f(−x) = −f(x)" },
        ],
      },
      {
        title: "Graph transformations",
        formulas: [
          {
            label: "Vertical translation",
            formula: "y = f(x) + k  shifts the graph k units up",
          },
          {
            label: "Horizontal translation",
            formula: "y = f(x − h)  shifts the graph h units right",
          },
          { label: "Reflection in x-axis", formula: "y = −f(x)" },
          { label: "Reflection in y-axis", formula: "y = f(−x)" },
          { label: "Vertical / horizontal scale", formula: "y = af(x);  y = f(bx)" },
        ],
      },
      {
        title: "Standard graphs & inverse checks",
        formulas: [
          { label: "Linear function", formula: "y = mx + c" },
          {
            label: "Quadratic vertex form",
            formula: "y = a(x − h)² + k;  vertex = (h, k)",
          },
          {
            label: "Exponential / logarithmic inverse pair",
            formula: "y = aˣ  ⇔  x = logₐ y,  a > 0, a ≠ 1",
          },
          {
            label: "Inverse graph",
            formula: "The graphs of y = f(x) and y = f⁻¹(x) reflect across y = x",
          },
        ],
        callout:
          "To find an inverse, interchange x and y, then solve for y. The original function must be one-to-one on its domain.",
      },
    ],
  },
  {
    slug: "limit-and-continuity",
    title: "Limit and Continuity",
    subject: "Mathematics",
    subtitle: "Limit laws, standard limits, one-sided limits, and continuity",
    summary:
      "A progression from limit laws and standard forms to one-sided limits, continuity tests, and limits at infinity.",
    pdf: "/formula-sheets/limit-and-continuity.pdf",
    sections: [
      {
        title: "Limit laws & standard limits",
        formulas: [
          {
            label: "Sum / product / quotient",
            formula: "lim(f ± g) = L ± M;  lim(fg) = LM;  lim(f/g) = L/M,  M ≠ 0",
          },
          {
            label: "Algebraic standard limit",
            formula: "limₓ→ₐ (xⁿ − aⁿ)/(x − a) = n aⁿ⁻¹",
          },
          {
            label: "Trigonometric standard limits",
            formula: "limₓ→₀ (sin x)/x = 1;  limₓ→₀ (1 − cos x)/x² = 1/2",
          },
          { label: "Exponential standard limit", formula: "limₓ→₀ (eˣ − 1)/x = 1" },
          { label: "Logarithmic standard limit", formula: "limₓ→₀ ln(1 + x)/x = 1" },
        ],
        callout:
          "Use radians in trigonometric limits. For an indeterminate 0/0 form, factor, simplify, or rationalize before substituting.",
      },
      {
        title: "One-sided limits & continuity",
        formulas: [
          {
            label: "Two-sided limit exists",
            formula: "limₓ→ₐ f(x) exists  ⇔  limₓ→ₐ⁻ f(x) = limₓ→ₐ⁺ f(x)",
          },
          {
            label: "Continuity at a",
            formula: "f is continuous at a  ⇔  f(a) exists and limₓ→ₐ f(x) = f(a)",
          },
          {
            label: "Piecewise continuity",
            formula: "Match the left-hand limit, right-hand limit, and f(a)",
          },
          {
            label: "Polynomial / rational functions",
            formula:
              "Polynomials are continuous everywhere; rational functions where the denominator is non-zero",
          },
        ],
      },
      {
        title: "Limits at infinity",
        formulas: [
          {
            label: "Rational-function degree test",
            formula:
              "deg P < deg Q: limit 0;  deg P = deg Q: ratio of leading coefficients",
          },
          {
            label: "Higher numerator degree",
            formula:
              "If deg P > deg Q, the limit is unbounded; determine its sign from leading terms",
          },
          {
            label: "Squeeze theorem",
            formula: "If g(x) ≤ f(x) ≤ h(x) and lim g = lim h = L, then lim f = L",
          },
        ],
        callout: "For a square root, √(x²) = |x|, not always x. As x → −∞, |x| = −x.",
      },
    ],
  },
  {
    slug: "mathematical-induction-and-binomial-theorem",
    title: "Mathematical Induction and Binomial Theorem",
    subject: "Mathematics",
    subtitle: "Proof by induction, binomial coefficients, and expansions",
    summary:
      "A study sequence from the base case and inductive step to binomial expansion, general terms, and coefficient shortcuts.",
    pdf: "/formula-sheets/mathematical-induction-and-binomial-theorem.pdf",
    sections: [
      {
        title: "Proof by mathematical induction",
        formulas: [
          { label: "Base case", formula: "Verify P(1) (or the stated first integer)" },
          {
            label: "Inductive hypothesis",
            formula: "Assume P(k) is true for an arbitrary k ≥ 1",
          },
          { label: "Inductive step", formula: "Use P(k) to prove P(k + 1)" },
          {
            label: "Conclusion",
            formula: "Therefore P(n) holds for every integer n ≥ 1",
          },
        ],
        callout:
          "The inductive hypothesis is an assumption for one arbitrary k; the proof must explicitly establish the next case.",
      },
      {
        title: "Binomial coefficients & theorem",
        formulas: [
          { label: "Factorial", formula: "n! = n(n − 1)…2·1;  0! = 1" },
          { label: "Combination", formula: "ⁿCᵣ = n!/[r!(n − r)!]" },
          { label: "Symmetry", formula: "ⁿCᵣ = ⁿCₙ₋ᵣ" },
          { label: "Binomial theorem", formula: "(a + b)ⁿ = ∑ᵣ₌₀ⁿ ⁿCᵣ aⁿ⁻ʳbʳ" },
          { label: "General term", formula: "Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳbʳ,  r = 0, 1, …, n" },
        ],
      },
      {
        title: "Coefficient & term shortcuts",
        formulas: [
          {
            label: "Sum of coefficients",
            formula: "Set a = 1 and b = 1:  (1 + 1)ⁿ = 2ⁿ",
          },
          {
            label: "Alternating coefficients",
            formula: "Set a = 1 and b = −1:  (1 − 1)ⁿ = 0,  n > 0",
          },
          {
            label: "Middle term(s)",
            formula: "n even: one middle term Tₙ/₂₊₁;  n odd: two middle terms",
          },
          { label: "Pascal relation", formula: "ⁿCᵣ = ⁿ⁻¹Cᵣ₋₁ + ⁿ⁻¹Cᵣ" },
        ],
        callout:
          "In Tᵣ₊₁, the index r starts at 0. The coefficient of a particular power is found by matching exponents in the general term.",
      },
    ],
  },
  {
    slug: "matrices-and-determinants",
    title: "Matrices and Determinants",
    subject: "Mathematics",
    subtitle: "Matrix operations, determinants, inverses, and linear systems",
    summary:
      "A predictable order for matrix notation and operations, determinant evaluation, inverse matrices, and solving two-variable systems.",
    pdf: "/formula-sheets/matrices-and-determinants.pdf",
    sections: [
      {
        title: "Matrix operations",
        formulas: [
          {
            label: "Matrix order",
            formula: "An m × n matrix has m rows and n columns",
          },
          {
            label: "Addition / subtraction",
            formula: "A ± B is defined only when A and B have the same order",
          },
          { label: "Scalar multiplication", formula: "kA = [kaᵢⱼ]" },
          {
            label: "Matrix product",
            formula: "If A is m × n and B is n × p, then AB is m × p",
          },
          {
            label: "Identity matrix",
            formula: "AI = IA = A (when the matrix orders match)",
          },
          { label: "Transpose", formula: "(Aᵀ)ᵀ = A;  (AB)ᵀ = BᵀAᵀ" },
        ],
      },
      {
        title: "Determinants & inverses",
        formulas: [
          { label: "2 × 2 determinant", formula: "det A = ad − bc,  A = [a b; c d]" },
          {
            label: "2 × 2 inverse",
            formula: "A⁻¹ = (1/(ad − bc))[d −b; −c a],  ad − bc ≠ 0",
          },
          { label: "Inverse criterion", formula: "A⁻¹ exists  ⇔  det(A) ≠ 0" },
          { label: "Adjugate formula", formula: "A⁻¹ = adj(A)/det(A),  det(A) ≠ 0" },
          { label: "Determinant of a product", formula: "det(AB) = det(A)det(B)" },
        ],
      },
      {
        title: "Linear systems & determinant properties",
        formulas: [
          { label: "Cramer’s rule", formula: "x = Dₓ/D,  y = Dᵧ/D,  D ≠ 0" },
          {
            label: "Row swap",
            formula: "Interchanging two rows changes the sign of a determinant",
          },
          {
            label: "Equal / proportional rows",
            formula: "If two rows are equal or proportional, det(A) = 0",
          },
          {
            label: "Triangular matrix",
            formula:
              "For a triangular matrix, det(A) is the product of its diagonal entries",
          },
        ],
        callout:
          "Matrix multiplication is generally not commutative: AB need not equal BA. Check dimensions before multiplying.",
      },
    ],
  },
  {
    slug: "permutations-and-combinations",
    title: "Permutations and Combinations",
    subject: "Mathematics",
    subtitle: "Counting arrangements, selections, and repeated objects",
    summary:
      "A quick decision guide: use permutations when order matters and combinations when only the selected group matters.",
    pdf: "/formula-sheets/permutations-and-combinations.pdf",
    sections: [
      {
        title: "Factorials & basic counting",
        formulas: [
          { label: "Factorial", formula: "n! = n(n − 1)…2·1;  0! = 1" },
          {
            label: "Product rule",
            formula: "If successive choices have m and n options, total choices = mn",
          },
          {
            label: "Complement counting",
            formula: "Count wanted outcomes = total outcomes − unwanted outcomes",
          },
        ],
      },
      {
        title: "Permutations: order matters",
        formulas: [
          { label: "Arrange r from n distinct objects", formula: "ⁿPᵣ = n!/(n − r)!" },
          { label: "Arrange all n distinct objects", formula: "n!" },
          { label: "With repeated objects", formula: "n!/(n₁!n₂!…nₖ!)" },
          {
            label: "Circular arrangements",
            formula: "(n − 1)! for n distinct objects around a circle",
          },
          {
            label: "Repetition allowed",
            formula: "nʳ ordered strings of length r from n choices",
          },
        ],
      },
      {
        title: "Combinations: order does not matter",
        formulas: [
          { label: "Choose r from n", formula: "ⁿCᵣ = n!/[r!(n − r)!]" },
          { label: "Permutation–combination relation", formula: "ⁿPᵣ = ⁿCᵣ · r!" },
          { label: "Symmetry", formula: "ⁿCᵣ = ⁿCₙ₋ᵣ" },
          { label: "Pascal relation", formula: "ⁿCᵣ = ⁿ⁻¹Cᵣ₋₁ + ⁿ⁻¹Cᵣ" },
          {
            label: "Choose with repetition",
            formula: "ⁿ⁺ʳ⁻¹Cᵣ (non-negative selections of r items from n types)",
          },
        ],
        callout:
          "Decide whether changing the order creates a different outcome before choosing nPᵣ or nCᵣ.",
      },
    ],
  },
  {
    slug: "sequences-and-series",
    title: "Sequences and Series",
    subject: "Mathematics",
    subtitle: "Arithmetic, geometric, and harmonic progressions; sums and means",
    summary:
      "A topic-first reference to progressions, finite and infinite sums, harmonic means, and standard power-sum formulae.",
    pdf: "/formula-sheets/sequences-and-series.pdf",
    sections: [
      {
        title: "Arithmetic progression (A.P.)",
        formulas: [
          { label: "Common difference", formula: "d = aₙ − aₙ₋₁" },
          { label: "n-th term", formula: "aₙ = a₁ + (n − 1)d" },
          {
            label: "Sum of first n terms",
            formula: "Sₙ = n/2 [2a₁ + (n − 1)d] = n/2 (a₁ + aₙ)",
          },
          { label: "Arithmetic mean", formula: "A = (a + b)/2" },
        ],
      },
      {
        title: "Geometric & harmonic progressions",
        formulas: [
          { label: "G.P. n-th term", formula: "aₙ = a₁rⁿ⁻¹" },
          { label: "Finite G.P. sum", formula: "Sₙ = a₁(1 − rⁿ)/(1 − r),  r ≠ 1" },
          { label: "Infinite G.P. sum", formula: "S∞ = a₁/(1 − r),  |r| < 1" },
          { label: "Geometric mean", formula: "G = √(ab) for a, b > 0" },
          { label: "Harmonic mean", formula: "H = 2ab/(a + b),  a + b ≠ 0" },
          {
            label: "Harmonic progression",
            formula: "a₁, a₂, … is an H.P. when 1/a₁, 1/a₂, … is an A.P.",
          },
        ],
      },
      {
        title: "Means & power sums",
        formulas: [
          {
            label: "A.M.–G.M.–H.M. relation",
            formula: "A ≥ G ≥ H for positive numbers;  G² = AH",
          },
          { label: "Sum of first n integers", formula: "∑ₖ₌₁ⁿ k = n(n + 1)/2" },
          { label: "Sum of squares", formula: "∑ₖ₌₁ⁿ k² = n(n + 1)(2n + 1)/6" },
          { label: "Sum of cubes", formula: "∑ₖ₌₁ⁿ k³ = [n(n + 1)/2]²" },
        ],
        callout:
          "The infinite geometric-series formula is valid only when |r| < 1. For a finite G.P. with r = 1, Sₙ = na₁.",
      },
    ],
  },
  {
    slug: "theory-of-quadratic-functions",
    title: "Theory of Quadratic Functions",
    subject: "Mathematics",
    subtitle: "Roots, discriminant, vertex, and graph behaviour",
    summary:
      "A step-by-step quadratic reference: standard and vertex forms, roots, discriminant, axis of symmetry, and maximum or minimum values.",
    pdf: "/formula-sheets/theory-of-quadratic-functions.pdf",
    sections: [
      {
        title: "Forms & roots",
        formulas: [
          { label: "Standard form", formula: "f(x) = ax² + bx + c,  a ≠ 0" },
          { label: "Quadratic formula", formula: "x = [−b ± √(b² − 4ac)]/(2a)" },
          { label: "Discriminant", formula: "Δ = b² − 4ac" },
          { label: "Sum and product of roots", formula: "α + β = −b/a;  αβ = c/a" },
          { label: "Factor form", formula: "f(x) = a(x − α)(x − β)" },
        ],
      },
      {
        title: "Vertex & axis of symmetry",
        formulas: [
          { label: "Axis of symmetry", formula: "x = −b/(2a)" },
          { label: "Vertex", formula: "V = (−b/(2a), −Δ/(4a))" },
          { label: "Vertex form", formula: "f(x) = a(x − h)² + k;  vertex = (h, k)" },
          {
            label: "Maximum / minimum",
            formula: "a > 0: minimum at vertex;  a < 0: maximum at vertex",
          },
        ],
      },
      {
        title: "Roots & graph classification",
        formulas: [
          { label: "Two distinct real roots", formula: "Δ > 0" },
          { label: "One repeated real root", formula: "Δ = 0" },
          { label: "No real roots", formula: "Δ < 0" },
          { label: "y-intercept", formula: "f(0) = c" },
          {
            label: "Sign of the parabola",
            formula: "The graph opens upward if a > 0 and downward if a < 0",
          },
        ],
        callout:
          "The vertex’s x-coordinate is −b/(2a); the vertex’s y-coordinate is the function value there, −Δ/(4a).",
      },
    ],
  },
  {
    slug: "trigonometric-functions-and-their-graphs",
    title: "Trigonometric Functions and Their Graphs",
    subject: "Mathematics",
    subtitle: "Radians, values, domains, ranges, and periodic graphs",
    summary:
      "A logical progression from angle measure and unit-circle values to the domains, ranges, periods, and transformed trigonometric graphs.",
    pdf: "/formula-sheets/trigonometric-functions-and-their-graphs.pdf",
    sections: [
      {
        title: "Angle measure & standard values",
        formulas: [
          {
            label: "Degree–radian conversion",
            formula: "180° = π radians;  θ° = θπ/180 radians",
          },
          { label: "Arc length", formula: "s = rθ,  θ in radians" },
          { label: "Sector area", formula: "A = ½r²θ,  θ in radians" },
          { label: "Core identity", formula: "sin²x + cos²x = 1" },
        ],
      },
      {
        title: "Domains, ranges & periods",
        formulas: [
          {
            label: "Sine / cosine",
            formula: "Domain: ℝ;  range: [−1, 1];  period: 2π",
          },
          {
            label: "Tangent",
            formula: "tan x = sin x/cos x;  period: π;  x ≠ π/2 + kπ",
          },
          { label: "Secant / cosecant", formula: "sec x = 1/cos x;  csc x = 1/sin x" },
          { label: "Cotangent", formula: "cot x = cos x/sin x;  period: π;  x ≠ kπ" },
        ],
      },
      {
        title: "Graph transformations",
        formulas: [
          {
            label: "Amplitude and period",
            formula: "y = A sin(Bx): amplitude = |A|;  period = 2π/|B|",
          },
          {
            label: "Cosine graph",
            formula: "y = A cos(Bx): amplitude = |A|;  period = 2π/|B|",
          },
          { label: "Tangent graph", formula: "y = A tan(Bx): period = π/|B|" },
          {
            label: "Vertical shift",
            formula: "y = f(x) + D shifts the graph D units vertically",
          },
        ],
        callout:
          "For tangent and reciprocal trigonometric graphs, mark where the denominator is zero before drawing asymptotes.",
      },
    ],
  },
  {
    slug: "trigonometric-identities",
    title: "Trigonometric Identities",
    subject: "Mathematics",
    subtitle: "Reciprocal, quotient, Pythagorean, and angle identities",
    summary:
      "A carefully grouped identity reference, beginning with reciprocal and quotient relations before Pythagorean and angle-combination formulae.",
    pdf: "/formula-sheets/trigonometric-identities.pdf",
    sections: [
      {
        title: "Reciprocal & quotient identities",
        formulas: [
          {
            label: "Reciprocal identities",
            formula: "csc x = 1/sin x;  sec x = 1/cos x;  cot x = 1/tan x",
          },
          {
            label: "Quotient identities",
            formula: "tan x = sin x/cos x;  cot x = cos x/sin x",
          },
          {
            label: "Pythagorean identities",
            formula: "sin²x + cos²x = 1;  1 + tan²x = sec²x;  1 + cot²x = csc²x",
          },
        ],
      },
      {
        title: "Sum, difference & double-angle",
        formulas: [
          {
            label: "Sine sum / difference",
            formula: "sin(A ± B) = sin A cos B ± cos A sin B",
          },
          {
            label: "Cosine sum / difference",
            formula: "cos(A ± B) = cos A cos B ∓ sin A sin B",
          },
          {
            label: "Tangent sum",
            formula: "tan(A ± B) = (tan A ± tan B)/(1 ∓ tan A tan B)",
          },
          {
            label: "Double angle",
            formula: "sin 2A = 2 sin A cos A;  cos 2A = cos²A − sin²A",
          },
          {
            label: "Equivalent cosine forms",
            formula: "cos 2A = 1 − 2 sin²A = 2 cos²A − 1",
          },
        ],
      },
      {
        title: "Half-angle & product conversions",
        formulas: [
          {
            label: "Half-angle squares",
            formula: "sin²(A/2) = (1 − cos A)/2;  cos²(A/2) = (1 + cos A)/2",
          },
          {
            label: "Product-to-sum",
            formula: "2 sin A cos B = sin(A + B) + sin(A − B)",
          },
          {
            label: "Product-to-sum",
            formula: "2 cos A cos B = cos(A + B) + cos(A − B)",
          },
          {
            label: "Sum-to-product",
            formula: "sin A + sin B = 2 sin((A + B)/2) cos((A − B)/2)",
          },
        ],
        callout:
          "In cos(A ± B), the sign between the terms reverses: cos(A + B) uses a minus; cos(A − B) uses a plus.",
      },
    ],
  },
  {
    slug: "vectors-in-space",
    title: "Vectors in Space",
    subject: "Mathematics",
    subtitle: "Components, direction, dot and cross products, and 3D geometry",
    summary:
      "A clear sequence from 3D vector notation and magnitude to dot products, cross products, projections, and lines in space.",
    pdf: "/formula-sheets/vectors-in-space.pdf",
    sections: [
      {
        title: "Components & basic operations",
        formulas: [
          { label: "Component form", formula: "a = ⟨a₁, a₂, a₃⟩ = a₁i + a₂j + a₃k" },
          { label: "Magnitude", formula: "|a| = √(a₁² + a₂² + a₃²)" },
          { label: "Unit vector", formula: "â = a/|a|,  a ≠ 0" },
          {
            label: "Distance in space",
            formula: "d = √[(x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²]",
          },
          {
            label: "Vector operations",
            formula: "a ± b = ⟨a₁ ± b₁, a₂ ± b₂, a₃ ± b₃⟩",
          },
        ],
      },
      {
        title: "Dot product, angle & projection",
        formulas: [
          {
            label: "Dot product",
            formula: "a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ",
          },
          { label: "Perpendicular vectors", formula: "a ⟂ b  ⇔  a · b = 0" },
          { label: "Angle between vectors", formula: "cos θ = (a · b)/(|a||b|)" },
          { label: "Scalar projection of a on b", formula: "compᵦ a = (a · b)/|b|" },
          {
            label: "Vector projection of a on b",
            formula: "projᵦ a = [(a · b)/|b|²]b",
          },
        ],
      },
      {
        title: "Cross product & line equations",
        formulas: [
          { label: "Cross-product magnitude", formula: "|a × b| = |a||b| sin θ" },
          { label: "Parallel vectors", formula: "a ∥ b  ⇔  a × b = 0" },
          {
            label: "Area of a parallelogram",
            formula: "A = |a × b|;  triangle area = ½|a × b|",
          },
          { label: "Scalar triple product", formula: "a · (b × c) = det[a b c]" },
          { label: "Parallelepiped volume", formula: "V = |a · (b × c)|" },
          { label: "Vector line through r₀", formula: "r = r₀ + t v" },
          {
            label: "Symmetric line form",
            formula: "(x − x₀)/a = (y − y₀)/b = (z − z₀)/c",
          },
          { label: "Plane with normal n", formula: "n · (r − r₀) = 0" },
        ],
        callout:
          "The cross product depends on order: a × b = −(b × a). The result is perpendicular to both input vectors.",
      },
    ],
  },
];
