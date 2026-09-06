import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Clock, Bell, Settings,
  LogOut, CheckCircle, Menu, ChevronRight,
  BookOpen, Calendar, Loader2, Camera, KeyRound, TrendingUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useResource } from '../lib/hooks'
import { api, ApiError } from '../lib/api'
import { img } from '../lib/img'
import { formatDateShort } from '../lib/format'
import { roleLabel, roleBadgeClass } from '../lib/roles'
import { fileToAvatarDataUrl } from '../lib/resizeImage'
import { LoadingState, ErrorState } from '../components/DataStates'
import type { AuthUser } from '../context/AuthContext'
import type { MyDashboardData } from '../lib/types'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: User, label: 'My Profile', id: 'profile' },
  { icon: BookOpen, label: 'Applications', id: 'applications' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

const statusPill = (s: string) =>
  s === 'Approved'
    ? 'bg-green-100 text-green-700'
    : s === 'Rejected'
      ? 'bg-red-100 text-red-600'
      : s === 'Under Review'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-amber-100 text-amber-700'

export default function UserDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useResource<MyDashboardData>('/dashboard/me')

  const [profile, setProfile] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  const notifications = useMemo(() => {
    const list: { text: string; time: string; read: boolean }[] = []
    for (const app of data?.applications ?? []) {
      list.push({
        text: `Your volunteer application for "${app.role}" is ${app.status.toLowerCase()}.`,
        time: formatDateShort(app.createdAt),
        read: app.status !== 'Under Review' && app.status !== 'Pending',
      })
    }
    for (const ev of data?.upcomingEvents ?? []) {
      list.push({ text: `Upcoming event: ${ev.title} — registration is open!`, time: ev.dateLabel ?? '', read: false })
    }
    list.push({ text: 'Welcome to YEEP Somalia! Complete your profile to get started.', time: '', read: true })
    return list
  }, [data])

  const unread = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg(null)
    try {
      const res = await api.patch<AuthUser>('/auth/me', profile)
      updateUser(res.data)
      setProfileMsg('Profile updated.')
    } catch (err) {
      setProfileMsg(err instanceof ApiError ? err.message : 'Could not save changes.')
    } finally {
      setSavingProfile(false)
    }
  }

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarBusy, setAvatarBusy] = useState(false)

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setAvatarBusy(true)
    setProfileMsg(null)
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      const res = await api.patch<AuthUser>('/auth/me', { avatar: dataUrl })
      updateUser(res.data)
      setProfileMsg('Photo updated.')
    } catch (err) {
      setProfileMsg(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Could not upload photo.')
    } finally {
      setAvatarBusy(false)
    }
  }

  // Password change
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwdBusy, setPwdBusy] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg(null)
    if (pwd.newPassword.length < 8) {
      setPwdMsg({ text: 'New password must be at least 8 characters.', ok: false })
      return
    }
    if (pwd.newPassword !== pwd.confirm) {
      setPwdMsg({ text: 'New passwords do not match.', ok: false })
      return
    }
    setPwdBusy(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      })
      setPwd({ currentPassword: '', newPassword: '', confirm: '' })
      setPwdMsg({ text: 'Password changed successfully.', ok: true })
    } catch (err) {
      setPwdMsg({ text: err instanceof ApiError ? err.message : 'Could not change password.', ok: false })
    } finally {
      setPwdBusy(false)
    }
  }

  const counts = data?.counts
  const stats = [
    { label: 'Applications', value: counts?.total ?? 0, icon: BookOpen, color: 'text-[#0f766e] bg-teal-50', trend: `${counts?.total ?? 0} total` },
    { label: 'Approved', value: counts?.approved ?? 0, icon: CheckCircle, color: 'text-green-600 bg-green-50', trend: 'Active roles' },
    { label: 'Pending Review', value: counts?.pending ?? 0, icon: Clock, color: 'text-[#f59e0b] bg-amber-50', trend: 'Awaiting decision' },
    { label: 'Upcoming Events', value: data?.upcomingEvents.length ?? 0, icon: Calendar, color: 'text-blue-500 bg-blue-50', trend: 'You can register' },
  ]

  return (
    <div className="min-h-screen bg-slate-100/70 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0b1a19] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <Link
          to="/"
          title="Back to site"
          className="h-16 px-5 border-b border-white/[0.06] flex items-center gap-3 hover:bg-white/[0.04] transition-colors shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#0d9488] flex items-center justify-center shrink-0 shadow-lg shadow-[#0f766e]/20">
            <span className="text-white font-bold">Y</span>
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm tracking-tight truncate">YEEP Somalia</div>
            <div className="text-[11px] text-slate-400 truncate">Member Dashboard</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Menu</p>
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#0f766e] text-white shadow-lg shadow-[#0f766e]/20'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white/80" />}
                <item.icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.id === 'notifications' && unread > 0 && (
                  <span className={`ml-auto min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                    {unread}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-white/[0.04]">
            <img src={img(user?.avatar, 'w=64&h=64&fit=crop&auto=format')} alt={user?.name} className="w-9 h-9 rounded-lg object-cover bg-white/10 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-white truncate">{user?.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{roleLabel(user?.role)}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block leading-none mb-1">YEEP Somalia Member</p>
              <h1 className="font-semibold text-slate-900 capitalize text-[17px] leading-none tracking-tight truncate">{navItems.find(n => n.id === active)?.label}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2.5 pl-1">
              <img
                src={img(user?.avatar, 'w=64&h=64&fit=crop&auto=format')}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover bg-slate-200 ring-1 ring-slate-200"
              />
              <div className="hidden sm:block leading-tight">
                <div className="text-[13px] font-semibold text-slate-800">{user?.name}</div>
                <div className="text-[11px] text-slate-400">{roleLabel(user?.role)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {loading && <LoadingState label="Loading your dashboard…" />}
          {error && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && data && (
            <>
              {active === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                      <div key={s.label} className="group bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300/70 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center ring-1 ring-inset ring-black/[0.03]`}>
                            <s.icon size={19} />
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp size={11} /> {s.trend}
                          </span>
                        </div>
                        <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">{s.value}</div>
                        <div className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Applications */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-semibold text-slate-900 tracking-tight">Recent Applications</h3>
                      <button onClick={() => setActive('applications')} className="text-xs text-[#0f766e] font-medium flex items-center gap-1">
                        View All <ChevronRight size={12} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {data.applications.slice(0, 3).map((app) => (
                        <div key={app._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50/70 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                            <BookOpen size={14} className="text-[#0f766e]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{app.role}</div>
                            <div className="text-xs text-gray-400">{formatDateShort(app.createdAt)}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusPill(app.status)}`}>{app.status}</span>
                        </div>
                      ))}
                      {data.applications.length === 0 && (
                        <p className="text-sm text-gray-400 py-4 text-center">
                          No applications yet. <Link to="/volunteer" className="text-[#0f766e] font-medium">Apply to volunteer →</Link>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-900 tracking-tight mb-5">Upcoming Events</h3>
                    <div className="space-y-3">
                      {data.upcomingEvents.map((ev) => (
                        <div key={ev._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50/70 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                            <Calendar size={14} className="text-[#f59e0b]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{ev.title}</div>
                            <div className="text-xs text-gray-400">{ev.dateLabel} · {ev.location}</div>
                          </div>
                          <Link to="/events" className="ml-auto text-xs text-[#0f766e] font-medium border border-[#0f766e] px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors">
                            Register
                          </Link>
                        </div>
                      ))}
                      {data.upcomingEvents.length === 0 && (
                        <p className="text-sm text-gray-400 py-4 text-center">No upcoming events.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {active === 'applications' && (
                <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200/70">
                    <h3 className="font-semibold text-slate-900 tracking-tight">Volunteer Applications</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.applications.map((app) => (
                      <div key={app._id} className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                          <User size={18} className="text-[#0f766e]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{app.role}</div>
                          <div className="text-xs text-gray-400">Applied {formatDateShort(app.createdAt)}</div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusPill(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                    {data.applications.length === 0 && (
                      <p className="p-6 text-sm text-gray-400 text-center">You haven't applied to any roles yet.</p>
                    )}
                  </div>
                </div>
              )}

              {active === 'notifications' && (
                <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200/70">
                    <h3 className="font-semibold text-slate-900 tracking-tight">Notifications</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.map((n, i) => (
                      <div key={i} className={`p-5 flex items-start gap-4 ${!n.read ? 'bg-teal-50/30' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-gray-200' : 'bg-[#0f766e]'}`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === 'profile' && (
                <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-8 max-w-xl">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                  <div className="flex items-center gap-5 mb-8">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative group w-20 h-20 rounded-2xl overflow-hidden shadow-md bg-gray-200 shrink-0"
                      title="Change photo"
                    >
                      <img
                        src={img(user?.avatar, 'w=100&h=100&fit=crop&auto=format')}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {avatarBusy ? <Loader2 size={18} className="text-white animate-spin" /> : <Camera size={18} className="text-white" />}
                      </span>
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{user?.name}</h2>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                      <div className="mt-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${roleBadgeClass(user?.role)}`}>
                          {roleLabel(user?.role)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarBusy}
                        className="mt-2 text-xs text-[#0f766e] font-medium border border-[#0f766e] px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-60 inline-flex items-center gap-1.5"
                      >
                        {avatarBusy && <Loader2 size={12} className="animate-spin" />}
                        Change Photo
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <input
                        type="text"
                        value={user?.email ?? ''}
                        disabled
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10 transition-all"
                      />
                    </div>
                    {profileMsg && <p className="text-sm text-[#0f766e]">{profileMsg}</p>}
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full py-3 bg-[#0f766e] text-white font-semibold rounded-xl hover:bg-[#0d9488] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {savingProfile && <Loader2 size={16} className="animate-spin" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {active === 'settings' && (
                <div className="max-w-xl space-y-6">
                  {/* Change Password */}
                  <form onSubmit={changePassword} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-8 space-y-4">
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-[#0f766e]" />
                      <h3 className="font-semibold text-slate-900 tracking-tight">Change Password</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        autoComplete="current-password"
                        value={pwd.currentPassword}
                        onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                        <input
                          type="password"
                          required
                          autoComplete="new-password"
                          value={pwd.newPassword}
                          onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          autoComplete="new-password"
                          value={pwd.confirm}
                          onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10 transition-all"
                        />
                      </div>
                    </div>
                    {pwdMsg && <p className={`text-sm ${pwdMsg.ok ? 'text-[#16a34a]' : 'text-red-500'}`}>{pwdMsg.text}</p>}
                    <button
                      type="submit"
                      disabled={pwdBusy}
                      className="py-2.5 px-5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {pwdBusy && <Loader2 size={15} className="animate-spin" />}
                      Update Password
                    </button>
                  </form>

                  {/* Preferences */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-8 space-y-6">
                  <h3 className="font-semibold text-slate-900 tracking-tight">Account Settings</h3>
                  {[
                    { label: 'Email Notifications', desc: 'Receive updates about programs and events' },
                    { label: 'SMS Alerts', desc: 'Get text messages for urgent updates' },
                    { label: 'Monthly Newsletter', desc: 'Impact reports and program highlights' },
                    { label: 'Public Profile', desc: 'Let others see your volunteer profile' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{s.label}</div>
                        <div className="text-xs text-gray-400">{s.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#0f766e] rounded-full transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
