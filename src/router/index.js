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
    beforeEnter: (to, from, next) => {
      const user = sessionStorage.getItem("key");
      if (!user) {
        next("/");
      } else if (user !== "admin") {
        next("/pedidos");
      }
      next();
    },
  },
  {
    path: "/pedidos",
    name: "Pedidos",
    component: Pedidos,
    beforeEnter: (to, from, next) => {
      const user = sessionStorage.getItem("key");
      if (!user) {
        next("/");
      }
      next();
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
