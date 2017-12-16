/**
 * Non-network request errors.
 * 
 * @export
 * @class RequestError
 * @extends {Error}
 */
export default class RequestError extends Error {
  status: number
  constructor (message: string, status: number) {
    super()
    this.message = message
    this.status = status
  }
}