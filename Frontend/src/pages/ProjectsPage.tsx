import { useEffect, useState } from 'react'
import { MapPin, DollarSign, Users, ArrowRight, X } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { img } from '../lib/img'
import { QueryBoundary } from '../components/DataStates'
import type { Project } from '../lib/types'

const statuses = ['All', 'Ongoing', 'Completed', 'Planned']

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const { data: projects, loading, error, refetch } = useCollection<Project>('/projects', { limit: 100 })

  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter)

  const statusColor: Record<string, string> = {
    Ongoing: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Planned: 'bg-amber-100 text-amber-700',
  }

  const counts = {
    Total: projects.length,
    Ongoing: projects.filter(p => p.status === 'Ongoing').length,
    Completed: projects.filter(p => p.status === 'Completed').length,
    Planned: projects.filter(p => p.status === 'Planned').length,
  }

  // Close the detail modal with Escape and lock body scroll while it's open.
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#115e59] to-[#0f766e] relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">Projects</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Our Projects</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            From leadership academies to community dialogues — every project is a step toward lasting peace.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex gap-6">
              {[
                { label: 'Total Projects', value: counts.Total },
                { label: 'Ongoing', value: counts.Ongoing },
                { label: 'Completed', value: counts.Completed },
                { label: 'Planned', value: counts.Planned },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold text-[#0f766e]">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === s ? 'bg-[#0f766e] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-[#0f766e]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={filtered.length === 0}
            onRetry={refetch}
            emptyLabel="No projects with this status yet."
            loadingLabel="Loading projects…"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((proj) => (
                <div key={proj._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={img(proj.image, 'w=600&h=400&fit=crop&auto=format')}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full ${statusColor[proj.status]}`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{proj.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {proj.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={11} /> ${proj.budget.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {proj.beneficiaries}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">{proj.description}</p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-semibold text-[#0f766e]">{proj.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0f766e] to-[#16a34a] rounded-full"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setSelected(proj)}
                      className="flex items-center justify-center gap-2 py-2.5 border border-[#0f766e] text-[#0f766e] text-sm font-semibold rounded-xl hover:bg-teal-50 transition-colors"
                    >
                      Read More <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-52 bg-gray-100">
              <img
                src={img(selected.image, 'w=800&h=450&fit=crop&auto=format')}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-4 left-4 px-2.5 py-1 text-xs font-bold rounded-full ${statusColor[selected.status]}`}>
                {selected.status}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-5">
                {selected.location && <span className="flex items-center gap-1"><MapPin size={12} /> {selected.location}</span>}
                <span className="flex items-center gap-1"><DollarSign size={12} /> ${selected.budget.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {selected.beneficiaries.toLocaleString()} beneficiaries</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                {selected.description || 'No description provided for this project yet.'}
              </p>

              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-semibold text-[#0f766e]">{selected.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0f766e] to-[#16a34a] rounded-full"
                    style={{ width: `${selected.progress}%` }}
                  />
                </div>
              </div>

              {(selected.fundedBy || selected.partners || selected.startDate || selected.region) && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-gray-100 pt-5">
                  {selected.region && (
                    <div><dt className="text-xs text-gray-400">Region</dt><dd className="text-gray-700">{selected.region}</dd></div>
                  )}
                  {selected.startDate && (
                    <div><dt className="text-xs text-gray-400">Started</dt><dd className="text-gray-700">{new Date(selected.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</dd></div>
                  )}
                  {selected.fundedBy && (
                    <div><dt className="text-xs text-gray-400">Funded by</dt><dd className="text-gray-700">{selected.fundedBy}</dd></div>
                  )}
                  {selected.partners && (
                    <div><dt className="text-xs text-gray-400">Partners</dt><dd className="text-gray-700">{selected.partners}</dd></div>
                  )}
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
