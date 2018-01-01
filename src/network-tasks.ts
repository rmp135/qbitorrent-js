import nodefetch from 'node-fetch'
import RequestError from './RequestError'
import * as FormData from 'form-data'
import { Stream } from 'stream'
import * as querystring from 'querystring'

const proxy = require('http-proxy-agent')

/**
 * Retrieves an instance of type T, or undefined if the resource does not exist.
 *
 * @export
 * @template T           The type to return.
 * @param {string} url   The url to retrieve the model from.
 * @returns {Promise<T>}
 */
export async function get<T> (url: string, parameters?: { [key:string]: any }): Promise<T> {
  const res = await getText(url, parameters)
  if (res === '') return undefined
  return JSON.parse(res)
}

export async function getText (url: string, parameters?: { [key:string]: any }): Promise<string> {
  if (parameters != null) {
    const mergedParameters = Object.assign({}, parameters)
    const query = querystring.stringify(mergedParameters)
    url = `${url}?${query}`
  }
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
export async function post (url: string, data?: { [key: string]: string | Stream }, headers?: { [key: string]: string }) {
  const mergedData = Object.assign({}, data)
  const formdata = new FormData()
  for (let key in mergedData) {
    formdata.append(key, mergedData[key])
  }
  const newHeaders = Object.assign({}, headers)

  // const agent = new proxy('http://localhost:8888')
  return nodefetch(url, { method: 'POST', body: formdata, headers: newHeaders })
}
