import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Pedidos from "../views/Pedidos.vue";
import Productos from "../views/Productos.vue";
import Informes from "../views/informes.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
    path: "/informes",
    name: "Informes",
    component: Informes,
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
];

const router = new VueRouter({
  routes,
});

export default router;
