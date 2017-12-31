import nodefetch from 'node-fetch'
import RequestError from './RequestError'
import * as FormData from 'form-data'
import { Stream } from 'stream';

/**
 * Retrieves an instance of type T, or undefined if the resource does not exist.
 *
 * @export
 * @template T           The type to return.
 * @param {string} url   The url to retrieve the model from.
 * @returns {Promise<T>}
 */
export async function get<T> (url: string): Promise<T> {
  const res = await getText(url)
  if (res === '') return undefined
  return JSON.parse(res)
}

export async function getText (url: string): Promise<string> {
  const res = await nodefetch(url)
  if (res.status === 403) {
    throw new RequestError(res.statusText, res.status)
  }
  return await res.text()
}

/**
 * Posts a command with given formdata.
 *
 * Commands will not be verified whether they have succeeded.
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} data
 * @returns
 */
export async function post (url: string, data: { [key: string]: string | Stream }, headers?: { [key: string]: string }) {
  const formdata = new FormData()
  console.log(data)
  for (let key in data) {
    formdata.append(key, data[key])
  }
  const newHeaders = Object.assign({}, headers)

  return nodefetch(url, { method: 'POST', body: formdata, headers: newHeaders })
}
