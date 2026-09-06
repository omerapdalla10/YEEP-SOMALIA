import { useState } from 'react'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { img } from '../lib/img'
import { QueryBoundary } from '../components/DataStates'
import type { EventItem } from '../lib/types'

const typeColor: Record<string, string> = {
  Community: 'bg-green-100 text-green-700',
  Conference: 'bg-blue-100 text-blue-700',
  Workshop: 'bg-purple-100 text-purple-700',
  Fundraiser: 'bg-amber-100 text-amber-700',
  Forum: 'bg-teal-100 text-teal-700',
  Networking: 'bg-rose-100 text-rose-700',
}

export default function EventsPage() {
  const [activeMonth, setActiveMonth] = useState('All')
  const { data: events, loading, error, refetch } = useCollection<EventItem>('/events', { limit: 100 })

  const months = Array.from(new Set(events.map(e => e.month).filter(Boolean))) as string[]
  const filtered = activeMonth === 'All' ? events : events.filter(e => e.month === activeMonth)

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0f766e] to-[#115e59]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">Events</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Upcoming Events</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join us at forums, workshops, dialogues, and roundtables — every event is a chance to connect and build peace.
          </p>
        </div>
      </section>

      {/* Month filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap">
            {['All', ...months].map((m) => (
              <button
                key={m}
                onClick={() => setActiveMonth(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeMonth === m ? 'bg-[#0f766e] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-[#0f766e]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={filtered.length === 0}
            onRetry={refetch}
            emptyLabel="No events scheduled for this month."
            loadingLabel="Loading events…"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {filtered.map((event) => {
                const spots = event.capacity || 0
                const registered = event.registered || 0
                return (
                  <div key={event._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
                    <div className="relative sm:w-44 h-44 sm:h-auto overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={img(event.image, 'w=400&h=300&fit=crop&auto=format')}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${typeColor[event.type]}`}>
                          {event.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{event.description}</p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Calendar size={11} className="text-[#0f766e]" /> {event.dateLabel}</span>
                        <span className="flex items-center gap-1"><Clock size={11} className="text-[#0f766e]" /> {event.timeLabel}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-[#0f766e]" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users size={11} className="text-[#0f766e]" /> {registered}/{spots} spots</span>
                      </div>
                      {/* Spots progress */}
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-[#0f766e] rounded-full"
                          style={{ width: `${spots ? (registered / spots) * 100 : 0}%` }}
                        />
                      </div>
                      <button className="flex items-center justify-center gap-1.5 py-2 bg-[#0f766e] hover:bg-[#0d9488] text-white text-xs font-semibold rounded-xl transition-colors">
                        Register Now <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </QueryBoundary>
        </div>
      </section>
    </div>
  )
}
