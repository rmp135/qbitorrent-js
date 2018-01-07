import { ReadStream } from "fs";

export interface SharedDownloadOptions {
  savepath: string
  cookie?: string
  rename?: string
  category?: string
  paused?: boolean
  dlLimit?: number
  upLimit?: number
  firstLastPiecePriority?: boolean
  createSubfolder?: boolean,
  sequential?: boolean,
  skipChecking?: boolean
}

export interface FileDownloadOptions extends SharedDownloadOptions {
  file: string
}

export interface WebDownloadOptions extends SharedDownloadOptions {
  urls: string[]
}

export enum DownloadPriority {
  Ignored = 0,
  Normal = 1,
  High = 6,
  Maximum = 7
}

export interface ClientOptions {
  url?: string
}

export enum QueryTorrentFilter {
  All = 'all',
  Downloading = 'downloading',
  Seeding = 'seeding',
  Completed = 'completed',
  Paused = 'paused',
  Resumed = 'paused',
  Active = 'active',
  Inactive = 'inactive'
}

export interface QueryTorrentsParameters {
  filter?: QueryTorrentFilter,
  category?: string
  sort?: string
  reverse?: boolean
  limit?: number
  offset?: number
}

export interface QueryTorrentResponse {
  added_on: number
  amount_left: number
  auto_tmm: boolean
  category: string
  completed: number
  completion_on: number
  dl_limit: number
  dlspeed: number
  downloaded: number
  downloaded_session: number
  eta: number
  hash: string
  force_start: boolean
  last_activity: number
  magnet_url: string
  name: string
  num_complete: number
  num_incomplete: number
  num_leechs: number
  num_seeds: number
  priority: number
  progress: number
  ratio: number
  ratio_limit: number
  save_path: string
  seen_complete: number
  seq_dl: boolean
  size: number
  state: string
  super_seeeding: boolean
  total_size: number
  tracker: string
  up_limit: boolean
  uploaded: number
  uploaded_session: number
  upspeed: number
}

export interface MainData {
  /**
   * All available categories.
   */
  categories: string[]
  server_state: {
    alltime_download: number
    alltime_upload: number
    average_queue_time: number
    connection_status: string
    dht_nodes: number
    download_data: number
    download_speed: number
    download_rate_limit: number
    global_ratio: string
    queued_io_jobs: number
    queuing: boolean
    read_cache_hits: string
    refresh_interval: number
    total_buffers_size: number
    total_peer_connections: number
    total_queued_size: number
    total_wasted_data: number
    upload_data: number
    upload_speed: number
    upload_rate_limit: number
    upload_alt_speed_limits: boolean
    write_cache_overload: string
  }
  torrents: {
    id: string
    added_on: Date
    amount_left: number
    auto_tmm: boolean
    category: string
    completed: number
    completed_on: Date
    download_limit: number
    download_speed: number
    downloaded: number
    downloaded_session: number
    eta: Date
    f_l_piece_prio: boolean
    force_start: boolean
    last_activity: Date
    magnet_url: string
    name: string
    num_complete: number
    num_incomplete: number
    leeches: number
    seeds: number
    priority: number
    progress: number
    ratio: number
    ratio_limit: number
    save_path: string
    seen_complete: number
    sequential_download: boolean
    size: number
    state: string
    super_seeding: boolean
    total_size: number
    tracker: string
    upload_limit: boolean
    uploaded: number
    uploaded_session: number
    upload_speed: number
  }[]
}

export interface MainDataResponse {
  categories: string[]
  full_update: boolean
  rid: number
  server_state: {
    alltime_dl: number
    alltime_ul: number
    average_time_queue: number
    connection_status: string
    dht_nodes: number
    dl_info_data: number
    dl_info_speed: number
    dl_rate_limit: number
    global_ratio: string
    queued_io_jobs: number
    queuing: boolean
    read_cache_hits: string
    refresh_interval: number
    total_buffers_size: number
    total_peer_connections: number
    total_queued_size: number
    total_wasted_data: number
    up_info_data: number
    up_info_speed: number
    up_rate_limit: number
    up_alt_speed_limits: boolean
    write_cache_overload: string
  }
  torrents: {
    [key: string]: {
      added_on: number
      amount_left: number
      auto_tmm: boolean
      category: string
      completed: number
      completion_on: number
      dl_limit: number
      dlspeed: number
      downloaded: number
      downloaded_session: number
      eta: number
      f_l_piece_prio: boolean
      force_start: boolean
      last_activity: number
      magnet_url: string
      name: string
      num_complete: number
      num_incomplete: number
      num_leechs: number
      num_seeds: number
      priority: number
      progress: number
      ratio: number
      ratio_limit: number
      save_path: string
      seen_complete: number
      seq_dl: boolean
      size: number
      state: string
      super_seeeding: boolean
      total_size: number
      tracker: string
      up_limit: boolean
      uploaded: number
      uploaded_session: number
      upspeed: number
    }
  }
}

