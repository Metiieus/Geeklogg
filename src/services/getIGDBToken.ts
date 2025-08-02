import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CACHE_PATH = path.resolve(__dirname, '../.cache/igdb_token.json');
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

async function generateNewToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.IGDB_CLIENT_ID!,
      client_secret: process.env.IGDB_CLIENT_SECRET!,
      grant_type: 'client_credentials'
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao gerar token IGDB: ${error}`);
  }

  const { access_token, expires_in } = await response.json();
  const expires_at = Date.now() + expires_in * 1000;

  const data = { access_token, expires_at };
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2));

  return access_token;
}

export async function getIGDBToken(): Promise<string> {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
      if (cached.expires_at > Date.now()) {
        return cached.access_token;
      }
    }
    return await generateNewToken();
  } catch (error) {
    console.error('Erro ao obter token IGDB:', error);
    throw error;
  }
}
