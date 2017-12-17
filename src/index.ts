import Client from './Client'
import RequestError from './RequestError'

import { DownloadPriority, ClientOptions } from './typings'

;(async () => {
  const options: ClientOptions = {
    url: 'http://localhost:8080'
  }
  const client = new Client(options)
  try {
    const res = await client.setFilePriority('0e67a21331fcfe55e567cf2bbd208016a73e6361', 0, DownloadPriority.NORMAL)
    console.log(JSON.stringify(res, null, 2))
  } catch (error) {
    if (error instanceof RequestError) {
      console.log(error.status)
    }
    console.log(error.stack)
  }
})()
