export const triggerAIResponse = async (req, res, next) => {
  try {
    const { conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.status !== 'AI') {
      return res.status(400).json({ error: 'Conversation is not in AI mode' });
    }

    const history = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chronological = history.reverse();

    // Guard: don't respond if last message was already from AI
    const lastMessage = chronological[chronological.length - 1];
    if (lastMessage?.senderType === 'ai') {
      return res.status(400).json({ error: 'Last message is already from AI' });
    }

    const aiText = await generateAIResponse(chronological);

    const aiMsg = await Message.create({
      conversationId,
      senderType: 'ai',
      senderId: null,
      message: aiText,
    });

    const io = req.app.get('io');
    io.to(`conversation_${conversationId}`).emit('new_message', aiMsg.toObject());

    res.json({ success: true, message: aiMsg });
  } catch (error) {
    next(error);
  }
};