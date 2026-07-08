// // src/Component/Chat/ConversationList.jsx
// import React, { useState, useRef, useEffect } from 'react'

// const BRAND = '#154895'

// const statusBadge = {
//   AI:     'bg-blue-100 text-blue-700',
//   HUMAN:  'bg-green-100 text-green-700',
//   CLOSED: 'bg-gray-100 text-gray-500',
// }

// const statusDot = {
//   AI:     'bg-blue-400',
//   HUMAN:  'bg-green-400',
//   CLOSED: 'bg-gray-300',
// }

// const filterTabs = ['ALL', 'AI', 'HUMAN', 'CLOSED']

// const formatRelativeTime = (dateStr) => {
//   if (!dateStr) return ''
//   const date = new Date(dateStr)
//   const now  = new Date()
//   if (date.toDateString() === now.toDateString()) {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//   }
//   const yesterday = new Date(now)
//   yesterday.setDate(now.getDate() - 1)
//   if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
//   const sameYear = date.getFullYear() === now.getFullYear()
//   return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: sameYear ? undefined : 'numeric' })
// }

// const DeleteConfirmPopover = ({ onConfirm, onCancel, isDeleting }) => (
//   <div
//     className="absolute right-0 top-full mt-1.5 z-50 w-60 rounded-2xl shadow-2xl
//       border border-red-100 bg-white overflow-hidden animate-[fadeInScale_0.15s_ease-out]"
//     onClick={e => e.stopPropagation()}
//   >
//     <div className="px-4 pt-3.5 pb-3">
//       <p className="text-sm font-bold text-gray-800 mb-1">Delete conversation?</p>
//       <p className="text-xs text-gray-500 leading-relaxed">
//         This will permanently remove all messages. This cannot be undone.
//       </p>
//     </div>
//     <div className="flex border-t border-gray-100">
//       <button
//         onClick={onCancel}
//         disabled={isDeleting}
//         className="flex-1 py-3 text-xs font-semibold text-gray-500
//           hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={onConfirm}
//         disabled={isDeleting}
//         className="flex-1 py-3 text-xs font-semibold text-red-600
//           hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
//       >
//         {isDeleting ? (
//           <>
//             <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10"
//                 stroke="currentColor" strokeWidth="4" />
//               <path className="opacity-75" fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z" />
//             </svg>
//             Deleting…
//           </>
//         ) : (
//           <>
//             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//             Delete
//           </>
//         )}
//       </button>
//     </div>
//   </div>
// )

// const ConvItem = ({ conv, selected, onSelect, onDelete }) => {
//   const [showConfirm, setShowConfirm] = useState(false)
//   const [isDeleting,  setIsDeleting]  = useState(false)
//   const popoverRef                     = useRef(null)
//   const visitor = conv.visitorId
//   const time = formatRelativeTime(conv.updatedAt)

//   useEffect(() => {
//     if (!showConfirm) return
//     const handler = (e) => {
//       if (popoverRef.current && !popoverRef.current.contains(e.target)) {
//         setShowConfirm(false)
//       }
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [showConfirm])

//   const handleDeleteClick = (e) => {
//     e.stopPropagation()
//     setShowConfirm(true)
//   }

//   const handleConfirmDelete = async (e) => {
//     e.stopPropagation()
//     setIsDeleting(true)
//     try {
//       await onDelete(conv._id)
//     } finally {
//       setIsDeleting(false)
//       setShowConfirm(false)
//     }
//   }

