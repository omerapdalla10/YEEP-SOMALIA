import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, FolderOpen, Calendar, Newspaper,
  Settings, LogOut, Bell, Menu, ChevronRight,
  BookOpen, Search, Download, Edit, Trash2,
  UserCheck, Activity, Clock, Camera, KeyRound,
  Plus, X, MapPin, CheckCircle, AlertCircle, Loader2, TrendingUp, ImagePlus,
  Images, Quote, Handshake, Star
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { useAuth, type AuthUser } from '../context/AuthContext'
import { useCollection, useResource } from '../lib/hooks'
import { api, ApiError } from '../lib/api'
import { img } from '../lib/img'
import { formatDateShort } from '../lib/format'
import { roleLabel, roleBadgeClass } from '../lib/roles'
import { fileToAvatarDataUrl, fileToCoverDataUrl } from '../lib/resizeImage'
import { LoadingState, ErrorState } from '../components/DataStates'
import type {
  AdminDashboardData, AdminUser, Program, Project, EventItem, Article, VolunteerApplication,
  GalleryItem, TeamMember, Testimonial, Partner,
} from '../lib/types'

function AdminAccountCard() {
  const { user, updateUser } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null)
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwdBusy, setPwdBusy] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setAvatarBusy(true)
    setAvatarMsg(null)
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      const res = await api.patch<AuthUser>('/auth/me', { avatar: dataUrl })
      updateUser(res.data)
      setAvatarMsg('Photo updated.')
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setAvatarBusy(false)
    }
  }

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg(null)
    if (pwd.newPassword.length < 8) return setPwdMsg({ text: 'New password must be at least 8 characters.', ok: false })
    if (pwd.newPassword !== pwd.confirm) return setPwdMsg({ text: 'New passwords do not match.', ok: false })
    setPwdBusy(true)
    try {
      await api.post('/auth/change-password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword })
      setPwd({ currentPassword: '', newPassword: '', confirm: '' })
      setPwdMsg({ text: 'Password changed successfully.', ok: true })
    } catch (err) {
      setPwdMsg({ text: err instanceof ApiError ? err.message : 'Could not change password.', ok: false })
    } finally {
      setPwdBusy(false)
    }
  }

  const fieldCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]'

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-8 max-w-xl space-y-6">
      <h3 className="font-semibold text-slate-900 tracking-tight">My Account</h3>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative group w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-gray-200 shrink-0"
          title="Change photo"
        >
          <img src={img(user?.avatar, 'w=100&h=100&fit=crop&auto=format')} alt={user?.name} className="w-full h-full object-cover" />
          <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {avatarBusy ? <Loader2 size={16} className="text-white animate-spin" /> : <Camera size={16} className="text-white" />}
          </span>
        </button>
        <div>
          <div className="font-semibold text-gray-900">{user?.name}</div>
          <div className="text-xs text-gray-400">{user?.email}</div>
          <div className="mt-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${roleBadgeClass(user?.role)}`}>
              {roleLabel(user?.role)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={avatarBusy}
            className="mt-1.5 text-xs text-[#0f766e] font-medium border border-[#0f766e] px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-60"
          >
            Change Photo
          </button>
          {avatarMsg && <p className="text-xs text-[#16a34a] mt-1">{avatarMsg}</p>}
        </div>
      </div>

      <form onSubmit={submitPwd} className="space-y-4 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2 pt-4">
          <KeyRound size={15} className="text-[#0f766e]" />
          <h4 className="font-semibold text-gray-900 text-sm">Change Password</h4>
        </div>
        <input type="password" required autoComplete="current-password" placeholder="Current password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} className={fieldCls} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="password" required autoComplete="new-password" placeholder="New password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} className={fieldCls} />
          <input type="password" required autoComplete="new-password" placeholder="Confirm new password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={fieldCls} />
        </div>
        {pwdMsg && <p className={`text-sm ${pwdMsg.ok ? 'text-[#16a34a]' : 'text-red-500'}`}>{pwdMsg.text}</p>}
        <button type="submit" disabled={pwdBusy} className="py-2.5 px-5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors disabled:opacity-70 inline-flex items-center gap-2">
          {pwdBusy && <Loader2 size={15} className="animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  )
}

/** `adminOnly` items are hidden from `staff`. */
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Users, label: 'Users', id: 'users', adminOnly: true },
  { icon: UserCheck, label: 'Volunteers', id: 'volunteers' },
  { icon: FolderOpen, label: 'Projects', id: 'projects' },
  { icon: BookOpen, label: 'Programs', id: 'programs' },
  { icon: Calendar, label: 'Events', id: 'events' },
  { icon: Newspaper, label: 'News', id: 'news' },
  { icon: Images, label: 'Gallery', id: 'gallery' },
  { icon: UserCheck, label: 'Team', id: 'team' },
  { icon: Quote, label: 'Testimonials', id: 'testimonials' },
  { icon: Handshake, label: 'Partners', id: 'partners' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

const galleryCategories = ['Programs', 'Events', 'Community', 'Volunteers']

// All 18 federal member state regions (gobollada) of Somalia.
const regions = [
  'Awdal', 'Bakool', 'Banaadir', 'Bari', 'Bay', 'Galguduud', 'Gedo', 'Hiiraan',
  'Jubbada Dhexe', 'Jubbada Hoose', 'Mudug', 'Nugaal', 'Sanaag', 'Shabeellaha Dhexe',
  'Shabeellaha Hoose', 'Sool', 'Togdheer', 'Woqooyi Galbeed',
]
const programCategories = ['Education', 'Skills', 'Leadership', 'Health', 'Arts', 'Vocational', 'Digital Literacy', 'Entrepreneurship']
const newsCategories = ['Events', 'Impact', 'Education', 'Partnerships', 'Stories', 'Funding', 'Programs', 'News']

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200/70 flex items-center justify-between z-10">
          <h2 className="font-semibold text-slate-900 tracking-tight text-lg">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{required && ' *'}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20 transition-colors bg-white'

/** Image picker used by every content modal. Stores a resized data URL. */
function ImageField({
  value,
  onChange,
  label = 'Cover Image',
  shape = 'cover',
}: {
  value: string
  onChange: (v: string) => void
  label?: string
  shape?: 'cover' | 'square'
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setErr(null)
    try {
      onChange(shape === 'square' ? await fileToAvatarDataUrl(file, 512) : await fileToCoverDataUrl(file))
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Could not read that image.')
    } finally {
      setBusy(false)
    }
  }

  const box = shape === 'square' ? 'w-20 h-20' : 'w-32 h-20'
  const params = shape === 'square' ? 'w=160&h=160&fit=crop&auto=format' : 'w=256&h=160&fit=crop&auto=format'

  return (
    <Field label={label}>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div className="flex items-center gap-4">
        <div className={`${box} rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center`}>
          {value
            ? <img src={img(value, params)} alt="" className="w-full h-full object-cover" />
            : <ImagePlus size={20} className="text-gray-300" />}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="text-xs font-medium text-[#0f766e] border border-[#0f766e] px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-60 inline-flex items-center gap-1.5 w-fit"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
            {value ? 'Replace image' : 'Upload image'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-gray-400 hover:text-red-500 transition-colors w-fit">
              Remove
            </button>
          )}
          <span className="text-[11px] text-gray-400">
            JPG or PNG · resized to {shape === 'square' ? '512×512' : '1024×576'}
          </span>
          {err && <span className="text-[11px] text-red-500">{err}</span>}
        </div>
      </div>
    </Field>
  )
}

function SavedState({ label }: { label: string }) {
  return (
    <div className="py-10 flex flex-col items-center gap-3 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <p className="font-semibold text-gray-900">{label}</p>
    </div>
  )
}

