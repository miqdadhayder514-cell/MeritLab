"use client";

import { useEffect, useState } from "react";
import { pricingComparison, pricingPlans } from "@/lib/pricing-data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Footer } from "./landing-page";
import { Card, Icon } from "./ui";

const faqs = [
  [
    "Can I use MeritLab for free?",
    "Yes. Student registration is available at no cost. The Free plan inclusions shown here are a proposed outline and are not active entitlements yet.",
  ],
  [
    "What is included in the Free plan?",
    "The Free plan is planned to include basic preparation tools and limited practice. Exact content and limits will be confirmed when real learning materials are added.",
  ],
  [
    "What is the difference between Plus and Premium?",
    "Plus is planned to expand practice, explanations, analytics, and revision tools. Premium is planned to include the full set of available preparation resources and additional insights. These features are not active subscriptions yet.",
  ],
  [
    "Can I upgrade my plan later?",
    "When a paid plan is enabled, you can submit a NayaPay transfer for review. Access is activated only after an administrator approves the payment proof.",
  ],
  [
    "How long does my subscription last?",
    "Each enabled plan shows its one-time price and access duration before checkout. New approved access starts when any existing active period ends.",
  ],
  [
    "Which payment methods will be supported?",
    "Manual NayaPay transfers are supported when the receiving account and at least one paid plan are enabled by an administrator.",
  ],
  [
    "Can I access MeritLab on mobile?",
    "The MeritLab frontend is responsive and can be browsed on mobile devices. Some learning features are still awaiting real content.",
  ],
  [
    "What happens when my subscription expires?",
    "Paid access ends at the expiry date shown in your account. You can submit a new payment for an enabled plan to extend access.",
  ],
];

