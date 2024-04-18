<template>
  <v-app id="app">
    <v-app-bar app>
      <v-tabs color="primary">
        <v-tab to="/"> Inicio </v-tab>
        <v-tab to="/pedidos"> Pedidos </v-tab>
        <v-tab v-if="isAdmin" to="/productos"> Productos </v-tab>
        <v-tab v-if="isAdmin" to="/informes"> Informes </v-tab>
        <v-spacer></v-spacer>
        <v-tab @click="logout"> Salir </v-tab>
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
    userStore: sessionStorage.getItem("key"),
  }),
  computed: {
    isAdmin() {
      return this.userStore === "admin";
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem("key");
      if(this.$route.name !== "Home")
        this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style lang="scss"></style>
