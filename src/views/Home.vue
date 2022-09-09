<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>BarDeTato - App</h2>
        <p>
          Estados: <br />
          Colores y estados de los pedidos
        </p>
        <ul>
          <li>Nuevo: por defecto al crear pedido</li>
          <li>Pendiente: cuando es entregado el pedido</li>
          <li>Terminado: al cancelar o pagar el pedido</li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
