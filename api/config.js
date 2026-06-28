export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ clientId: process.env.SPOTIFY_CLIENT_ID });
}
