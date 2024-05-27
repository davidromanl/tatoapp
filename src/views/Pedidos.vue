<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Pedidos</h2>
        <v-btn @click="nuevo" color="success">Nuevo</v-btn>
      </v-col>
      <v-col>
        Buscar:
        <v-text-field label="Por nombre" v-model="buscar" clearable hide-details></v-text-field>
      </v-col>
      <v-col>
        Medio de Pago:
        <v-select label="Medio de pago" v-model="medioPago" :items="mediosPago" hide-details></v-select>
      </v-col>
      <v-col>
        Filtrar:
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field prepend-icon="mdi-calendar" readonly label="Fecha" @change="listar_pedidos" v-model="fecha"
              hide-details v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="fecha" locale="es-CO"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-switch label="Con propina" v-model="propina"></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-tabs fixed-tabs centered right slider-size="4" @change="listar_pedidos" v-model="estado">
        <v-tabs-slider :color="colores[estado]"></v-tabs-slider>
        <v-tab :active-class="colores[estado] + ' lighten-4'" v-for="(e, i) in estados" :key="i">
          {{ e }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-row class="mt-2">
      <v-col v-for="item in filtroPedidos" :key="item.id" sm="12" md="4">
        <v-card @click="editar(item)">
          <v-card-title :class="colores[item.estado]" class="pa-2">
            {{ item.nombre }}
          </v-card-title>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in item.productos" :key="p.id">
                <td>{{ p.cant }}</td>
                <td>{{ p.nombre }}</td>
                <td>{{ p.valor | pesos }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-actions>
            <small v-if="item.propina">Propina: {{ item.total * 0.1 | pesos }} - 10%</small>
            <v-spacer></v-spacer>
            <strong>Total: {{ item.propina ? item.total * 1.1 : item.total | pesos }}</strong>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <div><strong>Subtotal: {{ total | pesos }}</strong></div>
        <div>Propinas: {{ totalPropinas | pesos }}</div>
        <h2>Total {{ estados[estado] }}s: {{ total + totalPropinas | pesos }} {{ medioPago == 'Todos' ? '' : medioPago
          }}
        </h2>
      </v-col>
    </v-row>
    <v-snackbar color="info" v-model="snackbar">
      Pedido actualizado
    </v-snackbar>
    <PedidoForm :visible="dialog" :item="pedido" @guardar="guardar" @close="dialog = false" />
  </v-container>
</template>

<script>
import { format } from "@formkit/tempo"
//Componentes
import PedidoForm from "@/components/PedidoForm.vue";
import { getPedidos } from "../firebase.service";
import { pesos } from "./../helper"

export default {
  name: "PedidosView",

  components: {
    PedidoForm,
  },

  data: () => ({
    pedidos: [],
    dialog: false,
    propina: false,
    estado: 0,
    buscar: null,
    medioPago: 'Todos',
    snackbar: false,
    mediosPago: ['Todos', "Efectivo", "Tarjeta", "Transferencia"],
    fecha: format(new Date(), "YYYY-MM-DD"),
    estados: ["Todo", "Nuevo", "Pendiente", "Terminado"],
    colores: ["", "light-green", "amber", "cyan"],
    pedido: {},
  }),

  filters: {
    pesos(val) {
      return pesos(val)
    },
  },

  watch: {
    fecha() {
      this.listar_pedidos()
    },
  },

  computed: {

    filtroPedidos() {
      return this.pedidos.filter((pedido) => {
        const value = this.buscar ? this.buscar.toLowerCase() : "";
        const estado = pedido.estado === this.estado || this.estado === 0
        const medio = this.medioPago == 'Todos' || this.medioPago == pedido.medioPago
        const propina = !this.propina || pedido.propina
        return pedido.nombre.toLowerCase().includes(value) && estado && medio && propina;
      });
    },
    total() {
      let total = 0;
      for (let item in this.filtroPedidos) {
        total += this.filtroPedidos[item].total || 0;
      }
      return total;
    },
    totalPropinas() {
      let total = 0;
      for (let item in this.filtroPedidos) {
        if (this.filtroPedidos[item].propina)
          total += this.filtroPedidos[item].total * 0.1 || 0;
      }
      return total;
    }
  },

  mounted() {
    this.listar_pedidos();
  },

  methods: {
    async listar_pedidos() {
      if (!this.fecha) return
      this.pedidos = await getPedidos(this.fecha);
    },

    nuevo() {
      const medioPago = 'Efectivo'
      const hora = Math.floor(Date.now() / 1000)
      const fecha = format(new Date(), "YYYY-MM-DD")
      this.pedido = { estado: 1, productos: [], fecha, hora, medioPago, propina: false };
      this.dialog = true;
    },

    editar(item) {
      this.pedido = Object.assign({}, item);
      this.dialog = true;
    },

    guardar() {
      this.dialog = false;
      this.snackbar = true;
      this.listar_pedidos();
    },
  },
};
</script>
