'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {createApp} = require('../app');

const salt = crypto.randomBytes(24).toString('hex');
const password = 'local-test-password-not-real';
process.env.IDSC_ADMIN_EMAIL = 'notification-test@example.invalid';
process.env.IDSC_ADMIN_PASSWORD_SCRYPT = `${salt}:${crypto.scryptSync(password,salt,64).toString('hex')}`;

test('notifications endpoint is protected and search returns persisted history', async t => {
  const server=createApp({frontendUrl:'http://localhost:5173'}).listen(0);
  await new Promise(resolve=>server.once('listening',resolve));
  t.after(()=>server.close());
  const base=`http://127.0.0.1:${server.address().port}/api/admin`;
  assert.equal((await fetch(`${base}/notifications`)).status,401);
  const login=await fetch(`${base}/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:process.env.IDSC_ADMIN_EMAIL,password})});
  assert.equal(login.status,200);
  const {token}=await login.json();
  const response=await fetch(`${base}/notifications?search=unlikely-nonexistent-title-123`,{headers:{Authorization:`Bearer ${token}`}});
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{items:[],total:0});
});
