const OWNER = "Uishi2";
const REPO = "xiaochen-fitness-workbench";
const BRANCH = "main";
const FILE_PATH = "cloud-sync/workbench.enc.json";
const API_BASE = `https://api.github.com/repos/${OWNER}/${encodeURIComponent(REPO)}/contents/${FILE_PATH}`;

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value.replace(/\s/g, ""));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function deriveKey(passphrase, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 180000,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptWorkbench(data, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(data)),
  );
  return {
    format: "suxing-cloud-sync-v1",
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA256",
    iterations: 180000,
    updatedAt: new Date().toISOString(),
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    content: bytesToBase64(new Uint8Array(encrypted)),
  };
}

export async function decryptWorkbench(payload, passphrase) {
  if (payload?.format !== "suxing-cloud-sync-v1") {
    throw new Error("云端备份格式不兼容");
  }
  const key = await deriveKey(passphrase, base64ToBytes(payload.salt));
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToBytes(payload.iv) },
      key,
      base64ToBytes(payload.content),
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch {
    throw new Error("解密失败，请检查同步密码");
  }
}

function headers(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token.trim()}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function getCloudBackup(token) {
  const response = await fetch(`${API_BASE}?ref=${BRANCH}`, { headers: headers(token) });
  if (response.status === 404) return null;
  if (response.status === 401 || response.status === 403) {
    throw new Error("GitHub 令牌无效或没有仓库内容权限");
  }
  if (!response.ok) throw new Error(`读取云端失败（${response.status}）`);
  const file = await response.json();
  const text = new TextDecoder().decode(base64ToBytes(file.content));
  return { sha: file.sha, payload: JSON.parse(text) };
}

export async function uploadCloudBackup(token, data, passphrase) {
  const encrypted = await encryptWorkbench(data, passphrase);
  const remote = await getCloudBackup(token).catch((error) => {
    if (error.message.includes("无效")) throw error;
    return null;
  });
  const content = bytesToBase64(new TextEncoder().encode(JSON.stringify(encrypted, null, 2)));
  const body = {
    message: `云同步更新 ${new Date().toLocaleString("zh-CN")}`,
    content,
    branch: BRANCH,
    ...(remote?.sha ? { sha: remote.sha } : {}),
  };
  const response = await fetch(API_BASE, {
    method: "PUT",
    headers: {
      ...headers(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error("GitHub 令牌没有写入权限");
  }
  if (response.status === 409) {
    throw new Error("云端刚刚被更新，请先下载最新数据再上传");
  }
  if (!response.ok) throw new Error(`上传失败（${response.status}）`);
  return encrypted;
}
