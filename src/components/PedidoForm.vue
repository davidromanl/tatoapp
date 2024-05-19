<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-dialog
    :value="visible"
    persistent
    max-width="550px"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card :loading="loading">
      <v-form
        v-model="valid"
        lazy-validation
        ref="form"
        @keypress.enter="guardar"
        @submit.prevent="guardar"
      >
        <v-tabs
          fixed-tabs
          centered
          right
          slider-size="4"
          v-model="pedido.estado"
        >
          <v-tab disabled>Pedido:</v-tab>
          <v-tab
            v-for="(e, i) in estados"
            :active-class="colores[i + 1] + ' lighten-4'"
            :key="i"
            >{{ e }}</v-tab
          >
        </v-tabs>

        <v-card-text>
          <v-row dense>
            <v-col>
              <v-text-field
                label="Nombre"
                v-model="pedido.nombre"
                :rules="[(v) => !!v || 'Requerido']"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-autocomplete
                clearable
                solo
                hide-selected
                @change="add_producto"
                label="Añadir producto"
                :items="productos"
                v-model="producto"
                item-text="nombre"
                return-object
                hide-details
              >
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col>
              <v-pagination
                light
                v-if="pedido.productos.length > 10"
                v-model="page"
                :length="pageCount"
              ></v-pagination>
              <v-data-table
                dense
                :headers="headers"
                hide-default-footer
                :page.sync="page"
                @page-count="pageCount = $event"
                :items="pedido.productos"
              >
                <template v-slot:item.cant="{ item, index }">
                  <v-btn @click="sumar(item.cant, index)" icon color="orange">
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  {{ item.cant }}
                  <v-btn
                    @click="quitar(index)"
                    v-if="item.cant < 2"
                    icon
                    color="error"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    @click="restar(item.cant, index)"
                    icon
                    color="error"
                  >
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item.valor="{ item }">
                  <div class="text-right">
                    {{ (item.valor * item.cant) | pesos }}
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox
                class="mt-2"
                label="Incluir propina"
                v-model="propina"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col class="mt-3 text-right" :class="{ 'grey--text': !propina }">
              Servicio 10%
            </v-col>
            <v-col
              class="mt-3 mr-3 text-right"
              :class="{ 'grey--text text-decoration-line-through': !propina }"
            >
              {{ (total * 0.1) | pesos }}
            </v-col>
          </v-row>

          <v-row dense>
            <v-col>
              <hr />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col class="text-center pa-3">
              <v-icon>mdi-clock</v-icon>
              <small>{{ pedido.hora | fecha }}</small>
            </v-col>
            <v-col>
              <h3 class="text-right pa-2">
                Total: {{ propina ? total * 1.1 : total | pesos }}
              </h3>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="auto">
              <div class="pa-3">Medio de pago:</div>
            </v-col>
            <v-col>
              <v-select v-model="pedido.medioPago" dense :items="mediosPago" hide-details></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="$emit('close')" color="secondary">cerrar</v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" :disabled="loading" color="success"
            >guardar</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { getProd, addPedido } from "../firebase.service";
import { format } from "@formkit/tempo"

export default {
  name: "PedidoForm",

  props: ["visible", "item"],

  data: () => ({
    valid: true,
    propina: false,
    page: 1,
    pageCount: 0,
    pedido: { productos: [] },
    headers: [
      { text: "Producto", value: "nombre" },
      { text: "Cant.", value: "cant" },
      { text: "Valor", value: "valor" },
    ],
    productos: [],
    mediosPago: ["Efectivo", "Tarjeta", "Transferencia"],
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
      if (val) return new Date(val * 1000).toLocaleString().slice(11, 22);
    },
  },

  computed: {
    total() {
      let total = this.pedido.productos.reduce(
        (sum, v) => sum + v.cant * v.valor,
        0
      );
      return total;
    },
  },

  mounted() {
    this.listar_productos();
  },

  watch: {
    visible(val) {
      if (val) this.pedido = JSON.parse(JSON.stringify(this.item));
    },
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
      this.loading = true;
      this.pedido.total = this.total;
      this.pedido.fecha = format(new Date(), "YYYY-MM-DD");
      await addPedido(this.pedido);
      this.loading = false;
      this.$emit("guardar");
    },
  },
};
</script>
