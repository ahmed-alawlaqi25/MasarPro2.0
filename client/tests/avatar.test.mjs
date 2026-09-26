import test from 'node:test';
import assert from 'node:assert/strict';
import { avatarPath, changeAvatar, MAX_AVATAR_SIZE } from '../src/lib/avatar.js';

const root = 'https://project.supabase.co/storage/v1/object/';
const oldUrl = `${root}authenticated/user_avatar/user-1/old.png`;
const image = new Blob(['image'], { type: 'image/png' });

function fixture({ saveFails = false, uploadFails = false, deleteFails = false } = {}) {
  const files = new Map([['user-1/old.png', image]]);
  const calls = [];
  let profile = { user_id: 'user-1', avatar_url: oldUrl };
  const bucket = {
    getPublicUrl: path => ({ data: { publicUrl: `${root}public/user_avatar/${path}` } }),
    download: async path => ({ data: files.get(path), error: files.has(path) ? null : new Error('Missing') }),
    remove: async paths => {
      calls.push('remove');
      if (deleteFails) return { error: new Error('Delete denied') };
      paths.forEach(path => files.delete(path));
      return { error: null };
    },
    upload: async (path, file) => {
      calls.push('upload');
      if (uploadFails && !path.endsWith('old.png')) return { error: new Error('Upload denied') };
      files.set(path, file);
      return { error: null };
    },
  };
  const client = {
    storage: { from: name => { assert.equal(name, 'user_avatar'); return bucket; } },
    from: table => {
      assert.equal(table, 'profiles');
      return { update: values => ({ eq: (column, id) => {
        assert.equal(column, 'user_id');
        assert.equal(id, 'user-1');
        return { select: () => ({ single: async () => {
          calls.push('save');
          if (saveFails) return { error: new Error('Save denied') };
          profile = { ...profile, ...values };
          return { data: profile, error: null };
        } }) };
      } }) };
    },
  };
  return { client, files, calls, profile: () => profile };
}

test('replacement removes the old object and saves an authenticated URL', async () => {
  const f = fixture();
  const result = await changeAvatar(f.client, 'user-1', oldUrl, image);
  assert.deepEqual(f.calls, ['remove', 'upload', 'save']);
  assert.equal(f.files.size, 1);
  assert.equal(f.files.has('user-1/old.png'), false);
  assert.match(result.avatar_url, /\/object\/authenticated\/user_avatar\/user-1\/.+\.png$/);
  assert.ok(f.files.has(avatarPath(f.client, result.avatar_url, 'user-1')));
});

test('removal clears the saved URL and deletes the object', async () => {
  const f = fixture();
  const result = await changeAvatar(f.client, 'user-1', oldUrl, null);
  assert.equal(result.avatar_url, null);
  assert.equal(f.files.size, 0);
});

for (const scenario of [{ saveFails: true }, { uploadFails: true }, { deleteFails: true }]) {
  test(`failed replacement preserves the previous photo: ${JSON.stringify(scenario)}`, async () => {
    const f = fixture(scenario);
    await assert.rejects(changeAvatar(f.client, 'user-1', oldUrl, image));
    assert.equal(f.files.size, 1);
    assert.equal(f.files.get('user-1/old.png'), image);
    assert.equal(f.profile().avatar_url, oldUrl);
  });
}

test('failed profile update during removal restores the photo', async () => {
  const f = fixture({ saveFails: true });
  await assert.rejects(changeAvatar(f.client, 'user-1', oldUrl, null));
  assert.equal(f.files.get('user-1/old.png'), image);
  assert.equal(f.profile().avatar_url, oldUrl);
});

test('reject invalid uploads before any storage writes', async () => {
  for (const file of [new Blob(['svg'], { type: 'image/svg+xml' }), new Blob([], { type: 'image/png' }), new Blob([new Uint8Array(MAX_AVATAR_SIZE + 1)], { type: 'image/png' })]) {
    const f = fixture();
    await assert.rejects(changeAvatar(f.client, 'user-1', oldUrl, file));
    assert.deepEqual(f.calls, []);
  }
});

test('path parsing rejects foreign hosts, buckets, users, and nested paths', () => {
  const { client } = fixture();
  assert.equal(avatarPath(client, oldUrl, 'user-1'), 'user-1/old.png');
  for (const value of [oldUrl.replace('project.supabase.co', 'other.example'), oldUrl.replace('user_avatar', 'other'), oldUrl.replace('user-1', 'user-2'), oldUrl.replace('old.png', 'sub/old.png')]) {
    assert.equal(avatarPath(client, value, 'user-1'), null);
  }
});

test('first upload creates an avatar without deleting anything', async () => {
  const f = fixture();
  f.files.clear();
  await changeAvatar(f.client, 'user-1', null, image);
  assert.deepEqual(f.calls, ['upload', 'save']);
  assert.equal(f.files.size, 1);
});
