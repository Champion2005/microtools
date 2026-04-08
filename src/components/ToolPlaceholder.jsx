import { Link } from 'react-router-dom'

export default function ToolPlaceholder({ title, description }) {
  return (
    <main className="min-h-screen bg-linear-to-b from-surface-950 via-surface-900 to-surface-950 px-4 py-10 sm:px-8 sm:py-14">
      <section className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-brand-300 transition hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
        >
          Back to tools
        </Link>

        <article className="mt-8 rounded-2xl border border-surface-700 bg-surface-800/80 p-6 shadow-panel sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">
            Tool in development
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-slate-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {description}
          </p>

          <div className="mt-8 rounded-xl border border-brand-400/30 bg-brand-500/10 p-4 text-sm text-brand-100">
            Next step: implement the core input form, add loading and error states, and
            keep styling aligned to shared theme tokens.
          </div>
        </article>
      </section>
    </main>
  )
}
