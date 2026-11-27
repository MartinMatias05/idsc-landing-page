// Run: node server/generate-admin-hash.cjs "a-strong-private-password"
const crypto=require('node:crypto');
const password=process.argv[2];
if(!password || password.length<12){console.error('Provide a password of at least 12 characters.');process.exit(1)}
const salt=crypto.randomBytes(24).toString('hex');
console.log(`${salt}:${crypto.scryptSync(password,salt,64).toString('hex')}`);
