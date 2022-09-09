<template>
  <v-app id="app">
    <v-app-bar app>
      <v-tabs color="primary">
        <v-tab to="/"> Inicio </v-tab>
        <v-tab to="/pedidos"> Pedidos </v-tab>
        <v-tab to="/productos"> Productos </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
</style>
