<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Informes</h2>
        <h3>Reporte de ventas por producto</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Por nombre"
          v-model="search"
          clearable
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Fecha"
          @change="listar_pedidos"
          type="date"
          v-model="fecha"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="productos"
          :search="search"
          class="elevation-1"
          loading="true"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getPedidos } from "../firebase.service";
import { fecha, pesos } from "@/helper";
export default {
  name: "InformesView",
  data: () => ({
    pedidos: [],
    search: "",
    fecha: fecha(),
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "nombre",
      },
      { text: "Cantidad", value: "cant" },
      { text: "Valor", value: "valor" },
      { total: 0, text: "Total", value: "total" },
    ],
  }),

  mounted() {
    this.listar_pedidos();
  },

  computed: {
    productos() {
      const productos = new Map();
      this.prodPedidos.forEach(({ id, cant: ct, valor, nombre }) => {
        const c = (productos.get(id)?.cant || 0) + ct;
        productos.set(id, { cant: c, valor: pesos(valor), nombre, total: pesos(c * valor) });
      });
      return Array.from(productos.values());
    },
    prodPedidos() {
      return this.pedidos.flatMap((p) => p.productos);
    },
  },

  methods: {
    async listar_pedidos() {
      if (!this.fecha) return;
      this.pedidos = await getPedidos(this.fecha);
    },
  },
};
</script>
