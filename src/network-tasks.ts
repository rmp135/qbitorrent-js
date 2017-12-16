import nodefetch from 'node-fetch'
import RequestError from './RequestError'

/**
 * Retrieves an instance of type T, or undefined if the resource does not exist.
 * 
 * @export
 * @template T           The type to return.
 * @param {string} url   The url to retrieve the model from.
 * @returns {Promise<T>} 
 */
export async function get<T> (url: string): Promise<T> {
  const res = await nodefetch(url)
  if (res.status === 403) {
    throw new RequestError(res.statusText, res.status)
  }
  const size = Number.parseInt(res.headers.get('content-length'))
  if (size === 0) return undefined
  return await res.json()
}