function priceText(price: number) {
  return price === 0 ? "Rs. 0" : `Rs. ${price.toLocaleString("en-PK")}`;
}

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [paidPlans, setPaidPlans] = useState<
    Record<string, { amount_pkr: number; duration_days: number }>
  >({});
  const [plansLoaded, setPlansLoaded] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    async function loadPlans() {
      try {
        const { data, error } = await createClient().rpc("public_payment_plans");
        if (error) throw error;

        const nextPlans: Record<string, { amount_pkr: number; duration_days: number }> =
          {};
        for (const plan of data ?? []) {
          if (
            (plan.code === "plus" || plan.code === "premium") &&
            typeof plan.amount_pkr === "number" &&
            typeof plan.duration_days === "number"
          ) {
            nextPlans[plan.code] = {
              amount_pkr: plan.amount_pkr,
              duration_days: plan.duration_days,
            };
          }
        }
        if (active) setPaidPlans(nextPlans);
      } catch (error) {
        console.error("Could not load configured pricing plans.", error);
      } finally {
        if (active) setPlansLoaded(true);
      }
    }

    void loadPlans();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-hero-grid" aria-hidden="true" />
        <div className="pricing-orbit pricing-orbit-a" aria-hidden="true" />
        <div className="pricing-orbit pricing-orbit-b" aria-hidden="true" />
        <span className="pricing-float pricing-float-a" aria-hidden="true">
          ∑
        </span>
        <span className="pricing-float pricing-float-b" aria-hidden="true">
          ∫ f(x)
        </span>
        <span className="pricing-float pricing-float-c" aria-hidden="true">
          F = ma
        </span>
        <div className="wrap pricing-hero-inner">
          <div className="pricing-hero-copy">
            <span className="pricing-kicker">
              <i /> SIMPLE, ONE-TIME PRICING
            </span>
            <h1>
              Choose Your Path
              <br />
              to <span>NUST Success.</span>
            </h1>
            <p>
              Get the preparation tools, practice resources, and insights you need to
              approach your NUST Entry Test with confidence.
            </p>
            <a
              className="button button-primary button-large pricing-hero-cta"
              href="#plans"
            >
              Explore plans <Icon name="arrow" size={17} />
            </a>
            <div className="pricing-trust-note">
              <Icon name="info" size={15} />
              <span>
                One-time payment model. Paid plans appear only after an administrator
                configures their price and duration.
              </span>
            </div>
          </div>
          <div className="pricing-hero-art" aria-hidden="true">
            <div className="pricing-art-halo" />
            <div className="pricing-art-panel">
              <div className="pricing-art-panel-top">
                <span className="pricing-art-logo">
                  <Icon name="orbit" size={18} />
                </span>
                <span>YOUR PREPARATION PATH</span>
                <i />
              </div>
              <div className="pricing-art-title">
                <small>ONE STEP AT A TIME</small>
                <strong>Build your confidence.</strong>
              </div>
              <div className="pricing-art-path">
                <span className="pricing-path-step path-step-done">
                  <Icon name="check" size={15} />
                </span>
                <i />
                <span className="pricing-path-step path-step-current">
                  <Icon name="book" size={15} />
                </span>
                <i />
                <span className="pricing-path-step">
                  <Icon name="practice" size={15} />
                </span>
                <i />
                <span className="pricing-path-step">
                  <Icon name="chart" size={15} />
                </span>
              </div>
              <div className="pricing-art-labels">
                <span>Plan</span>
                <span>Learn</span>
                <span>Practice</span>
                <span>Improve</span>
              </div>
              <div className="pricing-art-bottom">
                <span>
                  <Icon name="spark" size={15} /> A plan that fits your goals
                </span>
                <span>NET</span>
              </div>
            </div>
            <div className="pricing-float-card pricing-float-card-a">
              <span>
                <Icon name="check" size={15} />
              </span>
              <div>
                <strong>One-time payment</strong>
                <small>No recurring billing</small>
              </div>
            </div>
            <div className="pricing-float-card pricing-float-card-b">
              <Icon name="compass" size={19} />
              <span>Find your path</span>
            </div>
          </div>
        </div>
        <div className="pricing-hero-foot wrap">
          <span>Transparent plan outlines</span>
          <span>Designed for your NET journey</span>
          <span>No recurring charges</span>
        </div>
      </section>

      <section className="section pricing-plans-section" id="plans">
        <div className="wrap">
          <div className="section-heading centered pricing-section-heading">
            <span className="eyebrow">Choose what works for you</span>
            <h2>
              Your goals. <span>Your pace.</span>
            </h2>
            <p>
              Paid plan prices and access periods below are read from the active payment
              configuration. Feature descriptions remain proposed outlines.
            </p>
            <div className="one-time-indicator">
              <span>
                <Icon name="check" size={15} /> One-time payment
              </span>
              <small>Paid access duration is shown on configured plans</small>
            </div>
          </div>
          <div className="pricing-plan-grid">
            {pricingPlans.map((plan) => {
              const configuredPlan =
                plan.id === "plus" || plan.id === "premium"
                  ? paidPlans[plan.id]
                  : undefined;
              const available = plan.id === "free" || Boolean(configuredPlan);
              const amount = plan.id === "free" ? 0 : configuredPlan?.amount_pkr;
              return (
                <Card
                  className={`pricing-plan-card ${plan.recommended ? "pricing-plan-featured" : ""}`}
                  key={plan.id}
                >
                  {plan.recommended && (
                    <span className="recommended-ribbon">
                      <Icon name="spark" size={13} /> RECOMMENDED
                    </span>
                  )}
                  <div className="pricing-plan-top">
                    <span className={`pricing-plan-icon plan-icon-${plan.id}`}>
                      <Icon
                        name={
                          plan.id === "free"
                            ? "compass"
                            : plan.id === "plus"
                              ? "bolt"
                              : "spark"
                        }
                        size={20}
                      />
                    </span>
                    <span className="plan-status">
                      {plan.id === "free"
                        ? "FREE PLAN"
                        : available
                          ? "AVAILABLE"
                          : "NOT AVAILABLE"}
                    </span>
                  </div>
                  <h3>{plan.name}</h3>
                  <p className="pricing-plan-description">{plan.description}</p>
                  <div className="pricing-price">
                    <strong>
                      {plan.id === "free"
                        ? priceText(0)
                        : !plansLoaded
                          ? "Loading…"
                          : configuredPlan
                            ? priceText(amount ?? 0)
                            : "Unavailable"}
                    </strong>
                    {configuredPlan && <span>{configuredPlan.duration_days} days</span>}
                  </div>
                  <p className="pricing-placeholder-note">
                    {plan.id === "free"
                      ? "Free registration · no payment"
                      : configuredPlan
                        ? `${configuredPlan.duration_days} days of access`
                        : "Checkout remains disabled until configured"}
                  </p>
                  {plan.id === "free" ? (
                    <a
                      className={`button ${plan.recommended ? "button-primary" : "button-outline"} pricing-plan-cta`}
                      href="/register"
                    >
                      {plan.cta} <Icon name="arrow" size={15} />
                    </a>
                  ) : available ? (
                    <a
                      className={`button ${plan.recommended ? "button-primary" : "button-outline"} pricing-plan-cta`}
                      href={`/payments?plan=${plan.id}`}
                    >
                      Choose {plan.id === "plus" ? "Plus" : "Premium"}{" "}
                      <Icon name="arrow" size={15} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={`button ${plan.recommended ? "button-primary" : "button-outline"} pricing-plan-cta`}
                      disabled
                    >
                      {plansLoaded ? "Not available" : "Loading plans"}
                    </button>
                  )}
                  <div className="pricing-feature-divider">
                    <span>PLANNED PLAN OUTLINE</span>
                  </div>
                  <ul className="pricing-feature-list">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <span>
                          <Icon name="check" size={13} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
          <p className="pricing-disclaimer">
            Paid plans appear only while their amounts, access durations, and NayaPay
            receiving details are configured and enabled. Plan feature outlines remain
            proposed and are not access guarantees.
          </p>
        </div>
      </section>

      <section className="pricing-comparison-section">
        <div className="wrap">
          <div className="section-heading centered pricing-section-heading">
            <span className="eyebrow">Compare the plan outlines</span>
            <h2>
              See what’s <span>planned.</span>
            </h2>
            <p>
              This is a proposed feature map, not a list of currently available paid
              entitlements.
            </p>
          </div>
          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">Preparation feature</th>
                  {pricingPlans.map((plan) => (
                    <th
                      scope="col"
                      className={plan.recommended ? "comparison-recommended" : ""}
                      key={plan.id}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((row) => (
                  <tr className="comparison-row" key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {row.values.map((value, index) => (
                      <td
                        className={
                          pricingPlans[index].recommended
                            ? "comparison-recommended"
                            : ""
                        }
                        key={`${row.feature}-${pricingPlans[index].id}`}
                      >
                        {value === "—" ? (
                          <span className="comparison-not-included">Not planned</span>
                        ) : (
                          <span className="comparison-planned">
                            <Icon name="check" size={14} />
                            {value}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pricing-table-note">
            Feature limits and availability will be confirmed before paid plans launch.
          </p>
        </div>
      </section>

      <section className="section pricing-plus-section">
        <div className="wrap pricing-plus-grid">
          <div className="pricing-plus-visual" aria-hidden="true">
            <div className="plus-visual-orbit" />
            <div className="plus-visual-card">
              <span className="plus-visual-badge">
                <Icon name="bolt" size={19} />
              </span>
              <small>MERITLAB PLUS · PLAN OUTLINE</small>
              <strong>
                More focus.
                <br />
                Less guesswork.
              </strong>
              <div className="plus-visual-lines">
                <i />
                <i />
                <i />
              </div>
              <span className="plus-visual-foot">UPGRADE PATH · PROPOSED</span>
            </div>
            <span className="plus-float plus-float-a">Practice</span>
            <span className="plus-float plus-float-b">Insights</span>
          </div>
          <div className="pricing-plus-copy">
            <span className="eyebrow">Why choose MeritLab Plus?</span>
            <h2>
              A clearer route from
              <br />
              <span>practice to progress.</span>
            </h2>
            <p>
              Plus is designed for students who want deeper topic practice and more
              useful feedback. Its listed benefits are planned and will only be offered
              when the underlying content and tools are ready.
            </p>
            <ul>
              <li>
                <Icon name="check" size={17} /> Practice planned around chapters and
                topics
              </li>
              <li>
                <Icon name="check" size={17} /> More detailed explanations and review
              </li>
              <li>
                <Icon name="check" size={17} /> A stronger view of what to revisit
              </li>
            </ul>
            <a href="#plans" className="text-link">
              Compare all plan outlines <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="section pricing-faq-section">
        <div className="wrap pricing-faq-grid">
          <div className="pricing-faq-intro">
            <span className="eyebrow">Before you choose</span>
            <h2>
              Good questions.
              <br />
              <span>Clear answers.</span>
            </h2>
            <p>
              Pricing, access duration, payment methods, and plan features will be
              confirmed before paid plans launch.
            </p>
            <a href="/contact-us" className="text-link">
              Ask about a plan <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="faq-list pricing-faq-list">
            {faqs.map(([question, answer], index) => (
              <div
                className={`faq-item ${openFaq === index ? "faq-open" : ""}`}
                key={question}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{question}</span>
                  <i>{openFaq === index ? "−" : "+"}</i>
                </button>
                {openFaq === index && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-final-cta">
        <div className="wrap pricing-final-inner">
          <div>
            <span className="eyebrow eyebrow-light">One focused step at a time</span>
            <h2>Your NUST Journey Starts Here.</h2>
            <p>
              Create a free account today. Paid plans will only open when their prices,
              content, and terms are confirmed.
            </p>
          </div>
          <div className="pricing-final-actions">
            <a href="/register" className="button button-white">
              Start for Free <Icon name="arrow" size={15} />
            </a>
            <a href="#plans" className="button pricing-final-outline">
              Explore Plans
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
