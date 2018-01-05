# qbittorrent-js

A JavaScript interface to qBittorrent.

## Usage

Install.

_Currently not deployed to npm, clone the repo and `yarn build`._

Import client and initialise.

```js
import { Client } from '@rmp135/qbittorrent-js'

const options = {
  url: 'http://192.168.1.23:8080'
}

const client = new Client(options)

const data = await client.mainData()

console.log(data)

await client.pauseTorrent('08296d923e5d57a0b2b763aff6391b257c891b44') // Example torrent ID, yours will be different!

```

TypeScript users to import various types from the package as well. Some examples below.

```typescript
import {
  Client,
  ClientOptions,
  QueryTorentFilter,
  QueryTorrentParameters,
  DownloadPriority
}

const options: ClientOptions = {
  url: 'http://192.168.1.23:8080'
}

const client = new Client(options)

const queryOptions: QueryTorrentParameters = {
  filter: QueryTorrentFilter.DOWNLOADING
}

await client.setFilePriority('08296d923e5d57a0b2b763aff6391b257c891b44', 1, DownloadPriority.HIGH)

```

The latest version of the qBittorrent api that has been fully tested against is 17. Use `client.apiVersion` to check. It may work with earlier versions but there's no guarantee.

## Further Usage

## Client

Parameters:
- options: object?:
  - url?: string : The URL to connect the client to. Defaults to 'http://localhost:8080'.

Create a new Client with given parameters. Currently the only parameter is the URL to connect to.

```js
const options = {
  url: 'http://192.168.1.23:8080'
}
const client = new Client(options)
```

Currently, authentication is not supported and you must allow the IP address of the client in the qBittorrent options.

The Client will keep track of the last response id when using `mainData` and `torrentPeers`. This means subsequent calls to these methods will only return the difference in results. Setting `Client.rid` to null will reset the last response id.

### Client.mainData

Returns data related to the server status, torrents and available categories.

Updates `Client.rid` if response is successful.
```js
await client.mainData()
```
### Client.queryTorrents

Queries all torrents given parameters.

TypeScript users can import `QueryTorentFilter`.

Parameters:
- options?: object :
  - filter?: string : Filter on a particular torrent status. ('all' | 'downloading' | 'seeding' | 'completed' | 'paused' | 'resumed' | 'active' | 'inactive') 
  - category?: boolean : The category to filter on. Not supplying returns all, supplying an empty string returns torrents with no category.
  - sort?: string : The column to sort by. Any column in the response is valid.
  - reverse?: boolean : Whether to reverse the sort order.
  - limit?: number : The number of results to limit.
  - offset?: number : The number of results to offset by. A negative number offsets from the end.

```js
await client.queryTorrents({
  filter: 'downloading',
  category: 'FOSS',
  sort: 'added_on',
  reverse: false,
  limit: 10,
  offset: 2
})
```

### Client.torrentGeneral

Retrieves general information about a torrent.

Parameters:
- torrentID: string : The ID of the torrent to retrieve information for.

```js
await client.torrentGeneral('08296d923e5d57a0b2b763aff6391b257c891b44')
```

### Client.torrentTrackers

Retrieves the list of trackers for a particular torrent.

Parameters:
- torrentID: string : The ID of the torrent to retrieve the trackers of.

```js
await client.torrentTrackers('08296d923e5d57a0b2b763aff6391b257c891b44')
```

### Client.torrentPeers

Retrieves the list of peers that belong to a given torrent.

Updates `Client.torrentPeers` so this may return different results on subsequent calls.

Parameters:
- torrentID: string : The ID of the torrent to retrieve the peers of.

```js
await client.torrentPeers('08296d923e5d57a0b2b763aff6391b257c891b44')
```

### Client.torretFiles

Retrives a list of files for a particular torrent.

Parameters:
- torrentID: string : The ID of the torrent to retrieve files for.

```js
await client.torrentFiles('08296d923e5d57a0b2b763aff6391b257c891b44')
```

### Client.pauseTorrent

Pauses a given torrent.

Parameters:
- torrentID: string : The ID of the torrent to pause.

```js
await client.pauseTorrent('08296d923e5d57a0b2b763aff6391b257c891b44')
```

### Client.resumeTorrent

Resumes a paused torrent.

Parameters:
- torrentID: string : The ID of the torrent to resume.

```js
await client.resumeTorrents('08296d923e5d57a0b2b763aff6391b257c891b44')
```

### Client.setFilePriority

Sets the download priority of a file in a particular torrent.

TypeScript users can import `DownloadPriority`.

Parameters:
- torrentID: string : The ID of the torrent.
- fileIndex: number : The index location of the file given by `Client.torrentFiles`.
- priority: number : 0 (ignored), 1 (normal), 6 (high), 7 (maximum)

```js
await client.updateFilePriority('08296d923e5d57a0b2b763aff6391b257c891b44', 0, 6)
```

### Client.recheckTorrent

Forces a file integrity recheck on a torrent.

Parameters:
- torrentID: string : The ID of the torrent to force a recheck on.

```js
await client.recheckTorrent('08296d923e5d57a0b2b763aff6391b257c891b44', 0, 6)
```

### Client.setSuperSeedingMode

Sets a torrent to 'super seeding mode' (not entirely sure what this actually is).