//   return (
//     <div className="relative group">
//       {/* Conversation row — right padding makes room for the always-visible delete button */}
//       <button
//         onClick={() => onSelect(conv)}
//         className="w-full text-left pl-3.5 pr-14 py-3.5 border-b border-gray-50
//           hover:bg-gray-50 active:bg-gray-100 transition-colors"
//         style={selected
//           ? { backgroundColor: '#eff6ff', borderLeft: '3px solid #154895' }
//           : { borderLeft: '3px solid transparent' }}
//       >
//         <div className="flex items-start gap-3">
//           {/* Avatar with status dot */}
//           <div className="relative flex-shrink-0 mt-0.5">
//             <div
//               className="w-11 h-11 rounded-full flex items-center justify-center
//                 text-white text-sm font-bold shadow-sm"
//               style={{ background: `linear-gradient(135deg, ${BRAND}, #1a5cbf)` }}
//             >
//               {(visitor?.name?.[0] || '?').toUpperCase()}
//             </div>
//             {conv.status !== 'CLOSED' && (
//               <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
//                 {conv.status === 'HUMAN' && (
//                   <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
//                 )}
//                 <span className={`relative inline-flex w-3 h-3 rounded-full border-2 border-white
//                   ${statusDot[conv.status] || 'bg-gray-300'}`} />
//               </span>
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             {/* Name + time */}
//             <div className="flex items-center justify-between gap-2">
//               <p className="text-sm font-semibold text-gray-800 truncate">
//                 {visitor?.name || 'Unknown'}
//               </p>
//               <span className="text-[11px] text-gray-400 flex-shrink-0 tabular-nums font-medium">
//                 {time}
//               </span>
//             </div>

//             {/* Email */}
//             <p className="text-[11px] text-gray-400 truncate mt-0.5">{visitor?.email}</p>

//             {/* Last message */}
//             {conv.lastMessage && (
//               <p className="text-xs text-gray-500 truncate mt-1 leading-relaxed">
//                 {conv.lastMessage}
//               </p>
//             )}

//             {/* Status badge + unread */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5
//                 rounded-full font-semibold ${statusBadge[conv.status] || 'bg-gray-100 text-gray-500'}`}>
//                 <span className={`w-1.5 h-1.5 rounded-full ${statusDot[conv.status] || 'bg-gray-400'}`} />
//                 {conv.status}
//               </span>
//               {conv.unreadCount > 0 && (
//                 <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
//                   rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
//                   {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </button>

//       {/* ── Delete button — always visible on every screen size ── */}
//       <div ref={popoverRef} className="absolute top-1/2 -translate-y-1/2 right-3">
//         <button
//           onClick={handleDeleteClick}
//           title="Delete conversation"
//           className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150
//             bg-red-50 border border-red-200 text-red-400
//             hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md
//             active:scale-90"
//         >
//           <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor"
//             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//             <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//           </svg>
//         </button>

//         {showConfirm && (
//           <DeleteConfirmPopover
//             onConfirm={handleConfirmDelete}
//             onCancel={(e) => { e?.stopPropagation(); setShowConfirm(false) }}
//             isDeleting={isDeleting}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// const ConversationList = ({
//   conversations, selected, onSelect,
//   filter, setFilter, search, setSearch,
//   onDelete,
// }) => (
//   <div className="flex flex-col h-full bg-white">

//     <style>{`
//       @keyframes fadeInScale {
//         from { opacity: 0; transform: translateY(-4px) scale(0.97); }
//         to   { opacity: 1; transform: translateY(0)    scale(1);    }
//       }
//     `}</style>

//     {/* Search */}
//     <div className="px-4 pt-4 pb-3 border-b border-gray-100">
//       <div className="relative">
//         <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
//           fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
//         <input
//           type="text"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search visitors…"
//           className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl
//             text-gray-800 placeholder-gray-400 bg-gray-50
//             focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-colors"
//           style={{ '--tw-ring-color': BRAND }}
//         />
//         {search && (
//           <button
//             onClick={() => setSearch('')}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400
//               hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
//           >
//             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
//     </div>

//     {/* Filter tabs */}
//     <div className="flex gap-1.5 px-3 py-2.5 border-b border-gray-100 bg-white">
//       {filterTabs.map(tab => (
//         <button
//           key={tab}
//           onClick={() => setFilter(tab)}
//           className="flex-1 text-xs py-2.5 rounded-xl font-semibold transition-colors"
//           style={filter === tab
//             ? { backgroundColor: BRAND, color: '#ffffff', boxShadow: '0 2px 8px rgba(21,72,149,0.25)' }
//             : { color: '#6b7280', backgroundColor: '#f9fafb' }}
//           onMouseEnter={e => { if (filter !== tab) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
//           onMouseLeave={e => { if (filter !== tab) e.currentTarget.style.backgroundColor = '#f9fafb' }}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>

