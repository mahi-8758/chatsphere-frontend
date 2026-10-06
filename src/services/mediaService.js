export const mediaService = {
  async upload(file) { return { file, url: URL.createObjectURL(file) } },
}