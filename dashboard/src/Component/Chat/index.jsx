// src/Component/Chat/index.jsx
// Premium redesign for Sandesh Innovations — all functionality preserved.
// Visual identity: electric indigo + signal teal on a cool slate canvas.
// Display face: Sora (brand/headings) · Body/UI face: Inter (data, controls).

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getAdminSocket } from '../../services/socket.js'
import api from '../../api/axios.js'
import ConversationList from './ConversationList.jsx'
import ChatPanel from './ChatPanel.jsx'

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const T = {
  brand:      '#4F46E5', // electric indigo — primary brand
  brandDeep:  '#3730A3',
  brandLight: '#6366F1',
  brandSoft:  '#EEF2FF',
  signal:     '#0D9488', // signal teal — AI / live / success accent
  signalSoft: '#F0FDFA',
  signalDeep: '#0F766E',
  surface:    '#ffffff',
  canvas:     '#F5F6FA',
  sidebar:    '#ffffff',
  border:     '#E4E7EE',
  borderMid:  '#CBD1DE',
  ink:        '#0B1120',
  textSec:    '#4B5566',
  textMuted:  '#96A0B3',
  danger:     '#E11D48',
  dangerSoft: '#FEF2F4',
  warning:    '#D97706',
}

/* ─── Inline global styles injected once ────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .chat-root * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .chat-root { background: ${T.canvas}; }
  .font-display { font-family: 'Sora', 'Inter', system-ui, sans-serif; }

  /* Scrollbar */
  .chat-scroll::-webkit-scrollbar { width: 4px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: ${T.borderMid}; border-radius: 4px; }
  .chat-scroll::-webkit-scrollbar-thumb:hover { background: ${T.textMuted}; }

  /* Nav — deep indigo gradient with a faint woven node/lattice texture,
     a nod to the "network" at the heart of an AI product. */
  .nav-shimmer {
    position: relative;
    background:
      radial-gradient(circle at 15% 30%, rgba(255,255,255,0.10) 0, transparent 45%),
      radial-gradient(circle at 85% 70%, rgba(13,148,136,0.35) 0, transparent 50%),
      linear-gradient(120deg, ${T.brandDeep} 0%, ${T.brand} 55%, ${T.brandLight} 100%);
  }
  .nav-lattice {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
    background-image:
      radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.4px);
    background-size: 22px 22px;
    mask-image: linear-gradient(120deg, rgba(0,0,0,0.9), transparent 75%);
  }

  /* Stat card hover */
  .stat-card {
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    cursor: default;
  }
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px -6px rgba(55,48,163,0.16);
    border-color: ${T.brandLight}55;
  }

  /* Sidebar item */
  .conv-item {
    transition: background 0.12s ease, transform 0.12s ease;
  }
  .conv-item:hover { background: ${T.brandSoft}; }
  .conv-item.active {
    background: linear-gradient(135deg, ${T.brandSoft} 0%, #E0E7FF 100%);
    border-left: 3px solid ${T.brand};
  }

  /* Button base */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 13px; font-weight: 500; border-radius: 9px;
    padding: 7px 14px; cursor: pointer; border: none; outline: none;
    transition: all 0.15s ease;
  }
  .btn:focus-visible { outline: 2px solid ${T.signal}; outline-offset: 2px; }
  .btn-ghost {
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.86); border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(6px);
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.16); color: #fff; border-color: rgba(255,255,255,0.45); }
  .btn-primary { background: ${T.brand}; color: #fff; }
  .btn-primary:hover { background: ${T.brandDeep}; box-shadow: 0 4px 14px rgba(79,70,229,0.38); }
  .btn-danger { background: ${T.dangerSoft}; color: ${T.danger}; border: 1px solid #FBCFDA; }
  .btn-danger:hover { background: ${T.danger}; color: #fff; }

  /* Badge */
  .badge {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    padding: 2px 7px; border-radius: 100px; text-transform: uppercase;
  }
  .badge-ai     { background: ${T.brandSoft}; color: ${T.brand}; border: 1px solid #C7D2FE; }
  .badge-human  { background: ${T.signalSoft}; color: ${T.signalDeep}; border: 1px solid #99F6E4; }
  .badge-closed { background: #F8FAFC; color: ${T.textMuted}; border: 1px solid ${T.border}; }

  /* Filter tabs */
  .filter-tab {
    padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; background: transparent;
    color: ${T.textSec}; transition: all 0.14s ease;
  }
  .filter-tab:hover { background: ${T.brandSoft}; color: ${T.brand}; }
  .filter-tab.active { background: ${T.brand}; color: #fff; }

  /* Empty state pulse ring */
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.55; }
    50%  { transform: scale(1.08); opacity: 0.15; }
    100% { transform: scale(1);   opacity: 0.55; }
  }
  .pulse-ring { animation: pulse-ring 2.6s ease-in-out infinite; }

  /* Live dot pulse */
  @keyframes live-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.55); }
    50%       { box-shadow: 0 0 0 5px rgba(45,212,191,0); }
  }
  .live-dot { animation: live-pulse 2s ease-in-out infinite; }

  /* Avatar ring glow */
  .avatar-glow {
    box-shadow: 0 0 0 2px ${T.brand}, 0 0 0 4px rgba(79,70,229,0.16);
  }

  /* Search input */
  .search-input {
    background: ${T.canvas}; border: 1px solid ${T.border};
    border-radius: 9px; padding: 8px 12px 8px 36px;
    font-size: 13px; color: ${T.ink}; width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
  }
  .search-input:focus { border-color: ${T.brandLight}; box-shadow: 0 0 0 3px rgba(99,102,241,0.14); }
  .search-input::placeholder { color: ${T.textMuted}; }

  /* Always-visible delete button in conversation list */
  .conv-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #FBCFDA;
    background: ${T.dangerSoft};
    color: ${T.danger};
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
    flex-shrink: 0;
  }
  .conv-delete-btn:hover {
    background: ${T.danger};
    color: #fff;
    transform: scale(1.05);
  }
  .conv-delete-btn:active { transform: scale(0.95); }
`

function injectStyles() {
  if (document.getElementById('chat-premium-css')) return
  const s = document.createElement('style')
  s.id = 'chat-premium-css'
  s.textContent = GLOBAL_CSS
  document.head.appendChild(s)
}

/* ─── Stats Bar ──────────────────────────────────────────────────────────── */
function PremiumStatsBar({ stats }) {
  const items = [
    {
      label: 'Total',
      value: stats.total,
      color: T.brand,
      iconBg: T.brandSoft,
      icon: (
        <svg width="16" height="16" fill="none" stroke={T.brand} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>
      ),
    },
    {
      label: 'AI',
      value: stats.ai,
      color: T.brandDeep,
      iconBg: T.brandSoft,
      icon: (
        <svg width="16" height="16" fill="none" stroke={T.brandDeep} strokeWidth="2" viewBox="0 0 24 24">
          <rect x="7" y="8" width="10" height="8" rx="2" />
          <path d="M12 4v2M9 16v2M15 16v2M4 12h2M18 12h2" />
        </svg>
      ),
    },
    {
      label: 'Human',
      value: stats.human,
      color: T.signalDeep,
      iconBg: T.signalSoft,
      icon: (
        <svg width="16" height="16" fill="none" stroke={T.signalDeep} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: 'Closed',
      value: stats.closed,
      color: T.textMuted,
      iconBg: '#F8FAFC',
      icon: (
        <svg width="16" height="16" fill="none" stroke={T.textMuted} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 px-3 sm:px-5 py-3 border-b flex-shrink-0"
      style={{ background: T.canvas, borderColor: T.border }}>
      {items.map(it => (
        <div key={it.label} className="stat-card rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          {/* Icon — hidden on very small screens to save space */}
          <div className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center flex-shrink-0"
            style={{ background: it.iconBg }}>
            {it.icon}
          </div>
          <div className="min-w-0">
            <div className="font-display text-lg sm:text-xl font-bold leading-none" style={{ color: it.color }}>
              {it.value}
            </div>
            <div className="text-[10px] sm:text-[11px] mt-0.5 font-500 truncate" style={{ color: T.textMuted }}>
              {it.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ name = '?', size = 36 }) {
  return (
    <div className="font-display" style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${T.brand} 0%, ${T.brandLight} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: '#fff', flexShrink: 0,
      userSelect: 'none',
    }}>
      {(name || '?')[0].toUpperCase()}
    </div>
  )
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center"
      style={{ background: T.canvas }}>
      <div className="relative mb-7">
        <div className="pulse-ring absolute inset-[-12px] rounded-full border-2"
          style={{ borderColor: T.signal, opacity: 0.4 }} />
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${T.brandSoft} 0%, #E0E7FF 100%)`,
            border: `1px solid #C7D2FE`,
          }}>
          <svg width="36" height="36" fill="none" stroke={T.brand} strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-base font-bold mb-2" style={{ color: T.ink }}>
        No conversation selected
      </h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: T.textMuted }}>
        Pick a conversation from the sidebar to view messages and manage the chat.
      </p>
    </div>
  )
}

