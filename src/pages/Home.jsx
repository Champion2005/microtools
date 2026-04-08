import { Link } from 'react-router-dom'

const statusStyles = {
  Planned: 'border border-surface-700 bg-surface-900 text-slate-300',
  'In Progress': 'border border-brand-400/40 bg-brand-500/20 text-brand-200',
}

export default function Home({ tools }) {
  return (
    <main className="min-h-screen bg-linear-to-b from-surface-950 via-surface-900 to-surface-950 px-4 py-10 sm:px-8 sm:py-14">
      <section className="mx-auto max-w-6xl">
        <p className="inline-flex items-center rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-200">
          microtools command deck
        </p>

        <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
          Build focused utilities with a consistent dark, modern UI system.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          This project now follows theme-first Tailwind rules. Reuse shared tokens,
          avoid one-off values, and keep every screen tech-forward and readable.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={tools[0]?.href ?? '/'}
            className="inline-flex items-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            Build first tool
          </Link>
          <a
            href="#tools"
            className="inline-flex items-center rounded-full border border-surface-700 bg-surface-800 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400/50 hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            Browse tools
          </a>
        </div>

        <div id="tools" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.href}
              className="group flex h-full flex-col rounded-2xl border border-surface-700 bg-surface-800/80 p-5 shadow-panel transition duration-200 hover:-translate-y-1 hover:border-brand-400/40 hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
            >
              <p
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  statusStyles[tool.status] ?? statusStyles.Planned
                }`}
              >
                {tool.status}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-slate-100">{tool.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{tool.summary}</p>
              <span className="mt-auto pt-6 text-sm font-semibold text-brand-300 transition group-hover:text-brand-200">
                Open tool
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
