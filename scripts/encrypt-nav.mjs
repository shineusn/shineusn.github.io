import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

function b64(b) { return Buffer.from(b).toString('base64'); }
function hex(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }

async function main() {
  const passphrase = process.env.NAV_PASSPHRASE;
  if (!passphrase) {
    console.error('NAV_PASSPHRASE is required');
    process.exit(1);
  }

  const root = process.cwd();
  const contentDir = path.join(root, 'external', 'NavSphere', 'navsphere', 'content');
  const outDir = path.join(root, 'nav');
  await fs.mkdir(outDir, { recursive: true });

  // Collect JSON files
  const files = await fs.readdir(contentDir);
  const jsonMap = {};
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const full = path.join(contentDir, f);
    const text = await fs.readFile(full, 'utf8');
    try {
      jsonMap[f.replace(/\.json$/,'')] = JSON.parse(text);
    } catch (e) {
      console.warn('Skip invalid JSON:', f);
    }
  }

  const plaintext = Buffer.from(JSON.stringify({
    createdAt: new Date().toISOString(),
    files: jsonMap
  }));

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const iter = 210000;

  const key = crypto.pbkdf2Sync(Buffer.from(passphrase, 'utf8'), salt, iter, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const combined = Buffer.concat([ct, tag]);

  const ver = hex(plaintext).slice(0, 16);

  const payload = {
    v: 1,
    ver,
    kdf: 'PBKDF2',
    hash: 'SHA-256',
    iter,
    alg: 'AES-GCM',
    tag: 'appended',
    salt: b64(salt),
    iv: b64(iv),
    data: b64(combined)
  };

  await fs.writeFile(path.join(outDir, 'data.enc'), JSON.stringify(payload));
  await fs.writeFile(path.join(outDir, 'version.txt'), ver);
  console.log('Wrote nav/data.enc and nav/version.txt ver=', ver);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


