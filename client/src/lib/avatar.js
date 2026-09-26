export const AVATAR_BUCKET = 'user_avatar';
export const DEFAULT_AVATAR = '/Sample_User_Icon.png';
export const MAX_AVATAR_SIZE = 1024 * 1024;

// Only accept objects in this project's bucket and the current user's folder.
export function avatarPath(client, avatarUrl, userId) {
  if (!avatarUrl || !userId) return null;
  const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl('');
  try {
    const url = new URL(avatarUrl);
    if (url.origin !== new URL(data.publicUrl).origin) return null;
    const match = url.pathname.match(/^\/storage\/v1\/object\/(?:authenticated|public|sign)\/user_avatar\/(.+)$/);
    if (!match) return null;
    const path = decodeURIComponent(match[1]);
    const parts = path.split('/');
    return parts[0] === userId && parts.length === 2 && parts[1] && !['.', '..'].includes(parts[1]) ? path : null;
  } catch {
    return null;
  }
}

// Keep a backup until both storage and the profile update have succeeded.
export async function changeAvatar(client, userId, previousUrl, file) {
  if (!userId) throw new Error('Please sign in again.');
  if (file && (!['image/jpeg', 'image/png'].includes(file.type) || file.size > MAX_AVATAR_SIZE || !file.size)) {
    throw new Error('Choose a JPEG or PNG image up to 1 MB.');
  }
  const bucket = client.storage.from(AVATAR_BUCKET);
  const oldPath = avatarPath(client, previousUrl, userId);
  let backup = null;
  let oldRemoved = false;
  let uploaded = false;
  const newPath = file ? `${userId}/${crypto.randomUUID()}.${file.type === 'image/png' ? 'png' : 'jpg'}` : null;

  try {
    if (oldPath) {
      const { data, error } = await bucket.download(oldPath);
      if (error) throw error;
      backup = data;
      const { error: removeError } = await bucket.remove([oldPath]);
      if (removeError) throw removeError;
      oldRemoved = true;
    }
    let avatarUrl = null;
    if (file) {
      const { error } = await bucket.upload(newPath, file, { contentType: file.type, cacheControl: '0', upsert: false });
      if (error) throw error;
      uploaded = true;
      const { data } = bucket.getPublicUrl(newPath);
      // This stable URL still requires authentication. Never persist an expiring signed URL.
      avatarUrl = data.publicUrl.replace('/object/public/', '/object/authenticated/');
    }
    const { data: profile, error } = await client.from('profiles')
      .update({ avatar_url: avatarUrl }).eq('user_id', userId).select('*').single();
    if (error) throw error;
    return profile;
  } catch (error) {
    const recoveryErrors = [];
    if (oldRemoved && backup) {
      try {
        const { error: restoreError } = await bucket.upload(oldPath, backup, { contentType: backup.type, cacheControl: '0', upsert: false });
        if (restoreError) recoveryErrors.push(restoreError);
      } catch (restoreError) { recoveryErrors.push(restoreError); }
    }
    if (uploaded) {
      try {
        const { error: cleanupError } = await bucket.remove([newPath]);
        if (cleanupError) recoveryErrors.push(cleanupError);
      } catch (cleanupError) { recoveryErrors.push(cleanupError); }
    }
    if (recoveryErrors.length) throw new Error(`${error.message} Image recovery failed. Please reload and try again.`, { cause: error });
    throw error;
  }
}
