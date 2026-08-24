import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

async function fixBuildings() {
  console.log('=== Fixing buildings: adding zahma ===');
  const snap = await db.collection('buildings').get();
  console.log(`Found ${snap.size} buildings.\n`);

  let fixed = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const ratings = data.averageRatings || {};

    if (ratings.zahma !== undefined) {
      skipped++;
      continue;
    }

    // Use the overall average as a reasonable default for zahma
    const defaultVal = ratings.overall || 3;
    await doc.ref.update({ 'averageRatings.zahma': defaultVal });
    fixed++;
    console.log(`  ✅ ${doc.id} (${data.address || '?'}): zahma=${defaultVal}`);
  }

  console.log(`Buildings — Fixed: ${fixed}, Skipped: ${skipped}\n`);
}

async function fixReviews() {
  console.log('=== Fixing reviews: adding zahma ===');
  const snap = await db.collection('reviews').get();
  console.log(`Found ${snap.size} reviews.\n`);

  let fixed = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const ratings = data.ratings || {};

    if (ratings.zahma !== undefined) {
      skipped++;
      continue;
    }

    // Use the review's overall as a reasonable default
    const defaultVal = data.overall || 3;
    await doc.ref.update({ 'ratings.zahma': defaultVal });
    fixed++;
    console.log(`  ✅ ${doc.id} (building ${data.buildingId || '?'}): zahma=${defaultVal}`);
  }

  console.log(`Reviews — Fixed: ${fixed}, Skipped: ${skipped}\n`);
}

async function main() {
  await fixBuildings();
  await fixReviews();
  console.log('Fix complete.');
}

main().catch((err) => {
  console.error('Fix failed:', err);
  process.exit(1);
});
