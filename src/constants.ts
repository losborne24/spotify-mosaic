export const client_id = 'f1da744b65de4f5aaa1d3e3bb881d942';
export const response_type = 'token';
export const redirect_uri =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/playlists'
    : 'https://losborne24.github.io/playlists';
export const scopes = 'user-top-read user-read-private user-read-email';
export const access_token = 'access_token=';
export const state_res = 'state=';
export const playlists_page_size = 10;
export const tracks_page_size = 100;
export const top_tracks_page_size = 50;
export const create_mosaic_url = '/createMosaic';
export const select_playlist_url = '/playlists';
export const select_image_url = '/selectImage';
