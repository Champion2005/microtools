import { Link } from 'react-router-dom'

const statusStyles = {
  Preview: 'border border-brand-400/40 bg-brand-500/10 text-brand-200',
  'Coming Soon': 'border border-surface-700 bg-surface-900 text-slate-300',
}

function ToolCard({ tool }) {
  const content = (
    <>
      <h3 className="text-xl font-semibold text-slate-100">{tool.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{tool.summary}</p>
    </>
  )

  if (!tool.isAvailable || !tool.href) {
    return (
      <article
        className="flex h-full flex-col rounded-2xl border border-surface-700 bg-surface-800/50 p-6"
        aria-label={`${tool.name} coming soon`}
      >
        {content}
        <span className="mt-auto pt-6 text-sm font-semibold text-slate-500">Coming soon</span>
      </article>
    )
  }

  return (
    <Link
      to={tool.href}
      className="group flex h-full flex-col rounded-2xl border border-surface-700 bg-surface-800/80 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-400/40 hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
      aria-label={`Open ${tool.name}`}
    >
      {content}
      <span className="mt-auto pt-6 text-sm font-semibold text-brand-300 transition group-hover:text-brand-200 flex items-center gap-1">
        Open Tool <span aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  )
}

export default function Home({ tools }) {
  const availableCount = tools.filter((tool) => tool.isAvailable).length

  return (
    <main className="relative min-h-screen overflow-x-clip bg-surface-950 px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[100px]" />
      </div>

      <header className="mx-auto max-w-5xl motion-enter text-center">
        <h1 className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl">
          Microtools
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          A collection of lightweight, single-purpose utilities for everyday tasks.
          Fast, minimal, and running entirely locally in your browser.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#tools"
            className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            Browse Tools
          </a>
          <a
            href="https://github.com/Champion2005/microtools-mcp"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center rounded-full border border-surface-700 bg-surface-800 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400/50 hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            Get MCP Server
          </a>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3 motion-enter motion-enter-delay-1">
          <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Available Tools</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">{availableCount}</dd>
          </div>
          <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Data Processing</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">Local Only</dd>
          </div>
          <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">AI Integration</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">MCP Ready</dd>
          </div>
        </dl>
      </header>

      <section id="tools" className="mx-auto mt-24 max-w-5xl motion-enter motion-enter-delay-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-800 pb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-50">Utilities</h2>
            <p className="mt-2 text-slate-400">Click any card below to launch the tool.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-24 max-w-5xl border-t border-surface-800 pt-8 text-center motion-enter motion-enter-delay-3">
        <p className="text-sm text-slate-500">
          Built for simplicity and speed. No trackers, no server-side processing.
        </p>
      </footer>
    </main>
  )
}
