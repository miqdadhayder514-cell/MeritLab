import type {
  MeritFormulaComponent,
  VerifiedMeritFormula,
} from "./merit-calculator-engine";

export type PendingMeritFormula = {
  id: string;
  universityId: string;
  programId: string | "*";
  admissionCycle: string;
  components: MeritFormulaComponent[];
  officialRule: string;
  eligibilityNotes: string[];
  sourceUrl: string;
  sourceTitle: string;
  additionalSources?: { url: string; title: string }[];
  lastVerified: string;
  verificationStatus: "pending";
};

export type MeritFormulaRecord = VerifiedMeritFormula | PendingMeritFormula;

const pending = (
  id: string,
  universityId: string,
  admissionCycle: string,
  sourceUrl: string,
  sourceTitle: string,
  officialRule: string,
  additionalSources?: { url: string; title: string }[],
): PendingMeritFormula => ({
  id,
  universityId,
  programId: "*",
  admissionCycle,
  components: [],
  officialRule,
  eligibilityNotes: [],
  sourceUrl,
  sourceTitle,
  additionalSources,
  lastVerified: "2026-11-26",
  verificationStatus: "pending",
});

const source = {
  pmdc: "https://pmdc.pk/Documents/law/PM%26DC%20(ADMISSIONS,%20CURRICULUM%20AND%20CONDUCT)%20POLICY%20AND%20REGULATIONS%202026.pdf",
  nums: "https://numspak.edu.pk/news-detail/centralized-admissions-mbbs-bds-session-2026-27",
  kmu: "https://cas.kmu.edu.pk/index.php",
  uhsNews: "https://uhs.edu.pk/mdcatadmissionnews.php",
  uhsPaper: "https://uhs.edu.pk/images/A.pdf",
};

function formula(
  id: string,
  universityId: string,
  programId: string,
  admissionCycle: string,
  components: MeritFormulaComponent[],
  officialRule: string,
  eligibilityNotes: string[],
  sourceUrl: string,
  sourceTitle: string,
  additionalSources?: { url: string; title: string }[],
): VerifiedMeritFormula {
  return {
    id,
    universityId,
    programId,
    admissionCycle,
    components,
    officialRule,
    eligibilityNotes,
    sourceUrl,
    sourceTitle,
    additionalSources,
    lastVerified: "2026-11-26",
    verificationStatus: "verified",
  };
}

const pct = (field: MeritFormulaComponent["field"], label: string, weight: number) => ({
  field,
  label,
  weight,
});

