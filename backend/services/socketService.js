export const emitToVisitor = (io, socketId, event, data) => {
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

export const emitToAdmins = (io, event, data) => {
  io.to('admin_room').emit(event, data);
};

export const emitToConversation = (io, conversationId, event, data) => {
  io.to(`conversation_${conversationId}`).emit(event, data);
};

export const broadcastToAdmins = (io, socket, event, data) => {
  socket.to('admin_room').emit(event, data);
};