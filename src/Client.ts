import { post, get, getText } from './network-tasks'
import { stat, createReadStream } from 'fs'
import { promisify } from 'util'
import {
  ClientOptions,
  MainDataResponse,
  TorrentFileResponse,
  TorrentGeneralResponse,
  TorrentPeerResponse,
  TorrentTrackerResponse,
  DownloadPriority,
  WebDownloadOptions,
  FileDownloadOptions,
  QueryTorrentResponse,
  QueryTorrentFilter,
  QueryTorrentsParameters
} from './typings'

export default class Client {
  /**
   * The url of the qBittorrent instance.
   * 
   * @type {string}
   * @memberof Client
   */
  url: string

  /**
   * The last response id for partial retrieval. Will be automatically populated.
   * 
   * @type {number}
   * @memberof Client
   */
  rid: number

  constructor (options?: ClientOptions) {
    const mergedOptions = Object.assign({
      url: 'http://localhost:8080'
    }, options)
    this.url = mergedOptions.url
  }

  /**
   * Returns the main data differences since the last time this method was called.
   * 
   * @returns {Promise<MainDataResponse>} 
   * @memberof Client
   */
  async mainData (): Promise<MainDataResponse> {
    const response = await get<MainDataResponse>(`${this.url}/sync/maindata`, { rid: this.rid })
    if (response !== undefined) {
      this.rid = response.rid
    }
    return response
  }

  /**
   * Returns a list of torrents optionally filtered by paramters.
   * 
   * @param {QueryTorrentsParameters} [parameters] Paramters to filter the torrents by.
   * @returns {Promise<QueryTorrentResponse[]>} 
   * @memberof Client
   */
  async queryTorrents (parameters?: QueryTorrentsParameters): Promise<QueryTorrentResponse[]> {
    return await get<QueryTorrentResponse[]>(`${this.url}/query/torrents`, parameters)
  }

  /**
   * Queries the torrent given by torrentID, returning general information about it.
   * 
   * @param {string} torrentID                     The torrent UID
   * @returns {Promise<TorrentPropertiesResponse>} The properties of the torrent.
   * @memberof Client
   */
  async torrentGeneral (torrentID: string): Promise<TorrentGeneralResponse> {
    return get<TorrentGeneralResponse>(`${this.url}/query/propertiesGeneral/${torrentID}`)
  }
  
  /**
   * Queries the torrent given by torrentID, returning the list of trackers.
   * 
   * @param {string} torrentID                    The torrent UID.
   * @returns {Promise<TorrentTrackerResponse[]>} List of trackers.
   * @memberof Client
   */
  async torrentTrackers (torrentID: string): Promise<TorrentTrackerResponse[]> {
    return get<TorrentTrackerResponse[]>(`${this.url}/query/propertiesTrackers/${torrentID}`)
  }
  
  /**
   * Returns the peers for torrent identified by torrentID.
   * 
   * @param {string} torrentID                    The torrent UID.
   * @returns {Promise<TorrentTrackerResponse[]>} List of trackers
   * @memberof Client
   */
  async torrentPeers (torrentID: string): Promise<TorrentPeerResponse> {
    const response = await get<TorrentPeerResponse>(`${this.url}/sync/torrent_peers/${torrentID}`, { rid: this.rid })
    if (response !== undefined) {
      this.rid = response.rid
    }
    return response
  }

  /**
   * Returns the files for torrent identified by torrentID.
   * 
   * @param {string} torrentID                 The torrent UID.
   * @returns {Promise<TorrentFileResponse[]>} List of files.
   * @memberof Client
   */
  async torrentFiles (torrentID: string) : Promise<TorrentFileResponse[]> {
    return get<TorrentFileResponse[]>(`${this.url}/query/propertiesFiles/${torrentID}`)
  }

  /**
   * Pauses a torrent given by torrentID
   * 
   * @param {string} torrentID The torrent UID.
   * @memberof Client
   */
  async pauseTorrent (torrentID: string) {
    await post(`${this.url}/command/pause`, { hash: torrentID })
  }

  /**
   * Resumes a torrent given by torrentID
   * 
   * @param {string} torrentID 
   * @memberof Client
   */
  async resumeTorrent (torrentID: string) {
    await post(`${this.url}/command/resume`, { hash: torrentID })
  }

  /**
   * Sets the priority of a file.
   * 
   * @param {string} torrentID          The torrent UID.
   * @param {number} fileIndex          The location of the file in the file list.
   * @param {DownloadPriority} priority The priority to set.
   * @memberof Client
   */
  async setFilePriority (torrentID: string, fileIndex: number, priority: DownloadPriority) {
    await post(`${this.url}/command/setFilePrio`, { hash: torrentID, id: fileIndex.toString(), priority: priority.toString() })
  }

  /**
   * Triggers a recheck on the torret.
   * 
   * @param {string} torrentID The torrent UID.
   * @memberof Client
   */
  async recheckTorrent (torrentID: string)  {
    await post(`${this.url}/command/recheck`, { hash: torrentID })
  }

  /**
   * Sets the super seeding mode for multiple torrents.
   * 
   * @param {string[]} torrents The torrents to set super seeding mode on.
   * @param {boolean} value     Whether or not to set super seeding mode.
   * @memberof Client
   */
  async setSuperSpeedingMode (torrents: string[], value: boolean) {
    await post(`${this.url}/command/setSuperSeeding`, { hashes: torrents.join('|'), value: value.toString() })
  }

  /**
   * Get the default save path.
   * 
   * @returns {Promise<string>} 
   * @memberof Client
   */
  async getSavePath (): Promise<string> {
    return getText(`${this.url}/command/getSavePath`)
  }

