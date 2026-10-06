export const authService = {
  async signIn() { return { user: { id: 'local-user', name: 'Alex Morgan' } } },
  async signOut() { return true },
}