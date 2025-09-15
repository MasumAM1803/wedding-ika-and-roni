<template>
  <div class="p-4 space-y-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

    <!-- Download wishes section -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">Download Wishes</h2>
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button @click="downloadJson" class="btn-secondary">Download JSON</button>
        <button @click="downloadCsv" class="btn-primary">Download CSV</button>
        <button @click="sendAll" :disabled="sendingAll || guestsWithNumber.length===0" class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50">
          <span v-if="!sendingAll">Send All ({{ guestsWithNumber.length }})</span>
          <span v-else>Sending {{ sendProgress }}%</span>
        </button>
      </div>
    </section>

    <!-- Wishes CRUD section -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">Manage Wishes</h2>
      <div class="overflow-x-auto max-w-full">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="py-2 text-left">ID</th>
              <th class="py-2 text-left">Name</th>
              <th class="py-2 text-left">Message</th>
              <th class="py-2 text-left">Attendance</th>
              <th class="py-2 text-left">Guest</th>
              <th class="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="wish in wishes" :key="wish.id" class="border-b">
              <td class="py-1">{{ wish.id }}</td>
              <td class="py-1"><input v-model="wish.name" class="border px-1"/></td>
              <td class="py-1"><input v-model="wish.message" class="border px-1 w-60"/></td>
              <td class="py-1">
                <select v-model="wish.attendance" class="border px-1">
                  <option value="present">present</option>
                  <option value="absent">absent</option>
                </select>
              </td>
              <td class="py-1"><input type="number" v-model.number="wish.guestCount" class="border w-16 px-1"/></td>
              <td class="py-1 flex gap-2 justify-center">
                <button @click="updateWish(wish)" class="btn-secondary text-xs">Save</button>
                <button @click="deleteWish(wish.id)" class="bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded-lg">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
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
              <th class="py-2 text-left hidden sm:table-cell">Sent</th>
              <th class="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in filteredGuests" :key="guest.id" class="border-b hover:bg-gray-50">
              <td class="py-2">{{ guest.fullName }}</td>
              <td class="py-2">{{ guest.whatsapp || '-' }}</td>
              <td class="py-2 text-center hidden sm:table-cell">{{ sendCounts[guest.id] || 0 }}</td>
              <td class="py-2 text-center whitespace-nowrap">
                <a v-if="guest.whatsapp" :href="waLink(guest)" target="_blank" class="btn-primary btn-small" @click="incCount(guest.id)">Send</a>
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
import { ref, computed, onMounted, reactive } from 'vue'
import guestsData from '../../assets/data/guests.json'

// Determine API base URL: in dev we run Express at 3001, in prod same origin
const API_BASE = import.meta.env.VITE_API_BASE || (window.location.port === '3000' ? 'http://localhost:3001' : '')
const wishesEndpoint = `${API_BASE}/api/wishes`
const search = ref('')
const guests = ref([])
const sendingAll = ref(false)
const sendProgress = ref(0)
const wishes = ref([])
const sendCounts = reactive({})

onMounted(async () => {
  guests.value = guestsData.guests
  guests.value.forEach(g=>{ if(g.sent) sendCounts[g.id]=g.sent })

  // fetch wishes list
  try {
    const data = await fetchWishes()
    wishes.value = data.wishes
  } catch (e) {
    console.error(e)
  }
})

const filteredGuests = computed(() => {
  return guests.value.filter(g =>
    g.fullName.toLowerCase().includes(search.value.toLowerCase())
  )
})

const guestsWithNumber = computed(() => guests.value.filter(g=>g.whatsapp))

function normalizePhone(raw) {
  let p = raw.replace(/[^\d]/g,'')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  return p
}

function waLink (guest) {
  const baseUrl = window.location.origin
  const inviteLink = `${baseUrl}/guest/${guest.slug}`
  const message = encodeURIComponent(`Assalamu'alaikum wr wb.%0ASalam sejahtera untuk kita semua.%0A%0ABerikut link undangan pernikahan kami:%0A${inviteLink}%0A%0ATerima kasih.`)
  let phone = guest.whatsapp.replace(/[^\d]/g, '')
  if (phone.startsWith('0')) {
    phone = '62' + phone.slice(1)
  }
  return `https://wa.me/${phone}?text=${message}`
}

// Download helpers
async function fetchWishes () {
  const res = await fetch(wishesEndpoint)
  if (!res.ok) throw new Error('Failed to fetch wishes')
  return await res.json()
}

async function updateWish (wish) {
  try {
    const res = await fetch(`${wishesEndpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wish)
    })
    if (!res.ok) throw new Error('Failed to update wish')
    alert('Updated')
  } catch (e) {
    alert(e.message)
  }
}

async function deleteWish (id) {
  if (!confirm('Delete this wish?')) return
  try {
    const res = await fetch(`${wishesEndpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (!res.ok) throw new Error('Failed to delete wish')
    wishes.value = wishes.value.filter(w => w.id !== id)
  } catch (e) {
    alert(e.message)
  }
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

async function sendAll () {
  if (sendingAll.value) return
  sendingAll.value = true
  const list = guestsWithNumber.value
  for (let i = 0; i < list.length; i++) {
    const g = list[i]
    try {
      await fetch(`${API_BASE}/api/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizePhone(g.whatsapp) })
      })
      incCount(g.id)
    } catch (e) {
      console.error('send failed', g.whatsapp, e)
    }
    sendProgress.value = Math.round(((i+1)/list.length)*100)
    await new Promise(r=>setTimeout(r, 500)) // light throttle
  }
  sendingAll.value = false
}

function incCount(id){
  sendCounts[id] = (sendCounts[id] || 0) + 1
  fetch(`${API_BASE}/api/guest/increment`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id})
  }).catch(()=>{})
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