  /**
   * Delete torrents and optionally the files.
   * 
   * @param {string[]} torrents   List of torrents to delete.
   * @param {boolean} deleteFiles Whether to also delete the files.
   * @memberof Client
   */
  async delete (torrents: string[], deleteFiles: boolean) {
    if (deleteFiles) {
      await post(`${this.url}/command/deletePerm`, { hashes: torrents.join('|') })
    } else {
      await post(`${this.url}/command/delete`, { hashes: torrents.join('|') })
    }
  }

  /**
   * Download torrents using links (magnet / remote).
   * 
   * @param {WebDownloadOptions} options 
   * @memberof Client
   */
  async downloadLinks (options: WebDownloadOptions) {
    const mergedOptions = Object.assign({
      urls: [],
      savepath: '',
      cookie: '',
      rename: '',
      category: '',
      paused: false,
      dlLimit: 0,
      upLimit: 0,
      firstLastPiecePriority: false,
      createSubfolder: false,
      skipChecking: false,
      sequential: false
    } as WebDownloadOptions, options)

    const downloadOptions = {
      urls: mergedOptions.urls.join('\n'),
      savepath: mergedOptions.savepath,
      cookie: mergedOptions.cookie,
      rename: mergedOptions.rename,
      category: mergedOptions.category,
      paused: mergedOptions.paused.toString(),
      dlLimit: mergedOptions.dlLimit.toString(),
      upLimit: mergedOptions.upLimit.toString(),
      firstLastPiecePrio: mergedOptions.firstLastPiecePriority.toString(),
      root_folder: mergedOptions.createSubfolder.toString(),
      sequentialDownload: mergedOptions.sequential.toString(),
      skip_checking: mergedOptions.skipChecking.toString()
    }
    await post(`${this.url}/command/download`, downloadOptions)
  }

  /**
   * Downloads torrents using .torrent files.
   * 
   * @param {FileDownloadOptions} options Download options.
   * @memberof Client
   */
  async downloadFile (options: FileDownloadOptions) {
    const file = await promisify(stat)(options.file)

    const mergedOptions = Object.assign({
      savepath: '',
      cookie: '',
      rename: '',
      category: '',
      paused: false,
      dlLimit: 0,
      upLimit: 0,
      firstLastPiecePriority: false,
      createSubfolder: true,
      skipChecking: false,
      sequential: false
    } as FileDownloadOptions, options)

    const downloadOptions = {
      "fileselect[]": createReadStream(options.file),
      savepath: mergedOptions.savepath,
      cookie: mergedOptions.cookie,
      rename: mergedOptions.rename,
      category: mergedOptions.category,
      paused: mergedOptions.paused.toString(),
      dlLimit: '',
      upLimit: '',
      firstLastPiecePrio: mergedOptions.firstLastPiecePriority.toString(),
      root_folder: mergedOptions.createSubfolder.toString(),
      sequentialDownload: mergedOptions.sequential.toString(),
      skip_checking: mergedOptions.skipChecking.toString()
    }

    // The file size calculation isn't perfect but it's close enough to work.
    const bodylen = JSON.stringify(downloadOptions).length
    const headers = { 'Content-Length': (file.size + bodylen).toString() }

    await post(`${this.url}/command/upload`, downloadOptions, headers)
  }

  /**
   * Pause all torrents
   * 
   * @memberof Client
   */
  async pauseAll() {
    await post(`${this.url}/command/pauseAll`)
  }

  /**
   * Resumes all torrents.
   * 
   * @memberof Client
   */
  async resumeAll() {
    await post(`${this.url}/command/resumeAll`)
  }

  /**
   * Returns the version of the qBittorrent api.
   * 
   * @returns {Promise<number>} The version number of the qBittorrent api.
   * @memberof Client
   */
  async apiVersion(): Promise<number> {
    return parseInt(await getText(`${this.url}/version/api`))
  }
  
  /**
   * Returns the api version that qBittorrent is backwards compatible with.
   * 
   * @returns {Promise<number>} The minumum version number of the qBittorrent api.
   * @memberof Client
   */
  async apiVersionMin(): Promise<number> {
    return parseInt(await getText(`${this.url}/version/api_min`))
  }
  
  /**
   * Returns the qBittorrent version.
   * 
   * @returns {Promise<string>} The version of qBittorrent.
   * @memberof Client
   */
  async version(): Promise<string> {
    return await getText(`${this.url}/version/qbittorrent`)
  }

  /**
   * Shuts down the qBittorrent instance. 
   * 
   * @memberof Client
   */
  async shutdown() {
    await post(`${this.url}/command/shutdown`)
  }

  /**
   * Adds a category.
   * 
   * @param {string} category The name of the category to add.
   * @memberof Client
   */
  async addCategory(category: string) {
    await post(`${this.url}/command/addCategory`, { category })
  }
  
  /**
   * Removes multiple categories.
   * 
   * @param {string[]} categories The names of the categories to remove.
   * @memberof Client
   */
  async removeCategories(categories: string[]) {
    await post(`${this.url}/command/removeCategories`, { categories: categories.join('\n') })
  }
  
  /**
   * Sets a category to torrents.
   * 
   * @param {string[]} torrents 
   * @param {string} category 
   * @memberof Client
   */
  async setCategory(torrents: string[], category: string) {
    await post(`${this.url}/command/setCategory`, { hashes: torrents.join('|'), category })
  }
  
  /**
   * Renames a torrent.
   * 
   * @param {string} torrent The torrent UID.
   * @param {string} name    The new name for the torrent.
   * @memberof Client
   */
  async rename(torrent: string, name: string) {
    await post(`${this.url}/command/rename`, { hash: torrent, name })
  }
}
