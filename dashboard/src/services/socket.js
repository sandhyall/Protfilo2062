import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
let socket = null

export const getAdminSocket = (token) => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

export const disconnectAdminSocket = () => {
  if (socket) { socket.disconnect(); socket = null }
}