import { doc, setDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';
import { MYANMAR_DELIVERY_REGIONS } from './src/data/myanmarDeliveryRates';

async function run() {
  console.log('Resetting delivery rates in database...');
  await setDoc(doc(db, 'delivery_rates', 'main'), { regions: MYANMAR_DELIVERY_REGIONS }, { merge: true });
  console.log('Done!');
  process.exit(0);
}

run().catch(console.error);
