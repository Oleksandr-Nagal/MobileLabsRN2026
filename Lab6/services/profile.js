import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

function assertOwnUid(uid) {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    throw new Error('Заборонено: доступ лише до власного профілю');
  }
}

export async function loadProfile(uid) {
  assertOwnUid(uid);
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveProfile(uid, { name, age, city }) {
  assertOwnUid(uid);
  await setDoc(
    doc(db, 'users', uid),
    {
      name: name.trim(),
      age: Number(age),
      city: city.trim(),
      email: auth.currentUser.email,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
