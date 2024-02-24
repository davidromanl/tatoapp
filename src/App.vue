<template>
  <v-app id="app">
    <v-app-bar app>
      <v-tabs color="primary">
        <v-tab to="/"> Inicio </v-tab>
        <v-tab v-if="userStore" to="/pedidos"> Pedidos </v-tab>
        <v-tab v-if="userStore" to="/productos"> Productos </v-tab>
        <v-spacer></v-spacer>
        <v-tab v-if="userStore" @click="logout"> Salir </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    userStore: sessionStorage.getItem("key")
  }),
  methods: {
    logout() {
      sessionStorage.removeItem("key");
      this.$router.push({ name: "Home" });
    }
  }
};
</script>

<style lang="scss">
</style>
