<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Pedidos</h2>
        <v-btn @click="nuevo" color="success">Nuevo</v-btn>
      </v-col>
      <v-col>
        Buscar:
        <v-text-field
          label="Por nombre"
          v-model="buscar"
          clearable
        ></v-text-field>
      </v-col>
      <v-col>
        Filtrar:
        <v-text-field
          @change="listar_pedidos"
          label="Fecha"
          type="date"
          v-model="fecha"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-tabs
      fixed-tabs
      centered
      right
      slider-size="4"
      @change="listar_pedidos"
      v-model="estado"
    >
      <v-tabs-slider :color="colores[estado]"></v-tabs-slider>
      <v-tab
        :active-class="colores[estado] + ' lighten-4'"
        v-for="(e, i) in estados"
        :key="i"
      >
        {{ e }}
      </v-tab>
    </v-tabs>

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
              <tr v-for="p in productos(item.productos)" :key="p.id">
                <td>{{ p.cant }}</td>
                <td>{{ p.nombre }}</td>
                <td>{{ p.valor | pesos }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <strong>Total: {{ item.total | pesos }}</strong>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Total {{ estados[estado] }}s: {{ total | pesos }}</h2>
      </v-col>
    </v-row>
    <v-snackbar color="info" v-model="snackbar">
      Pedido actualizado
    </v-snackbar>
    <PedidoForm
      :visible="dialog"
      :pedido="pedido"
      @guardar="guardar"
      @close="dialog = false"
    />
  </v-container>
</template>

<script>
//Componentes
import PedidoForm from "@/components/PedidoForm.vue";


export default {
  name: "PedidosView",

  components: {
    PedidoForm,
  },

  data: () => ({
    pedidos: [],
    dialog: false,
    estado: 0,
    buscar: null,
    snackbar: false,
    fecha: new Date(new Date().getTime()).toISOString().slice(0, 10),
    estados: ["Todo", "Nuevo", "Pendiente", "Terminado"],
    colores: ["", "light-green", "amber", "cyan"],
    pedido: {},
  }),

  filters: {
    pesos(val) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val);
    },
  },

  computed: {
    filtro() {
      let estado = this.estado > 0 ? "&estado=" + this.estado : "";
      return "?fecha=" + this.fecha + estado;
    },
    filtroPedidos() {
      return this.pedidos.filter((pedido) => {
        const value = this.buscar ? this.buscar.toLowerCase() : "";
        return pedido.nombre.toLowerCase().includes(value);
      });
    },
    total() {
      let total = 0;
      for (let item in this.filtroPedidos) {
        total += this.filtroPedidos[item].total;
      }
      return total;
    },
  },

  methods: {
    listar_pedidos() {
      this.pedidos = [];
    },

    nuevo() {
      this.pedido = { estado: 1 };
      this.dialog = true;
    },

    editar(item) {
      this.pedido = Object.assign({}, item);
      this.dialog = true;
    },

    productos(item) {
      return JSON.parse(item);
    },

    guardar() {
      this.dialog = false;
      this.snackbar = true;
      this.listar_pedidos();
    },
  },
};
</script>