Parameters:
- torrents: string[] : The torrents to be assigned super seeding mode.

```js
await client.updateFilePriority(['08296d923e5d57a0b2b763aff6391b257c891b44', '08296d923e5d57a0b2b763aff6391b257c891b44'])
```

### Client.getSavePath

Retrieves the default save path.

```js
await client.getSavePath()
```

### Client.delete

Deletes torrents, optionally deleting the files.

Parameters:
- torrents: string[] : The torrents to delete.
- deleteFiles: boolean : Whether to also delete the files.

```js
await client.delete(['08296d923e5d57a0b2b763aff6391b257c891b44', '08296d923e5d57a0b2b763aff6391b257c891b44'], true)
```

### Client.downloadLinks

Adds torrnts by URL or magnet links.

The only required fields are urls and savepath.

Parameters:
- options: object :
  - urls: string[] : The urls to add.
  - savepath: string : The path to save the torrent. Use `Client.getSavePath` to retrieve the default one.
  - cookie?: string : A cookie string to use when retrieving. Default: ''.
  - rename?: string : What to rename the torrent to. Empty string does not rename. Default: ''.
  - category?: string : The category to place to the torrent in. Default no category.
  - paused?: boolean : Whether to start the torrent pause. Default: false.
  - dlLimit?: number : The download speed limit in bytes per second. Default no limit.
  - upLimit?: number : The upload speed limit in bytes per second. Default no limit.
  - firstLastPiecePriority?: boolean : Prioritise the first and last pieces. Default: false.
  - createSubfolder?: boolean : Whether to always create a subfolder. Default: false.
  - skipChecking?: boolean : Skip the hash check. Default: false.
  - sequential?: boolean : Download the torrent pieces in sequential order. Default: false.

```js
await client.downloadLinks({
  urls: ['linktomagetfile', 'anotherlink'],
  savepath: 'path/to/download/to',
  cookie: 'some cookie information',
  rename: 'new torrent name',
  category: 'FOSS',
  paused: false,
  dlLimit: 1000000,
  upLimit: 25000,
  firstLastPiecePriority: false,
  skipChecking: false,
  sequential: false
})
```

### Client.downloadFile

Adds a torrent by the path to a .torrent file.

The only required fields are file and savepath.

Parameters:
- options: object :
  - file: string : The full path to a .torrent file.
  - savepath: string : The path to save the torrent. Use `Client.getSavePath` to retrieve the default one.
  - cookie?: string : A cookie string to use when retrieving. Default: ''.
  - rename?: string : What to rename the torrent to. Empty string does not rename. Default: ''.
  - category?: string : The category to place to the torrent in. Default no category.
  - paused?: boolean : Whether to start the torrent pause. Default: false.
  - dlLimit?: number : The download speed limit in bytes. Default no limit.
  - upLimit?: number : The upload speed limit in bytes. Default no limit.
  - firstLastPiecePriority?: boolean : Prioritise the first and last pieces. Default: false.
  - createSubfolder?: boolean : Whether to always create a subfolder. Default: false.
  - skipChecking?: boolean : Skip the hash check. Default: false.
  - sequential?: boolean : Download the torrent pieces in sequential order. Default: false.

```js
await client.downloadLinks({
  file: 'path/to/torrent/file',
  savepath: 'path/to/download/to',
  cookie: 'some cookie information',
  rename: 'new torrent name',
  category: 'FOSS',
  paused: false,
  dlLimit: 1000000,
  upLimit: 25000,
  firstLastPiecePriority: false,
  skipChecking: false,
  sequential: false
})
```

### Client.pauseAll

Pauses all torrents.

```js
await client.pauseAll()
```

### Client.resumeAll

Resumes all paused torrents.

```js
await client.resumeAll()
```

### Client.apiVersion

The version of the qBittorrent Web api. 

```js
await client.apiVersion()
```

### Client.apiVersionMin

The oldest version of the qBittorrent Web api that qBittorrent is backwards compatible with.

```js
await client.apiVersionMin()
```

### Client.version

The version of qBittorrent (e.g. "v4.0.1").

```js
await client.version()
```

### Client.shutdown

Shutdown the instance of qBittorrent. Warning: This is an immediate action and will not prompt for confirmation.

```js
await client.shutdown()
```

### Client.addCategory

Adds a category to a torrent.

```js
await client.addCategory('d114681d63fde7da0d4b33acb8d325e801b9049d', 'FOSS')
```

### Client.removeCategories

Removes categories.

```js
await client.addCategory(['FOSS', 'Software'])
```

### Client.setCategory

Sets a particular category to a number of torrents.

```js
await client.addCategory(['d114681d63fde7da0d4b33acb8d325e801b9049d', '64affd58c8ccf2147fb3e6feaadea982fccbd05a'], 'FOSS'])
```

### Client.rename

Renames a torrent.

Parameters:
- torrentID: string : The ID of the torrent.
- name: string : The new name of the torrent.

```js
await client.rename('64affd58c8ccf2147fb3e6feaadea982fccbd05a', 'newname')
```

## Error Handling

If a response is returned from the server that isn't status 200, a `ResponseError` will be thrown. This contains the `status`, `body` and text description of the status as the message.

This  can be imported.

```js
import { RequestError } from '@rmp135/qbittorrent-js'
```