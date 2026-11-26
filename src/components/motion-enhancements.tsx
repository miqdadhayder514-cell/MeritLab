"use client";

import { useEffect } from "react";

const revealSelector = [
  ".hero-copy",
  ".hero-art",
  ".hero-bottom-line",
  ".section-heading",
  ".category-card",
  ".why-copy",
  ".benefit-row",
  ".step-card",
  ".featured-visual",
  ".featured-copy",
  ".mock-promo-copy",
  ".exam-preview",
  ".analytics-copy",
  ".analytics-card",
  ".faq-intro",
  ".faq-item",
  ".final-cta-inner",
  ".home-metric",
  ".pricing-hero-copy",
  ".pricing-hero-art",
  ".pricing-plan-card",
  ".comparison-row",
  ".pricing-plus-visual",
  ".pricing-plus-copy",
  ".pricing-faq-intro",
  ".pricing-final-inner",
  ".page-heading",
  ".stat-grid > .stat-card",
  ".admin-stat-grid > *",
  ".dashboard-main-grid > .card",
  ".dashboard-secondary-grid > .card",
  ".continue-card",
  ".category-selector-card",
  ".prep-content-heading",
  ".subject-overview",
  ".chapter-row",
  ".question-card",
  ".practice-side > .card",
  ".chart-card",
  ".subject-performance-card",
  ".time-insight",
  ".resource-feature",
  ".resource-list-header",
  ".challenge-hero",
  ".leaderboard-card",
  ".profile-hero",
  ".auth-card",
  ".mock-test-card",
  ".instructions-card",
  ".exam-result-hero",
  ".admin-table-card",
  ".admin-main-grid > .card",
  ".admin-breakdown > .card",
  ".site-footer .footer-col",
  ".site-footer .footer-brand",
  ".practice-layout > *",
  ".resource-card",
  ".result-hero-card",
  ".result-stats > .stat-card",
  ".bars-chart",
].join(",");

function animateCounter(element: HTMLElement) {
  const target = Number(element.dataset.countTarget);
  if (!Number.isFinite(target)) return;

  const suffix = element.dataset.countSuffix ?? "";
  const duration = 950;
  const start = performance.now();

  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 4;
    const current = Math.round(target * eased);
    element.textContent = `${new Intl.NumberFormat("en").format(current)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

export function MotionEnhancements() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduceMotion.matches) return;

    const observed = new WeakSet<Element>();
    const counted = new WeakSet<Element>();
    const magneticButtons = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in-view");
          if (
            entry.target instanceof HTMLElement &&
            entry.target.dataset.countTarget &&
            !counted.has(entry.target)
          ) {
            counted.add(entry.target);
            animateCounter(entry.target);
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    function observeMotionTargets() {
      document.querySelectorAll(revealSelector).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.setAttribute("data-motion", "reveal");
        observer.observe(element);
      });
      document
        .querySelectorAll<HTMLElement>("[data-count-target]")
        .forEach((element) => {
          if (observed.has(element)) return;
          observed.add(element);
          observer.observe(element);
        });
      if (finePointer.matches) {
        document
          .querySelectorAll<HTMLElement>(".hero-buttons .button")
          .forEach((button) => {
            if (magneticButtons.has(button)) return;
            magneticButtons.add(button);
            button.addEventListener("pointermove", (event) => {
              const bounds = button.getBoundingClientRect();
              button.style.setProperty(
                "--magnetic-x",
                `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}px`,
              );
              button.style.setProperty(
                "--magnetic-y",
                `${((event.clientY - bounds.top) / bounds.height - 0.5) * 4}px`,
              );
            });
            button.addEventListener("pointerleave", () => {
              button.style.removeProperty("--magnetic-x");
              button.style.removeProperty("--magnetic-y");
            });
          });
      }
    }

    observeMotionTargets();
    document.documentElement.classList.add("motion-ready");

    const mutationObserver = new MutationObserver(observeMotionTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const art = document.querySelector<HTMLElement>(".hero-art");
    const dashboard = art?.querySelector<HTMLElement>(".hero-dashboard");
    function handlePointerMove(event: PointerEvent) {
      if (!finePointer.matches || !art || !dashboard) return;
      const bounds = art.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      dashboard.style.setProperty("--tilt-x", `${-y * 3.5}deg`);
      dashboard.style.setProperty("--tilt-y", `${x * 4.5}deg`);
    }
    function resetPointer() {
      dashboard?.style.removeProperty("--tilt-x");
      dashboard?.style.removeProperty("--tilt-y");
    }
    art?.addEventListener("pointermove", handlePointerMove);
    art?.addEventListener("pointerleave", resetPointer);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      document.documentElement.classList.remove("motion-ready");
      art?.removeEventListener("pointermove", handlePointerMove);
      art?.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return null;
}
