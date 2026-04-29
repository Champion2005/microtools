import { Link } from 'react-router-dom'

const statusStyles = {
  Preview: 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  'Coming Soon': 'border border-surface-700 bg-surface-900 text-slate-300',
}

function ToolCard({ tool }) {
  const content = (
    <>
      <p
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
          statusStyles[tool.status] ?? statusStyles['Coming Soon']
        }`}
      >
        {tool.status}
      </p>
      <h3 className="mt-4 text-xl font-semibold text-slate-100">{tool.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{tool.summary}</p>
    </>
  )

  if (!tool.isAvailable || !tool.href) {
    return (
      <article
        className="flex h-full flex-col rounded-2xl border border-surface-700 bg-surface-800/80 p-5 shadow-panel"
        aria-label={`${tool.name} coming soon`}
      >
        {content}
        <span className="mt-auto pt-6 text-sm font-semibold text-slate-400">Coming soon</span>
      </article>
    )
  }

  return (
    <Link
      to={tool.href}
      className="group flex h-full flex-col rounded-2xl border border-surface-700 bg-surface-800/80 p-5 shadow-panel transition duration-200 hover:-translate-y-1 hover:border-brand-400/40 hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
      aria-label={`Open ${tool.name}`}
    >
      {content}
      <span className="mt-auto pt-6 text-sm font-semibold text-brand-300 transition group-hover:text-brand-200">
        Open preview
      </span>
    </Link>
  )
}

export default function Home({ tools }) {
  const availableCount = tools.filter((tool) => tool.isAvailable).length

  return (
    <main className="relative min-h-screen overflow-x-clip bg-linear-to-b from-surface-950 via-surface-900 to-surface-950 px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-surface-700/50 blur-3xl" />
      </div>

      <header className="mx-auto max-w-6xl motion-enter">
        <p className="inline-flex items-center rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-200">
          APMT Browser Microtools
        </p>

        <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
          Useful everyday tools, built for people, and running entirely in the browser.
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          APMT is a user-facing site for lightweight tools that solve real day-to-day tasks:
          cleaning text, comparing JSON, resizing images, and more. It is not a command deck,
          and the goal is fast results with local, browser-first workflows.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#how-it-works"
            className="inline-flex items-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            How it works
          </a>
          <a
            href="#tools"
            className="inline-flex items-center rounded-full border border-surface-700 bg-surface-800 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400/50 hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            Browse tools
          </a>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3 motion-enter motion-enter-delay-1">
          <div className="rounded-xl border border-surface-700 bg-surface-800/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tool Library</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-100">{tools.length} Cards</dd>
          </div>
          <div className="rounded-xl border border-surface-700 bg-surface-800/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Live Previews</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-100">{availableCount} Available</dd>
          </div>
          <div className="rounded-xl border border-surface-700 bg-surface-800/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Execution Model</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-100">Browser Local</dd>
          </div>
        </dl>
      </header>

      <section id="how-it-works" className="mx-auto mt-14 max-w-6xl motion-enter motion-enter-delay-2">
        <h2 className="font-display text-2xl font-semibold text-slate-50 sm:text-3xl">How APMT Works</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Each tool is intentionally small, focused on one job, and designed for quick in-browser use.
          Start with a card, complete the task, then move on.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-surface-700 bg-surface-800/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">Step 1</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-100">Choose a focused tool</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Pick the exact utility you need instead of navigating a complex all-in-one interface.
            </p>
          </article>
          <article className="rounded-xl border border-surface-700 bg-surface-800/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">Step 2</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-100">Run the task locally</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Process files and text directly in your browser for quick feedback and less friction.
            </p>
          </article>
          <article className="rounded-xl border border-surface-700 bg-surface-800/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">Step 3</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-100">Copy, export, done</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Take the output and continue your workflow without extra setup or heavyweight apps.
            </p>
          </article>
        </div>
      </section>

      <section id="tools" className="mx-auto mt-14 max-w-6xl motion-enter motion-enter-delay-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-50 sm:text-3xl">Tool Cards</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Available cards open live previews. Planned cards are listed now so the roadmap is visible.
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Clickable: Preview · Disabled: Coming Soon
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  )
}
