import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin credentials in env vars.');
  process.exit(1);
}

const app = getApps().length === 0
  ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  : getApps()[0];

const db = getFirestore(app);

const NEW_FIELDS = ['cleanliness', 'services', 'annoyance', 'elevator', 'maintenance', 'ac'];
const OLD_FIELDS = ['noise', 'lighting', 'ventilation'];

async function migrateBuildings() {
  console.log('=== Migrating buildings ===');
  const snap = await db.collection('buildings').get();
  console.log(`Found ${snap.size} buildings.\n`);

  let updated = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const ratings = data.averageRatings || {};
    const changes = [];
    const update = {};

    for (const field of NEW_FIELDS) {
      if (ratings[field] === undefined) {
        update[`averageRatings.${field}`] = 1;
        changes.push(`+${field}=1`);
      }
    }

    for (const field of OLD_FIELDS) {
      if (ratings[field] !== undefined) {
        update[`averageRatings.${field}`] = FieldValue.delete();
        changes.push(`-${field}`);
      }
    }

    if (changes.length === 0) {
      skipped++;
      continue;
    }

    await doc.ref.update(update);
    updated++;
    console.log(`  ✅ ${doc.id} (${data.address || '?'}): ${changes.join(', ')}`);
  }

  console.log(`Buildings — Updated: ${updated}, Skipped: ${skipped}\n`);
}

async function migrateReviews() {
  console.log('=== Migrating reviews ===');
  const snap = await db.collection('reviews').get();
  console.log(`Found ${snap.size} reviews.\n`);

  let updated = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const ratings = data.ratings || {};
    const changes = [];
    const update = {};

    for (const field of NEW_FIELDS) {
      if (ratings[field] === undefined) {
        update[`ratings.${field}`] = 1;
        changes.push(`+${field}=1`);
      }
    }

    for (const field of OLD_FIELDS) {
      if (ratings[field] !== undefined) {
        update[`ratings.${field}`] = FieldValue.delete();
        changes.push(`-${field}`);
      }
    }

    if (changes.length === 0) {
      skipped++;
      continue;
    }

    await doc.ref.update(update);
    updated++;
    console.log(`  ✅ ${doc.id} (building ${data.buildingId || '?'}): ${changes.join(', ')}`);
  }

  console.log(`Reviews — Updated: ${updated}, Skipped: ${skipped}\n`);
}

async function main() {
  await migrateBuildings();
  await migrateReviews();
  console.log('Migration complete.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
