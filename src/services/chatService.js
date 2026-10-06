export const chatService = {
  async listConversations() { return [] },
  async sendMessage(message) { return { ...message, id: Date.now() } },
}