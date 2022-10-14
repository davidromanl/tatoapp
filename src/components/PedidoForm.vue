<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog :value="visible" scrollable persistent max-width="500px" :fullscreen="$vuetify.breakpoint.smAndDown">
    <v-card :loading="loading">
      <v-form v-model="valid" lazy-validation ref="form" @keypress.enter="guardar" @submit.prevent="guardar">
        <v-card-title primary-title>
          Pedido
          <v-spacer></v-spacer>
          <v-icon>mdi-clock</v-icon>
          <small>{{ pedido.fecha?.seconds | fecha }}</small>
        </v-card-title>

        <v-card-text>
          <v-text-field label="Nombre" v-model="pedido.nombre" :rules="[(v) => !!v || 'Requerido']"></v-text-field>
          <v-autocomplete clearable solo hide-selected @change="add_producto" label="Añadir producto" :items="productos"
            v-model="producto" item-text="nombre" return-object>
          </v-autocomplete>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Producto</th>
                  <th class="text-left">Cantidad</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, j) in pedido.productos" :key="j">
                  <td>{{ item.nombre }}</td>
                  <td>
                    <v-btn @click="sumar(item.cant, j)" icon color="orange">
                      <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    {{ item.cant }}
                    <v-btn @click="quitar(j)" v-if="item.cant < 2" icon color="error">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn v-else @click="restar(item.cant, j)" icon color="error">
                      <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                  </td>
                  <td class="text-right">
                    {{ (item.valor * item.cant) | pesos }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-row>
            <v-col>
              <hr />
              <h3 class="text-right pa-2">Total: {{ total | pesos }}</h3>
              <v-radio-group row v-model="pedido.estado">
                <v-radio :color="colores[n + 1]" v-for="(e, n) in estados" :key="n" :label="e" :value="n + 1" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="$emit('close')" color="secondary">cerrar</v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="success">guardar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { getProd, addPedido } from "../firebase.service";
export default {
  name: "PedidoForm",

  props: ["visible", "item"],

  data: () => ({
    valid: true,
    pedido: { productos: [] },
    productos: [],
    producto: {},
    estados: ["Nuevo", "Pendiente", "Terminado"],
    colores: ["", "light-green", "amber", "cyan"],
    loading: false,
  }),

  filters: {
    pesos(val) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val);
    },
    fecha(val) {
      if(val) return new Date(val*1000).toLocaleString().slice(11, 22)
    }
  },

  computed: {
    total() {
      let total = this.pedido.productos.reduce((sum, v) => sum + v.cant * v.valor, 0);
      return total;
    },

  },

  mounted() {
    this.listar_productos()
  },

  watch: {
    visible(val) {
      if (val) this.pedido = JSON.parse(JSON.stringify(this.item))
    }
  },

  methods: {
    async listar_productos() {
      this.productos = await getProd();
    },

    add_producto() {
      let e = this.producto;

      //busca si esta
      var index = this.pedido.productos.map((i) => i.id).indexOf(e.id);

      if (index >= 0) {
        //si esta lo suma
        this.pedido.productos[index].cant += 1;
      } else {
        //sino lo añade
        let item = {
          id: e.id,
          nombre: e.nombre,
          cant: 1,
          valor: e.valor,
        };
        this.pedido.productos.push(item);
      }
      this.producto = {};
    },

    sumar(cant, key) {
      this.pedido.productos[key].cant = cant + 1;
    },

    restar(cant, key) {
      this.pedido.productos[key].cant = cant - 1;
    },

    quitar(j) {
      this.pedido.productos.splice(j, 1);
    },

    async guardar() {
      if (!this.$refs.form.validate()) return;
      this.loading = true
      this.pedido.total = this.total
      this.pedido.fecha = new Date()
      await addPedido(this.pedido)
      this.loading = false
      this.$emit("guardar");
    },
  },
};
</script>
