import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDzh2Jr0CwpkEmW8Pu5EqjvtpKBS8axctw",
  authDomain: "bardetato-com.firebaseapp.com",
  databaseURL: "https://bardetato-com.firebaseio.com",
  projectId: "bardetato-com",
  storageBucket: "bardetato-com.appspot.com",
  messagingSenderId: "177843279083",
  appId: "1:177843279083:web:76f34ae150f070f571daae",
  measurementId: "G-FM7RBQ6X00",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(firebase.app());

export const addProd = async (producto) => {
  if (producto.id) {
    const id = producto.id;
    delete producto.id;
    await db.collection("productos").doc(id).update(producto);
  } else {
    await db.collection("productos").add(producto);
  }
};
export const getProd = async () => {
  const productos = [];
  const docRef = await db.collection("productos").get();
  docRef.forEach((doc) => productos.push({ id: doc.id, ...doc.data() }));
  return productos;
};
export const delProd = async (id) => {
  await db.collection("productos").doc(id).delete();
};