export interface TorrentGeneralResponse {
  addition_date: number
  comment: string
  completion_date: number
  created_by: string
  creation_date: number
  dl_limit: number
  dl_speed: number
  dl_speed_avg: number
  eta: number
  last_seen: number
  nb_connections: number
  nb_connections_limit: number
  peers: number
  peers_total: number
  piece_size: number
  pieces_have: number
  pieces_num: number
  reannounce: number
  save_path: string
  seeding_time: number
  seeds: number
  seeds_total: number
  share_ratio: number
  time_elapsed: number
  total_downloaded: number
  total_downloaded_session: number
  total_size: number
  total_uploaded: number
  total_uploaded_session: number
  total_wasted: number
  up_limit: number
  up_speed: number
  up_speed_avg: number
}

export interface TorrentTrackerResponse {
  msg: string
  num_peers: number
  status: string
  url: string
}

export interface TorrentFileResponse {
  is_seed?: boolean
  name: string
  priority: number
  progress: number
  size: number
  piece_range?: number[]
}

export interface TorrentPeerResponse {
  full_update: boolean
  rid: number
  show_flags: string
  peers: {
    [key: string]: {
      client: string
      connection: string
      country: string
      country_code: string
      dl_speed: number
      downloaded: number
      flags: string
      flags_desc: string
      ip: string
      port: number
      progress: number
      relevance: number
      up_speed: number
      uploaded: number
    }
  }
}

export interface TransferInfoResponse {
  alltime_dl: number
  alltime_ul: number
  average_time_queue: number
  connection_status: string
  dht_nodes: number
  dl_info_data: number
  dl_info_speeed: number
  dl_rate_limit: number
  global_ratio: string
  queued_io_jobs: number
  read_cache_hits: string
  read_cache_overload: string
  total_buffers_size: number
  total_peer_connections: number
  total_queued_size: number
  total_wasted_session: number
  up_info_data: number
  up_info_speed: number
  up_rate_limit: number
  write_cache_overload: string
}

export enum ScanDirType {
  ScanFolder = 0,
  DefaultSaveLocation = 1
}

export enum ProxyType {
  None = 0,
  Socks4 = 5,
  Socks5 = 2,
  Http = 1
}

export enum EncryptionMode {
  Prefer = 0,
  Force = 1,
  Disabled = 3
}

export enum DnsService {
  DynDns = 0,
  NoIp = 1
}

export enum SchedulerDays {
  Everyday = 0,
  Weekdays = 1,
  Weekends = 2,
  Mondays = 3,
  Tuesdays = 4,
  Wednesdays = 5,
  Thursdays = 6,
  Fridays = 7,
  Saturdays = 8,
  Sundays = 9
}

export enum MaxRatioAction {
  Pause = 0,
  Remove = 1
}

