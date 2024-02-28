<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Productos</h2>
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
    </v-row>
    <v-row>
      <v-col>
        <v-progress-linear
          indeterminate
          :active="loading"
          query
        ></v-progress-linear>
        <!-- <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Nombre</th>
                <th class="text-left">Precio</th>
                <th>Opc</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in listarFiltro" :key="item.id">
                <td>{{ item.nombre }}</td>
                <td>{{ item.valor | pesos }}</td>
                <td>
                  <v-btn @click="editar(item)" color="orange" icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn @click="eliminar(item.id)" color="error" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table> -->
        <v-data-table
          :headers="headers"
          :items="productos"
          :search="buscar"
        >
          <template v-slot:item.opciones="{ item }">
            <v-btn @click="editar(item)" color="orange" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="eliminar(item.id)" color="error" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
      </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" scrollable max-width="500px">
      <v-card>
        <v-card-title primary-title> Producto </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Nombre"
                type="text"
                v-model="producto.nombre"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Valor"
                type="number"
                v-model="producto.valor"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Cerrar</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="valido" @click="guardar" color="success"
            >guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { addProd, getProd, delProd } from "../firebase.service";

export default {
  name: "ProductosView",

  data: () => ({
    productos: [],
    headers: [
      { text: 'Nombre', value: 'nombre' },
      { text: 'Valor', value: 'valor' },
      { text: 'Opciones', value: 'opciones', sortable: false },
    ],
    producto: {},
    loading: true,
    buscar: '',
    dialog: false,
  }),

  computed: {
    valido() {
      return Object.keys(this.producto).length < 2;
    },
    listarFiltro() {
      return this.productos.filter((pedido) => {
        const value = this.buscar ? this.buscar.toLowerCase() : "";
        return pedido.nombre.toLowerCase().includes(value)
      });
    },
  },

  filters: {
    pesos(val) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val);
    },
  },

  mounted() {
    this.listar();
  },

  methods: {
    async listar() {
      this.productos = await getProd();
      this.loading = false;
    },

    nuevo() {
      this.producto = {};
      this.dialog = true;
    },

    editar(item) {
      this.producto = Object.assign({}, item);
      this.dialog = true;
    },

    async guardar() {
      this.loading = true;
      await addProd(this.producto);
      this.dialog = false;
      this.listar();
    },

    eliminar(id) {
      const shure = confirm("Estas seguro?");
      if (!shure) return;
      this.loading = true;
      delProd(id);
      this.listar();
    },

  },
};
</script>
