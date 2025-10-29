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
              <v-form v-model="valid" ref="form" v-else @submit.prevent="login">
                <v-text-field v-model="user" label="User" :rules="[(v) => !!v || 'Requerido']"></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" :rules="[(v) => !!v || 'Requerido']"></v-text-field>
                <small class="red--text">{{ message }}</small>
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
    password: "B4RD3T4T0"
  },
  {
    user: "tatobar",
    password: "tato-2025"
  }
];

export default {
  name: "HomeView",
  data: () => ({
    user: "",
    valid: true,
    password: "",
    message: "",
    userStore: sessionStorage.getItem("key")
  }),
  methods: {
    login() {
      if (!this.$refs.form.validate()) return;
      const result = users.find(u => u.user === this.user && u.password === this.password);
      if (result) {
        sessionStorage.setItem("key", result.user);
        this.$router.push({ name: "Pedidos" });
      } else {
        this.message = "Credenciales inválidas";
      }
    },
    logout() {
      sessionStorage.removeItem("key");
      this.userStore = null;
    }
  }
};
</script>
