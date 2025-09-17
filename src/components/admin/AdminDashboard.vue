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

    <!-- Guest import section -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">Guests</h2>
      <!-- Desktop controls -->
      <div class="hidden sm:flex items-center gap-4 w-full mb-2">
        <input ref="fileInput" type="file" accept=".csv,.json" class="hidden" @change="onFileChange" />
        <button @click="fileInput.click()" class="btn-secondary">Select File</button>
        <span v-if="selectedFile" class="text-sm truncate max-w-[200px]">{{ selectedFile.name }}</span>
        <label class="flex items-center gap-2 ml-auto">
          <input type="checkbox" v-model="replaceGuests" />
          <span>Replace existing list</span>
        </label>
        <button :disabled="!selectedFile" @click="uploadGuests" class="btn-primary">Upload</button>
        <button @click="showAddGuest=true" class="btn-secondary">Add Guest</button>
      </div>

      <!-- Mobile controls -->
      <div class="flex sm:hidden justify-end items-center flex-wrap gap-2 w-full mb-4">
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="replaceGuests" />
          <span class="text-xs">Replace</span>
        </label>
        <input ref="fileInput" type="file" accept=".csv,.json" class="hidden" @change="onFileChange" />
        <button @click="fileInput.click()" class="btn-secondary btn-small px-3 py-2">Select</button>
        <button :disabled="!selectedFile" @click="uploadGuests" class="btn-primary btn-small px-3 py-2">Upload</button>
        <button @click="showAddGuest=true" class="btn-secondary btn-small px-3 py-2">Add Guest</button>
      </div>
      <span v-if="selectedFile" class="block text-xs truncate mt-1 sm:hidden">{{ selectedFile.name }}</span>

      <!-- simple list -->
      <input v-model="guestSearch" placeholder="Search guest" class="w-full border rounded px-3 py-2 mb-2" />
      <div class="max-h-60 overflow-y-auto border rounded">
        <table class="min-w-full text-sm">
          <thead class="sticky top-0 bg-gray-100">
            <tr>
              <th class="px-2 py-1 text-left">Name</th>
              <th class="px-2 py-1 text-left">Phone</th>
              <th class="px-2 py-1 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in filteredGuestList" :key="g.id" class="border-b">
              <td class="px-2 py-1">{{ g.fullName }}</td>
              <td class="px-2 py-1">{{ g.whatsapp||'-' }}</td>
              <td class="px-2 py-1 text-center flex gap-1 justify-center">
                <button @click="startEdit(g)" class="btn-secondary btn-small">Edit</button>
                <button @click="deleteGuest(g)" class="bg-red-600 hover:bg-red-700 text-white text-xs rounded px-2">Del</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Add Guest Modal -->
    <div v-if="showAddGuest" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-80 space-y-4">
        <h3 class="text-lg font-semibold">Add Guest</h3>
        <div class="space-y-2">
          <input v-model="newGuest.fullName" placeholder="Full Name" class="w-full border rounded px-2 py-1" />
          <input :value="slugPreview" placeholder="Slug" disabled class="w-full border rounded px-2 py-1 bg-gray-100 text-gray-500" />
          <input v-model="newGuest.whatsapp" placeholder="WhatsApp (optional)" class="w-full border rounded px-2 py-1" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="showAddGuest=false" class="btn-secondary btn-small">Cancel</button>
          <button @click="saveGuest" :disabled="!newGuest.fullName" class="btn-primary btn-small">Save</button>
        </div>
      </div>
    </div>

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
              <th class="py-2 text-left">Sent</th>
              <th class="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in filteredGuests" :key="guest.id" class="border-b hover:bg-gray-50">
              <td class="py-2">{{ guest.fullName }}</td>
              <td class="py-2">{{ guest.whatsapp || '-' }}</td>
              <td class="py-2 text-center">{{ sendCounts[guest.id] || 0 }}</td>
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
import { ref, computed, onMounted, reactive, watch } from 'vue'
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
const replaceGuests = ref(false)
const selectedFile = ref(null)
const showAddGuest = ref(false)
const newGuest = reactive({ fullName:'', whatsapp:'' })
const fileInput = ref(null)
const editingGuestId = ref(null)
const guestSearch = ref('')
const filteredGuestList = computed(()=> guests.value.filter(g=> g.fullName.toLowerCase().includes(guestSearch.value.toLowerCase())))

const slugPreview = computed(()=>slugify(newGuest.fullName))

watch(()=>newGuest.fullName, ()=>{
  newGuest.slug = slugify(newGuest.fullName)
})

function slugify(str){
  return str.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g,'')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-');
}

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

function onFileChange (e) {
  selectedFile.value = e.target.files[0] || null
}

async function parseCsv (text) {
  const lines = text.trim().split(/\r?\n/)
  const header = lines.shift().split(',').map(h=>h.trim().toLowerCase())
  return lines.map(line=>{
    const cols = line.split(',')
    const obj = {}
    header.forEach((h,i)=>{ obj[h] = cols[i]?.trim() })
    if(obj.nama && !obj.name) obj.name = obj.nama
    if(!obj.fullName) obj.fullName = obj.name || obj.nama
    return obj
  })
}

async function uploadGuests () {
  if (!selectedFile.value) return
  try {
    let parsed
    if (selectedFile.value.name.endsWith('.csv')) {
      const text = await selectedFile.value.text()
      parsed = await parseCsv(text)
    } else {
      const text = await selectedFile.value.text()
      parsed = JSON.parse(text)
    }

    const res = await fetch(`${API_BASE}/api/guests/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replace: replaceGuests.value, guests: parsed })
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    guests.value = data.guests
    alert('Guests updated')
  } catch (e) {
    alert(e.message)
  } finally {
    selectedFile.value = null
  }
}

function startEdit(g){
  editingGuestId.value = g.id
  Object.assign(newGuest,{ fullName: g.fullName, whatsapp: g.whatsapp })
  showAddGuest.value = true
}

async function saveGuest(){
  try{
    const payload = { fullName:newGuest.fullName, whatsapp:newGuest.whatsapp }
    let url = `${API_BASE}/api/guests`;
    let method = 'POST';
    if(editingGuestId.value){
      url += `/${editingGuestId.value}`
      method = 'PUT'
    }
    const res = await fetch(url,{ method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
    if(!res.ok) throw new Error('Failed to save guest')
    const data = await res.json()
    if(editingGuestId.value){
      const idx = guests.value.findIndex(x=>x.id===editingGuestId.value)
      guests.value[idx] = data.guest
    }else{
      guests.value.push(data.guest)
    }
    editingGuestId.value=null
    Object.assign(newGuest,{fullName:'', whatsapp:''})
    showAddGuest.value=false
  }catch(e){ alert(e.message) }
}

async function deleteGuest(g){
  if(!confirm('Delete this guest?')) return
  try{
    const res = await fetch(`${API_BASE}/api/guests/${g.id}`,{method:'DELETE'})
    if(!res.ok) throw new Error('Failed')
    guests.value = guests.value.filter(x=>x.id!==g.id)
  }catch(e){ alert(e.message)}
}
</script>
