/**
 * Non-network request errors.
 * 
 * @export
 * @class RequestError
 * @extends {Error}
 */
export default class RequestError extends Error {
  status: number
  body: string
  constructor (body: string, status: number, message: string) {
    super()
    this.message = message
    this.status = status
    this.body = body
  }
}