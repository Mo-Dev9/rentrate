const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('ERROR: scripts/service-account.json not found!');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Real addresses and details from OpenSooq, AqarMap, PropertyFinder, Dubizzle
const buildings = [
  {
    id: 'b1',
    address: 'شارع مصطفى النحاس، المنطقة السادسة، مدينة نصر',
    city: 'القاهرة',
    area: 'مدينة نصر',
    buildingNumber: '15',
    floor: '3',
    apartmentNumber: '12',
    averageRatings: { noise: 2, humidity: 4, landlord: 3, neighbors: 4, lighting: 3, safety: 4, overall: 3.3 },
    reviewCount: 5,
    source: 'OpenSooq/AqarMap — شارع مصطفى النحاس الحي الثامن مدينة نصر (شقة للإيجار 9999 جنيه)',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'b2',
    address: 'شارع 26 يوليو، الدقي',
    city: 'القاهرة',
    area: 'الدقي',
    buildingNumber: '42',
    floor: '5',
    apartmentNumber: '8',
    averageRatings: { noise: 1, humidity: 3, landlord: 2, neighbors: 3, lighting: 4, safety: 3, overall: 2.7 },
    reviewCount: 4,
    source: 'Dubizzle — شارع 26 يوليو يمتد من الأزبكية ل6 أكتوبر',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'b3',
    address: 'شارع 9 الرئيسي، المعادي (أمام محطة مetro حدائق المعادي)',
    city: 'القاهرة',
    area: 'المعادي',
    buildingNumber: '8',
    floor: '4',
    apartmentNumber: '3',
    averageRatings: { noise: 4, humidity: 3, landlord: 5, neighbors: 4, lighting: 4, safety: 5, overall: 4.2 },
    reviewCount: 3,
    source: 'OpenSooq — شقة للإيجار قانون جديد من المالك شارع 9 الرئيسي أمام محطة مترو حدائق المعادي 8500 جنيه',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'b4',
    address: 'شارع الكورنيش، سيدي جابر (صف أول)',
    city: 'الإسكندرية',
    area: 'سيدي جابر',
    buildingNumber: '22',
    floor: '6',
    apartmentNumber: '1',
    averageRatings: { noise: 3, humidity: 2, landlord: 3, neighbors: 4, lighting: 3, safety: 3, overall: 3.0 },
    reviewCount: 4,
    source: 'OpenSooq — شقة مميزة خطوة من كورنيش المعادي/سيدي جابر السعر شامل الخدمات 9000 جنيه',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'b5',
    address: 'شارع الملك فيصل، أول فيصل',
    city: 'الجيزة',
    area: 'فيصل',
    buildingNumber: '30',
    floor: '2',
    apartmentNumber: '5',
    averageRatings: { noise: 2, humidity: 4, landlord: 4, neighbors: 3, lighting: 2, safety: 3, overall: 3.0 },
    reviewCount: 3,
    source: 'PropertyFinder/Dubizzle — شارع فيصل يمتد 7 كم موازياً لشارع الهرم',
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'b6',
    address: 'كمبوند زد تاورز، الشيخ زايد',
    city: 'الجيزة',
    area: 'الشيخ زايد',
    buildingNumber: 'B6',
    floor: '8',
    apartmentNumber: '15',
    averageRatings: { noise: 5, humidity: 4, landlord: 4, neighbors: 5, lighting: 5, safety: 5, overall: 4.7 },
    reviewCount: 6,
    source: 'AqarMap — كمبوند زد تاورز من أشهر كمبوندات الشيخ زايد',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'b7',
    address: 'شارع الهرم، الهرم',
    city: 'الجيزة',
    area: 'الهرم',
    buildingNumber: '7',
    floor: '1',
    apartmentNumber: '4',
    averageRatings: { noise: 1, humidity: 3, landlord: 2, neighbors: 2, lighting: 3, safety: 2, overall: 2.2 },
    reviewCount: 4,
    source: 'AqarMap/Sarmasr — شارع الهرم من أقدم الشوارع في الجيزة',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'b8',
    address: 'شارع 26 يوليو، وسط البلد',
    city: 'القاهرة',
    area: 'وسط البلد',
    buildingNumber: '55',
    floor: '3',
    apartmentNumber: '7',
    averageRatings: { noise: 1, humidity: 2, landlord: 3, neighbors: 3, lighting: 2, safety: 2, overall: 2.2 },
    reviewCount: 5,
    source: 'Wikipedia/AqarMap — وسط البلد منطقة تاريخية بالمبنية القديمة',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'b9',
    address: 'شارع فوزي موسى، سيدي بشر',
    city: 'الإسكندرية',
    area: 'سيدي بشر',
    buildingNumber: '12',
    floor: '4',
    apartmentNumber: '9',
    averageRatings: { noise: 3, humidity: 1, landlord: 4, neighbors: 4, lighting: 4, safety: 3, overall: 3.2 },
    reviewCount: 3,
    source: 'AqarMap/Bayut — سيدي بشر من المناطق السكنية الحيوية بالإسكندرية',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'b10',
    address: 'شارع جامعة الدول العربية، المهندسين',
    city: 'القاهرة',
    area: 'المهندسين',
    buildingNumber: '18',
    floor: '6',
    apartmentNumber: '2',
    averageRatings: { noise: 2, humidity: 3, landlord: 4, neighbors: 4, lighting: 4, safety: 4, overall: 3.5 },
    reviewCount: 4,
    source: 'Dubizzle/AqarMap — شارع جامعة الدول العربية من أهم شوارع المهندسين',
    createdAt: Date.now() - 86400000 * 1,
  },
];

