const tools = [
  {
    name: 'Image Batch Resize',
    summary: 'Drop a folder of screenshots and export optimized variants in one click.',
    status: 'Planned',
  },
  {
    name: 'JSON Shape Diff',
    summary: 'Compare two payloads and highlight schema drift before it breaks a deploy.',
    status: 'In progress',
  },
  {
    name: 'Text Cleanup Pad',
    summary: 'Normalize spacing, punctuation, and casing for messy copy-pasted notes.',
    status: 'Planned',
  },
]

export default function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#ffe4b5,transparent_40%),radial-gradient(circle_at_90%_0%,#ffc6a9,transparent_35%),linear-gradient(180deg,#fffdf9_0%,#f9f2e8_100%)] px-5 py-10 text-stone-900 sm:px-8 sm:py-14">
      <section className="mx-auto max-w-5xl">
        <p className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-100/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">
          microtools starter kit
        </p>

        <h1 className="display-font mt-6 max-w-3xl text-4xl leading-tight sm:text-6xl">
          Build tiny tools that solve very specific problems.
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-stone-700">
          Your Vite + React + Tailwind setup is ready. Add one focused tool at a time,
          keep the UX sharp, and ship fast.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700">
            Build first tool
          </button>
          <button className="rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900">
            View roadmap
          </button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <article
              key={tool.name}
              className="card-appear rounded-3xl border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_rgba(120,80,35,0.12)] backdrop-blur"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                {tool.status}
              </p>
              <h2 className="mt-3 text-xl font-bold text-stone-900">{tool.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">{tool.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
