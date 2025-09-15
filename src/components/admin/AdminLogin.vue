<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form @submit.prevent="login" class="w-full max-w-sm bg-white rounded-xl shadow p-8 space-y-6">
      <h1 class="text-2xl font-semibold text-center">Admin Login</h1>
      <div>
        <label class="block text-sm font-medium mb-1" for="username">Username</label>
        <input v-model="username" id="username" type="text" required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-500" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="password">Password</label>
        <input v-model="password" id="password" type="password" required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary-500" />
      </div>
      <button type="submit" class="btn-primary w-full">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

function login () {
  // Simple hardcoded credentials
  if (username.value === 'admin' && password.value === 'admin123') {
    localStorage.setItem('isAdmin', 'true')
    router.push({ name: 'AdminDashboard' })
  } else {
    alert('Invalid credentials')
  }
}
</script>
