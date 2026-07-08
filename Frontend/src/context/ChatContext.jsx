import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from 'react'
import api from '../Axios/Axios.js'
import { getSocket, connectSocket, disconnectSocket } from '../services/socket.js'

const ChatContext = createContext(null)

const SESSION_KEY    = 'sandesh_chat_session'
const SESSION_TTL_MS = 30 * 60 * 1000   // ← 30 minutes (was 60)

const saveSession = (visitor, conversationId) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      visitor,
      conversationId,
      expiresAt: Date.now() + SESSION_TTL_MS,
    }))
  } catch { /* storage full / blocked */ }
}

const loadSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session?.expiresAt || Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

const clearSession = () => {
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

export const ChatProvider = ({ children }) => {
  const [isOpen,          setIsOpen]          = useState(false)
  const [step,            setStep]            = useState('form')
  const [visitor,         setVisitor]         = useState(null)
  const [conversation,    setConversation]    = useState(null)
  const [messages,        setMessages]        = useState([])
  const [isAiTyping,      setIsAiTyping]      = useState(false)
  const [recruiterTyping, setRecruiterTyping] = useState(false)
  const [recruiterName,   setRecruiterName]   = useState('')
  const [isRestoring,     setIsRestoring]     = useState(true)

  const socketRef       = useRef(null)
  const visitorRef      = useRef(null)
  const conversationRef = useRef(null)
  const aiTypingTimeout = useRef(null)

  useEffect(() => { visitorRef.current      = visitor      }, [visitor])
  useEffect(() => { conversationRef.current = conversation }, [conversation])

  // ── Session restore on mount ─────────────────────────────────────────────
  // FIX: previously any error in this block (network blip, CORS hiccup,
  // temporary 500, slow connection right after a hard refresh) called
  // clearSession() unconditionally — wiping a perfectly valid, non-expired
  // session and forcing the visitor to re-enter their details. Now we only
  // clear the session when the backend explicitly confirms it's invalid
  // (404/403 or a malformed success response). Any other error just skips
  // restoring this time, leaving the session in localStorage so the next
  // refresh/retry can still use it. On a successful restore we also refresh
  // the TTL so an actively-used chat doesn't expire mid-conversation.



  // useEffect(() => {

  //   const restore = async () => {
  //     const session = loadSession()
  //     if (!session) { setIsRestoring(false); return }

  //     try {
  //       const { data } = await api.get(`/conversations/${session.conversationId}`)

  //       if (!data?.success || !data?.conversation) {
  //         console.warn('[ChatContext] Session conversation not found — clearing session')
  //         clearSession()
  //         setIsRestoring(false)
  //         return
  //       }

  //       setVisitor(session.visitor)
  //       setConversation({
  //         _id:               data.conversation._id,
  //         status:            data.conversation.status,
  //         assignedRecruiter: data.conversation.assignedRecruiter,
  //       })
  //       setMessages(data.messages || [])
  //       setStep('chat')

  //       // await connection so socket.id is valid before emitting
  //       const socket = await connectSocket()
  //       socket.emit('visitor_join', {
  //         visitorId:      session.visitor._id,
  //         conversationId: session.conversationId,
  //         socketId:       socket.id,  // guaranteed to exist now
  //       })

  //       // Refresh the 30-minute TTL on every successful restore
  //       saveSession(session.visitor, session.conversationId)

  //     } catch (err) {
  //       const status = err?.response?.status
  //       if (status === 404 || status === 403) {
  //         console.warn(`[ChatContext] Session invalid (HTTP ${status}) — clearing session`)
  //         clearSession()
  //       } else {
  //         console.error('[ChatContext] Restore failed (keeping session for retry):', err?.message || err)
  //       }
  //     }
  //     setIsRestoring(false)
  //   }
  //   restore()
  // }, [])


// ── Session restore on mount ─────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const session = loadSession()
      if (!session) { setIsRestoring(false); return }

      try {
        // FIX: was calling the admin-protected `/conversations/:id` route
        // (returned 401 for visitors, no auth token). Visitors must use the
        // public route instead: /conversations/:conversationId/visitor/:visitorId
        const { data } = await api.get(
          `/conversations/${session.conversationId}/visitor/${session.visitor._id}`
        )

        if (!data?.success || !data?.conversation) {
          console.warn('[ChatContext] Session conversation not found — clearing session')
          clearSession()
          setIsRestoring(false)
          return
        }

        setVisitor(session.visitor)
        setConversation({
          _id:               data.conversation._id,
          status:            data.conversation.status,
          assignedRecruiter: data.conversation.assignedRecruiter,
        })
        setMessages(data.messages || [])
        setStep('chat')

        const socket = await connectSocket()
        socket.emit('visitor_join', {
          visitorId:      session.visitor._id,
          conversationId: session.conversationId,
          socketId:       socket.id,
        })

        // Refresh the 30-minute TTL on every successful restore
        saveSession(session.visitor, session.conversationId)

      } catch (err) {
        const status = err?.response?.status
        if (status === 404 || status === 403) {
          console.warn(`[ChatContext] Session invalid (HTTP ${status}) — clearing session`)
          clearSession()
        } else {
          console.error('[ChatContext] Restore failed (keeping session for retry):', err?.message || err)
        }
      }
      setIsRestoring(false)
    }
    restore()
  }, [])



  // ── Deduped append ───────────────────────────────────────────────────────
  const appendMessage = useCallback((msg) => {
    setMessages(prev => {
      if (prev.some(m => m._id === msg._id)) return prev
      return [...prev, msg]
    })
  }, [])

  // ── Replace optimistic message with server-confirmed version ─────────────
  const replaceOptimistic = useCallback((serverMsg) => {
    setMessages(prev => {
      if (prev.some(m => m._id === serverMsg._id)) return prev
      const idx = [...prev].reverse().findIndex(
        m => String(m._id).startsWith('opt-') && m.senderType === 'visitor'
      )
      if (idx === -1) return [...prev, serverMsg]
      const realIdx = prev.length - 1 - idx
      const next = [...prev]
      next[realIdx] = serverMsg
      return next
    })
  }, [])

  // ── Socket setup — attach listeners, guard against null socket ───────────
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return  // no URL set — bail out, no errors
    socketRef.current = socket

    const handleReconnect = () => {
      const v = visitorRef.current
      const c = conversationRef.current
      // only emit if we have a valid visitor AND socket.id (i.e. truly connected)
      if (v && c && socket.id) {
        socket.emit('visitor_join', {
          visitorId:      v._id,
          conversationId: c._id,
          socketId:       socket.id,
        })
      }
    }

    const handleNewMessage = (msg) => {
      const normalised = {
        ...msg,
        senderName: msg.senderName || msg.recruiterName || null,
      }
      if (normalised.senderType === 'visitor') {
        replaceOptimistic(normalised)
        return
      }
      if (normalised.senderType === 'ai') {
        clearTimeout(aiTypingTimeout.current)
        setIsAiTyping(false)
      }
      appendMessage(normalised)
    }

    const handleAiTyping = ({ isTyping }) => {
      if (isTyping) {
        setIsAiTyping(true)
        clearTimeout(aiTypingTimeout.current)
        aiTypingTimeout.current = setTimeout(() => setIsAiTyping(false), 15000)
      } else {
        clearTimeout(aiTypingTimeout.current)
        setIsAiTyping(false)
      }
    }

    const handleRecruiterJoined = (data) => {
      const name = data.recruiterName || 'Recruitment Specialist'
      setRecruiterName(name)
      if (data.systemMessage) {
        appendMessage({
          ...data.systemMessage,
          _id: data.systemMessage._id || `sys-${Date.now()}`,
        })
      } else {
        appendMessage({
          _id:        `sys-${Date.now()}`,
          senderType: 'system',
          message:    `${name} has joined the conversation.`,
          createdAt:  new Date().toISOString(),
        })
      }
    }

    const handleConversationClosed = (data) => {
      if (data?.systemMessage) {
        appendMessage({
          ...data.systemMessage,
          _id: data.systemMessage._id || `sys-${Date.now()}`,
        })
      } else {
        appendMessage({
          _id:        `sys-${Date.now()}`,
          senderType: 'system',
          message:    'This conversation has been closed. Thank you!',
          createdAt:  new Date().toISOString(),
        })
      }
      setConversation(prev => prev ? { ...prev, status: 'CLOSED' } : prev)
      clearSession()
    }

    const handleStatusUpdate = (data) => {
      setConversation(prev => {
        if (!prev || prev._id !== data.conversationId) return prev
        return { ...prev, status: data.status }
      })
      if (data.status === 'AI') {
        setRecruiterName('')
        setRecruiterTyping(false)
      }
    }

    socket.on('connect',                    handleReconnect)
    socket.on('new_message',                handleNewMessage)
    socket.on('ai_typing',                  handleAiTyping)
    socket.on('recruiter_joined',           handleRecruiterJoined)
    socket.on('recruiter_typing',           () => setRecruiterTyping(true))
    socket.on('recruiter_stop_typing',      () => setRecruiterTyping(false))
    socket.on('conversation_closed',        handleConversationClosed)
    socket.on('conversation_status_update', handleStatusUpdate)

    return () => {
      clearTimeout(aiTypingTimeout.current)
      socket.off('connect',                    handleReconnect)
      socket.off('new_message',                handleNewMessage)
      socket.off('ai_typing',                  handleAiTyping)
      socket.off('recruiter_joined',           handleRecruiterJoined)
      socket.off('recruiter_typing')
      socket.off('recruiter_stop_typing')
      socket.off('conversation_closed',        handleConversationClosed)
      socket.off('conversation_status_update', handleStatusUpdate)
    }
  }, [appendMessage, replaceOptimistic])

  // ── Visitor identification ────────────────────────────────────────────────
  const identifyVisitor = useCallback(async ({ name, email }) => {
    try {
      // await so socket.id is guaranteed before sending to backend
      const socket = await connectSocket()

      const { data } = await api.post('/visitors/identify', {
        name,
        email,
        socketId: socket.id,  // always valid now
      })

      setVisitor(data.visitor)
      setConversation(data.conversation)
      setMessages(data.messages || [])
      setStep('chat')

      saveSession(data.visitor, data.conversation._id)

      socket.emit('visitor_join', {
        visitorId:      data.visitor._id,
        conversationId: data.conversation._id,
        socketId:       socket.id,
      })
    } catch (err) {
      console.error('Identify visitor error:', err)
      throw err
    }
  }, [])

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!visitor || !conversation || !text.trim()) return

    const optimistic = {
      _id:        `opt-${Date.now()}`,
      senderType: 'visitor',
      message:    text.trim(),
      createdAt:  new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    socketRef.current?.emit('visitor_message', {
      visitorId:      visitor._id,
      conversationId: conversation._id,
      message:        text.trim(),
    })
  }, [visitor, conversation])

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), [])
  const closeChat  = useCallback(() => setIsOpen(false), [])

  return (
    <ChatContext.Provider value={{
      isOpen, toggleChat, closeChat,
      step, setStep,
      visitor, conversation,
      messages,
      isAiTyping, recruiterTyping, recruiterName,
      identifyVisitor, sendMessage,
      isRestoring,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}