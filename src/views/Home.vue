<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-center">BarDeTato - App</h2>
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
    password: "B4rD3T4t0"
  },
  {
    user: "bar123",
    password: "tato-2024"
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
      const result = users.find(u => u.user === this.user && u.password === this.password);
      if (result) {
        sessionStorage.setItem("key", result.user);
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