//     {/* Count label */}
//     {conversations.length > 0 && (
//       <div className="px-4 py-2 border-b border-gray-50">
//         <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
//           {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
//           {filter !== 'ALL' ? ` · ${filter}` : ''}
//         </p>
//       </div>
//     )}

//     {/* List */}
//     <div className="flex-1 overflow-y-auto">
//       {conversations.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-center px-6">
//           <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
//             style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
//             <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                 d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//             </svg>
//           </div>
//           <p className="text-sm font-semibold text-gray-400">No conversations found</p>
//           {(search || filter !== 'ALL') && (
//             <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
//           )}
//         </div>
//       ) : (
//         conversations.map(conv => (
//           <ConvItem
//             key={conv._id}
//             conv={conv}
//             selected={selected?._id === conv._id}
//             onSelect={onSelect}
//             onDelete={onDelete}
//           />
//         ))
//       )}
//     </div>
//   </div>
// )


// src/Component/Chat/ConversationList.jsx
import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const BRAND = '#154895'

const statusBadge = {
  AI:     'bg-blue-100 text-blue-700',
  HUMAN:  'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-500',
}

const statusDot = {
  AI:     'bg-blue-400',
  HUMAN:  'bg-green-400',
  CLOSED: 'bg-gray-300',
}

const filterTabs = ['ALL', 'AI', 'HUMAN', 'CLOSED']

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now  = new Date()
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  const sameYear = date.getFullYear() === now.getFullYear()
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: sameYear ? undefined : 'numeric' })
}

// ── Portal Popover ─────────────────────────────────────────────────────────────
const DeleteConfirmPopover = ({ anchorRef, popoverRef, onConfirm, onCancel, isDeleting }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!anchorRef.current) return

    const updatePos = () => {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({
        top:  rect.bottom + window.scrollY + 6,
        left: rect.right  + window.scrollX - 240,
      })
    }

    updatePos()

    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [anchorRef])

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top:      pos.top,
        left:     pos.left,
        zIndex:   9999,
        width:    240,
        animation: 'fadeInScale 0.15s ease-out',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="rounded-2xl shadow-2xl border border-red-100 bg-white overflow-hidden">
        <div className="px-4 pt-3.5 pb-3">
          <p className="text-sm font-bold text-gray-800 mb-1">Delete conversation?</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This will permanently remove all messages. This cannot be undone.
          </p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 text-xs font-semibold text-gray-500
              hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 text-xs font-semibold text-red-600
              hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── ConvItem ───────────────────────────────────────────────────────────────────
