import { CheckCircle, Target, Eye, Users, ShieldCheck, Scale, HeartHandshake, Handshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCollection } from '../lib/hooks'
import { img } from '../lib/img'
import { QueryBoundary } from '../components/DataStates'
import type { TeamMember, Milestone } from '../lib/types'

const values = [
  { icon: Users, title: 'Youth Leadership & Ownership', desc: 'Young people lead the work — as decision-makers, facilitators, and advocates, not just beneficiaries.' },
  { icon: ShieldCheck, title: 'Peacebuilding & P/CVE', desc: 'We work non-violently to reduce conflict and to prevent and counter violent extremism.' },
  { icon: Scale, title: 'Gender Inclusion', desc: 'We invest in young women leaders and make space for voices too often left out of peace and security.' },
  { icon: HeartHandshake, title: 'Community Resilience & Dialogue', desc: 'We bring youth, elders, women, and authorities together to build trust and solve problems locally.' },
  { icon: Handshake, title: 'Partnership & Collaboration', desc: 'We work with government, civil society, and international partners to reach further together.' },
]

export default function AboutPage() {
  const team = useCollection<TeamMember>('/team', { limit: 100 })
  const timeline = useCollection<Milestone>('/milestones', { limit: 100 })

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-[#0f766e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">About Us</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Our Story, Mission & Vision</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            YEEP Somalia is a youth-led NGO in Mogadishu, strengthening youth leadership in peacebuilding and preventing violent extremism across Somalia.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-5">A Youth-Led Movement for Peace</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                YEEP Somalia — the Youth Engagement and Empowerment Programme — was founded in 2024 by young Somali peacebuilders in Mogadishu. It began as a national initiative to strengthen youth leadership in peacebuilding and to prevent violent extremism, giving young people a real seat at the table on the issues that shape their communities.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Today we work across Banadir and several federal member states on Youth, Peace and Security (YPS), youth leadership, civic engagement, and community resilience — alongside more than ten partner organisations in government and civil society. Our work is shaped by the young people we serve: their priorities, their resilience, and their determination drive everything we do.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Founded', value: '2024' },
                  { label: 'Base', value: 'Mogadishu' },
                  { label: 'Focus', value: 'YPS' },
                  { label: 'Partners', value: '10+' },
                ].map((s) => (
                  <div key={s.label} className="bg-[#f8fafc] rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#0f766e]">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=500&fit=crop&auto=format"
                alt="YEEP Somalia team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-[#0f766e] flex items-center justify-center mb-4">
                <Eye size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-500 leading-relaxed">
                "Youth are not just beneficiaries of change — we are the leaders of change. Youth are not the leaders of tomorrow — we are the leaders of today."
              </p>
            </div>
            <div className="bg-[#0f766e] rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Target size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                To equip young leaders with the skills, knowledge, and opportunities to drive positive change, counter violent extremism, and build resilient communities.
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-7 text-center">Strategic Objectives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Build the leadership and peacebuilding capacity of young Somalis',
                'Create safe spaces for youth to address community challenges',
                'Advance the Youth, Peace and Security (YPS) agenda nationally',
                'Support youth-led initiatives that prevent violent extremism',
                'Integrate youth voices into peace and security policy',
                'Strengthen partnerships across government and civil society',
              ].map((obj) => (
                <div key={obj} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <CheckCircle size={18} className="text-[#16a34a] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v) => (
              <div key={v.title} className="group text-center p-7 rounded-2xl hover:bg-[#0f766e] transition-all duration-300 border border-gray-100 hover:border-[#0f766e] hover:shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 group-hover:bg-white/20 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <v.icon size={24} className="text-[#0f766e] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">{v.title}</h4>
                <p className="text-sm text-gray-500 group-hover:text-white/80 leading-relaxed transition-colors">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Timeline of Achievements</h2>
          </div>
          <QueryBoundary
            loading={timeline.loading}
            error={timeline.error}
            empty={timeline.data.length === 0}
            onRetry={timeline.refetch}
          >
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-8">
                {timeline.data.map((item, i) => (
                  <div key={item._id} className={`flex gap-8 items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="bg-white rounded-xl p-5 shadow-sm inline-block max-w-xs">
                        <div className="text-[#0f766e] font-bold mb-1">{item.year}</div>
                        <p className="text-sm text-gray-600">{item.event}</p>
                      </div>
                    </div>
                    <div className="relative z-10 w-4 h-4 rounded-full bg-[#0f766e] border-4 border-white shadow-md shrink-0" />
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">The People</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Meet the Leadership Team</h2>
          </div>
          <QueryBoundary
            loading={team.loading}
            error={team.error}
            empty={team.data.length === 0}
            onRetry={team.refetch}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {team.data.map((member) => (
                <div key={member._id} className="group text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white ring-offset-2 group-hover:ring-[#0f766e] transition-all shadow-md">
                    <img
                      src={img(member.image, 'w=200&h=200&fit=crop&auto=format')}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0f766e]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-white/80 mb-8">Whether you volunteer or partner with us — every action creates ripples of change.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/volunteer" className="px-7 py-3 bg-white text-[#0f766e] font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
              Volunteer Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
