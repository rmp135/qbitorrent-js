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
  createSubfolder?: boolean
}

export interface FileDownloadOptions extends SharedDownloadOptions {
  file: string
}

export interface WebDownloadOptions extends SharedDownloadOptions {
  urls: string[]
}

export enum DownloadPriority {
  IGNORED = 0,
  NORMAL = 1,
  HIGH = 6,
  MAXIMUM = 7
}

export interface ClientOptions {
  url: string
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