export interface PreferencesParameters {
  savePath?: string
  tempPathEnabled?: boolean
  tempPath?: string
  preallocateAll?: boolean
  incompleteFilesExtension?: boolean
  scanDirectories?: { [key: string]: ScanDirType }
  exportDirectory?: string
  exportDirectoryFinished?: string
  mailNotificationEnabled?: boolean
  mailNotificationEmail?: string
  mailNotificationSmtpServer?: string
  mailNotificationSslEnabled?: boolean
  mailNotificationAuthEnabled?: boolean
  mailNotificationUsername?: string
  mailNotificationPassword?: string
  autorunEnabled?: boolean
  autorunProgram?: string
  listenPort?: number
  upnpEnabled?: boolean
  randomPortEnabled?: boolean
  maxConnections?: number
  maxConnectionsPerTorrent?: number
  maxUploads?: number
  maxUploadsPerTorrents?: number
  proxyType?: ProxyType
  proxyAuthEnabled?: boolean
  proxyIp?: string
  proxyPort?: number
  proxyUseForPeerConnections?: boolean
  forceProxy?: boolean
  proxyUsername?: string
  proxyPassword?: string
  ipFilterEnabled?: boolean
  ipFilterPath?: string
  ipFilterTrackers?: boolean
  bannedIPs?: string[]
  uploadLimit?: number
  downloadLimit?: number
  bittorrentProtocol?: string
  limitUtpRate?: boolean
  limitTcpOverhead?: boolean
  altUploadLimit?: number
  altDownloadLimit?: number
  schedulerEnabled?: boolean
  schedulerFrom?: Date
  schedulerTo?: Date
  schedulerDays?: SchedulerDays
  dhtEnabled?: boolean
  peerExchangeEnabled?: boolean
  localPeerDiscoveryEnabled?: boolean
  encryptionMode?: EncryptionMode
  anonymousModeEnabled?: boolean
  queueingEnabled?: boolean
  maxActiveTorrents?: number
  maxActiveUploads?: number
  maxActiveDownloads?: number
  doNotCountSlowTorrents?: boolean
  maxRatio?: number
  maxSeedingTime?: number
  maxRatioAction?: MaxRatioAction
  addTrackersEnabled: boolean
  addTrackers: string[]
  locale?: string
  webUiDomanList?: string
  webUiAddress?: string
  webUiPort?: number
  webUiUpnpEnabled?: boolean
  webUiUseHttps?: boolean
  webUiSslCert?: string
  webUiSslKey?: string
  webUiUsername?: string
  webUiPassword?: string
  webUiBypassLocalAuth?: boolean
  webUiBypassAuthSubnetWhitelistEnabled?: boolean
  webUiBypassAuthSubnetWhitelist?: string[]
  webUiDyndnsEnabled?: boolean
  webUiDyndnsService?: DnsService
  webUiDyndnsUsername?: string
  webUiDyndnsPassword?: string
  webUiDyndnsDoman?: string
}

export interface PreferencesResponse {
  add_trackers: string
  add_trackers_enabled: false
  alt_dl_limit: number
  alt_up_limit: number
  anonymous_mode: boolean
  autorun_program: string
  banned_IPs: string
  bittorrent_protocol: number
  bypass_auth_subnet_whitelist: string
  bypass_auth_subnet_whitelist_enabled: boolean
  bypass_local_auth: boolean
  dht: boolean
  dl_limit: number
  dont_count_slow_torrents: boolean
  dyndns_doman: string
  dyndns_enabled: boolean
  dyndns_password: string
  dyndns_service: number
  dyndns_username: string
  encryption: number
  export_dir: string
  export_dir_fn: string
  force_proxy: boolean
  incomplete_files_ext: boolean
  ip_filter_enabled: boolean
  ip_filter_path: string
  ip_filter_trackers: boolean
  limit_tcp_overhead: boolean
  limit_utp_rate: boolean
  listen_port: boolean
  locale: string
  lsd: boolean
  mail_notification_auth_enabled: boolean
  mail_notification_email: string
  mail_nofification_enabled: boolean
  mail_notification_password: string
  mail_notification_smtp: string
  mail_notification_ssl_enabled: boolean
  mail_notification_username: string
  max_active_downloads: number
  max_active_torrents: number
  max_active_uploads: number
  max_connect: number
  max_connec_per_torrent: number
  max_ratio: number
  max_ratio_act: number
  max_ratio_enabled: boolean
  max_seeding_time: number
  max_seeding_time_enabled: boolean
  max_uploads: number
  max_uploads_per_torrents: number
  pex: boolean
  preallocate_all: boolean
  prox_auth_enabled: boolean
  proxy_ip: string
  proxy_password: string
  proxy_peer_connections: boolean
  proxy_port: number
  proxy_type: ProxyType
  proxy_username: string
  queueing_enabled: boolean
  random_port: boolean
  save_path: string
  scan_dirs: { [key: string]: ScanDirType }
  schedule_from_hour: number
  schedule_from_min: number
  schedule_to_hour: number
  schedule_to_min: number
  scheduler_days: number
  scheduler_enabled: boolean
  ssl_cert: string
  ssl_key: string
  temp_path: string
  temp_path_enabled: boolean
  up_limit: number
  upnp: boolean
  use_https: boolean
  web_ui_address: string
  web_ui_domain_list: string
  web_ui_password: string
  web_ui_port: number
  web_ui_upnp: boolean
  web_ui_username: string
}