const ConvItem = ({ conv, selected, onSelect, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting,  setIsDeleting]  = useState(false)
  const btnRef      = useRef(null)   // anchor for positioning
  const popoverRef  = useRef(null)   // ref passed into the portal DOM node
  const visitor = conv.visitorId
  const time    = formatRelativeTime(conv.updatedAt)

  // Close popover on outside click — checks both the button and the portal node
  useEffect(() => {
    if (!showConfirm) return
    const handler = (e) => {
      const clickedBtn     = btnRef.current?.contains(e.target)
      const clickedPopover = popoverRef.current?.contains(e.target)
      if (!clickedBtn && !clickedPopover) {
        setShowConfirm(false)
      }
    }
    // Use capture so we catch clicks before stopPropagation on children
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [showConfirm])

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowConfirm(prev => !prev)
  }

  const handleConfirmDelete = async (e) => {
    e.stopPropagation()
    setIsDeleting(true)
    try {
      await onDelete(conv._id)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleCancel = (e) => {
    e?.stopPropagation()
    setShowConfirm(false)
  }

  return (
    <div className="relative group">
      {/* Conversation row */}
      <button
        onClick={() => onSelect(conv)}
        className="w-full text-left pl-3.5 pr-14 py-3.5 border-b border-gray-50
          hover:bg-gray-50 active:bg-gray-100 transition-colors"
        style={selected
          ? { backgroundColor: '#eff6ff', borderLeft: '3px solid #154895' }
          : { borderLeft: '3px solid transparent' }}
      >
        <div className="flex items-start gap-3">
          {/* Avatar with status dot */}
          <div className="relative flex-shrink-0 mt-0.5">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center
                text-white text-sm font-bold shadow-sm"
              style={{ background: `linear-gradient(135deg, ${BRAND}, #1a5cbf)` }}
            >
              {(visitor?.name?.[0] || '?').toUpperCase()}
            </div>
            {conv.status !== 'CLOSED' && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                {conv.status === 'HUMAN' && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
                )}
                <span className={`relative inline-flex w-3 h-3 rounded-full border-2 border-white
                  ${statusDot[conv.status] || 'bg-gray-300'}`} />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + time */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {visitor?.name || 'Unknown'}
              </p>
              <span className="text-[11px] text-gray-400 flex-shrink-0 tabular-nums font-medium">
                {time}
              </span>
            </div>

            {/* Email */}
            <p className="text-[11px] text-gray-400 truncate mt-0.5">{visitor?.email}</p>

            {/* Last message */}
            {conv.lastMessage && (
              <p className="text-xs text-gray-500 truncate mt-1 leading-relaxed">
                {conv.lastMessage}
              </p>
            )}

            {/* Status badge + unread */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5
                rounded-full font-semibold ${statusBadge[conv.status] || 'bg-gray-100 text-gray-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[conv.status] || 'bg-gray-400'}`} />
                {conv.status}
              </span>
              {conv.unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                  rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
                  {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* ── Delete button ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3">
        <button
          ref={btnRef}
          onClick={handleDeleteClick}
          title="Delete conversation"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150
            bg-red-50 border border-red-200 text-red-400
            hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md
            active:scale-90"
        >
          <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {showConfirm && (
          <DeleteConfirmPopover
            anchorRef={btnRef}
            popoverRef={popoverRef}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancel}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  )
}

// ── ConversationList ───────────────────────────────────────────────────────────
const ConversationList = ({
  conversations, selected, onSelect,
  filter, setFilter, search, setSearch,
  onDelete,
}) => (
  <div className="flex flex-col h-full bg-white">

    <style>{`
      @keyframes fadeInScale {
        from { opacity: 0; transform: translateY(-4px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
      }
    `}</style>

    {/* Search */}
    <div className="px-4 pt-4 pb-3 border-b border-gray-100">
      <div className="relative">
        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search visitors…"
          className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl
            text-gray-800 placeholder-gray-400 bg-gray-50
            focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-colors"
          style={{ '--tw-ring-color': BRAND }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400
              hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>

    {/* Filter tabs */}
    <div className="flex gap-1.5 px-3 py-2.5 border-b border-gray-100 bg-white">
      {filterTabs.map(tab => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className="flex-1 text-xs py-2.5 rounded-xl font-semibold transition-colors"
          style={filter === tab
            ? { backgroundColor: BRAND, color: '#ffffff', boxShadow: '0 2px 8px rgba(21,72,149,0.25)' }
            : { color: '#6b7280', backgroundColor: '#f9fafb' }}
          onMouseEnter={e => { if (filter !== tab) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
          onMouseLeave={e => { if (filter !== tab) e.currentTarget.style.backgroundColor = '#f9fafb' }}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Count label */}
    {conversations.length > 0 && (
      <div className="px-4 py-2 border-b border-gray-50">
        <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          {filter !== 'ALL' ? ` · ${filter}` : ''}
        </p>
      </div>
    )}

    {/* List */}
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-400">No conversations found</p>
          {(search || filter !== 'ALL') && (
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
          )}
        </div>
      ) : (
        conversations.map(conv => (
          <ConvItem
            key={conv._id}
            conv={conv}
            selected={selected?._id === conv._id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  </div>
)

export default ConversationList