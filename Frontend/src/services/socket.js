import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

let socket = null

/**
 * Returns a singleton Socket.io instance (NOT yet connected).
 * Returns null if VITE_SOCKET_URL is not set — no DNS lookup, no console error.
 */
export const getSocket = () => {
  if (!SOCKET_URL) return null

  if (!socket) {
    socket = io(SOCKET_URL, {
      transports:           ['websocket'],
      autoConnect:          false,  // never connect until explicitly called
      reconnection:         true,
      reconnectionAttempts: 5,
      reconnectionDelay:    1000,
    })
  }

  return socket
}

/**
 * Connects the socket and resolves with the instance once socket.id is ready.
 * Safe to call multiple times — resolves immediately if already connected.
 * Rejects if VITE_SOCKET_URL is not set or connection fails.
 */
export const connectSocket = () => new Promise((resolve, reject) => {
  const s = getSocket()

  if (!s) return reject(new Error('Socket not available: VITE_SOCKET_URL is not set'))

  // Already connected — socket.id is valid, resolve immediately
  if (s.connected) return resolve(s)

  // Wait for connect or connect_error — whichever fires first
  const onConnect = () => {
    s.off('connect_error', onError)
    resolve(s)
  }
  const onError = (err) => {
    s.off('connect', onConnect)
    reject(err)
  }

  s.once('connect',       onConnect)
  s.once('connect_error', onError)

  // Kick off the connection
  s.connect()
})

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}