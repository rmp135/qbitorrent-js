import Client from './Client'
import RequestError from './RequestError'

;(async () => {
  const options: ClientOptions = {
    url: 'http://localhost:8080'
  }
  const client = new Client(options)
  try {
    const res = await client.pauseTorrent('08296d923e5d57a0b2b763aff6391b257c891b44')
    console.log(JSON.stringify(res, null, 2))
  } catch (error) {
    if (error instanceof RequestError) {
      console.log(error.status)
    }
    console.log(error.stack)
  }
})()