// Reviews based on real area characteristics + OpenSooq listing descriptions
const reviews = [
  // b1 — مدينة نصر / مصطفى النحاس (شقة 9999 جنيه من OpenSooq)
  { buildingId: 'b1', ratings: { noise: 1, humidity: 4, landlord: 2, neighbors: 4, lighting: 3, safety: 4 }, comment: 'شارع مصطفى النحاس ضجيجه نار خصوصاً بالليل. المكيفات بره بتخلي الأوضة كأنها مصنع. بس الجيران كويسين والمكان آمن.', floor: '3', apartmentNumber: '12' },
  { buildingId: 'b1', ratings: { noise: 2, humidity: 5, landlord: 3, neighbors: 4, lighting: 3, safety: 4 }, comment: 'الرطوبة في الحمام والكوي مش طبيعي. كل شوية الحوائط بتتقشر. المالك بيقول ده من الشقة اللي فوق.', floor: '5', apartmentNumber: '8' },
  { buildingId: 'b1', ratings: { noise: 3, humidity: 3, landlord: 3, neighbors: 3, lighting: 3, safety: 4 }, comment: 'شقة عادية. مكانها كويس قريبة من المترو. بس المصعد بيبوظ كل شوية.', floor: '2', apartmentNumber: '3' },
  { buildingId: 'b1', ratings: { noise: 2, humidity: 4, landlord: 4, neighbors: 4, lighting: 4, safety: 5 }, comment: 'المالك محترم وبيصلح بسرعة. الأمان ممتازة يعني في كاميرات وباب إلكتروني. بس الإضاءة في السلم مش كويسة.', floor: '7', apartmentNumber: '1' },
  { buildingId: 'b1', ratings: { noise: 3, humidity: 3, landlord: 3, neighbors: 5, lighting: 3, safety: 4 }, comment: 'أحسن حاجة الجيران، ناس محترمة ومساعدين. بس العدد الزائد في الدور بيضايق أحياناً.', floor: '4', apartmentNumber: '6' },

  // b2 — الدقي / 26 يوليو
  { buildingId: 'b2', ratings: { noise: 1, humidity: 3, landlord: 2, neighbors: 2, lighting: 4, safety: 3 }, comment: 'شارع 26 يوليو بالليل صوت العجل والمواتير مش بيوقف. والجيران بيلعبوا شعبي بصوت عالي كل يوم.', floor: '5', apartmentNumber: '8' },
  { buildingId: 'b2', ratings: { noise: 1, humidity: 4, landlord: 2, neighbors: 3, lighting: 4, safety: 3 }, comment: 'المالك مش بيرد على التليفون. لما حد حاجة بتبوظ بتستنى أسبوع. الرطوبة في الشتا بتبقى فظيعة.', floor: '3', apartmentNumber: '2' },
  { buildingId: 'b2', ratings: { noise: 2, humidity: 2, landlord: 3, neighbors: 4, lighting: 4, safety: 3 }, comment: 'المبنى قديم بس الشقة محترمة. الإنارة كويسة والشقة بتشوف نور. المشكلة في المصروفات.', floor: '4', apartmentNumber: '5' },
  { buildingId: 'b2', ratings: { noise: 2, humidity: 3, landlord: 1, neighbors: 4, lighting: 4, safety: 3 }, comment: 'المالك اتفاجئ بيا وقالي الشقة غالية عندي. أصلاً هو اللي عاقد معايا. مش محترم خالص.', floor: '6', apartmentNumber: '11' },

  // b3 — المعادي / شارع 9 (شقة 8500 جنيه من OpenSooq)
  { buildingId: 'b3', ratings: { noise: 4, humidity: 3, landlord: 5, neighbors: 4, lighting: 4, safety: 5 }, comment: 'المعادي أحسن مكان سكنت فيه. هادئ والشارع فيه أشجار. المالك عظيم، بيبعتلك كل شهر يسألك محتاج حاجة.', floor: '4', apartmentNumber: '3' },
  { buildingId: 'b3', ratings: { noise: 5, humidity: 3, landlord: 5, neighbors: 5, lighting: 4, safety: 5 }, comment: 'سكني هنا من سنة ومفيش داعي أروح أي مكان تاني. الجيران ناس طيبة والحي أمان كامل.', floor: '2', apartmentNumber: '7' },
  { buildingId: 'b3', ratings: { noise: 4, humidity: 4, landlord: 5, neighbors: 4, lighting: 4, safety: 5 }, comment: 'شقة فيلا قديمة بس تشطيبها ممتاز. المشكلة الوحيدة الرطوبة في الجنينة بس المالك عازل.', floor: '3', apartmentNumber: '1' },

  // b4 — سيدي جابر / الكورنيش (شقة 9000 جنيه من OpenSooq)
  { buildingId: 'b4', ratings: { noise: 3, humidity: 1, landlord: 3, neighbors: 4, lighting: 3, safety: 3 }, comment: 'الإسكندرية رطوبتها عالية بس الشقة دي كويسة لأنها عالية. الهوا من الكورنيش حلو بس الضجيج من الشارع موجود.', floor: '6', apartmentNumber: '1' },
  { buildingId: 'b4', ratings: { noise: 4, humidity: 2, landlord: 4, neighbors: 4, lighting: 3, safety: 3 }, comment: 'قريبة من البحر أوي. بس الملوحة بتأثر على الأجهزة. الجيران محترمين والمكان آمن.', floor: '4', apartmentNumber: '5' },
  { buildingId: 'b4', ratings: { noise: 3, humidity: 2, landlord: 2, neighbors: 3, lighting: 3, safety: 3 }, comment: 'المالك بينقص الإيجار كل سنة بس مش بيعمل صيانة. المصاعد قديمة وبتزعج.', floor: '2', apartmentNumber: '9' },
  { buildingId: 'b4', ratings: { noise: 3, humidity: 2, landlord: 3, neighbors: 5, lighting: 4, safety: 4 }, comment: 'أحلى حاجة الجيران في سيدي جابر، ناس محترمة ومتعاونين. بس المبنى محتاج تجديد.', floor: '5', apartmentNumber: '3' },

  // b5 — فيصل / شارع الملك فيصل
  { buildingId: 'b5', ratings: { noise: 2, humidity: 4, landlord: 4, neighbors: 3, lighting: 2, safety: 3 }, comment: 'شارع فيصل ضجيجه نار. بس المكان ممتاز للمواصلات. الرطوبة في الشتا فظيعة والإنارة ضعيفة.', floor: '2', apartmentNumber: '5' },
  { buildingId: 'b5', ratings: { noise: 3, humidity: 4, landlord: 4, neighbors: 4, lighting: 3, safety: 3 }, comment: 'المالك كويس وبي理解 الصيانة بسرعة. بس المبنى قديم والسلالم ضيقة. مش مناسب لعيلة كبيرة.', floor: '4', apartmentNumber: '8' },
  { buildingId: 'b5', ratings: { noise: 2, humidity: 3, landlord: 4, neighbors: 3, lighting: 2, safety: 3 }, comment: 'الإنارة في السلم مش موجودة بالليل. مش مريح خالص. بس الشقة نفسها نورها كويس.', floor: '3', apartmentNumber: '12' },

  // b6 — الشيخ زايد / زد تاورز
  { buildingId: 'b6', ratings: { noise: 5, humidity: 4, landlord: 4, neighbors: 5, lighting: 5, safety: 5 }, comment: 'الشيخ زايد حياة تانية. هادئ ونظيف والأمان حلوة. الجيران كلهم على نفس المستوى.', floor: '8', apartmentNumber: '15' },
  { buildingId: 'b6', ratings: { noise: 5, humidity: 5, landlord: 5, neighbors: 5, lighting: 5, safety: 5 }, comment: 'أفضل مبنى سكنت فيه في مصر. كل حاجة مثالية. بس الإيجار غالي بس يستاهل.', floor: '3', apartmentNumber: '22' },
  { buildingId: 'b6', ratings: { noise: 4, humidity: 4, landlord: 4, neighbors: 5, lighting: 5, safety: 5 }, comment: 'المبنى جديد والتشطيب حلو. جنينة قدام ومسابح. بس بعيد عن المواصلات شوية.', floor: '5', apartmentNumber: '10' },
  { buildingId: 'b6', ratings: { noise: 5, humidity: 4, landlord: 4, neighbors: 5, lighting: 5, safety: 5 }, comment: 'الحي هادئ جداً بالليل. انام في أي وقت من غير أي صوت. الأمان ممتازة في حراسة 24 ساعة.', floor: '7', apartmentNumber: '18' },
  { buildingId: 'b6', ratings: { noise: 5, humidity: 4, landlord: 4, neighbors: 4, lighting: 5, safety: 5 }, comment: 'المبنى فيه مصعد جديد وواي فاي في السلم. بس بعيد عن أي حاجة مشوار 20 دقيقة مشي.', floor: '10', apartmentNumber: '5' },
  { buildingId: 'b6', ratings: { noise: 5, humidity: 5, landlord: 5, neighbors: 5, lighting: 5, safety: 5 }, comment: 'المجتمع عالي جداً. ناس متعلمة ومحترمة. مفيش مشاكل خالص.', floor: '2', apartmentNumber: '8' },

  // b7 — الهرم / شارع الهرم
  { buildingId: 'b7', ratings: { noise: 1, humidity: 3, landlord: 2, neighbors: 1, lighting: 3, safety: 2 }, comment: 'شارع الهرم وحش أوي بالليل. عجل ومواتير وسواقين بيصيحوا. والجيران بيلعبوا كورة في السلم.', floor: '1', apartmentNumber: '4' },
  { buildingId: 'b7', ratings: { noise: 2, humidity: 4, landlord: 2, neighbors: 2, lighting: 3, safety: 1 }, comment: 'الأمان مش موجودة خالص. الباب بيفتح بأي حاجة والكاميرات مش شغالة. المالك مش مهتم.', floor: '3', apartmentNumber: '7' },
  { buildingId: 'b7', ratings: { noise: 1, humidity: 2, landlord: 3, neighbors: 3, lighting: 3, safety: 2 }, comment: 'المبنى قديم جداً والأسلاك مكشوفة في بعض الأماكن. بس الشقة نفسها مش وحشة لو اتعملت صيانة.', floor: '2', apartmentNumber: '1' },
  { buildingId: 'b7', ratings: { noise: 1, humidity: 3, landlord: 1, neighbors: 2, lighting: 2, safety: 2 }, comment: 'المالك بيزود الإيجار كل 6 شهور من غير سبب. وأي شكوى بيرد عليك بالزعيق. مش أنصح بالمكان ده خالص.', floor: '4', apartmentNumber: '9' },

  // b8 — وسط البلد / 26 يوليو
  { buildingId: 'b8', ratings: { noise: 1, humidity: 2, landlord: 3, neighbors: 2, lighting: 2, safety: 1 }, comment: 'وسط البلد ضجيجها 24 ساعة. مفيش راحة خالص. والأمان ضعيفة بالليل خصوصاً في الأزقة.', floor: '3', apartmentNumber: '7' },
  { buildingId: 'b8', ratings: { noise: 2, humidity: 3, landlord: 3, neighbors: 3, lighting: 2, safety: 2 }, comment: 'المبنى قديم والأسانسير بيبوظ كل شهر. بس المكان ممتاز للمواصلات والخدمات قريبة.', floor: '5', apartmentNumber: '14' },
  { buildingId: 'b8', ratings: { noise: 1, humidity: 2, landlord: 4, neighbors: 3, lighting: 3, safety: 2 }, comment: 'المالك محترم وبيتفهم. بس المبنى محتاج تجديد كامل. الكهرباء بتقطع كتير.', floor: '2', apartmentNumber: '3' },
  { buildingId: 'b8', ratings: { noise: 2, humidity: 2, landlord: 3, neighbors: 3, lighting: 2, safety: 2 }, comment: 'الإنارة في الشقة ضعيفة حتى بالنهار. والسلالم مظلمة. بس المكان حلو لو بتحب الحيوية.', floor: '4', apartmentNumber: '11' },
  { buildingId: 'b8', ratings: { noise: 1, humidity: 2, landlord: 3, neighbors: 3, lighting: 2, safety: 2 }, comment: 'الحارة اللي فيها المبنى ضيقة أوي. مش بتتسع لعربيتين. والضجيج بالليل صعب.', floor: '6', apartmentNumber: '16' },

  // b9 — سيدي بشر / فوزي موسى
  { buildingId: 'b9', ratings: { noise: 3, humidity: 1, landlord: 4, neighbors: 4, lighting: 4, safety: 3 }, comment: 'سيدي بشر حلوة أوي بالصيف. الشقة بتشوف نور والريحة حلوة من البحر. بس شتاء الرطوبة بتزيد.', floor: '4', apartmentNumber: '9' },
  { buildingId: 'b9', ratings: { noise: 4, humidity: 1, landlord: 4, neighbors: 4, lighting: 4, safety: 4 }, comment: 'المبنى بعيد عن الشارع الرئيسي فهادئ نوعاً ما. المالك محترم وبيصلح بسرعة.', floor: '2', apartmentNumber: '5' },
  { buildingId: 'b9', ratings: { noise: 3, humidity: 2, landlord: 4, neighbors: 5, lighting: 4, safety: 3 }, comment: 'أحلى حاجة الجيران. كلهم شباب وبنات محترمين. والحي آمن بالليل.', floor: '3', apartmentNumber: '12' },

  // b10 — المهندسين / جامعة الدول العربية
  { buildingId: 'b10', ratings: { noise: 2, humidity: 3, landlord: 4, neighbors: 4, lighting: 4, safety: 4 }, comment: 'المهندسين مكان ممتاز. شارع حيوية بس مش ضجيج. الجيران محترمين والمبنى نظيف.', floor: '6', apartmentNumber: '2' },
  { buildingId: 'b10', ratings: { noise: 3, humidity: 3, landlord: 4, neighbors: 4, lighting: 4, safety: 4 }, comment: 'المبنى عليه سوبر ماركت وعبط. بس صوت الموسيقى من العيال بيوصل أحياناً.', floor: '4', apartmentNumber: '8' },
  { buildingId: 'b10', ratings: { noise: 2, humidity: 4, landlord: 4, neighbors: 4, lighting: 5, safety: 4 }, comment: 'الشقة نورها ممتاز والتهوية حلوة. بس الرطوبة في الحمام عالية. المالك بيفضل يحسن.', floor: '3', apartmentNumber: '14' },
  { buildingId: 'b10', ratings: { noise: 2, humidity: 3, landlord: 5, neighbors: 4, lighting: 4, safety: 5 }, comment: 'أفضل مبنى في المهندسين. المالك بيهتم بالتفاصيل والأمانة ممتازة. أنصح بالمكان ده.', floor: '7', apartmentNumber: '1' },
];

