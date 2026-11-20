const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

const accountsFile = path.join(__dirname, '..', 'src', 'config', 'adminAccounts.json');

const args = process.argv.slice(2);
const newEmail = args[0];
const newPassword = args[1];

if (!newEmail && !newPassword) {
  console.log('Usage: node scripts/update-admin.js <new-email> <new-password>');
  console.log('Example: node scripts/update-admin.js guruji@myguruji.com MyStrongPass123!');
  process.exit(1);
}

try {
  let accounts = [];
  if (fs.existsSync(accountsFile)) {
    accounts = JSON.parse(fs.readFileSync(accountsFile, 'utf-8'));
  }

  if (accounts.length === 0) {
    accounts = [
      {
        id: 'admin-primary-1',
        name: 'Omkar Ransing Guruji (Chief Daivajna)',
        email: 'admin@astroveda.com',
        role: 'Super Admin',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  const primary = accounts[0];

  if (newEmail && newEmail !== '-') {
    primary.email = newEmail.trim().toLowerCase();
    console.log(`✓ Superadmin Email/ID updated to: ${primary.email}`);
  }

  if (newPassword && newPassword !== '-') {
    if (newPassword.length < 8) {
      console.error('Error: Password must be at least 8 characters long.');
      process.exit(1);
    }
    primary.password = hashPassword(newPassword.trim());
    console.log('✓ Superadmin Password securely updated with cryptographic scrypt hash.');
  }

  fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2), 'utf-8');
  console.log('✓ Successfully saved to src/config/adminAccounts.json');
} catch (err) {
  console.error('Failed to update admin credentials:', err);
  process.exit(1);
}
