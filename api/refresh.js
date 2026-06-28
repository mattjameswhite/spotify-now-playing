export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken })
  });

  const data = await response.json();
  if (!response.ok) return res.status(400).json(data);

  res.json({
    access_token: data.access_token,
    expires_in: data.expires_in,
    // Spotify may issue a new refresh token; pass it through if so
    ...(data.refresh_token ? { refresh_token: data.refresh_token } : {})
  });
}
