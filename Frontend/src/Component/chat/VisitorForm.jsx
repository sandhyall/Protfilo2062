


import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '../../context/ChatContext.jsx'

/**
 * VisitorForm — collects name + email before chat starts.
 *
 * Simplified flow — no separate /check-email call:
 *   Step 1: Enter email
 *   Step 2: Enter name (skipped if backend says they're returning)
 *   Step 3: identifyVisitor() — backend handles new vs returning in one call
 */
const VisitorForm = () => {
  const { identifyVisitor } = useChat()

  const [step, setStep]       = useState('email')   // 'email' | 'name' | 'loading'
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const emailRef = useRef(null)
  const nameRef  = useRef(null)

  useEffect(() => {
    if (step === 'email') setTimeout(() => emailRef.current?.focus(), 80)
    if (step === 'name')  setTimeout(() => nameRef.current?.focus(), 80)
  }, [step])

  // ── Step 1: collect email ───────────────────────────────────────────────────
  const handleEmailSubmit = (e) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      return setError('Please enter a valid email address.')
    }
    setError('')
    setStep('name')
  }

  // ── Step 2: collect name, then identify ────────────────────────────────────
  const handleNameSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    setError('')
    setLoading(true)
    try {
      await identifyVisitor({
        name:  name.trim(),
        email: email.trim().toLowerCase(),
      })
      // ChatContext.identifyVisitor sets step → 'chat' on success
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">

      {/* ── Email step ──────────────────────────────────────────────────────── */}
      {step === 'email' && (
        <>
          <IconAvatar icon="chat" />
          <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
            Welcome! 👋
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            Enter your email to start chatting — we'll load your previous
            conversation if you've been here before.
          </p>

          <form onSubmit={handleEmailSubmit} className="w-full max-w-xs space-y-3">
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="your@email.com"
              className={inputClass(error)}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className={primaryBtn}>
              Continue →
            </button>
          </form>
        </>
      )}

      {/* ── Name step ───────────────────────────────────────────────────────── */}
      {step === 'name' && (
        <>
          <IconAvatar icon="person" />
          <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
            What's your name?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-2 max-w-xs">
            We'll use this to personalise your experience.
          </p>

          {/* Email chip */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full mb-5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-600 font-medium">{email}</span>
          </div>

          <form onSubmit={handleNameSubmit} className="w-full max-w-xs space-y-3">
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Your full name"
              className={inputClass(error)}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading
                ? <><Spinner /> Starting chat...</>
                : 'Start Chatting →'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError('') }}
              className={ghostBtn}
              disabled={loading}
            >
              ← Change email
            </button>
          </form>
        </>
      )}

      <p className="text-xs text-gray-300 mt-6 text-center">
        Your information is kept private and secure.
      </p>
    </div>
  )
}

// ── Style tokens ────────────────────────────────────────────────────────────────
const primaryBtn = `
  w-full bg-[#154895] hover:bg-[#0f3570] disabled:opacity-60
  text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-200
  flex items-center justify-center gap-2 cursor-pointer
`
const ghostBtn = `
  w-full text-xs text-gray-400 hover:text-gray-600 py-1.5 transition-colors
`
const inputClass = (error) => `
  w-full border ${error ? 'border-red-300' : 'border-gray-300'} rounded-xl px-4 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-[#154895] focus:border-transparent
  placeholder-gray-400 transition
`

// ── Micro components ────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

const IconAvatar = ({ icon }) => (
  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
    {icon === 'chat' ? (
      <svg className="w-8 h-8" style={{ color: '#154895' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ) : (
      <svg className="w-8 h-8" style={{ color: '#154895' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )}
  </div>
)

export default VisitorForm