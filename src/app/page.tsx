"use client";

import { useState } from "react";
import Link from "next/link";

type CheckResult = {
  status: "success" | "error";
  message: string;
  durationMs: number;
  checkedAt: string;
};

const milestones = [
  {
    number: "01",
    title: "Application foundation",
    description: "A working dashboard and a live application health endpoint.",
    status: "In progress",
  },
  {
    number: "02",
    title: "Production deployment",
    description: "Connect GitHub and publish the application on Vercel.",
    status: "Next",
  },
  {
    number: "03",
    title: "Preview workflow",
    description: "Review changes on branch deployments before releasing.",
    status: "Planned",
  },
  {
    number: "04",
    title: "Operations and recovery",
    description: "Practice configuration, monitoring, diagnosis, and rollback.",
    status: "Planned",
  },
];

export default function Home() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  async function checkHealth() {
    setChecking(true);
    setResult(null);

    const startedAt = performance.now();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch("/api/health", {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Health endpoint returned HTTP ${response.status}.`);
      }

      const body: unknown = await response.json();

      if (
        typeof body !== "object" ||
        body === null ||
        !("status" in body) ||
        body.status !== "ok" ||
        !("service" in body) ||
        body.service !== "launchboard"
      ) {
        throw new Error("Health endpoint returned an unexpected response.");
      }

      setResult({
        status: "success",
        message: "The application responded successfully.",
        durationMs: Math.round(performance.now() - startedAt),
        checkedAt: new Date().toISOString(),
      });
    } catch (error) {
      setResult({
        status: "error",
        message: controller.signal.aborted
          ? "The health check timed out after 8 seconds."
          : error instanceof Error
            ? error.message
            : "Unable to reach the health endpoint.",
        durationMs: Math.round(performance.now() - startedAt),
        checkedAt: new Date().toISOString(),
      });
    } finally {
      window.clearTimeout(timeout);
      setChecking(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime-300 text-slate-950">
              L
            </span>
            LaunchBoard
          </Link>

          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
            Deployment workspace
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <section className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-lime-300">
            Build. Deploy. Verify.
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Release two: ready for rollback practice.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            A practical workspace for deploying applications, checking their
            health, and building a repeatable release process.
          </p>
        </section>

        <section
          aria-labelledby="health-heading"
          className="mt-12 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-400">Application health</p>
              <h2 id="health-heading" className="mt-2 text-2xl font-semibold">
                {checking
                  ? "Checking application..."
                  : result?.status === "success"
                    ? "Health check passed"
                    : result?.status === "error"
                      ? "Health check failed"
                      : "Ready for a health check"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                A point-in-time check of the application endpoint.
              </p>
            </div>

            <button
              type="button"
              onClick={checkHealth}
              disabled={checking}
              className="rounded-xl bg-lime-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:cursor-wait disabled:opacity-60"
            >
              {checking ? "Checking..." : "Run health check"}
            </button>
          </div>

          <div role="status" aria-live="polite" aria-atomic="true">
            {result && (
              <div
                className={`mt-6 rounded-2xl border p-5 ${result.status === "success"
                  ? "border-lime-300/20 bg-lime-300/5"
                  : "border-rose-400/20 bg-rose-400/5"
                  }`}
              >
                <p>{result.message}</p>
                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-400">Browser round-trip time</dt>
                    <dd className="mt-1 font-mono">{result.durationMs} ms</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Checked at (UTC)</dt>
                    <dd className="mt-1 break-all font-mono">
                      {result.checkedAt}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="roadmap-heading" className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="roadmap-heading" className="text-xl font-semibold">
              Deployment roadmap
            </h2>
            <span className="text-sm text-slate-500">Four practical stages</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {milestones.map((milestone) => (
              <article
                key={milestone.number}
                className="rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-500">
                    {milestone.number}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {milestone.status}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-medium">{milestone.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {milestone.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
          LaunchBoard · Next.js deployment practice
        </footer>
      </div>
    </main>
  );
}