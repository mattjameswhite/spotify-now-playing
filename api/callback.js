export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code, redirectUri } = req.body;
  if (!code || !redirectUri) return res.status(400).json({ error: 'Missing code or redirectUri' });

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri })
  });

  const data = await response.json();
  if (!response.ok) return res.status(400).json(data);

  res.json({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in
  });
}