const statusBadge = (s: string) => {
  const m: Record<string, string> = {
    Ongoing: 'bg-blue-100 text-blue-700', Completed: 'bg-green-100 text-green-700',
    Planned: 'bg-amber-100 text-amber-700', Active: 'bg-green-100 text-green-700',
    Enrolling: 'bg-amber-100 text-amber-700', Paused: 'bg-gray-100 text-gray-500',
    Open: 'bg-teal-100 text-teal-700', Full: 'bg-red-100 text-red-600',
    Published: 'bg-green-100 text-green-700', Draft: 'bg-gray-100 text-gray-500',
  }
  return `text-xs px-2.5 py-1 rounded-full font-medium ${m[s] || 'bg-gray-100 text-gray-500'}`
}

const activityColor: Record<string, string> = {
  volunteer: 'bg-teal-100 text-teal-700',
  event: 'bg-blue-100 text-blue-700',
  news: 'bg-purple-100 text-purple-700',
  project: 'bg-green-100 text-green-700',
}

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const visibleNav = navItems.filter((i) => isAdmin || !i.adminOnly)

  const dashboard = useResource<AdminDashboardData>(active === 'dashboard' ? '/dashboard/admin' : null)
  const users = useCollection<AdminUser>(active === 'users' ? '/users' : null, { limit: 100 })
  const volunteers = useCollection<VolunteerApplication>(active === 'volunteers' ? '/volunteers' : null, { limit: 100 })
  const projects = useCollection<Project>(active === 'projects' ? '/projects' : null, { limit: 100 })
  const programs = useCollection<Program>(active === 'programs' ? '/programs' : null, { limit: 100 })
  const events = useCollection<EventItem>(active === 'events' ? '/events' : null, { limit: 100 })
  const news = useCollection<Article>(active === 'news' ? '/news' : null, { limit: 100 })
  const gallery = useCollection<GalleryItem>(active === 'gallery' ? '/gallery' : null, { limit: 100 })
  const team = useCollection<TeamMember>(active === 'team' ? '/team' : null, { limit: 100 })
  const testimonials = useCollection<Testimonial>(active === 'testimonials' ? '/testimonials' : null, { limit: 100 })
  const partners = useCollection<Partner>(active === 'partners' ? '/partners' : null, { limit: 100 })

  const [modal, setModal] = useState<null | 'project' | 'program' | 'event' | 'news' | 'user' | 'gallery' | 'team' | 'testimonial' | 'partner'>(null)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // One id shared by all content modals — only one is ever open at a time.
  // null = the modal is in "create" mode.
  const [editId, setEditId] = useState<string | null>(null)

  const emptyProjForm = { title: '', description: '', region: '', district: '', budget: '', status: 'Ongoing', startDate: '', targetBeneficiaries: '', fundedBy: '', partners: '', image: '', progress: '0' }
  const emptyProgForm = { title: '', description: '', category: '', region: '', status: 'Active', targetBeneficiaries: '', startDate: '', endDate: '', duration: '', progress: '0', image: '', isFeatured: false }
  const emptyEvtForm = { title: '', description: '', date: '', endDate: '', location: '', region: '', capacity: '', registrationDeadline: '', image: '', isFeatured: false }
  const emptyNewsForm = { title: '', excerpt: '', category: '', author: '', status: 'Draft', tags: '', image: '', isFeatured: false }
  const emptyGalleryForm = { image: '', type: 'image', videoUrl: '', category: 'Programs', caption: '', order: '' }
  const emptyTeamForm = { name: '', role: '', image: '', bio: '', order: '', active: true }
  const emptyTestimonialForm = { name: '', role: '', text: '', image: '', rating: '5', placement: 'home', order: '' }
  const emptyPartnerForm = { name: '', logo: '', website: '', order: '' }

  const [projForm, setProjForm] = useState(emptyProjForm)
  const [progForm, setProgForm] = useState(emptyProgForm)
  const [evtForm, setEvtForm] = useState(emptyEvtForm)
  const [newsForm, setNewsForm] = useState(emptyNewsForm)
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm)
  const [teamForm, setTeamForm] = useState(emptyTeamForm)
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm)
  const [partnerForm, setPartnerForm] = useState(emptyPartnerForm)
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', phone: '', role: 'volunteer', isActive: true })

  function openProjectModal(p?: Project) {
    setEditId(p?._id ?? null)
    setProjForm(p ? {
      title: p.title, description: p.description ?? '', region: p.region ?? '', district: p.district ?? '',
      budget: p.budget ? String(p.budget) : '', status: p.status,
      startDate: p.startDate ? p.startDate.slice(0, 10) : '',
      targetBeneficiaries: p.beneficiaries ? String(p.beneficiaries) : '',
      fundedBy: p.fundedBy ?? '', partners: p.partners ?? '', image: p.image ?? '', progress: String(p.progress ?? 0),
    } : emptyProjForm)
    setFormError(null); setModal('project')
  }

  function openProgramModal(p?: Program) {
    setEditId(p?._id ?? null)
    setProgForm(p ? {
      title: p.title, description: p.description ?? '', category: p.category ?? '', region: p.region ?? '',
      status: p.status ?? 'Active',
      targetBeneficiaries: p.beneficiaries ? String(p.beneficiaries) : '',
      startDate: '', endDate: '', duration: p.duration ?? '', progress: String(p.progress ?? 0),
      image: p.image ?? '', isFeatured: !!p.featured,
    } : emptyProgForm)
    setFormError(null); setModal('program')
  }

  function openEventModal(ev?: EventItem) {
    setEditId(ev?._id ?? null)
    setEvtForm(ev ? {
      title: ev.title, description: ev.description ?? '',
      date: ev.startDate ? ev.startDate.slice(0, 10) : '',
      endDate: ev.endDate ? ev.endDate.slice(0, 10) : '',
      location: ev.location ?? '', region: ev.region ?? '',
      capacity: ev.capacity ? String(ev.capacity) : '',
      registrationDeadline: ev.registrationDeadline ? ev.registrationDeadline.slice(0, 10) : '',
      image: ev.image ?? '', isFeatured: !!ev.featured,
    } : emptyEvtForm)
    setFormError(null); setModal('event')
  }

  function openNewsModal(n?: Article) {
    setEditId(n?._id ?? null)
    setNewsForm(n ? {
      title: n.title, excerpt: n.excerpt ?? '', category: n.category ?? '', author: n.author ?? '',
      status: n.published ? 'Published' : 'Draft',
      tags: Array.isArray(n.tags) ? n.tags.join(', ') : '',
      image: n.image ?? '', isFeatured: !!n.featured,
    } : emptyNewsForm)
    setFormError(null); setModal('news')
  }

  function openGalleryModal(g?: GalleryItem) {
    setEditId(g?._id ?? null)
    setGalleryForm(g ? {
      image: g.image ?? '', type: g.type ?? 'image', videoUrl: g.videoUrl ?? '',
      category: g.category ?? 'Programs', caption: g.caption ?? '',
      order: g.order != null ? String(g.order) : '',
    } : emptyGalleryForm)
    setFormError(null); setModal('gallery')
  }

  function openTeamModal(t?: TeamMember) {
    setEditId(t?._id ?? null)
    setTeamForm(t ? {
      name: t.name, role: t.role, image: t.image ?? '', bio: t.bio ?? '',
      order: t.order != null ? String(t.order) : '', active: t.active ?? true,
    } : emptyTeamForm)
    setFormError(null); setModal('team')
  }

  function openTestimonialModal(t?: Testimonial) {
    setEditId(t?._id ?? null)
    setTestimonialForm(t ? {
      name: t.name, role: t.role ?? '', text: t.text, image: t.image ?? '',
      rating: String(t.rating ?? 5), placement: t.placement ?? 'home',
      order: t.order != null ? String(t.order) : '',
    } : emptyTestimonialForm)
    setFormError(null); setModal('testimonial')
  }

  function openPartnerModal(p?: Partner) {
    setEditId(p?._id ?? null)
    setPartnerForm(p ? {
      name: p.name, logo: p.logo ?? '', website: p.website ?? '',
      order: p.order != null ? String(p.order) : '',
    } : emptyPartnerForm)
    setFormError(null); setModal('partner')
  }

  const closeModal = () => {
    setModal(null); setSaved(false); setFormError(null); setSubmitting(false); setEditId(null)
    setProjForm(emptyProjForm); setProgForm(emptyProgForm); setEvtForm(emptyEvtForm); setNewsForm(emptyNewsForm)
    setGalleryForm(emptyGalleryForm); setTeamForm(emptyTeamForm); setTestimonialForm(emptyTestimonialForm); setPartnerForm(emptyPartnerForm)
  }

  async function submit(fn: () => Promise<void>, refetch: () => void) {
    setSubmitting(true)
    setFormError(null)
    try {
      await fn()
      setSaved(true)
      refetch()
      setTimeout(closeModal, 1200)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveProject = () =>
    submit(async () => {
      const payload = {
        title: projForm.title,
        description: projForm.description || undefined,
        region: projForm.region || undefined,
        district: projForm.district || undefined,
        budget: projForm.budget ? Number(projForm.budget) : undefined,
        status: projForm.status,
        startDate: projForm.startDate || undefined,
        beneficiaries: projForm.targetBeneficiaries ? Number(projForm.targetBeneficiaries) : undefined,
        progress: projForm.progress === '' ? undefined : Math.max(0, Math.min(100, Number(projForm.progress))),
        image: projForm.image || undefined,
        fundedBy: projForm.fundedBy || undefined,
        partners: projForm.partners || undefined,
      }
      if (editId) await api.patch(`/projects/${editId}`, payload)
      else await api.post('/projects', payload)
    }, projects.refetch)

  const handleSaveProgram = () =>
    submit(async () => {
      const payload = {
        title: progForm.title,
        description: progForm.description || undefined,
        category: progForm.category,
        region: progForm.region || undefined,
        status: progForm.status,
        beneficiaries: progForm.targetBeneficiaries ? Number(progForm.targetBeneficiaries) : undefined,
        progress: progForm.progress === '' ? undefined : Math.max(0, Math.min(100, Number(progForm.progress))),
        duration: progForm.duration || undefined,
        image: progForm.image || undefined,
        featured: progForm.isFeatured,
      }
      if (editId) await api.patch(`/programs/${editId}`, payload)
      else await api.post('/programs', payload)
    }, programs.refetch)

  const handleSaveEvent = () =>
    submit(async () => {
      const payload = {
        title: evtForm.title,
        description: evtForm.description || undefined,
        startDate: evtForm.date,
        endDate: evtForm.endDate || undefined,
        dateLabel: evtForm.date
          ? new Date(evtForm.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : undefined,
        month: evtForm.date
          ? new Date(evtForm.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : undefined,
        location: evtForm.location || undefined,
        region: evtForm.region || undefined,
        capacity: evtForm.capacity ? Number(evtForm.capacity) : undefined,
        registrationDeadline: evtForm.registrationDeadline || undefined,
        image: evtForm.image || undefined,
        featured: evtForm.isFeatured,
      }
      if (editId) await api.patch(`/events/${editId}`, payload)
      else await api.post('/events', payload)
    }, events.refetch)

  const handleSaveNews = () =>
    submit(async () => {
      const payload = {
        title: newsForm.title,
        excerpt: newsForm.excerpt || undefined,
        category: newsForm.category || undefined,
        author: newsForm.author || undefined,
        published: newsForm.status === 'Published',
        tags: newsForm.tags ? newsForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        image: newsForm.image || undefined,
        featured: newsForm.isFeatured,
      }
      if (editId) await api.patch(`/news/${editId}`, payload)
      else await api.post('/news', payload)
    }, news.refetch)

  const handleSaveGallery = () =>
    submit(async () => {
      const payload = {
        image: galleryForm.image,
        type: galleryForm.type,
        videoUrl: galleryForm.type === 'video' ? galleryForm.videoUrl || undefined : undefined,
        category: galleryForm.category,
        caption: galleryForm.caption || undefined,
        order: galleryForm.order === '' ? undefined : Number(galleryForm.order),
      }
      if (editId) await api.patch(`/gallery/${editId}`, payload)
      else await api.post('/gallery', payload)
    }, gallery.refetch)

  const handleSaveTeam = () =>
    submit(async () => {
      const payload = {
        name: teamForm.name,
        role: teamForm.role,
        image: teamForm.image || undefined,
        bio: teamForm.bio || undefined,
        order: teamForm.order === '' ? undefined : Number(teamForm.order),
        active: teamForm.active,
      }
      if (editId) await api.patch(`/team/${editId}`, payload)
      else await api.post('/team', payload)
    }, team.refetch)

  const handleSaveTestimonial = () =>
    submit(async () => {
      const payload = {
        name: testimonialForm.name,
        role: testimonialForm.role || undefined,
        text: testimonialForm.text,
        image: testimonialForm.image || undefined,
        rating: testimonialForm.rating === '' ? undefined : Math.max(1, Math.min(5, Number(testimonialForm.rating))),
        placement: testimonialForm.placement,
        order: testimonialForm.order === '' ? undefined : Number(testimonialForm.order),
      }
      if (editId) await api.patch(`/testimonials/${editId}`, payload)
      else await api.post('/testimonials', payload)
    }, testimonials.refetch)

  const handleSavePartner = () =>
    submit(async () => {
      const payload = {
        name: partnerForm.name,
        logo: partnerForm.logo || undefined,
        website: partnerForm.website || undefined,
        order: partnerForm.order === '' ? undefined : Number(partnerForm.order),
      }
      if (editId) await api.patch(`/partners/${editId}`, payload)
      else await api.post('/partners', payload)
    }, partners.refetch)

  const handleSaveUser = () =>
    submit(async () => {
      await api.post('/users', {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone || undefined,
        role: userForm.role,
        isActive: userForm.isActive,
      })
      setUserForm({ name: '', email: '', password: '', phone: '', role: 'volunteer', isActive: true })
    }, users.refetch)

  async function remove(path: string, refetch: () => void) {
    try {
      await api.del(path)
      refetch()
    } catch {
      /* ignore — row stays */
    }
  }

  async function patchUser(id: string, body: Record<string, unknown>) {
    try {
      await api.patch(`/users/${id}`, body)
      users.refetch()
    } catch {
      /* ignore */
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const kpiCards = dashboard.data
    ? [
        { label: 'Total Users', value: dashboard.data.kpis.totalUsers.toLocaleString(), change: `${dashboard.data.kpis.activeVolunteers} volunteers`, icon: Users, color: 'bg-blue-50 text-blue-600' },
        { label: 'Active Programs', value: String(dashboard.data.kpis.activePrograms), change: 'live', icon: BookOpen, color: 'bg-teal-50 text-[#0f766e]' },
        { label: 'Volunteer Hours', value: dashboard.data.kpis.volunteerHours.toLocaleString(), change: 'est.', icon: Clock, color: 'bg-green-50 text-green-600' },
        { label: 'Events', value: String(dashboard.data.kpis.events), change: `${dashboard.data.kpis.upcomingEvents} upcoming`, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
      ]
    : []

  return (
    <div className="min-h-screen bg-slate-100/70 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0b1a19] border-r border-white/[0.06] flex flex-col transition-all duration-300 ${collapsed ? 'lg:w-[72px]' : 'w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Link
          to="/"
          title="Back to site"
          className={`h-16 px-5 border-b border-white/[0.06] flex items-center hover:bg-white/[0.04] transition-colors shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#0d9488] flex items-center justify-center shrink-0 shadow-lg shadow-[#0f766e]/20">
            <span className="text-white font-bold">Y</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm tracking-tight truncate">YEEP Somalia Admin</div>
              <div className="text-[11px] text-slate-400 truncate">Management Console</div>
            </div>
          )}
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Menu</p>}
          {visibleNav.map((item) => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                title={collapsed ? item.label : ''}
                className={`group relative w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-[#0f766e] text-white shadow-lg shadow-[#0f766e]/20' : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {isActive && !collapsed && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white/80" />}
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-white/[0.04]">
              <img src={img(user?.avatar, 'w=64&h=64&fit=crop&auto=format')} alt={user?.name} className="w-9 h-9 rounded-lg object-cover bg-white/10 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-white truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{roleLabel(user?.role)}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-white/[0.05] hover:text-slate-300 transition-colors`}
          >
            <ChevronRight size={15} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
            {!collapsed && 'Collapse'}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors`}
          >
            <LogOut size={16} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block leading-none mb-1">YEEP Somalia Admin</p>
              <h1 className="font-semibold text-slate-900 capitalize text-[17px] leading-none tracking-tight truncate">
                {navItems.find(n => n.id === active)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search…" className="pl-9 pr-4 py-2 text-xs bg-slate-100/80 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10 transition-all w-52" />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2.5 pl-1">
              <img src={img(user?.avatar, 'w=64&h=64&fit=crop&auto=format')} alt={user?.name} className="w-8 h-8 rounded-lg object-cover bg-slate-200 ring-1 ring-slate-200" />
              <div className="hidden sm:block leading-tight">
                <div className="text-[13px] font-semibold text-slate-800">{user?.name}</div>
                <div className="text-[11px] text-slate-400">{roleLabel(user?.role)}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* ── DASHBOARD ─────────────────────────────────────────────── */}
          {active === 'dashboard' && (
            <>
              {dashboard.loading && <LoadingState label="Loading dashboard…" />}
              {dashboard.error && <ErrorState message={dashboard.error} onRetry={dashboard.refetch} />}
              {dashboard.data && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {kpiCards.map((s) => (
                      <div key={s.label} className="group bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300/70 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center ring-1 ring-inset ring-black/[0.03]`}>
                            <s.icon size={19} />
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp size={11} /> {s.change}
                          </span>
                        </div>
                        <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">{s.value}</div>
                        <div className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-slate-900 tracking-tight">User Growth</h3>
                        <span className="text-xs text-gray-400">Cumulative registrations</span>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={dashboard.data.userGrowth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="users" fill="#0f766e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70">
                      <h3 className="font-semibold text-slate-900 tracking-tight mb-5">Program Distribution</h3>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={dashboard.data.programDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                            {dashboard.data.programDist.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => [`${v}%`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-2 space-y-1.5">
                        {dashboard.data.programDist.map((p) => (
                          <div key={p.name} className="flex items-center gap-2 text-xs">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                            <span className="text-gray-600 flex-1">{p.name}</span>
                            <span className="font-semibold text-gray-700">{p.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-200/70">
                        <h3 className="font-semibold text-slate-900 tracking-tight">Recent Activity</h3>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {dashboard.data.recentActivity.map((a, i) => (
                          <div key={i} className="px-5 py-3 flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full ${activityColor[a.type] ?? 'bg-gray-100 text-gray-500'} flex items-center justify-center shrink-0 mt-0.5`}>
                              <Activity size={11} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-700 leading-relaxed">{a.text}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6">
                      <h3 className="font-semibold text-slate-900 tracking-tight mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <button onClick={() => setActive('volunteers')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center justify-between">
                          <span>Review volunteer applications ({dashboard.data.kpis.pendingApplications} pending)</span>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>
                        <button onClick={() => setActive('programs')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center justify-between">
                          <span>View all programs</span>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>
                        <button onClick={() => setActive('events')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center justify-between">
                          <span>Manage events</span>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── USERS / VOLUNTEERS ────────────────────────────────────── */}
          {active === 'users' && isAdmin && (
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900 tracking-tight">User Management</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {users.data.length} accounts · {users.data.filter(u => u.role === 'admin').length} admins · {users.data.filter(u => u.role === 'staff').length} staff
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    <Download size={12} /> Export
                  </button>
                  <button onClick={() => setModal('user')} className="flex items-center gap-1.5 px-3 py-2 bg-[#0f766e] text-white text-xs font-semibold rounded-xl hover:bg-[#0d9488] transition-colors">
                    <Plus size={13} /> Add User
                  </button>
                </div>
              </div>
              {users.loading && <LoadingState label="Loading users…" />}
              {users.error && <ErrorState message={users.error} onRetry={users.refetch} />}
              {!users.loading && !users.error && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                      <tr>
                        <th className="px-5 py-3 text-left">User</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Joined</th>
                        <th className="px-5 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.data.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={img(u.avatar, 'w=40&h=40&fit=crop&auto=format')} alt={u.name} className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                <div className="text-xs text-gray-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeClass(u.role)}`}>
                              {roleLabel(u.role)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-400">{formatDateShort(u.createdAt)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              {u._id === user?._id ? (
                                <span className="text-xs text-gray-300 italic px-1">You</span>
                              ) : (
                                <>
                                  <select
                                    value={u.role}
                                    onChange={(e) => patchUser(u._id, { role: e.target.value })}
                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#0f766e]"
                                  >
                                    <option value="volunteer">Volunteer</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Administrator</option>
                                  </select>
                                  <button
                                    onClick={() => patchUser(u._id, { isActive: !u.isActive })}
                                    className="px-2 py-1 text-xs rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                  >
                                    {u.isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                                  <button
                                    onClick={() => remove(`/users/${u._id}`, users.refetch)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete user"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 border-t border-gray-50 text-xs text-gray-400">Showing {users.data.length} users</div>
                </div>
              )}
            </div>
          )}

          {active === 'volunteers' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200/70">
                <h3 className="font-semibold text-slate-900 tracking-tight">Volunteer Applications</h3>
              </div>
              {volunteers.loading && <LoadingState label="Loading applications…" />}
              {volunteers.error && <ErrorState message={volunteers.error} onRetry={volunteers.refetch} />}
              {!volunteers.loading && !volunteers.error && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                      <tr>
                        <th className="px-5 py-3 text-left">Applicant</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">Availability</th>
                        <th className="px-5 py-3 text-left">Applied</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {volunteers.data.map((v) => (
                        <tr key={v._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-gray-900">{v.name}</div>
                            <div className="text-xs text-gray-400">{v.email}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{v.role}</td>
                          <td className="px-5 py-4 text-xs text-gray-500">{v.availability}</td>
                          <td className="px-5 py-4 text-xs text-gray-400">{formatDateShort(v.createdAt)}</td>
                          <td className="px-5 py-4"><span className={statusBadge(v.status === 'Under Review' ? 'Enrolling' : v.status === 'Approved' ? 'Active' : v.status === 'Rejected' ? 'Full' : 'Planned')}>{v.status}</span></td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => api.patch(`/volunteers/${v._id}/status`, { status: 'Approved' }).then(volunteers.refetch).catch(() => {})}
                                className="px-2 py-1 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => api.patch(`/volunteers/${v._id}/status`, { status: 'Rejected' }).then(volunteers.refetch).catch(() => {})}
                                className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                Reject
                              </button>
                              <button onClick={() => remove(`/volunteers/${v._id}`, volunteers.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {volunteers.data.length === 0 && <p className="p-6 text-sm text-gray-400 text-center">No applications yet.</p>}
                </div>
              )}
            </div>
          )}

          {/* ── PROJECTS ─────────────────────────────────────────────── */}
          {active === 'projects' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Projects</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{projects.data.length} projects total</p>
                </div>
                <button onClick={() => openProjectModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add New Project
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: projects.data.length, color: 'text-gray-900' },
                  { label: 'Ongoing', value: projects.data.filter(p => p.status === 'Ongoing').length, color: 'text-blue-600' },
                  { label: 'Completed', value: projects.data.filter(p => p.status === 'Completed').length, color: 'text-green-600' },
                  { label: 'Planned', value: projects.data.filter(p => p.status === 'Planned').length, color: 'text-amber-600' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-sm text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                {projects.loading && <LoadingState label="Loading projects…" />}
                {projects.error && <ErrorState message={projects.error} onRetry={projects.refetch} />}
                {!projects.loading && !projects.error && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                        <tr>
                          <th className="px-5 py-3 text-left">Project</th>
                          <th className="px-5 py-3 text-left">Region</th>
                          <th className="px-5 py-3 text-left">Budget</th>
                          <th className="px-5 py-3 text-left">Beneficiaries</th>
                          <th className="px-5 py-3 text-left">Progress</th>
                          <th className="px-5 py-3 text-left">Status</th>
                          <th className="px-5 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {projects.data.map(p => (
                          <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {p.image ? (
                                  <img src={img(p.image, 'w=80&h=80&fit=crop&auto=format')} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                                ) : (
                                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                    <FolderOpen size={14} className="text-[#0f766e]" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-gray-900">{p.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} /> {p.region || p.location}</span>
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-[#0f766e]">${p.budget.toLocaleString()}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{p.beneficiaries.toLocaleString()}</td>
                            <td className="px-5 py-4 w-28">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-[#0f766e] to-[#16a34a] rounded-full" style={{ width: `${p.progress}%` }} />
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">{p.progress}%</span>
                              </div>
                            </td>
                            <td className="px-5 py-4"><span className={statusBadge(p.status)}>{p.status}</span></td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => openProjectModal(p)} className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0f766e] transition-colors" title="Edit project"><Edit size={14} /></button>
                                <button onClick={() => remove(`/projects/${p._id}`, projects.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete project"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROGRAMS ─────────────────────────────────────────────── */}
          {active === 'programs' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Programs</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{programs.data.length} programs total</p>
                </div>
                <button onClick={() => openProgramModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add New Program
                </button>
              </div>

              {programs.loading && <LoadingState label="Loading programs…" />}
              {programs.error && <ErrorState message={programs.error} onRetry={programs.refetch} />}
              {!programs.loading && !programs.error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {programs.data.map(p => (
                    <div key={p._id} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300/70 transition-all flex flex-col">
                      {p.image && (
                        <img src={img(p.image, 'w=600&h=240&fit=crop&auto=format')} alt="" className="h-28 w-full object-cover bg-gray-100" />
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <span className="px-2.5 py-1 bg-teal-50 text-[#0f766e] text-xs font-semibold rounded-full">{p.category}</span>
                          <span className={statusBadge(p.status)}>{p.status}</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 tracking-tight text-sm mb-2 leading-snug">{p.title}</h4>
                        <div className="space-y-1 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1.5"><MapPin size={11} className="text-[#0f766e]" /> {p.region || '—'}</div>
                          <div className="flex items-center gap-1.5"><Users size={11} className="text-[#0f766e]" /> {p.beneficiaries.toLocaleString()} beneficiaries</div>
                          <div className="flex items-center gap-1.5"><Clock size={11} className="text-[#0f766e]" /> {p.duration || '—'}</div>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-[11px] text-gray-400 mb-1"><span>Progress</span><span className="font-semibold text-[#0f766e]">{p.progress}%</span></div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#0f766e] to-[#16a34a] rounded-full" style={{ width: `${p.progress}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-auto">
                          <button onClick={() => openProgramModal(p)} className="flex-1 py-1.5 text-xs font-medium text-[#0f766e] border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-1">
                            <Edit size={12} /> Edit
                          </button>
                          <button onClick={() => remove(`/programs/${p._id}`, programs.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors border border-slate-200/70">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => openProgramModal()} className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#0f766e] hover:text-[#0f766e] hover:bg-teal-50/30 transition-all min-h-[180px]">
                    <div className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center">
                      <Plus size={20} />
                    </div>
                    <span className="text-sm font-medium">Add new program</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── EVENTS ───────────────────────────────────────────────── */}
          {active === 'events' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Events</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{events.data.length} events scheduled</p>
                </div>
                <button onClick={() => openEventModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add New Event
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                {events.loading && <LoadingState label="Loading events…" />}
                {events.error && <ErrorState message={events.error} onRetry={events.refetch} />}
                {!events.loading && !events.error && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                        <tr>
                          <th className="px-5 py-3 text-left">Event</th>
                          <th className="px-5 py-3 text-left">Date</th>
                          <th className="px-5 py-3 text-left">Location</th>
                          <th className="px-5 py-3 text-left">Capacity</th>
                          <th className="px-5 py-3 text-left">Registered</th>
                          <th className="px-5 py-3 text-left">Status</th>
                          <th className="px-5 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {events.data.map(e => {
                          const full = (e.registered || 0) >= (e.capacity || 0) && e.capacity > 0
                          return (
                            <tr key={e._id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {e.image ? (
                                    <img src={img(e.image, 'w=80&h=80&fit=crop&auto=format')} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                                  ) : (
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                      <Calendar size={14} className="text-blue-600" />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-gray-900">{e.title}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-600">{e.dateLabel}</td>
                              <td className="px-5 py-4 text-xs text-gray-500">{e.location}</td>
                              <td className="px-5 py-4 text-sm text-gray-600">{e.capacity}</td>
                              <td className="px-5 py-4 w-36">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${full ? 'bg-red-400' : 'bg-[#0f766e]'}`} style={{ width: `${e.capacity ? Math.min(100, Math.round(e.registered / e.capacity * 100)) : 0}%` }} />
                                  </div>
                                  <span className="text-xs text-gray-400 shrink-0">{e.registered}/{e.capacity}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4"><span className={statusBadge(full ? 'Full' : 'Open')}>{full ? 'Full' : 'Open'}</span></td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => openEventModal(e)} className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0f766e] transition-colors" title="Edit event"><Edit size={14} /></button>
                                  <button onClick={() => remove(`/events/${e._id}`, events.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete event"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── NEWS ─────────────────────────────────────────────────── */}
          {active === 'news' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">News & Articles</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{news.data.length} articles</p>
                </div>
                <button onClick={() => openNewsModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add New Article
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                {news.loading && <LoadingState label="Loading articles…" />}
                {news.error && <ErrorState message={news.error} onRetry={news.refetch} />}
                {!news.loading && !news.error && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                        <tr>
                          <th className="px-5 py-3 text-left">Title</th>
                          <th className="px-5 py-3 text-left">Category</th>
                          <th className="px-5 py-3 text-left">Date</th>
                          <th className="px-5 py-3 text-left">Views</th>
                          <th className="px-5 py-3 text-left">Status</th>
                          <th className="px-5 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {news.data.map(n => (
                          <tr key={n._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {n.image ? (
                                  <img src={img(n.image, 'w=80&h=80&fit=crop&auto=format')} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                                ) : (
                                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                    <Newspaper size={14} className="text-purple-600" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-gray-900 max-w-xs truncate">{n.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4"><span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">{n.category}</span></td>
                            <td className="px-5 py-4 text-xs text-gray-400">{n.published ? formatDateShort(n.publishedAt) : 'Draft'}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{n.views.toLocaleString()}</td>
                            <td className="px-5 py-4"><span className={statusBadge(n.published ? 'Published' : 'Draft')}>{n.published ? 'Published' : 'Draft'}</span></td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => openNewsModal(n)} className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0f766e] transition-colors" title="Edit article"><Edit size={14} /></button>
                                <button onClick={() => remove(`/news/${n._id}`, news.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete article"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── GALLERY ──────────────────────────────────────────────── */}
          {active === 'gallery' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Gallery</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{gallery.data.length} items</p>
                </div>
                <button onClick={() => openGalleryModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add Item
                </button>
              </div>
              {gallery.loading && <LoadingState label="Loading gallery…" />}
              {gallery.error && <ErrorState message={gallery.error} onRetry={gallery.refetch} />}
              {!gallery.loading && !gallery.error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.data.map(g => (
                    <div key={g._id} className="group relative bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                      <div className="aspect-[4/3] bg-gray-100">
                        <img src={img(g.image, 'w=400&h=300&fit=crop&auto=format')} alt={g.caption || ''} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-full">{g.category}</span>
                        <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{g.caption || <span className="text-gray-300">No caption</span>}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openGalleryModal(g)} className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-500 hover:text-[#0f766e] transition-colors" title="Edit"><Edit size={13} /></button>
                        <button onClick={() => remove(`/gallery/${g._id}`, gallery.refetch)} className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => openGalleryModal()} className="aspect-[4/3] bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#0f766e] hover:text-[#0f766e] hover:bg-teal-50/30 transition-all">
                    <Plus size={22} /><span className="text-xs font-medium">Add item</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TEAM ─────────────────────────────────────────────────── */}
          {active === 'team' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Team</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{team.data.length} members</p>
                </div>
                <button onClick={() => openTeamModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add Member
                </button>
              </div>
              {team.loading && <LoadingState label="Loading team…" />}
              {team.error && <ErrorState message={team.error} onRetry={team.refetch} />}
              {!team.loading && !team.error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.data.map(t => (
                    <div key={t._id} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 flex items-center gap-4">
                      <img src={img(t.image, 'w=120&h=120&fit=crop&auto=format')} alt={t.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 truncate">{t.name}</span>
                          {t.active === false && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">Hidden</span>}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{t.role}</div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => openTeamModal(t)} className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0f766e] transition-colors" title="Edit"><Edit size={14} /></button>
                        <button onClick={() => remove(`/team/${t._id}`, team.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
          {active === 'testimonials' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Testimonials</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{testimonials.data.length} quotes</p>
                </div>
                <button onClick={() => openTestimonialModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>
              {testimonials.loading && <LoadingState label="Loading testimonials…" />}
              {testimonials.error && <ErrorState message={testimonials.error} onRetry={testimonials.refetch} />}
              {!testimonials.loading && !testimonials.error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {testimonials.data.map(t => (
                    <div key={t._id} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
                      <div className="flex items-start gap-3">
                        <img src={img(t.image, 'w=120&h=120&fit=crop&auto=format')} alt={t.name} className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-400">{t.role || '—'}</div>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mt-3 line-clamp-3">“{t.text}”</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">{t.placement}</span>
                        <div className="flex gap-1">
                          <button onClick={() => openTestimonialModal(t)} className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0f766e] transition-colors" title="Edit"><Edit size={14} /></button>
                          <button onClick={() => remove(`/testimonials/${t._id}`, testimonials.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PARTNERS ─────────────────────────────────────────────── */}
          {active === 'partners' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 tracking-tight">Partners</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{partners.data.length} partners</p>
                </div>
                <button onClick={() => openPartnerModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm shadow-[#0f766e]/20">
                  <Plus size={16} /> Add Partner
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                {partners.loading && <LoadingState label="Loading partners…" />}
                {partners.error && <ErrorState message={partners.error} onRetry={partners.refetch} />}
                {!partners.loading && !partners.error && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                        <tr>
                          <th className="px-5 py-3 text-left">Partner</th>
                          <th className="px-5 py-3 text-left">Website</th>
                          <th className="px-5 py-3 text-left">Order</th>
                          <th className="px-5 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {partners.data.map(p => (
                          <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {p.logo
                                  ? <img src={img(p.logo, 'w=80&h=80&fit=crop&auto=format')} alt="" className="w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100 shrink-0" />
                                  : <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0"><Handshake size={14} className="text-[#0f766e]" /></div>}
                                <span className="text-sm font-medium text-gray-900">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-500">
                              {p.website ? <a href={p.website} target="_blank" rel="noreferrer" className="text-[#0f766e] hover:underline">{p.website.replace(/^https?:\/\//, '')}</a> : '—'}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">{p.order}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => openPartnerModal(p)} className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0f766e] transition-colors" title="Edit"><Edit size={14} /></button>
                                <button onClick={() => remove(`/partners/${p._id}`, partners.refetch)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {partners.data.length === 0 && <p className="p-6 text-sm text-gray-400 text-center">No partners yet.</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MODALS ───────────────────────────────────────────────── */}
          {modal === 'project' && (
            <Modal title={editId ? 'Edit Project' : 'Add New Project'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Project updated!' : 'Project saved successfully!'} /> : (
                <div className="space-y-4">
                  <ImageField value={projForm.image} onChange={v => setProjForm(f => ({ ...f, image: v }))} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Project Title" required>
                      <input className={inputCls} placeholder="Youth Leadership Academy — Banadir" value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} />
                    </Field>
                    <Field label="Status" required>
                      <select className={inputCls} value={projForm.status} onChange={e => setProjForm({ ...projForm, status: e.target.value })}>
                        {['Ongoing', 'Completed', 'Planned'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea className={inputCls + ' resize-none'} rows={3} value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Region">
                      <select className={inputCls} value={projForm.region} onChange={e => setProjForm({ ...projForm, region: e.target.value })}>
                        <option value="">Select region</option>
                        {regions.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </Field>
                    <Field label="District">
                      <input className={inputCls} value={projForm.district} onChange={e => setProjForm({ ...projForm, district: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Budget ($)">
                      <input className={inputCls} type="number" placeholder="45000" value={projForm.budget} onChange={e => setProjForm({ ...projForm, budget: e.target.value })} />
                    </Field>
                    <Field label="Target Beneficiaries">
                      <input className={inputCls} type="number" placeholder="420" value={projForm.targetBeneficiaries} onChange={e => setProjForm({ ...projForm, targetBeneficiaries: e.target.value })} />
                    </Field>
                  </div>
                  <Field label={`Progress — ${projForm.progress || 0}%`}>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={100} step={1} value={Number(projForm.progress) || 0}
                        onChange={e => setProjForm({ ...projForm, progress: e.target.value })}
                        className="flex-1 accent-[#0f766e]" />
                      <input type="number" min={0} max={100} value={projForm.progress}
                        onChange={e => setProjForm({ ...projForm, progress: e.target.value })}
                        className={inputCls + ' w-20 text-center'} />
                    </div>
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Start Date">
                      <input className={inputCls} type="date" value={projForm.startDate} onChange={e => setProjForm({ ...projForm, startDate: e.target.value })} />
                    </Field>
                    <Field label="Funded By">
                      <input className={inputCls} placeholder="GCERF, U.S. Embassy Mogadishu, etc." value={projForm.fundedBy} onChange={e => setProjForm({ ...projForm, fundedBy: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Partners">
                    <input className={inputCls} placeholder="Elman Peace, Ministry of Youth and Sports, ..." value={projForm.partners} onChange={e => setProjForm({ ...projForm, partners: e.target.value })} />
                  </Field>
                  {(!projForm.title || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'Title is required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveProject} disabled={submitting || !projForm.title} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Save Project'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'program' && (
            <Modal title={editId ? 'Edit Program' : 'Add New Program'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Program updated!' : 'Program saved successfully!'} /> : (
                <div className="space-y-4">
                  <ImageField value={progForm.image} onChange={v => setProgForm(f => ({ ...f, image: v }))} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Program Title" required>
                      <input className={inputCls} value={progForm.title} onChange={e => setProgForm({ ...progForm, title: e.target.value })} />
                    </Field>
                    <Field label="Category" required>
                      <select className={inputCls} value={progForm.category} onChange={e => setProgForm({ ...progForm, category: e.target.value })}>
                        <option value="">Select category</option>
                        {programCategories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea className={inputCls + ' resize-none'} rows={3} value={progForm.description} onChange={e => setProgForm({ ...progForm, description: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Region">
                      <select className={inputCls} value={progForm.region} onChange={e => setProgForm({ ...progForm, region: e.target.value })}>
                        <option value="">Select region</option>
                        {regions.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </Field>
                    <Field label="Status">
                      <select className={inputCls} value={progForm.status} onChange={e => setProgForm({ ...progForm, status: e.target.value })}>
                        {['Active', 'Enrolling', 'Completed', 'Paused'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Start Date">
                      <input className={inputCls} type="date" value={progForm.startDate} onChange={e => setProgForm({ ...progForm, startDate: e.target.value })} />
                    </Field>
                    <Field label="End Date">
                      <input className={inputCls} type="date" value={progForm.endDate} onChange={e => setProgForm({ ...progForm, endDate: e.target.value })} />
                    </Field>
                    <Field label="Duration">
                      <input className={inputCls} placeholder="6 months" value={progForm.duration} onChange={e => setProgForm({ ...progForm, duration: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Target Beneficiaries">
                      <input className={inputCls} type="number" placeholder="500" value={progForm.targetBeneficiaries} onChange={e => setProgForm({ ...progForm, targetBeneficiaries: e.target.value })} />
                    </Field>
                    <Field label="Featured">
                      <div className="flex items-center gap-3 h-[42px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={progForm.isFeatured} onChange={e => setProgForm({ ...progForm, isFeatured: e.target.checked })} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#0f766e] rounded-full transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm text-gray-600">Show on homepage</span>
                      </div>
                    </Field>
                  </div>
                  <Field label={`Progress — ${progForm.progress || 0}%`}>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={100} step={1} value={Number(progForm.progress) || 0}
                        onChange={e => setProgForm({ ...progForm, progress: e.target.value })}
                        className="flex-1 accent-[#0f766e]" />
                      <input type="number" min={0} max={100} value={progForm.progress}
                        onChange={e => setProgForm({ ...progForm, progress: e.target.value })}
                        className={inputCls + ' w-20 text-center'} />
                    </div>
                  </Field>
                  {(!progForm.title || !progForm.category || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'Title and category are required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveProgram} disabled={submitting || !progForm.title || !progForm.category} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Save Program'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'event' && (
            <Modal title={editId ? 'Edit Event' : 'Add New Event'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Event updated!' : 'Event saved successfully!'} /> : (
                <div className="space-y-4">
                  <ImageField value={evtForm.image} onChange={v => setEvtForm(f => ({ ...f, image: v }))} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Event Title" required>
                      <input className={inputCls} value={evtForm.title} onChange={e => setEvtForm({ ...evtForm, title: e.target.value })} />
                    </Field>
                    <Field label="Region">
                      <select className={inputCls} value={evtForm.region} onChange={e => setEvtForm({ ...evtForm, region: e.target.value })}>
                        <option value="">Select region</option>
                        {regions.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea className={inputCls + ' resize-none'} rows={3} value={evtForm.description} onChange={e => setEvtForm({ ...evtForm, description: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Start Date" required>
                      <input className={inputCls} type="date" value={evtForm.date} onChange={e => setEvtForm({ ...evtForm, date: e.target.value })} />
                    </Field>
                    <Field label="End Date">
                      <input className={inputCls} type="date" value={evtForm.endDate} onChange={e => setEvtForm({ ...evtForm, endDate: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Venue / Location">
                      <input className={inputCls} value={evtForm.location} onChange={e => setEvtForm({ ...evtForm, location: e.target.value })} />
                    </Field>
                    <Field label="Capacity">
                      <input className={inputCls} type="number" placeholder="500" value={evtForm.capacity} onChange={e => setEvtForm({ ...evtForm, capacity: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Registration Deadline">
                      <input className={inputCls} type="date" value={evtForm.registrationDeadline} onChange={e => setEvtForm({ ...evtForm, registrationDeadline: e.target.value })} />
                    </Field>
                    <Field label="Featured">
                      <div className="flex items-center gap-3 h-[42px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={evtForm.isFeatured} onChange={e => setEvtForm({ ...evtForm, isFeatured: e.target.checked })} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#0f766e] rounded-full transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm text-gray-600">Show on homepage</span>
                      </div>
                    </Field>
                  </div>
                  {(!evtForm.title || !evtForm.date || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'Title and start date are required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveEvent} disabled={submitting || !evtForm.title || !evtForm.date} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Save Event'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'news' && (
            <Modal title={editId ? 'Edit Article' : 'Add New Article'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Article updated!' : 'Article saved successfully!'} /> : (
                <div className="space-y-4">
                  <ImageField value={newsForm.image} onChange={v => setNewsForm(f => ({ ...f, image: v }))} />
                  <Field label="Article Title" required>
                    <input className={inputCls} value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} />
                  </Field>
                  <Field label="Excerpt / Summary">
                    <textarea className={inputCls + ' resize-none'} rows={3} value={newsForm.excerpt} onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Category">
                      <select className={inputCls} value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}>
                        <option value="">Select category</option>
                        {newsCategories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Author">
                      <input className={inputCls} value={newsForm.author} onChange={e => setNewsForm({ ...newsForm, author: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Publish Status">
                      <select className={inputCls} value={newsForm.status} onChange={e => setNewsForm({ ...newsForm, status: e.target.value })}>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </Field>
                    <Field label="Tags">
                      <input className={inputCls} placeholder="youth, education" value={newsForm.tags} onChange={e => setNewsForm({ ...newsForm, tags: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Featured">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={newsForm.isFeatured} onChange={e => setNewsForm({ ...newsForm, isFeatured: e.target.checked })} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#0f766e] rounded-full transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                      </label>
                      <span className="text-sm text-gray-600">Feature on homepage</span>
                    </div>
                  </Field>
                  {(!newsForm.title || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'Title is required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveNews} disabled={submitting || !newsForm.title} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />}
                      {editId ? 'Save Changes' : newsForm.status === 'Published' ? 'Publish' : 'Save Draft'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'user' && (
            <Modal title="Add User" onClose={closeModal}>
              {saved ? <SavedState label="User account created!" /> : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input className={inputCls} value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
                    </Field>
                    <Field label="Email" required>
                      <input className={inputCls} type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Temporary Password" required>
                      <input className={inputCls} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} placeholder="min. 8 characters" />
                    </Field>
                    <Field label="Phone">
                      <input className={inputCls} value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Role" required>
                      <select className={inputCls} value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                        <option value="volunteer">Volunteer</option>
                        <option value="staff">Staff — content & applications</option>
                        <option value="admin">Administrator — full control</option>
                      </select>
                    </Field>
                    <Field label="Active">
                      <div className="flex items-center gap-3 h-[42px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={userForm.isActive} onChange={e => setUserForm({ ...userForm, isActive: e.target.checked })} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#0f766e] rounded-full transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm text-gray-600">Can sign in immediately</span>
                      </div>
                    </Field>
                  </div>
                  {userForm.role === 'admin' && (
                    <p className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 rounded-lg px-3 py-2">
                      <AlertCircle size={13} /> Administrators have full control of every resource and user account.
                    </p>
                  )}
                  {userForm.role === 'staff' && (
                    <p className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                      <AlertCircle size={13} /> Staff can manage all content and review applications, but not user accounts or settings.
                    </p>
                  )}
                  {formError && <p className="flex items-center gap-1.5 text-xs text-red-500"><AlertCircle size={13} /> {formError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button
                      onClick={handleSaveUser}
                      disabled={submitting || !userForm.name || !userForm.email || userForm.password.length < 8}
                      className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 size={15} className="animate-spin" />} Create User
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'gallery' && (
            <Modal title={editId ? 'Edit Gallery Item' : 'Add Gallery Item'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Item updated!' : 'Item added!'} /> : (
                <div className="space-y-4">
                  <ImageField label="Image" value={galleryForm.image} onChange={v => setGalleryForm(f => ({ ...f, image: v }))} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Category" required>
                      <select className={inputCls} value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}>
                        {galleryCategories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Type">
                      <select className={inputCls} value={galleryForm.type} onChange={e => setGalleryForm({ ...galleryForm, type: e.target.value })}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </Field>
                  </div>
                  {galleryForm.type === 'video' && (
                    <Field label="Video URL">
                      <input className={inputCls} placeholder="https://youtube.com/watch?v=…" value={galleryForm.videoUrl} onChange={e => setGalleryForm({ ...galleryForm, videoUrl: e.target.value })} />
                    </Field>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                    <Field label="Caption">
                      <input className={inputCls} value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })} />
                    </Field>
                    <Field label="Order">
                      <input className={inputCls} type="number" value={galleryForm.order} onChange={e => setGalleryForm({ ...galleryForm, order: e.target.value })} />
                    </Field>
                  </div>
                  {(!galleryForm.image || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'An image is required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveGallery} disabled={submitting || !galleryForm.image} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Add Item'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'team' && (
            <Modal title={editId ? 'Edit Team Member' : 'Add Team Member'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Member updated!' : 'Member added!'} /> : (
                <div className="space-y-4">
                  <ImageField label="Photo" shape="square" value={teamForm.image} onChange={v => setTeamForm(f => ({ ...f, image: v }))} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input className={inputCls} value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} />
                    </Field>
                    <Field label="Role / Title" required>
                      <input className={inputCls} placeholder="Programs Director" value={teamForm.role} onChange={e => setTeamForm({ ...teamForm, role: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Bio">
                    <textarea className={inputCls + ' resize-none'} rows={3} value={teamForm.bio} onChange={e => setTeamForm({ ...teamForm, bio: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Order">
                      <input className={inputCls} type="number" value={teamForm.order} onChange={e => setTeamForm({ ...teamForm, order: e.target.value })} />
                    </Field>
                    <Field label="Visible">
                      <div className="flex items-center gap-3 h-[42px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={teamForm.active} onChange={e => setTeamForm({ ...teamForm, active: e.target.checked })} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#0f766e] rounded-full transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm text-gray-600">Show on the site</span>
                      </div>
                    </Field>
                  </div>
                  {(!teamForm.name || !teamForm.role || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'Name and role are required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveTeam} disabled={submitting || !teamForm.name || !teamForm.role} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Add Member'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'testimonial' && (
            <Modal title={editId ? 'Edit Testimonial' : 'Add Testimonial'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Testimonial updated!' : 'Testimonial added!'} /> : (
                <div className="space-y-4">
                  <ImageField label="Photo" shape="square" value={testimonialForm.image} onChange={v => setTestimonialForm(f => ({ ...f, image: v }))} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name" required>
                      <input className={inputCls} value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                    </Field>
                    <Field label="Role / Context">
                      <input className={inputCls} placeholder="Digital Literacy Graduate, 2024" value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Quote" required>
                    <textarea className={inputCls + ' resize-none'} rows={4} value={testimonialForm.text} onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Rating">
                      <select className={inputCls} value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: e.target.value })}>
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
                      </select>
                    </Field>
                    <Field label="Placement">
                      <select className={inputCls} value={testimonialForm.placement} onChange={e => setTestimonialForm({ ...testimonialForm, placement: e.target.value })}>
                        <option value="home">Home — success stories</option>
                        <option value="volunteer">Volunteer — voices</option>
                      </select>
                    </Field>
                    <Field label="Order">
                      <input className={inputCls} type="number" value={testimonialForm.order} onChange={e => setTestimonialForm({ ...testimonialForm, order: e.target.value })} />
                    </Field>
                  </div>
                  {(!testimonialForm.name || testimonialForm.text.trim().length < 5 || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'Name and a quote (5+ characters) are required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveTestimonial} disabled={submitting || !testimonialForm.name || testimonialForm.text.trim().length < 5} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Add Testimonial'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {modal === 'partner' && (
            <Modal title={editId ? 'Edit Partner' : 'Add Partner'} onClose={closeModal}>
              {saved ? <SavedState label={editId ? 'Partner updated!' : 'Partner added!'} /> : (
                <div className="space-y-4">
                  <ImageField label="Logo" shape="square" value={partnerForm.logo} onChange={v => setPartnerForm(f => ({ ...f, logo: v }))} />
                  <Field label="Partner Name" required>
                    <input className={inputCls} placeholder="GCERF" value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                    <Field label="Website">
                      <input className={inputCls} placeholder="https://www.gcerf.org" value={partnerForm.website} onChange={e => setPartnerForm({ ...partnerForm, website: e.target.value })} />
                    </Field>
                    <Field label="Order">
                      <input className={inputCls} type="number" value={partnerForm.order} onChange={e => setPartnerForm({ ...partnerForm, order: e.target.value })} />
                    </Field>
                  </div>
                  {(!partnerForm.name || formError) && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertCircle size={13} /> {formError || 'A name is required.'}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSavePartner} disabled={submitting || !partnerForm.name} className="flex-1 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <Loader2 size={15} className="animate-spin" />} {editId ? 'Save Changes' : 'Add Partner'}
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          )}

          {active === 'settings' && (
            <div className="space-y-6">
            <AdminAccountCard />
            {isAdmin && (
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-8 max-w-xl space-y-6">
              <h3 className="font-semibold text-slate-900 tracking-tight">System Settings</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
                <input type="text" defaultValue="YEEP Somalia — Youth Engagement and Empowerment Programme" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                <input type="email" defaultValue="yeepsomalia@gmail.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]" />
              </div>
              {[
                { label: 'Email Notifications', desc: 'Receive admin alerts via email' },
                { label: 'Volunteer Auto-approval', desc: 'Auto-approve volunteer applications' },
                { label: 'Maintenance Mode', desc: 'Take the website offline for maintenance' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
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
              <button className="w-full py-3 bg-[#0f766e] text-white font-semibold rounded-xl hover:bg-[#0d9488] transition-colors">
                Save Settings
              </button>
            </div>
            )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
