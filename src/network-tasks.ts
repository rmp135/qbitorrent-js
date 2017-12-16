import nodefetch from 'node-fetch'

export async function get<T> (url: string): Promise<T> {
  const res = await nodefetch(url)
  const size = Number.parseInt(res.headers.get("content-length"))
  if (size === 0) return undefined
  return await res.json()
}