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
  QueryTorrentsParameters,
  TransferInfoResponse,
  PreferencesResponse,
  PreferencesParameters
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
      'fileselect[]': createReadStream(options.file),
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

  /**
   * Returns the global upload limit.
   * 
   * @returns {Promise<number>} 
   * @memberof Client
   */
  async getGlobalUploadLimit(): Promise<number> {
    return parseInt(await getText(`${this.url}/command/getGlobalUpLimit`))
  }

  /**
   * Returns the global download limit.
   * 
   * @returns {Promise<number>} 
   * @memberof Client
   */
  async getGlobalDownloadLimit(): Promise<number> {
    return parseInt(await getText(`${this.url}/command/getGlobalDlLimit`))
  }

  /**
   * Returns information about the overall transfer state of the client.
   * 
   * @returns {Promise<TransferInfoResponse>} 
   * @memberof Client
   */
  async transferInfo(): Promise<TransferInfoResponse> {
    return get<TransferInfoResponse>(`${this.url}/query/transferInfo`)
  }
  
  /**
   * Returns the client preferences.
   * 
   * @returns {Promise<PreferencesResponse>} 
   * @memberof Client
   */
  async getPreferences(): Promise<PreferencesResponse> {
    return get<PreferencesResponse>(`${this.url}/query/preferences`)
  }

  /**
   * Sets preferences on the qBittorrent client.
   * Missing parameters will not be changed. 
   * 
   * @param {PreferencesParameters} options The preferences to set on the client. 
   * @returns 
   * @memberof Client
   */
  async setPreferences(options : PreferencesParameters) {
    const actualOptions = {
      save_path: options.savePath,
      temp_path_enabled: options.tempPathEnabled,
      temp_path: options.tempPathEnabled,
      preallocate_all: options.preallocateAll,
      incomplete_files_ext: options.incompleteFilesExtension,
      scan_dirs: options.scanDirectories,
      export_dir: options.exportDirectory,
      export_dir_fin: options.exportDirectoryFinished,
      mail_notification_enabled: options.mailNotificationEnabled,
      mail_notification_email: options.mailNotificationEmail,
      mail_notification_smtp: options.mailNotificationSmtpServer,
      mail_notification_ssl_enabled: options.mailNotificationSslEnabled,
      mail_notification_auth_enabled: options.mailNotificationAuthEnabled,
      mail_notification_username: options.mailNotificationUsername,
      mail_notification_password: options.mailNotificationPassword,
      autorun_enabled: options.autorunEnabled,
      autorun_program: options.autorunProgram,
      listen_port: options.listenPort,
      upnp: options.upnpEnabled,
      random_port: options.randomPortEnabled,
      max_connec: options.maxConnections,
      max_connec_per_torrent: options.maxConnectionsPerTorrent,
      max_uploads: options.maxUploads,
      max_uploads_per_torrent: options.maxUploadsPerTorrents,
      proxy_type: options.proxyType,
      proxy_auth_enabled: options.proxyAuthEnabled,
      proxy_ip: options.proxyIp,
      proxy_port: options.proxyPort,
      proxy_peer_connections: options.proxyUseForPeerConnections,
      force_proxy: options.forceProxy,
      proxy_username: options.proxyUsername,
      proxy_password: options.proxyPassword,
      ip_filter_enabled: options.ipFilterEnabled,
      ip_filter_path: options.ipFilterPath,
      ip_filter_trackers: options.ipFilterTrackers,
      banned_IPs: options.bannedIPs != undefined ? options.bannedIPs.join('\n') : undefined,
      up_limit: options.uploadLimit,
      dl_limit: options.downloadLimit,
      bittorrent_protocol: options.bittorrentProtocol,
      limit_utp_rate: options.limitUtpRate,
      limit_tcp_overhead: options.limitTcpOverhead,
      alt_up_limit: options.altUploadLimit,
      alt_dl_limit: options.altDownloadLimit,
      scheduler_enabled: options.schedulerEnabled,
      schedule_from_hour: options.schedulerFrom != undefined ? options.schedulerFrom.getHours() : undefined,
      schedule_from_minute: options.schedulerFrom != undefined ? options.schedulerFrom.getMinutes() : undefined,
      schedule_to_hour: options.schedulerFrom != undefined ? options.schedulerTo.getHours() : undefined,
      schedule_to_minute: options.schedulerFrom != undefined ? options.schedulerTo.getMinutes() : undefined,
      dht: options.dhtEnabled,
      pex: options.peerExchangeEnabled,
      lsd: options.localPeerDiscoveryEnabled,
      encryption: options.encryptionMode,
      anonymous_mode: options.anonymousModeEnabled,
      queueing_enabled: options.queueingEnabled,
      max_ratio_enabled: options.maxRatio != undefined,
      max_ratio: options.maxRatio,
      max_ratio_act: options.maxRatioAction,
      max_seeding_time_enabled: options.maxSeedingTime != undefined,
      max_seeding_time: options.maxSeedingTime,
      add_trackers_enabled: options.addTrackersEnabled,
      add_trackers: options.addTrackers != undefined ? options.addTrackers.join('\n') : undefined,
      locale: options.locale,
      web_ui_domain_list: options.webUiDomanList,
      web_ui_address: options.webUiAddress,
      web_ui_port: options.webUiPort,
      web_ui_upnp: options.webUiUpnpEnabled,
      use_https: options.webUiUseHttps,
      ssl_key: options.webUiSslKey,
      ssl_cert: options.webUiSslCert,
      web_ui_username: options.webUiUsername,
      web_ui_password: options.webUiPassword,
      bypass_local_auth: options.webUiBypassLocalAuth,
      bypass_auth_subnet_whitelist_enabled: options.webUiBypassAuthSubnetWhitelistEnabled,
      bypass_auth_subnet_whitelist: options.webUiBypassAuthSubnetWhitelist != undefined ? options.webUiBypassAuthSubnetWhitelist.join(',') : undefined,
      dyndns_enabled: options.webUiDyndnsEnabled,
      dyndns_service: options.webUiDyndnsService,
      dyndns_domain: options.webUiDyndnsDoman,
      dyndns_username: options.webUiDyndnsUsername,
      dyndns_password: options.webUiPassword
    }
    return post(`${this.url}/setPreferences`, { json: JSON.stringify(actualOptions)} )
  }
}
