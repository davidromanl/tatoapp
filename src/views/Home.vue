<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-center">BarDeTato - App</h2>
        <p class="text-center">App para administrar pedidos <small>(en desarrollo)</small></p>
        <p class="text-center">
          <strong>Demo:</strong> <br>
          Usuario: <strong>admin</strong> - contraseña: **admin** <br>
          Usuario: <strong>user1</strong> - contraseña: **demo**
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card>
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <div v-if="userStore">
                <p>Hola: {{userStore}}</p>
                <v-btn type="button" @click="logout" color="secodnary" block>Logout</v-btn>
              </div>
              <v-form v-else @submit.prevent="login">
                <v-text-field v-model="user" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-btn type="submit" color="primary" block>Login</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>

const users = [
  {
    user: "admin",
    password: "**admin**"
  },
  {
    user: "user1",
    password: "**demo**"
  }
];

export default {
  name: "HomeView",
  data: () => ({
    user: "",
    password: "",
    userStore: sessionStorage.getItem("key")
  }),
  methods: {
    login() {
      const { user } = users.find(u => u.user === this.user && u.password === this.password);
      console.log(user);
      if (user) {
        sessionStorage.setItem("key", user);
        this.$router.push({ name: "Pedidos" });
      }
    },
    logout() {
      sessionStorage.removeItem("key");
      this.userStore = null;
    }
  }
};
</script>