/* ─── Main Chat component ────────────────────────────────────────────────── */
const Chat = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv]   = useState(null)
  const [messages, setMessages]           = useState([])
  const [filter, setFilter]               = useState('ALL')
  const [search, setSearch]               = useState('')
  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [stats, setStats]                 = useState({ total: 0, ai: 0, human: 0, closed: 0 })

  const selectedConvRef = useRef(null)
  useEffect(() => { selectedConvRef.current = selectedConv }, [selectedConv])

  useEffect(() => { injectStyles() }, [])

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user, navigate])

  const recomputeStats = useCallback((convs) => {
    setStats({
      total:  convs.length,
      ai:     convs.filter(c => c.status === 'AI').length,
      human:  convs.filter(c => c.status === 'HUMAN').length,
      closed: convs.filter(c => c.status === 'CLOSED').length,
    })
  }, [])

  /* ── Socket ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!user) return
    const socket = getAdminSocket(user.token)
    socket.emit('recruiter_connect', { recruiterId: user._id })

    socket.on('new_conversation', (conv) => {
      setConversations(prev => {
        if (prev.some(c => c._id === conv._id)) return prev
        const updated = [conv, ...prev]
        recomputeStats(updated)
        return updated
      })
    })

    socket.on('visitor_message_to_admin', (data) => {
      setConversations(prev => prev.map(c =>
        c._id === data.conversationId
          ? { ...c, lastMessage: data.message, updatedAt: new Date().toISOString() }
          : c
      ))
      if (selectedConvRef.current?._id === data.conversationId) {
        setMessages(prev => {
          if (prev.some(m => m._id === data._id)) return prev
          return [...prev, {
            _id: data._id || Date.now(),
            senderType: 'visitor',
            message: data.message,
            createdAt: data.createdAt || new Date().toISOString(),
          }]
        })
      }
    })

    socket.on('ai_response_to_admin', (data) => {
      if (selectedConvRef.current?._id === data.conversationId) {
        setMessages(prev => {
          if (prev.some(m => m._id === data._id)) return prev
          return [...prev, {
            _id: data._id || Date.now(),
            senderType: 'ai',
            message: data.message,
            createdAt: data.createdAt || new Date().toISOString(),
          }]
        })
      }
    })

    socket.on('conversation_status_update', (data) => {
      setConversations(prev => {
        const updated = prev.map(c =>
          c._id === data.conversationId ? { ...c, status: data.status } : c
        )
        recomputeStats(updated)
        return updated
      })
      if (selectedConvRef.current?._id === data.conversationId) {
        setSelectedConv(prev => prev
          ? { ...prev, status: data.status, assignedRecruiter: data.recruiterId ?? prev.assignedRecruiter }
          : prev
        )
      }
    })

    socket.on('new_message', (data) => {
      if (selectedConvRef.current?._id === data.conversationId) {
        setMessages(prev => {
          if (prev.some(m => m._id === data._id)) return prev
          const optIdx = [...prev].reverse().findIndex(
            m => String(m._id).startsWith('opt-') && m.senderType === data.senderType
          )
          if (optIdx !== -1) {
            const realIdx = prev.length - 1 - optIdx
            const next = [...prev]
            next[realIdx] = { ...data, senderName: data.senderName || data.recruiterName }
            return next
          }
          return [...prev, { ...data, senderName: data.senderName || data.recruiterName }]
        })
      }
    })

    socket.on('conversation_deleted', ({ conversationId }) => {
      setConversations(prev => {
        const updated = prev.filter(c => c._id !== conversationId)
        recomputeStats(updated)
        return updated
      })
      if (selectedConvRef.current?._id === conversationId) {
        setSelectedConv(null)
        setMessages([])
      }
    })

    return () => {
      socket.off('new_conversation')
      socket.off('visitor_message_to_admin')
      socket.off('ai_response_to_admin')
      socket.off('conversation_status_update')
      socket.off('new_message')
      socket.off('conversation_deleted')
    }
  }, [user?._id, recomputeStats])

  /* ── Data ───────────────────────────────────────────────────────────── */
  const loadConversations = useCallback(async () => {
    try {
      const { data } = await api.get('/conversations')
      const convs = data.conversations || []
      setConversations(convs)
      recomputeStats(convs)
    } catch (err) {
      console.error('Load conversations error:', err)
    }
  }, [recomputeStats])

  useEffect(() => { loadConversations() }, [loadConversations])

  /* ── Actions ────────────────────────────────────────────────────────── */
  const selectConversation = useCallback(async (conv) => {
    setSelectedConv(conv)
    setSidebarOpen(false)
    try {
      const { data } = await api.get(`/messages/${conv._id}`)
      setMessages(data.messages || [])
    } catch (err) {
      console.error('Load messages error:', err)
    }
  }, [])

  const takeover = useCallback(async (conversationId) => {
    if (!user) return
    try {
      await api.put(`/conversations/${conversationId}/assign`, { recruiterId: user._id })
      const socket = getAdminSocket(user.token)
      socket.emit('recruiter_join_conversation', { conversationId, recruiterId: user._id })
      setSelectedConv(prev => prev ? { ...prev, status: 'HUMAN', assignedRecruiter: user._id } : prev)
    } catch (err) {
      console.error('Takeover error:', err)
    }
  }, [user])

  // const handBackToAI = useCallback(async (conversationId) => {
  //   if (!user) return
  //   try {
  //     await api.put(`/conversations/${conversationId}/hand-back-to-ai`)
  //     const socket = getAdminSocket(user.token)
  //     socket.emit('hand_back_to_ai', { conversationId, recruiterId: user._id })
  //     setSelectedConv(prev =>
  //       prev?._id === conversationId ? { ...prev, status: 'AI', assignedRecruiter: null } : prev
  //     )
  //     setConversations(prev => {
  //       const updated = prev.map(c =>
  //         c._id === conversationId ? { ...c, status: 'AI', assignedRecruiter: null } : c
  //       )
  //       recomputeStats(updated)
  //       return updated
  //     })
  //   } catch (err) {
  //     console.error('Hand back to AI error:', err)
  //   }
  // }, [user, recomputeStats])
  const handBackToAI = useCallback(async (conversationId) => {
  if (!user) return
  try {
    await api.put(`/conversations/${conversationId}/hand-back-to-ai`)
    // socket.emit('hand_back_to_ai', ...) removed — the REST call above
    // already updates the DB, creates the system message, and emits
    // both 'new_message' (to the visitor) and 'conversation_status_update'
    // (to admin_room). Emitting the socket event too caused a duplicate
    // system message with a different (incorrect) recruiter name.
    setSelectedConv(prev =>
      prev?._id === conversationId ? { ...prev, status: 'AI', assignedRecruiter: null } : prev
    )
    setConversations(prev => {
      const updated = prev.map(c =>
        c._id === conversationId ? { ...c, status: 'AI', assignedRecruiter: null } : c
      )
      recomputeStats(updated)
      return updated
    })
  } catch (err) {
    console.error('Hand back to AI error:', err)
  }
}, [user, recomputeStats])

  const sendRecruiterMessage = useCallback((text) => {
    const conv = selectedConvRef.current
    if (!conv || !text.trim() || !user) return
    const socket = getAdminSocket(user.token)
    const optimisticId = `opt-${Date.now()}`
    setMessages(prev => [...prev, {
      _id: optimisticId,
      senderType: 'recruiter',
      senderName: user.name,
      message: text.trim(),
      createdAt: new Date().toISOString(),
    }])
    socket.emit('recruiter_message', {
      conversationId: conv._id,
      recruiterId:    user._id,
      recruiterName:  user.name,
      message:        text.trim(),
    })
  }, [user])

  const closeConversation = useCallback(async (conversationId) => {
    try {
      await api.put(`/conversations/${conversationId}/close`)
      setConversations(prev => {
        const updated = prev.map(c =>
          c._id === conversationId ? { ...c, status: 'CLOSED' } : c
        )
        recomputeStats(updated)
        return updated
      })
      setSelectedConv(prev =>
        prev?._id === conversationId ? { ...prev, status: 'CLOSED' } : prev
      )
    } catch (err) {
      console.error('Close error:', err)
    }
  }, [recomputeStats])

  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await api.delete(`/conversations/${conversationId}`)
      setConversations(prev => {
        const updated = prev.filter(c => c._id !== conversationId)
        recomputeStats(updated)
        return updated
      })
      if (selectedConvRef.current?._id === conversationId) {
        setSelectedConv(null)
        setMessages([])
        setSidebarOpen(true)
      }
    } catch (err) {
      console.error('Delete error:', err)
      throw err
    }
  }, [recomputeStats])

  const filtered = conversations.filter(c => {
    const matchFilter = filter === 'ALL' || c.status === filter
    const matchSearch = !search ||
      c.visitorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.visitorId?.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  if (!user) return null

  return (
    <div
      className="chat-root fixed inset-0 z-50 flex flex-col overflow-hidden"
    >
      {/* ══ TOP NAV ════════════════════════════════════════════════════════ */}
      <header className="nav-shimmer flex-shrink-0 relative z-10"
        style={{ boxShadow: '0 2px 20px rgba(55,48,163,0.32)' }}>

        {/* Faint node lattice — the "network" signature */}
        <div className="nav-lattice" />

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)' }} />

        {/* ── Primary row — always visible ─────────────────────────────── */}
        <div className="flex items-center justify-between px-3 sm:px-5 h-14 sm:h-[60px] relative">

          {/* Left cluster */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">

            {/* Hamburger */}
            <button
              className="btn btn-ghost p-2 rounded-lg flex-shrink-0"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle sidebar"
            >
              <div className="flex flex-col justify-between w-[18px] h-[14px]">
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'block', height: 2, background: '#fff', borderRadius: 2,
                    transformOrigin: 'left center',
                    transition: 'all 0.25s ease',
                    ...(sidebarOpen && i === 0 ? { transform: 'rotate(45deg) translate(1px,-1px)' } : {}),
                    ...(sidebarOpen && i === 1 ? { opacity: 0, transform: 'scaleX(0)' } : {}),
                    ...(sidebarOpen && i === 2 ? { transform: 'rotate(-45deg) translate(1px,1px)' } : {}),
                  }} />
                ))}
              </div>
            </button>

            {/* Back to dashboard — icon only on mobile, icon+label on sm+ */}
            <button
              className="btn btn-ghost flex-shrink-0"
              onClick={() => navigate('/')}
              title="Dashboard"
              style={{ padding: '6px 10px', borderRadius: 9 }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline text-[13px]">Dashboard</span>
            </button>

            {/* Brand wordmark — truncated on very small screens */}
            <div className="min-w-0">
              <div className="font-display text-sm sm:text-base font-bold text-white tracking-tight leading-tight truncate"
                style={{ letterSpacing: '-0.01em' }}>
                Sandesh Innovations
              </div>
              <div className="hidden sm:block text-[11px] mt-0.5 font-normal"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                AI Support Console
              </div>
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <div className="live-dot w-2 h-2 rounded-full" style={{ background: '#2DD4BF' }} />
              <span className="hidden sm:inline text-[11.5px] font-medium"
                style={{ color: 'rgba(255,255,255,0.7)' }}>Live</span>
            </div>

            {/* Avatar + user info — info hidden on mobile */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-[13px] font-semibold text-white leading-tight">
                  {user.name || 'User'}
                </div>
                <div className="text-[11px] capitalize" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {user.role}
                </div>
              </div>
              <div className="avatar-glow rounded-full">
                <Avatar name={user.name} size={32} />
              </div>
            </div>

            {/* Logout — icon only on mobile */}
            <button className="btn btn-ghost flex-shrink-0" onClick={logout}
              style={{ padding: '6px 10px', fontSize: 12.5 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* ── Mobile sub-row: user name + role ─────────────────────────── */}
        {/* Visible only on very small screens where there's no room in the main row */}
        <div className="sm:hidden flex items-center justify-end px-3 pb-2 gap-2 relative">
          <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {user.name || 'User'} &middot; <span className="capitalize">{user.role}</span>
          </span>
        </div>
      </header>

      {/* ══ STATS ══════════════════════════════════════════════════════════ */}
      <PremiumStatsBar stats={stats} />

      {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Mobile backdrop */}
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="sm:hidden absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: 'rgba(11,17,32,0.55)',
            backdropFilter: 'blur(3px)',
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? 'auto' : 'none',
          }}
        />

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside
          className="flex flex-col flex-shrink-0 z-30 overflow-hidden transition-all duration-300"
          style={{
            width: 340,
            maxWidth: '88vw',
            background: T.sidebar,
            borderRight: `1px solid ${T.border}`,
            boxShadow: sidebarOpen ? '0 10px 40px rgba(11,17,32,0.12)' : 'none',
            // Mobile: absolute + slide in/out. Desktop: always visible via CSS override below.
          }}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 flex-shrink-0 bg-white border-b"
            style={{ borderColor: T.border }}>
            <div>
              <h2 className="font-display text-base font-bold m-0" style={{ color: T.ink }}>
                Conversations
              </h2>
              <p className="text-xs mt-0.5 m-0" style={{ color: T.textMuted }}>
                {filtered.length} active
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: T.brandSoft }}>
              <svg width="20" height="20" fill="none" stroke={T.brand} strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>

          {/* Scrollable list — the key fix for mobile */}
          <div
            className="chat-scroll flex-1 overflow-y-auto overflow-x-hidden"
            style={{ WebkitOverflowScrolling: 'touch', paddingBottom: 20 }}
          >
            <ConversationList
              conversations={filtered}
              selected={selectedConv}
              onSelect={selectConversation}
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
              onDelete={deleteConversation}
            />
          </div>
        </aside>

        {/* ── Main panel ───────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0"
          style={{ background: T.canvas }}>
          {selectedConv ? (
            <ChatPanel
              conversation={selectedConv}
              messages={messages}
              recruiter={user}
              onSend={sendRecruiterMessage}
              onTakeover={takeover}
              onClose={closeConversation}
              onBack={() => setSidebarOpen(true)}
              onHandBackToAI={handBackToAI}
            />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {/* ── Responsive layout rules ──────────────────────────────────────── */}
      <style>{`
        /* Desktop: sidebar is always in flow, not overlaid */
        @media (min-width: 640px) {
          aside {
            position: relative !important;
            transform: translateX(0) !important;
          }
          .sm\\:hidden { display: none !important; }
        }

        /* Mobile: sidebar absolutely overlays the content */
        @media (max-width: 639px) {
          aside {
            position: absolute !important;
            top: 0; bottom: 0; left: 0;
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
        }

        /* Stats bar 2-col on very small phones */
        @media (max-width: 380px) {
          .chat-root .grid-cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Chat