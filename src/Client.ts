import { post, get } from './network-tasks'
import * as mapper from './mapper'

import {
  ClientOptions,
  MainDataResponse,
  TorrentFileResponse,
  TorrentGeneralResponse,
  TorrentPeerResponse,
  TorrentTrackerResponse,
  DownloadPriority
} from './typings'

export default class Client {
  /**
   * The url of the qBittorent instance.
   * 
   * @type {string}
   * @memberof Client
   */
  url: string

  /**
   * The last response id for partial updating. Will be automatically populated.
   * 
   * @type {number}
   * @memberof Client
   */
  rid: number

  constructor (options?: ClientOptions) {
    this.url = options.url || 'http://localhost:8080'
  }

  /**
   * Queries the list of torrents and qBittorent client information.
   * 
   * @returns {Promise<MainDataResponse>} 
   * @memberof Client
   */
  async mainData (): Promise<MainDataResponse> {
    const response = await get<MainDataResponse>(`${this.url}/sync/maindata`)
    if (response !== undefined) {
      this.rid = response.rid
    }
    return response
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
    const response = await get<TorrentPeerResponse>(`${this.url}/sync/torrent_peers/${torrentID}`)
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
    await post(`${this.url}/command/setFilePrio`, { hash: torrentID, id: fileIndex, priority: priority })
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
    await post(`${this.url}/command/setSuperSeeding`, { hashes: torrents.join('|'), value })
  }
}
