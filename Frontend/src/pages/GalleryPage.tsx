import { useState } from 'react'
import { X, ZoomIn, Play } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { img } from '../lib/img'
import { QueryBoundary } from '../components/DataStates'
import type { GalleryItem } from '../lib/types'

const categories = ['All', 'Programs', 'Events', 'Community', 'Volunteers']

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const { data: items, loading, error, refetch } = useCollection<GalleryItem>('/gallery', { limit: 100 })

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory)

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0f766e] to-[#115e59]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">Gallery</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Photo & Video Gallery</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            A visual journey through the training, dialogues, and milestones of YEEP Somalia's community.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === c ? 'bg-[#0f766e] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-[#0f766e]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={filtered.length === 0}
            onRetry={refetch}
            emptyLabel="No media in this category yet."
            loadingLabel="Loading gallery…"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
              {filtered.map((item, i) => (
                <div
                  key={item._id}
                  className={`relative group overflow-hidden rounded-2xl bg-gray-200 cursor-pointer ${item.span}`}
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={img(item.image, 'w=600&h=600&fit=crop&auto=format')}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                    {item.type === 'video' ? (
                      <Play size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity px-3 text-center">
                      {item.caption}
                    </p>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Play size={9} /> VIDEO
                    </div>
                  )}
                </div>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={img(filtered[lightbox].image, 'w=1200&h=800&fit=crop&auto=format')}
              alt={filtered[lightbox].caption}
              className="w-full rounded-2xl shadow-2xl"
            />
            <p className="text-white/80 text-sm text-center mt-4">{filtered[lightbox].caption}</p>
          </div>
        </div>
      )}
    </div>
  )
}
