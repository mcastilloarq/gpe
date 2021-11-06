import firebase from 'firebase';
import './firebase';

const db = firebase.firestore();

export const save = ({collection, docName, item}) => {
  if (docName) {
    return db.collection(collection).doc(docName).set(item, {merge: true })
  } else {
    return db.collection(collection).add(item)
  }
};

export const remove = ({collection, docName}) => {
  return db.collection(collection).doc(docName).delete();
};

export const list = async (collection, orderBy) => {
  let docRef = db.collection(collection);
  if (orderBy) docRef = docRef.orderBy(orderBy);
  let result = null;

  await docRef.get().then((col) => {
    if (col) {
      result = col.docs.map((doc) => {
        return {...doc.data(), id: doc.id}
      });
    } else {
      console.log('No existe el documento');
    }
  }).catch((e) => {
    console.log('Error recuperando el documento:', e);
  });

  return result;
};

export const get = async ({collection, docName}) => {
  const docRef = db.collection(collection).doc(docName);
  let result = null;

  await docRef.get().then((doc) => {
    if (doc.exists) {
      result = doc.data();
    } else {
      console.log('No existe el documento');
    }
  }).catch((e) => {
    console.log('Error recuperando el documento:', e);
  });

  return result;
};

export const getQRs = (id) => {
  return db.collection("qrs")
    .where("client", "==", id)
    .get();
};

export const qrSnapshot = (id, callback) => {
  return db.collection('qrs')
    .where('client', '==', id)
    .onSnapshot(callback)
};

export const getQr = (id) => {
  return db.collection('qrs').doc(id);
}
