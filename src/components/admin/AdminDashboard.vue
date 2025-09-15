<template>
  <div class="p-4 space-y-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

    <!-- Download wishes section -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">Download Wishes</h2>
      <div class="flex gap-4">
        <button @click="downloadJson" class="btn-secondary">Download JSON</button>
        <button @click="downloadCsv" class="btn-primary">Download CSV</button>
      </div>
    </section>

    <!-- Send invitation section -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">Send Invitation via WhatsApp</h2>
      <input v-model="search" placeholder="Search guest" class="w-full border rounded px-3 py-2 mb-4" />
      <div class="max-h-96 overflow-y-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="py-2 text-left">Name</th>
              <th class="py-2 text-left">Phone</th>
              <th class="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in filteredGuests" :key="guest.id" class="border-b hover:bg-gray-50">
              <td class="py-2">{{ guest.fullName }}</td>
              <td class="py-2">{{ guest.whatsapp || '-' }}</td>
              <td class="py-2 text-center">
                <a v-if="guest.whatsapp" :href="waLink(guest)" target="_blank" class="btn-primary text-xs">Send</a>
                <span v-else class="text-gray-400 text-xs">No number</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import guestsData from '../../assets/data/guests.json'

// Determine API base URL: in dev we run Express at 3001, in prod same origin
const API_BASE = import.meta.env.VITE_API_BASE || (window.location.port === '3000' ? 'http://localhost:3001' : '')
const wishesEndpoint = `${API_BASE}/api/wishes`
const search = ref('')
const guests = ref([])

onMounted(() => {
  guests.value = guestsData.guests
})

const filteredGuests = computed(() => {
  return guests.value.filter(g =>
    g.fullName.toLowerCase().includes(search.value.toLowerCase())
  )
})

function waLink (guest) {
  const baseUrl = window.location.origin
  const inviteLink = `${baseUrl}/guest/${guest.slug}`
  const message = encodeURIComponent(`Assalamu'alaikum wr wb.%0ASalam sejahtera untuk kita semua.%0A%0ABerikut link undangan pernikahan kami:%0A${inviteLink}%0A%0ATerima kasih.`)
  const phone = guest.whatsapp.replace(/[^\d]/g, '')
  return `https://wa.me/${phone}?text=${message}`
}

// Download helpers
async function fetchWishes () {
  const res = await fetch(wishesEndpoint)
  if (!res.ok) throw new Error('Failed to fetch wishes')
  return await res.json()
}

async function downloadJson () {
  try {
    const data = await fetchWishes()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    triggerDownload(blob, 'wishes.json')
  } catch (e) {
    alert(e.message)
  }
}

async function downloadCsv () {
  try {
    const data = await fetchWishes()
    const rows = data.wishes
    const header = ['id', 'name', 'message', 'attendance', 'guestCount', 'timestamp']
    const csvContent = [header.join(',')].concat(
      rows.map(w => header.map(h => `"${(w[h] || '').toString().replace(/"/g, '""')}"`).join(','))
    ).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    triggerDownload(blob, 'wishes.csv')
  } catch (e) {
    alert(e.message)
  }
}

function triggerDownload (blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
