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
const colRef = db.collection("productos");
const pedRef = db.collection("pedidos");

export const addProd = async (producto) => {
  if (producto.id) {
    const id = producto.id;
    delete producto.id;
    await colRef.doc(id).update(producto);
  } else {
    await colRef.add(producto);
  }
};
export const getProd = async () => {
  const productos = [];
  const docRef = await colRef.get();
  docRef.forEach((doc) => productos.push({ id: doc.id, ...doc.data() }));
  return productos;
};
export const delProd = async (id) => {
  await colRef.doc(id).delete();
};
//Pedido
export const addPedido = async (pedido) => {
  if (pedido.id) {
    const id = pedido.id;
    delete pedido.id;
    await pedRef.doc(id).update(pedido);
  } else {
    await pedRef.add(pedido);
  }
};

export const getPedidos = async (fecha) => {
  const pedidos = [];
  const [year, month, day] = fecha.split("-")
  const start = new Date(year, month - 1, day)
  const end = new Date(year, month - 1, day)
  end.setHours(23, 59, 59, 999)
  const docRef = await pedRef
    .where('fecha', '>=', start)
    .where('fecha', '<=', end).get();
  docRef.forEach((doc) => pedidos.push({ id: doc.id, ...doc.data() }));
  return pedidos;
};
