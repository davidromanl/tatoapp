import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Productos from "../views/Productos.vue";
import Pedidos from "../views/Pedidos.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/productos",
    name: "Productos",
    component: Productos,
  },
  {
    path: "/pedidos",
    name: "Pedidos",
    component: Pedidos,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