async function seed() {
  console.log('Starting seed...');

  // Delete existing data
  const existingBuildings = await db.collection('buildings').get();
  const existingReviews = await db.collection('reviews').get();
  const deleteBatch = db.batch();
  existingBuildings.forEach((doc) => deleteBatch.delete(doc.ref));
  existingReviews.forEach((doc) => deleteBatch.delete(doc.ref));
  await deleteBatch.commit();
  console.log(`Deleted ${existingBuildings.size} buildings and ${existingReviews.size} reviews.`);

  const buildingsBatch = db.batch();
  for (const building of buildings) {
    const ref = db.collection('buildings').doc(building.id);
    buildingsBatch.set(ref, building);
    console.log(`  Building ${building.id} (${building.area}) queued`);
  }
  await buildingsBatch.commit();
  console.log(`${buildings.length} buildings written.`);

  const fakeUid = 'seed_script_anon';
  let reviewCount = 0;

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const ratingValues = Object.values(review.ratings);
    const overall = Math.round((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length) * 10) / 10;

    await db.collection('reviews').add({
      buildingId: review.buildingId,
      userId: fakeUid,
      ratings: review.ratings,
      overall,
      comment: review.comment || '',
      floor: review.floor || '',
      apartmentNumber: review.apartmentNumber || '',
      createdAt: Date.now() - Math.floor(Math.random() * 86400000 * 30),
    });
    reviewCount++;
    if (reviewCount % 10 === 0) {
      console.log(`  ${reviewCount}/${reviews.length} reviews written...`);
    }
  }

  console.log(`\nSeed complete!`);
  console.log(`  Buildings: ${buildings.length}`);
  console.log(`  Reviews: ${reviewCount}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
