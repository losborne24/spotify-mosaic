export const client_id = 'f1da744b65de4f5aaa1d3e3bb881d942';
export const response_type = 'token';
export const redirect_uri =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://losborne24.github.io/spotify-mosaic/';
export const scopes = 'user-top-read user-read-private user-read-email';
export const access_token = 'access_token=';