export const verifiedMeritFormulas: VerifiedMeritFormula[] = [
  formula(
    "nust-net-engineering",
    "nust",
    "engineering",
    "Current official NET-based criteria; admission-cycle name is not stated on the criteria page",
    [
      pct("net", "NET (Engineering)", 75),
      pct("matric", "SSC / Matric", 10),
      {
        field: "hssc-complete",
        alternativeFields: ["hssc-part1"],
        label: "HSSC / FSc (Part-I or complete, as applicable)",
        weight: 15,
      },
    ],
    "Aggregate = NET 75% + SSC/O Level/equivalent 10% + HSSC 15%. Use the relevant NET paper; the best NET score is selected where multiple attempts are taken.",
    [
      "The official criteria page was modified 10 September 2026 but does not state an admission-cycle label.",
      "The HSSC component may use Part-I or complete HSSC as applicable. This calculator uses the official published score supplied in the HSSC input selected by the applicant; confirm your result-stage treatment with NUST.",
      "The cited criteria page does not specify a NET maximum score. Enter the obtained and total marks shown by the official score report.",
      "A-Level/equivalent and DAE rules are special cases and are not calculated by this Matric/FSc calculator.",
    ],
    "https://nust.edu.pk/admissions/undergraduates/merit-criteria-for-admission-on-net-basis/",
    "NUST — Merit Generation Criteria for Admission on NET Basis",
    [
      {
        url: "https://ugadmissions.nust.edu.pk/",
        title: "NUST Undergraduate Admissions / NET portal",
      },
    ],
  ),
  formula(
    "nust-net-computing",
    "nust",
    "computing",
    "Current official NET-based criteria; admission-cycle name is not stated on the criteria page",
    [
      pct("net", "NET (Computing)", 75),
      pct("matric", "SSC / Matric", 10),
      {
        field: "hssc-complete",
        alternativeFields: ["hssc-part1"],
        label: "HSSC / FSc (Part-I or complete, as applicable)",
        weight: 15,
      },
    ],
    "Aggregate = NET 75% + SSC/O Level/equivalent 10% + HSSC 15%. Use the relevant NET paper; the best NET score is selected where multiple attempts are taken.",
    [
      "The official criteria page was modified 10 September 2026 but does not state an admission-cycle label.",
      "The HSSC component may use Part-I or complete HSSC as applicable. Confirm the result-stage treatment with NUST.",
      "The cited criteria page does not specify a NET maximum score. Enter the obtained and total marks shown by the official score report.",
      "A-Level/equivalent and DAE rules are special cases and are not calculated by this Matric/FSc calculator.",
    ],
    "https://nust.edu.pk/admissions/undergraduates/merit-criteria-for-admission-on-net-basis/",
    "NUST — Merit Generation Criteria for Admission on NET Basis",
    [
      {
        url: "https://ugadmissions.nust.edu.pk/",
        title: "NUST Undergraduate Admissions / NET portal",
      },
    ],
  ),
  formula(
    "qau-fall-2026-bs",
    "qau",
    "bs",
    "Fall 2026 · Morning BS",
    [
      pct("matric", "Matriculation", 30),
      pct("hssc-part1", "HSSC Part-I / equivalent", 70),
    ],
    "Aggregate = 30% Matriculation + 70% HSSC Part-I/equivalent. For BS merit, the notice specifies first-year marks even when the candidate already has a complete result.",
    [
      "Formula is limited to the Fall 2026 morning BS admission notice; it is not applied to LLB.",
      "The notice lists 50% minimum HSSC Part-I eligibility for BS. Eligibility conditions are separate from the calculated aggregate.",
      "The Fall 2026 notice mentions a USAT arrangement but does not state a USAT weight; no test component is added.",
    ],
    "https://qau.edu.pk/admissions-for-undergraduate-bs-ba-llb-pharm-d-morning-programme-on-regular-self-finance-basis-fall-semester-2026/",
    "QAU — Undergraduate BS/LLB/Pharm-D Morning Admissions Notice, Fall 2026",
    [
      {
        url: "https://qau.edu.pk/the-education-testing-council-etc-hec-and-quaid-i-azam-university-qau-islamabad-have-signed-an-mou-to-conduct-the-undergraduate-studies-admission-test-usat-for-fall-2026-admissions/",
        title: "QAU — ETC-HEC USAT announcement for Fall 2026",
      },
    ],
  ),
  formula(
    "qau-fall-2026-pharmd",
    "qau",
    "pharm-d",
    "Fall 2026 · Morning Pharm-D",
    [
      pct("matric", "Matriculation", 30),
      pct("hssc-complete", "Complete FA/FSc / equivalent", 70),
    ],
    "Aggregate = 30% Matriculation + 70% complete FA/FSc/equivalent result.",
    [
      "Formula is limited to the Fall 2026 morning Pharm-D admission notice.",
      "The notice requires a complete FSc result for Pharm-D and lists a 60% minimum. Eligibility is separate from the aggregate.",
      "The notice mentions a USAT arrangement but does not state a USAT weight; no test component is added.",
    ],
    "https://qau.edu.pk/admissions-for-undergraduate-bs-ba-llb-pharm-d-morning-programme-on-regular-self-finance-basis-fall-semester-2026/",
    "QAU — Undergraduate BS/LLB/Pharm-D Morning Admissions Notice, Fall 2026",
    [
      {
        url: "https://qau.edu.pk/the-education-testing-council-etc-hec-and-quaid-i-azam-university-qau-islamabad-have-signed-an-mou-to-conduct-the-undergraduate-studies-admission-test-usat-for-fall-2026-admissions/",
        title: "QAU — ETC-HEC USAT announcement for Fall 2026",
      },
    ],
  ),
  formula(
    "qau-fall-2026-llb",
    "qau",
    "llb",
    "Fall 2026 · Morning LLB",
    [
      pct("hssc-part1", "HSSC Part-I / equivalent", 50),
      pct("lat", "HEC Law Admission Test (LAT)", 30),
      pct("matric", "SSC / Matric", 20),
    ],
    "Aggregate = 50% HSSC Part-I/equivalent + 30% HEC Law Admission Test (LAT) + 20% SSC.",
    [
      "A valid LAT result with a minimum passing score of 50 is required for LLB admission.",
      "The Fall 2026 notice states that LLB merit uses first-year HSSC marks even if a complete result is available.",
      "The formula is limited to the Fall 2026 morning LLB program. Eligibility and admission are not guaranteed by the aggregate.",
    ],
    "https://qau.edu.pk/admissions-for-undergraduate-bs-ba-llb-pharm-d-morning-programme-on-regular-self-finance-basis-fall-semester-2026/",
    "QAU — Undergraduate BS/LLB/Pharm-D Morning Admissions Notice, Fall 2026",
    [
      {
        url: "https://qau.edu.pk/the-education-testing-council-etc-hec-and-quaid-i-azam-university-qau-islamabad-have-signed-an-mou-to-conduct-the-undergraduate-studies-admission-test-usat-for-fall-2026-admissions/",
        title: "QAU — ETC-HEC USAT announcement for Fall 2026",
      },
    ],
  ),
  formula(
    "pmdc-2026-27-mbbs",
    "pmdc-mbbs-bds",
    "mbbs",
    "2026–27 onward",
    [
      pct("mdcat", "MDCAT", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 50% MDCAT + 40% HSSC/FSc + 10% SSC/Matric.",
    [
      "PM&DC 2026 Regulations are effective for sessions 2026–27 onward and apply to the stated public- and private-college merit criteria.",
      "Open-merit eligibility requires at least 60% HSSC (or a higher percentage if PM&DC notifies one) and required science subjects.",
      "The regulations do not specify a national MDCAT passing percentage, a single national test maximum, or a national domicile rule in the cited clauses.",
      "Provincial quota, domicile, and category eligibility are not calculated here. Confirm the relevant admitting authority's current rules.",
    ],
    source.pmdc,
    "PM&DC Medical and Dental Admissions, Curriculum and Conduct Policy and Regulations 2026",
    [
      {
        url: "https://uhs.edu.pk/mdcatadmissionnews.php",
        title: "UHS — MDCAT 2026 admission news",
      },
    ],
  ),
  formula(
    "pmdc-2026-27-bds",
    "pmdc-mbbs-bds",
    "bds",
    "2026–27 onward",
    [
      pct("mdcat", "MDCAT", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 50% MDCAT + 40% HSSC/FSc + 10% SSC/Matric.",
    [
      "PM&DC 2026 Regulations are effective for sessions 2026–27 onward and apply to the stated public- and private-college merit criteria.",
      "Open-merit eligibility requires at least 60% HSSC (or a higher percentage if PM&DC notifies one) and required science subjects.",
      "The regulations do not specify a national MDCAT passing percentage, a single national test maximum, or a national domicile rule in the cited clauses.",
      "Provincial quota, domicile, and category eligibility are not calculated here. Confirm the relevant admitting authority's current rules.",
    ],
    source.pmdc,
    "PM&DC Medical and Dental Admissions, Curriculum and Conduct Policy and Regulations 2026",
    [
      {
        url: "https://uhs.edu.pk/mdcatadmissionnews.php",
        title: "UHS — MDCAT 2026 admission news",
      },
    ],
  ),
  formula(
    "uhs-2026-mbbs",
    "uhs-punjab",
    "mbbs",
    "2026–27 · PM&DC national weights; UHS Punjab category rules not fully verified",
    [
      pct("mdcat", "UHS MDCAT 2026", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 50% MDCAT + 40% HSSC/FSc + 10% SSC/Matric under the PM&DC policy effective 2026–27 onward.",
    [
      "The formula is the PM&DC national weighting; UHS-specific domicile, quota, and category criteria are not calculated.",
      "UHS MDCAT-2026 Paper ID A contains 180 MCQs / 180 marks. Enter the total printed on your own UHS test report.",
      "Provincial category eligibility and selection rules must be verified with UHS before applying.",
    ],
    source.pmdc,
    "PM&DC Medical and Dental Admissions, Curriculum and Conduct Policy and Regulations 2026",
    [
      { url: source.uhsNews, title: "UHS — MDCAT 2026 admission news" },
      { url: source.uhsPaper, title: "UHS — MDCAT 2026 Paper ID A (180 marks)" },
      {
        url: "https://uhs.edu.pk/finalpublicmeritlist2026.php",
        title: "UHS — 2026 public MBBS merit list",
      },
    ],
  ),
  formula(
    "uhs-2026-bds",
    "uhs-punjab",
    "bds",
    "2026–27 · PM&DC national weights; UHS Punjab category rules not fully verified",
    [
      pct("mdcat", "UHS MDCAT 2026", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 50% MDCAT + 40% HSSC/FSc + 10% SSC/Matric under the PM&DC policy effective 2026–27 onward.",
    [
      "The formula is the PM&DC national weighting; UHS-specific domicile, quota, and category criteria are not calculated.",
      "UHS MDCAT-2026 Paper ID A contains 180 MCQs / 180 marks. Enter the total printed on your own UHS test report.",
      "Provincial category eligibility and selection rules must be verified with UHS before applying.",
    ],
    source.pmdc,
    "PM&DC Medical and Dental Admissions, Curriculum and Conduct Policy and Regulations 2026",
    [
      { url: source.uhsNews, title: "UHS — MDCAT 2026 admission news" },
      { url: source.uhsPaper, title: "UHS — MDCAT 2026 Paper ID A (180 marks)" },
      {
        url: "https://uhs.edu.pk/finalpublicmeritlist2026.php",
        title: "UHS — 2026 public MBBS merit list",
      },
    ],
  ),
  formula(
    "nums-2026-27-mbbs",
    "nums",
    "mbbs",
    "2026–27 · constituent, affiliated, and attached Armed Forces-administered colleges",
    [
      pct("nums-mdcat", "NUMS MDCAT", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 50% admission test + 40% HSSC/FSc + 10% SSC/Matric, applying the PM&DC 2026 Regulations weights referenced by NUMS for 2026–27 admissions.",
    [
      "NUMS states that 2026–27 admissions follow applicable PM&DC regulations; its own announcement does not restate the weighting.",
      "NUMS lists a minimum 60% HSSC and a NUMS MDCAT pass threshold of 55% for MBBS.",
      "The NUMS admission material reviewed does not state the NUMS MDCAT maximum. Enter the total shown on your official score report.",
      "Foreign/overseas seat alternatives and eligibility are not represented by this open-merit calculation.",
    ],
    source.pmdc,
    "PM&DC Medical and Dental Admissions, Curriculum and Conduct Policy and Regulations 2026",
    [{ url: source.nums, title: "NUMS — MBBS/BDS centralized admissions 2026–27" }],
  ),
  formula(
    "nums-2026-27-bds",
    "nums",
    "bds",
    "2026–27 · constituent, affiliated, and attached Armed Forces-administered colleges",
    [
      pct("nums-mdcat", "NUMS MDCAT", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 50% admission test + 40% HSSC/FSc + 10% SSC/Matric, applying the PM&DC 2026 Regulations weights referenced by NUMS for 2026–27 admissions.",
    [
      "NUMS states that 2026–27 admissions follow applicable PM&DC regulations; its own announcement does not restate the weighting.",
      "NUMS lists a minimum 60% HSSC and a NUMS MDCAT pass threshold of 50% for BDS.",
      "The NUMS admission material reviewed does not state the NUMS MDCAT maximum. Enter the total shown on your official score report.",
      "Foreign/overseas seat alternatives and eligibility are not represented by this open-merit calculation.",
    ],
    source.pmdc,
    "PM&DC Medical and Dental Admissions, Curriculum and Conduct Policy and Regulations 2026",
    [{ url: source.nums, title: "NUMS — MBBS/BDS centralized admissions 2026–27" }],
  ),
  formula(
    "kmu-2026-mbbs",
    "kmu",
    "mbbs",
    "KMU centralized admissions 2026",
    [
      pct("mdcat", "MDCAT", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 10% SSC + 40% HSSC + 50% MDCAT.",
    [
      "KMU lists 65% minimum HSSC, 55% minimum MDCAT for MBBS, and KP/NMTD domicile requirements.",
      "The KMU page lists accepted MDCAT years 2024, 2025, and 2026 but does not state the test maximum. Enter the total from your own report.",
      "KMU quota/seat-category eligibility is not calculated.",
    ],
    source.kmu,
    "KMU Centralized Admission System — 2026 Merit Criteria and Eligibility",
    [
      {
        url: source.pmdc,
        title: "PM&DC 2026 Medical and Dental Admissions Regulations",
      },
    ],
  ),
  formula(
    "kmu-2026-bds",
    "kmu",
    "bds",
    "KMU centralized admissions 2026",
    [
      pct("mdcat", "MDCAT", 50),
      pct("hssc-complete", "HSSC / FSc", 40),
      pct("matric", "SSC / Matric", 10),
    ],
    "Aggregate = 10% SSC + 40% HSSC + 50% MDCAT.",
    [
      "KMU lists 65% minimum HSSC, 50% minimum MDCAT for BDS, and KP/NMTD domicile requirements.",
      "The KMU page lists accepted MDCAT years 2024, 2025, and 2026 but does not state the test maximum. Enter the total from your own report.",
      "KMU quota/seat-category eligibility is not calculated.",
    ],
    source.kmu,
    "KMU Centralized Admission System — 2026 Merit Criteria and Eligibility",
    [
      {
        url: source.pmdc,
        title: "PM&DC 2026 Medical and Dental Admissions Regulations",
      },
    ],
  ),
];

export const pendingMeritFormulas: PendingMeritFormula[] = [
  pending(
    "nust-other-programs",
    "nust",
    "Current criteria are published; program and test-specific scope needs confirmation",
    "https://nust.edu.pk/admissions/undergraduates/merit-criteria-for-admission-on-net-basis/",
    "NUST — Merit Generation Criteria for Admission on NET Basis",
    "The criteria page provides NET-based weights, but this selected program family is not enabled until its applicable test and current-cycle treatment are confirmed.",
  ),
  pending(
    "fast-cycle-pending",
    "fast-nuces",
    "Current admission cycle not identified on the official criteria page",
    "https://www.nu.edu.pk/Admissions/EligibilityCriteria",
    "FAST-NUCES — Eligibility Criteria",
    "The official page shows a 50% admission-test, 40% HSSC, 10% SSC formula for computing programs, but does not name a cycle or update date. It is not enabled until current-cycle applicability is confirmed.",
  ),
  pending(
    "comsats-current-formula",
    "comsats",
    "2026 cycle formula not verified",
    "https://admissions.comsats.edu.pk/",
    "COMSATS University — Admission Portal",
    "The official portal did not expose a current program-specific aggregate formula during verification.",
  ),
  pending(
    "uet-lahore-current-formula",
    "uet-lahore",
    "2026/27 program formula not verified",
    "https://admission.uet.edu.pk/",
    "UET Lahore — Admissions Portal",
    "The official portal's dynamic content did not expose a verifiable current merit formula.",
  ),
  pending(
    "uet-taxila-current-formula",
    "uet-taxila",
    "Current cycle formula not verified",
    "https://www.uettaxila.edu.pk/",
    "UET Taxila — Official Website",
    "A current official program-specific aggregate formula was not verified.",
  ),
  pending(
    "uet-peshawar-current-formula",
    "uet-peshawar",
    "2026 engineering / 2026–27 computing; formula not extractably verified",
    "https://www.uetpeshawar.edu.pk/admission-notice-for-engineering-program-2026/",
    "UET Peshawar — Admission Notice for Engineering Program 2026",
    "Current-cycle official notices were found, but the relevant criteria were image-based and could not be verified reliably. No formula is inferred.",
    [
      {
        url: "https://www.uetpeshawar.edu.pk/2026-2027-admission-notice-undergraduate-computing-programs/",
        title: "UET Peshawar — Undergraduate Computing Admission Notice 2026–27",
      },
    ],
  ),
  pending(
    "ned-2026-prospectus-pending",
    "ned",
    "2026; prospectus formula not extractably verified",
    "https://www.neduet.edu.pk/admission",
    "NED — Undergraduate Admissions 2026",
    "The official page links the 2026 prospectus, but its program-specific formula could not be verified from the accessible PDF text.",
    [
      {
        url: "https://www.neduet.edu.pk/sites/default/files/Admissions-2026/UGProspectus2026.pdf",
        title: "NED — Undergraduate Prospectus 2026",
      },
    ],
  ),
  pending(
    "giki-current-formula",
    "giki",
    "2026-cycle formula not verified",
    "https://giki.edu.pk/admissions/admissions-undergraduates/eligibility-criteria/",
    "GIKI — Undergraduate Eligibility and Assessment Criteria",
    "The official page was available but did not expose the current program-specific formula in the retrieved content.",
  ),
  pending(
    "pieas-current-formula",
    "pieas",
    "Current cycle formula not verified",
    "https://admissions.pieas.edu.pk/",
    "PIEAS — Admissions Division",
    "A current official undergraduate aggregate formula was not exposed in the accessible admissions material.",
  ),
  pending(
    "air-current-formula",
    "air-university",
    "Current cycle formula not verified",
    "https://www.au.edu.pk/",
    "Air University — Official Website",
    "A current official program-specific aggregate formula was not verified.",
  ),
  pending(
    "itu-current-formula",
    "itu-lahore",
    "2026 cycle formula not verified",
    "https://itu.edu.pk/admissions/application-process/",
    "ITU Lahore — Application Process and Norms",
    "Current admission pages were located, but a numerical program-specific formula was not verified.",
    [
      {
        url: "https://itu.edu.pk/admissions/eligibility-criteria/",
        title: "ITU Lahore — Eligibility Criteria",
      },
    ],
  ),
  pending(
    "nutech-current-formula",
    "nutech",
    "Current cycle formula not verified",
    "https://nutech.edu.pk/admissions/",
    "NUTECH — Admissions",
    "The accessible official material did not establish a current numerical aggregate formula.",
  ),
  pending(
    "bahria-current-formula",
    "bahria",
    "Current cycle formula not verified",
    "https://www.bahria.edu.pk/home/index#admissions_page",
    "Bahria University — Admissions",
    "A current official program-specific aggregate formula was not verified.",
  ),
  pending(
    "pu-academic-split-pending",
    "punjab-university",
    "Academic Year 2026–27",
    "https://pu.edu.pk/images/image/Admission-Notices/Instructions-Eligibility-Criteria-2026-27.pdf",
    "University of the Punjab — Instructions / Eligibility Criteria 2026–27",
    "The current regulations state 25% entry test + 75% academic record where a test is required, but do not define a Matric/HSSC split for that academic record. A numeric aggregate from the available marks cannot be derived without inventing a weight.",
    [
      {
        url: "https://pu.edu.pk/home/admission_notice/719",
        title: "Punjab University — 2026–27 vacant-seat admissions notice",
      },
      {
        url: "https://pu.edu.pk/downloads/Admission-Regulations-Book.pdf",
        title: "Punjab University — Admission Regulations Book",
      },
    ],
  ),
  pending(
    "gcu-current-formula-pending",
    "gcu-lahore",
    "Fall 2026 · Phase III",
    "https://gcu.edu.pk/admissions.php?pg=bs-program",
    "GCU Lahore — BS Program Admission Rules",
    "The current official pages describe admission categories and eligibility but do not expose a verifiable numeric aggregate formula. No published or historical weights are inferred.",
    [
      {
        url: "https://gcu.edu.pk/admissions.php",
        title: "GCU Lahore — Fall 2026 Phase III admissions",
      },
    ],
  ),
  pending(
    "karachi-2027-prospectus",
    "karachi-university",
    "2027; prospectus formula not verified",
    "https://www.uok.edu.pk/admissions/",
    "University of Karachi — Admissions 2027",
    "The official 2027 page identifies separate open-merit and test-based routes and links the current prospectus; the route-specific numerical formulas remain unverified.",
    [
      {
        url: "https://uokadmission.edu.pk/2027/prospectus/MP2027_1.pdf",
        title: "University of Karachi — Admissions Prospectus 2027",
      },
    ],
  ),
  pending(
    "uaf-2026-27-program-formulas",
    "uaf",
    "Undergraduate admissions session 2026–2027",
    "https://admissions.uaf.edu.pk/",
    "University of Agriculture Faisalabad — Online Admission Portal",
    "Official current-cycle merit lists vary by program and campus, but an aggregate formula was not verified in the accessible material.",
    [
      {
        url: "https://web.uaf.edu.pk/Downloads/MeritListsView",
        title: "UAF — Undergraduate Merit Lists",
      },
    ],
  ),
  pending(
    "iiui-cycle-pending",
    "iiui",
    "Fall 2026 / Spring 2027 policy applicability not verified",
    "https://admission.iiu.edu.pk/",
    "IIUI — Admission Portal",
    "The portal links a general policy dated 3 June 2025, but its applicability to a current Fall 2026 or Spring 2027 intake was not established.",
    [
      {
        url: "https://www.iiu.edu.pk/wp-content/uploads/2025/06/Admission-Policy-03062025.pdf",
        title: "IIUI — Admission Policy dated 3 June 2025",
      },
    ],
  ),
  pending(
    "nums-non-mbbs-bds",
    "nums",
    "2026–27; criteria for other program families not verified",
    "https://numspak.edu.pk/",
    "NUMS — Official Website",
    "This calculator only contains verified 2026–27 MBBS/BDS rules. Other degree programs require their own official criteria.",
  ),
  pending(
    "kmu-non-mbbs-bds",
    "kmu",
    "2026; criteria for other program families not verified",
    "https://cas.kmu.edu.pk/index.php",
    "KMU Centralized Admission System",
    "This calculator only contains verified 2026 MBBS/BDS rules. Other degree programs and seat categories require separate criteria.",
  ),
  pending(
    "uhs-special-category-pending",
    "uhs-punjab",
    "2026–27; UHS provincial category rules",
    "https://uhs.edu.pk/mdcatadmissionnews.php",
    "UHS — 2026–27 Medical Admissions News",
    "The national weighting is documented, but this record does not verify UHS domicile, quota, or special-seat rules.",
  ),
];

export const meritFormulaRegistry: MeritFormulaRecord[] = [
  ...verifiedMeritFormulas,
  ...pendingMeritFormulas,
];

export function findMeritFormulaRecord(
  universityId: string,
  programId: string,
): MeritFormulaRecord | undefined {
  return (
    meritFormulaRegistry.find(
      (record) =>
        record.universityId === universityId && record.programId === programId,
    ) ??
    meritFormulaRegistry.find(
      (record) => record.universityId === universityId && record.programId === "*",
    )
  );
}

export function findVerifiedMeritFormula(
  universityId: string,
  programId: string,
): VerifiedMeritFormula | undefined {
  const record = findMeritFormulaRecord(universityId, programId);
  return record?.verificationStatus === "verified" ? record : undefined;
}
