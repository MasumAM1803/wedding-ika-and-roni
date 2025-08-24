<template>
  <div class="wedding-invitation-02">
    <!-- Main Split Layout Container -->
    <div class="split-layout">
      <!-- Left Section - Main Invitation Card (70-75% width) -->
      <div class="left-section">
        <div class="invitation-card">
          <!-- Decorative Background Elements -->
          <div class="decorative-background">
            <!-- Floral Corner Elements -->
            <div class="floral-corner top-left">
              <div class="rose-cluster">
                <div class="rose rose-1"></div>
                <div class="rose rose-2"></div>
                <div class="rose rose-3"></div>
                <div class="leaf leaf-1"></div>
                <div class="leaf leaf-2"></div>
                <div class="leaf leaf-3"></div>
              </div>
            </div>
            
            <div class="floral-corner top-right">
              <div class="rose-cluster">
                <div class="rose rose-4"></div>
                <div class="rose rose-5"></div>
                <div class="leaf leaf-4"></div>
                <div class="leaf leaf-5"></div>
              </div>
            </div>
            
            <div class="floral-corner bottom-left">
              <div class="rose-cluster">
                <div class="rose rose-6"></div>
                <div class="rose rose-7"></div>
                <div class="leaf leaf-6"></div>
                <div class="leaf leaf-7"></div>
              </div>
            </div>
            
            <div class="floral-corner bottom-right">
              <div class="rose-cluster">
                <div class="rose rose-8"></div>
                <div class="rose rose-9"></div>
                <div class="leaf leaf-8"></div>
                <div class="leaf leaf-9"></div>
              </div>
            </div>
            
            <!-- Gold Line Art Elements -->
            <div class="gold-line-art top-center">
              <div class="line line-1"></div>
              <div class="line line-2"></div>
              <div class="line line-3"></div>
            </div>
            
            <div class="gold-line-art bottom-center">
              <div class="line line-4"></div>
              <div class="line line-5"></div>
              <div class="line line-6"></div>
            </div>
            
            <!-- Scattered Gold Glitter -->
            <div class="gold-glitter">
              <div class="glitter-piece piece-1"></div>
              <div class="glitter-piece piece-2"></div>
              <div class="glitter-piece piece-3"></div>
              <div class="glitter-piece piece-4"></div>
              <div class="glitter-piece piece-5"></div>
              <div class="glitter-piece piece-6"></div>
              <div class="glitter-piece piece-7"></div>
              <div class="glitter-piece piece-8"></div>
            </div>
          </div>
          
            <!-- Main Content -->
           <div class="invitation-content">
             <h1 class="wedding-title">The Wedding Of</h1>
             <div class="couple-names">
               <h2 class="bride-name">{{ wedding.couple.bride.shortName }}</h2>
               <span class="and-symbol">&</span>
               <h2 class="groom-name">{{ wedding.couple.groom.shortName }}</h2>
             </div>
              <div class="wedding-date">
                <div class="date-year">{{ wedding.date.year }}</div>
                <div class="date-main">
                  <span class="date-day">{{ wedding.date.day }}</span>
                  <span class="date-separator">|</span>
                  <span class="date-number">{{ wedding.date.date }}</span>
                  <span class="date-separator">|</span>
                  <span class="date-month">{{ wedding.date.month }}</span>
                </div>
                <div class="date-time">{{ wedding.date.time }}</div>
              </div>
           </div>
        </div>
      </div>
      
      <!-- Right Section - Photo and Formal Invitation (25-30% width) -->
      <div class="right-section">
                 <!-- Initial State - Photo and Button -->
         <div v-if="!isInvitationOpen" class="photo-section">
                       <!-- Text Overlay -->
            <div class="text-overlay">
              <h3 class="overlay-title">The Wedding Of</h3>
              <h2 class="overlay-couple">{{ wedding.couple.bride.shortName }} & {{ wedding.couple.groom.shortName }}</h2>
              
              <!-- Guest Welcome Section -->
              <div v-if="currentGuest" class="guest-welcome">
                <p class="overlay-greeting">Kepada Yth.</p>
                <p class="overlay-recipient">Bapak/Ibu/Saudara/i</p>
                <p class="guest-name">{{ currentGuest.fullName }}</p>
                <p class="guest-relationship">{{ currentGuest.relationship }}</p>
                <p class="guest-message">{{ currentGuest.invitationMessage }}</p>
              </div>
              
              <!-- Default Greeting (when no specific guest) -->
              <div v-else>
                <p class="overlay-greeting">Kepada Yth.</p>
                <p class="overlay-recipient">Bapak/Ibu/Saudara/i</p>
                <p class="overlay-disclaimer">*Mohon maaf jika ada kesalahan dalam penulisan nama / gelar.</p>
              </div>
            </div>
           
                       <!-- Open Invitation Button -->
            <button class="open-invitation-btn" @click="openInvitation">
              <i class="fas fa-envelope"></i>
              <span>Buka Undangan</span>
            </button>
         </div>

                                        <!-- Invitation Content Overlay (Shown after video ends) -->
             <div v-if="isInvitationOpen" class="content-overlay">
               <div class="content-scroll">
                            <!-- Hero Section -->
                               <div class="hero-section-right">
                  <video class="hero-video-bg" autoplay muted playsinline @ended="onVideoEnded">
                    <source src="../../../../assets/videos/background/background-1.mp4" type="video/mp4">
                  </video>
                  <div class="hero-content">
                   <h1 class="hero-title">The Wedding Of</h1>
                   <div class="hero-couple-names">
                     <h2 class="hero-bride">{{ wedding.couple.bride.shortName }}</h2>
                     <span class="hero-and">&</span>
                     <h2 class="hero-groom">{{ wedding.couple.groom.shortName }}</h2>
                   </div>
                   <p class="hero-date">{{ wedding.date.fullDate }}</p>
                 </div>
               </div>

              <!-- Quotes Section -->
              <div class="section-right quotes-section-right">
                <div class="quote-card">
                  <div class="quote-initials">{{ wedding.couple.bride.shortName.charAt(0) }} & {{ wedding.couple.groom.shortName.charAt(0) }}</div>
                  <div class="quote-text">
                    "{{ quotes.main }}"
                  </div>
                  <div class="quote-source">{{ quotes.source }}</div>
                  
                  <!-- Decorative corner elements -->
                  <div class="quote-corner top-left"></div>
                  <div class="quote-corner top-right"></div>
                </div>
              </div>

            <!-- Couple Section -->
            <div class="section-right couple-section-right">
              <div class="couple-arch-container">
                <div class="couple-arch-background">
                  <div class="couple-profiles-arch">
                    <div class="profile-card-arch">
                      <div class="arch-title-profile">The Bride</div>
                      <div class="profile-image-arch">
                        <div class="image-frame">
                          <div class="image-placeholder-arch">{{ wedding.couple.bride.shortName.charAt(0) }}</div>
                        </div>
                      </div>
                      <h3 class="profile-name-arch">{{ wedding.couple.bride.name }}</h3>
                      <p class="profile-desc-arch">Putri dari</p>
                      <p class="profile-parents-arch">{{ wedding.couple.bride.parents }}</p>
                      <button class="instagram-btn-profile">
                        <i class="fab fa-instagram"></i>
                        <span>{{ wedding.couple.bride.instagram }}</span>
                      </button>
                    </div>
                    
                    <div class="profile-card-arch">
                      <div class="arch-title-profile">The Groom</div>
                      <div class="profile-image-arch">
                        <div class="image-frame">
                          <div class="image-placeholder-arch">{{ wedding.couple.groom.shortName.charAt(0) }}</div>
                        </div>
                      </div>
                      <h3 class="profile-name-arch">{{ wedding.couple.groom.name }}</h3>
                      <p class="profile-desc-arch">Putra dari</p>
                      <p class="profile-parents-arch">{{ wedding.couple.groom.parents }}</p>
                      <button class="instagram-btn-profile">
                        <i class="fab fa-instagram"></i>
                        <span>{{ wedding.couple.groom.instagram }}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Decorative corner elements -->
                <div class="arch-corner top-left-arch"></div>
                <div class="arch-corner top-right-arch"></div>
                <div class="arch-corner bottom-left-arch"></div>
                <div class="arch-corner bottom-right-arch"></div>
              </div>
            </div>

            <!-- Countdown Section -->
            <div class="section-right countdown-section-right">
              <h2 class="section-title">Save The Date</h2>
              <div class="countdown-timer">
                <div class="countdown-item">
                  <span class="countdown-number">{{ countdown.days }}</span>
                  <span class="countdown-label">Hari</span>
                </div>
                <div class="countdown-item">
                  <span class="countdown-number">{{ countdown.hours }}</span>
                  <span class="countdown-label">Jam</span>
                </div>
                <div class="countdown-item">
                  <span class="countdown-number">{{ countdown.minutes }}</span>
                  <span class="countdown-label">Menit</span>
                </div>
                <div class="countdown-item">
                  <span class="countdown-number">{{ countdown.seconds }}</span>
                  <span class="countdown-label">Detik</span>
                </div>
              </div>
            </div>

            <!-- Events Section -->
            <div class="section-right events-section-right">
              <h2 class="section-title">Events</h2>
              <div class="event-card">
                <h3 class="event-title">AKAD NIKAH</h3>
                <div class="event-date">
                  <div class="date-main">{{ wedding.akad.date.split(', ')[0] }}</div>
                  <div class="date-number">{{ wedding.akad.date.split(', ')[1].split(' ')[1] }}</div>
                  <div class="date-month-year">
                    <span class="month">{{ wedding.akad.date.split(', ')[1].split(' ')[2].toUpperCase() }}</span>
                    <span class="year">{{ wedding.akad.date.split(', ')[1].split(' ')[3] }}</span>
                  </div>
                  <div class="event-time">
                    <i class="fas fa-clock"></i>
                    {{ wedding.akad.time }}
                  </div>
                </div>
                <div class="event-location">
                  <h4>Lokasi Acara</h4>
                  <p><strong>{{ wedding.akad.location }}</strong><br>{{ wedding.akad.address }}</p>
                  <button class="maps-btn" @click="openMaps(`${wedding.akad.location}, ${wedding.akad.address}`)">
                    <i class="fas fa-map-marker-alt"></i>
                    Google Maps
                  </button>
                </div>
              </div>
            </div>

            <!-- Wishes Section -->
            <div class="section-right wishes-section-right">
              <h2 class="section-title">Wishes</h2>
              <p class="wishes-desc">Berikan doa dan ucapan terbaik untuk kami.</p>
              
              <div class="wishes-form">
                <div class="form-group">
                  <input type="text" id="wishName" v-model="wishData.name" placeholder="Nama" minlength="2">
                </div>
                
                <div class="form-group">
                  <textarea id="wishMessage" v-model="wishData.message" placeholder="Ucapan" rows="3"></textarea>
                </div>
                
                <div class="attendance-section">
                  <div class="attendance-header">
                    <span>Konfirmasi Kehadiran</span>
                  </div>
                  <div class="attendance-buttons">
                    <button 
                      class="attendance-btn present-btn" 
                      :class="{ active: wishData.attendance === 'present' }"
                      @click="wishData.attendance = 'present'"
                    >
                      <i class="fas fa-check"></i>
                      <span>Hadir</span>
                    </button>
                    <button 
                      class="attendance-btn absent-btn" 
                      :class="{ active: wishData.attendance === 'absent' }"
                      @click="wishData.attendance = 'absent'"
                    >
                      <i class="fas fa-times"></i>
                      <span>Tidak Hadir</span>
                    </button>
                  </div>
                </div>
                
                <button class="submit-wish-btn" @click="submitWish">Kirim</button>
                

              </div>
              
              <div class="wishes-counter">
                <span class="counter-number">{{ wishesCount }}</span> Messages
              </div>
              
              <!-- Wishes Display Section -->
              <div class="wishes-display-section">
                <h3 class="wishes-display-title">Ucapan & Doa</h3>
                <div class="wishes-container">
                  <div v-if="wishes.length === 0" class="no-wishes">
                    <p>Belum ada ucapan. Jadilah yang pertama!</p>
                  </div>
                  <div v-else class="wishes-list">
                    <div 
                      v-for="(wish, index) in paginatedWishes" 
                      :key="index" 
                      class="wish-item"
                      :class="wish.attendance"
                    >
                      <div class="wish-header">
                        <div class="wish-name">{{ wish.name }}</div>
                        <div class="wish-attendance" :class="wish.attendance">
                          <i :class="wish.attendance === 'present' ? 'fas fa-check' : 'fas fa-times'"></i>
                          <span>{{ wish.attendance === 'present' ? 'Hadir' : 'Tidak Hadir' }}</span>
                        </div>
                      </div>
                      <div class="wish-message">{{ wish.message }}</div>
                      <div class="wish-timestamp">{{ wish.timestamp }}</div>
                    </div>
                    
                    <!-- Pagination Buttons -->
                    <div v-if="totalPages > 1" class="pagination-container">
                      <button 
                        class="pagination-btn prev-btn" 
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                      >
                        <i class="fas fa-chevron-left"></i>
                        <span>Sebelumnya</span>
                      </button>
                      
                      <div class="page-numbers">
                        <button 
                          v-for="page in visiblePages" 
                          :key="page"
                          class="pagination-btn page-btn"
                          :class="{ active: page === currentPage }"
                          @click="goToPage(page)"
                        >
                          {{ page }}
                        </button>
                      </div>
                      
                      <button 
                        class="pagination-btn next-btn" 
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                      >
                        <span>Selanjutnya</span>
                        <i class="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gift Section -->
            <div class="section-right gift-section-right">
              <div class="gift-container">
                <h2 class="gift-title">Tanda Kasih</h2>
                <p class="gift-message">
                  Terima kasih telah menambah semangat kegembiraan pernikahan kami dengan kehadiran dan hadiah indah Anda.
                </p>
                
                <div class="gift-options">
                  <button class="gift-option-btn cashless-btn" @click="selectGiftType('cashless')">Cashless</button>
                  <button class="gift-option-btn physical-btn" @click="selectGiftType('physical')">Kirim Kado</button>
                </div>
                
                <!-- Cashless Section -->
                <div v-if="giftType === 'cashless'" class="cashless-section">
                  <h3 class="cashless-title">Transfer Bank</h3>
                  <p class="cashless-message">
                    Anda dapat melakukan transfer ke rekening berikut:
                  </p>
                  
                  <div class="bank-accounts">
                    <div v-for="account in bankAccounts" :key="account.bank" class="bank-account">
                      <div class="bank-row">
                        <div class="flex">
                          <div class="bank-logo" :class="`${account.logo}`">{{ account.bank }}</div>
                        </div>
                        <div class="account-details">
                          <div class="account-number">{{ account.accountNumber }}</div>
                          <button class="copy-btn" @click="copyAccountNumber(account.accountNumber, account.bank)">
                            Salin Rekening
                          </button>
                          <div class="account-holder">{{ account.bank }} : {{ account.accountHolder }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Physical Gift Section -->
                <div v-if="giftType === 'physical'" class="physical-gift-section">
                  <h3 class="physical-gift-title">Kirim Kado</h3>
                  <p class="physical-gift-address">
                    Anda dapat mengirim kado ke:<br>
                    <strong>{{ giftAddress.address }}<br>{{ giftAddress.city }} {{ giftAddress.postalCode }}</strong>
                  </p>
                  <button class="copy-address-btn" @click="copyAddress(`${giftAddress.address}, ${giftAddress.city} ${giftAddress.postalCode}`)">
                    <i class="fas fa-copy"></i>
                    Salin Alamat
                  </button>
                </div>
              </div>
            </div>

             <!-- Gallery Section -->
             <div class="section-right gallery-section-right">
               <h2 class="section-title">Gallery</h2>
               <p class="gallery-desc">Our precious moments together</p>
               
               <div class="gallery-grid">
                 <div class="gallery-item">
                   <div class="gallery-placeholder">Photo 1</div>
                 </div>
                 <div class="gallery-item">
                   <div class="gallery-placeholder">Photo 2</div>
                 </div>
                 <div class="gallery-item">
                   <div class="gallery-placeholder">Photo 3</div>
                 </div>
                 <div class="gallery-item">
                   <div class="gallery-placeholder">Photo 4</div>
                 </div>
               </div>
             </div>

            <!-- Thanks Section -->
             <div class="section-right thanks-section-right">
               <h2 class="section-title">Terima Kasih</h2>
               <p class="thanks-desc">
                 Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do'a restu kepada kami.
               </p>
               <p class="thanks-closing"><strong>Wassalamu'alaikum warahmatullahi wabarakatuh</strong></p>
               
               <div class="signature">
                 <p>Kami Yang Berbahagia</p>
                 <h3>{{ wedding.couple.bride.shortName }} & {{ wedding.couple.groom.shortName }}</h3>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </template>

<script>
import wishesData from '../../../../assets/data/wishes.json'
import weddingConfig from '../../../../assets/data/wedding-config.json'
export default {
  name: 'Wedding3D02FullWidth',
  props: {
    guestSlug: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentSection: 'hero',
      isInvitationOpen: false,
      giftType: 'cashless', // 'cashless' or 'physical' or null - default to cashless
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      wishesCount: 0,
      wishes: [],
      currentPage: 1, // Current page number
      itemsPerPage: weddingConfig.settings.itemsPerPage || 10, // Number of wishes per page
      wishData: {
        name: '',
        message: '',
        attendance: 'present', // Default to present
        guestCount: ''
      },
      // Guest information
      currentGuest: null,
      
      // Wedding configuration from JSON
      wedding: weddingConfig.wedding,
      bankAccounts: weddingConfig.bankAccounts,
      giftAddress: weddingConfig.giftAddress,
      quotes: weddingConfig.quotes,
      settings: weddingConfig.settings
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.wishes.length / this.itemsPerPage)
    },
    paginatedWishes() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.wishes.slice(startIndex, endIndex)
    },
    visiblePages() {
      const pages = []
      const maxVisible = this.settings.maxVisiblePages || 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted() {
    this.checkGuestFromProps()
    this.initializeData()
    this.startCountdown()
    this.scrollToActiveButton()
  },
  updated() {
    this.scrollToActiveButton()
  },
  watch: {
    guestSlug: {
      handler(newSlug) {
        if (newSlug !== this.currentGuest?.slug) {
          this.checkGuestFromProps()
        }
      },
      immediate: false
    }
  },
  methods: {
    async checkGuestFromProps() {
      // Check if we have a guest slug from the route
      if (this.guestSlug) {
        try {
          // Try to fetch guest information from API
          const apiUrl = import.meta.env.DEV ? `http://localhost:3001/api/guest/${this.guestSlug}` : `/api/guest/${this.guestSlug}`;
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const guestData = await response.json();
            this.currentGuest = guestData.guest;
            console.log('Guest found:', this.currentGuest);
          } else {
            console.log('Guest not found or invalid slug:', this.guestSlug);
            this.currentGuest = null;
          }
        } catch (error) {
          console.error('Error checking guest:', error);
          this.currentGuest = null;
        }
      } else {
        // No guest slug, reset to null
        this.currentGuest = null;
      }
    },
    
    async initializeData() {
      try {
        // Try to fetch wishes from API first (use local server for development)
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/wishes' : '/api/wishes';
        const response = await fetch(apiUrl);
        if (response.ok) {
          const apiData = await response.json();
          this.wishes = apiData.wishes.map(wish => ({
            ...wish,
            timestamp: this.formatTimestamp(wish.timestamp)
          }));
          this.wishesCount = this.wishes.length;
        } else {
          // Fallback to imported data
          this.wishes = wishesData.wishes.map(wish => ({
            ...wish,
            timestamp: this.formatTimestamp(wish.timestamp)
          }));
          this.wishesCount = this.wishes.length;
        }
      } catch (error) {
        console.error('Error fetching wishes:', error);
        // Fallback to imported data
        this.wishes = wishesData.wishes.map(wish => ({
          ...wish,
          timestamp: this.formatTimestamp(wish.timestamp)
        }));
        this.wishesCount = this.wishes.length;
      }
      
      this.itemsPerPage = this.settings.itemsPerPage;
    },





    formatTimestamp(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) {
        return 'Baru saja'
      } else if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays} hari yang lalu`
      }
    },
    
    openInvitation() {
      this.isInvitationOpen = true
    },
    
    onVideoEnded() {
      // Video has ended, it will stop playing naturally
      console.log('Hero video ended')
    },
    
    openRSVP() {
      this.showNotification('📧 RSVP functionality coming soon!', 'info')
    },
    
    changeSection(section) {
      this.currentSection = section
      this.$nextTick(() => {
        this.scrollToActiveButton()
      })
    },
    
    startCountdown() {
      // Use target date from wedding config
      const targetDate = new Date(this.wedding.countdown.targetDate).getTime()
      
      const updateCountdown = () => {
        const now = new Date().getTime()
        const distance = targetDate - now
        
        if (distance > 0) {
          this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24))
          this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000)
        } else {
          this.countdown.days = 0
          this.countdown.hours = 0
          this.countdown.minutes = 0
          this.countdown.seconds = 0
        }
      }
      
      updateCountdown()
      setInterval(updateCountdown, 1000)
    },
    
    scrollToActiveButton() {
      const active = this.$refs.scrollWrapper?.querySelector('.active')
      if (active && this.$refs.scrollWrapper) {
        const wrapperRect = this.$refs.scrollWrapper.getBoundingClientRect()
        const activeRect = active.getBoundingClientRect()
        const scrollAmount =
          active.offsetLeft - wrapperRect.width / 2 + activeRect.width / 2

        this.$refs.scrollWrapper.scrollTo({
          left: scrollAmount,
          behavior: 'smooth',
        })
      }
    },
    
    openMaps(address) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      window.open(googleMapsUrl, '_blank')
      this.showNotification('🗺️ Membuka Google Maps', 'info')
    },
    
    copyAccountNumber(accountNumber, accountHolder) {
      navigator.clipboard.writeText(accountNumber).then(() => {
        this.showNotification(`✅ Nomor rekening ${accountHolder} berhasil disalin`, 'success')
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = accountNumber
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        this.showNotification(`✅ Nomor rekening ${accountHolder} berhasil disalin`, 'success')
      })
    },
    
         copyAddress(address) {
       navigator.clipboard.writeText(address).then(() => {
         this.showNotification('✅ Alamat berhasil disalin', 'success')
       }).catch(() => {
         // Fallback for older browsers
         const textArea = document.createElement('textarea')
         textArea.value = address
         document.body.appendChild(textArea)
         textArea.select()
         document.execCommand('copy')
         document.body.removeChild(textArea)
         this.showNotification('✅ Alamat berhasil disalin', 'success')
       })
     },
     
           selectGiftType(type) {
        if (this.giftType === type) {
          // If clicking the same button, hide it
          this.giftType = null
        } else {
          // Show the selected gift type
          this.giftType = type
        }
      },
    
    async submitWish() {
       if (this.wishData.name.trim() === '' || this.wishData.message.trim() === '') {
         this.showNotification('❌ Mohon lengkapi nama dan ucapan', 'error')
         return
       }
       
      // Store original form data for potential rollback
      const originalFormData = { ...this.wishData }
      
      // Optimistically update UI first (immediate feedback)
      const optimisticWish = {
        id: this.wishes.length + 1,
         name: this.wishData.name.trim(),
         message: this.wishData.message.trim(),
         attendance: this.wishData.attendance,
        timestamp: this.formatTimestamp(new Date().toISOString()),
        guestCount: this.wishData.guestCount || 1
      }
      
      // Add to beginning of array immediately
      this.wishes.unshift(optimisticWish)
      this.wishesCount = this.wishes.length
      
      // Reset form immediately for better UX
       this.wishData = {
         name: '',
         message: '',
        attendance: 'present',
         guestCount: ''
       }
       
       // Reset to first page to show the new wish
       this.currentPage = 1
      
      // Show optimistic success message
      this.showNotification('📝 Mengirim ucapan...', 'info')
      
      try {
        // Send wish to API (use local server for development)
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/wishes' : '/api/wishes';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: originalFormData.name.trim(),
            message: originalFormData.message.trim(),
            attendance: originalFormData.attendance,
            guestCount: originalFormData.guestCount || 1
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          // Update the optimistic wish with real data from server
          const realWish = {
            ...result.wish,
            timestamp: this.formatTimestamp(result.wish.timestamp)
          }
          
          // Replace the optimistic wish with real one
          this.wishes[0] = realWish
          this.wishesCount = result.totalWishes
          
          this.showNotification('✅ Ucapan berhasil dikirim!', 'success')
        } else {
          const errorData = await response.json();
          
          // Rollback optimistic update on error
          this.wishes.shift()
          this.wishesCount = this.wishes.length
          
          // Restore form data
          this.wishData = originalFormData
          
          this.showNotification(`❌ Error: ${errorData.error}`, 'error')
        }
      } catch (error) {
        console.error('Error submitting wish:', error);
        
        // Rollback optimistic update on error
        this.wishes.shift()
        this.wishesCount = this.wishes.length
        
        // Restore form data
        this.wishData = originalFormData
        
        this.showNotification('❌ Gagal mengirim ucapan. Silakan coba lagi.', 'error')
      }
    },
    
              goToPage(page) {
           if (page >= 1 && page <= this.totalPages) {
             this.currentPage = page
             // Scroll to top of wishes-container (internal scrollable area)
             this.$nextTick(() => {
               const wishesContainer = document.querySelector('.wishes-container')
               if (wishesContainer) {
                 wishesContainer.scrollTop = 0
               }
             })
           }
         },
    
     goToNextPage() {
       if (this.currentPage < this.totalPages) {
         this.goToPage(this.currentPage + 1)
       }
     },
    
     goToPrevPage() {
       if (this.currentPage > 1) {
         this.goToPage(this.currentPage - 1)
       }
     },
    
    showNotification(message, type = 'info') {
      const notification = document.createElement('div')
      notification.className = `notification notification-${type}`
      notification.textContent = message
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
      `
      
      switch (type) {
        case 'success':
          notification.style.background = '#10B981'
          break
        case 'error':
          notification.style.background = '#EF4444'
          break
        case 'warning':
          notification.style.background = '#F59E0B'
          break
        default:
          notification.style.background = '#3B82F6'
      }
      
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in'
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.wedding-invitation-02 {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%);
  font-family: 'Playfair Display', 'Georgia', serif;
  position: relative;
  overflow-x: hidden;
  margin: 0 auto;
  padding: 0;
}

/* Main Split Layout Container */
.split-layout {
  display: flex;
  height: 100vh; /* Ensure it takes full height */
  overflow: hidden;
}

.left-section {
  flex: 0 0 70%; /* 70% of the container */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.right-section {
  flex: 0 0 30%; /* 30% of the container */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: url('../../../../assets/images/background/background-2.jpg') no-repeat center center;
  background-size: cover;
}

.invitation-card {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%);
  color: #8B0000;
}

.decorative-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%);
  overflow: hidden;
}

/* Floral Corner Elements */
.floral-corner {
  position: absolute;
  z-index: 2;
}

.floral-corner.top-left {
  top: 5%;
  left: 5%;
  transform: rotate(-15deg);
}

.floral-corner.top-right {
  top: 8%;
  right: 5%;
  transform: rotate(15deg);
}

.floral-corner.bottom-left {
  bottom: 8%;
  left: 5%;
  transform: rotate(-25deg);
}

.floral-corner.bottom-right {
  bottom: 5%;
  right: 5%;
  transform: rotate(25deg);
}

.rose-cluster {
  position: relative;
  width: 120px;
  height: 120px;
}

.rose {
  position: absolute;
  width: 25px;
  height: 25px;
  background: radial-gradient(circle at 30% 30%, #FFB6C1, #FF69B4, #FF1493);
  border-radius: 50%;
  opacity: 0.8;
  animation: float 6s ease-in-out infinite;
}

.rose-1 { top: 0; left: 0; animation-delay: 0s; }
.rose-2 { top: 15px; left: 35px; animation-delay: 1s; }
.rose-3 { top: 45px; left: 20px; animation-delay: 2s; }
.rose-4 { top: 10px; left: 10px; animation-delay: 0.5s; }
.rose-5 { top: 40px; left: 40px; animation-delay: 1.5s; }
.rose-6 { top: 5px; left: 25px; animation-delay: 1.2s; }
.rose-7 { top: 35px; left: 5px; animation-delay: 2.5s; }
.rose-8 { top: 20px; left: 15px; animation-delay: 0.8s; }
.rose-9 { top: 50px; left: 30px; animation-delay: 1.8s; }

.leaf {
  position: absolute;
  width: 20px;
  height: 12px;
  background: linear-gradient(45deg, #90EE90, #32CD32, #228B22);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  opacity: 0.7;
  animation: sway 4s ease-in-out infinite;
}

.leaf-1 { top: 25px; left: 50px; transform: rotate(45deg); animation-delay: 0s; }
.leaf-2 { top: 55px; left: 10px; transform: rotate(-30deg); animation-delay: 1s; }
.leaf-3 { top: 70px; left: 45px; transform: rotate(60deg); animation-delay: 2s; }
.leaf-4 { top: 30px; left: 60px; transform: rotate(-45deg); animation-delay: 0.5s; }
.leaf-5 { top: 60px; left: 25px; transform: rotate(75deg); animation-delay: 1.5s; }
.leaf-6 { top: 15px; left: 70px; transform: rotate(-15deg); animation-delay: 1.2s; }
.leaf-7 { top: 45px; left: 80px; transform: rotate(30deg); animation-delay: 2.5s; }
.leaf-8 { top: 25px; left: 85px; transform: rotate(-60deg); animation-delay: 0.8s; }
.leaf-9 { top: 65px; left: 65px; transform: rotate(90deg); animation-delay: 1.8s; }

/* Gold Line Art Elements */
.gold-line-art {
  position: absolute;
  z-index: 3;
}

.gold-line-art.top-center {
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.gold-line-art.bottom-center {
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #DAA520, #FFD700, #DAA520, transparent);
  margin: 8px 0;
  border-radius: 1px;
  opacity: 0.6;
  animation: shimmer 3s ease-in-out infinite;
}

.line-1 { transform: rotate(-15deg); animation-delay: 0s; }
.line-2 { transform: rotate(0deg); animation-delay: 0.5s; }
.line-3 { transform: rotate(15deg); animation-delay: 1s; }
.line-4 { transform: rotate(-20deg); animation-delay: 0.3s; }
.line-5 { transform: rotate(0deg); animation-delay: 0.8s; }
.line-6 { transform: rotate(20deg); animation-delay: 1.3s; }

/* Scattered Gold Glitter */
.gold-glitter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.glitter-piece {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #FFD700, #DAA520);
  border-radius: 50%;
  opacity: 0.7;
  animation: sparkle 4s ease-in-out infinite;
}

.piece-1 { top: 20%; left: 15%; animation-delay: 0s; }
.piece-2 { top: 25%; right: 20%; animation-delay: 0.5s; }
.piece-3 { top: 45%; left: 10%; animation-delay: 1s; }
.piece-4 { top: 50%; right: 15%; animation-delay: 1.5s; }
.piece-5 { top: 70%; left: 25%; animation-delay: 2s; }
.piece-6 { top: 75%; right: 25%; animation-delay: 2.5s; }
.piece-7 { top: 35%; left: 80%; animation-delay: 0.3s; }
.piece-8 { top: 65%; right: 10%; animation-delay: 0.8s; }

/* Additional Floral Styling */
.rose::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #FF1493;
  border-radius: 50%;
  opacity: 0.6;
}

.leaf::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3px;
  height: 3px;
  background: #228B22;
  border-radius: 50%;
  opacity: 0.8;
}

.invitation-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 400px;
}

.wedding-of {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.5s forwards;
  color: #8B0000;
}

.wedding-title {
  font-size: 2rem;
  font-weight: 400;
  font-family: 'Paper Tiger', 'Cormorant Garamond', 'Crimson Text', 'Playfair Display', serif;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.7s forwards;
  color: #8B0000;
  letter-spacing: 0.05em;
}

.couple-names {
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1s forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.bride-name, .groom-name {
  font-size: 4.5rem;
  font-weight: 700;
  font-family: 'Playfair Display', 'Georgia', serif;
  margin: 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  color: #DAA520;
  letter-spacing: 0.02em;
}

.and-symbol {
  font-size: 2.5rem;
  font-weight: 400;
  font-family: 'Playfair Display', 'Georgia', serif;
  margin: 0 1rem;
  opacity: 0.8;
  color: #DAA520;
  letter-spacing: 0.05em;
}

.wedding-date {
  animation: slideInUp 1s ease-out 0.6s both;
  text-align: center;
  margin-top: 1rem;
}

.date-year {
  font-size: 1.6rem;
  font-weight: 500;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #8B0000;
  margin-bottom: 0.5rem;
  letter-spacing: 0.03em;
}

.date-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.date-day, .date-month {
  font-size: 1.8rem;
  font-weight: 500;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #8B0000;
  letter-spacing: 0.02em;
}

.date-separator {
  font-size: 1.3rem;
  color: #8B0000;
  font-weight: 400;
}

.date-number {
  font-size: 3.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #FF69B4;
  line-height: 1;
  letter-spacing: 0.01em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.date-time {
  font-size: 1.6rem;
  font-weight: 600;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #8B0000;
  margin-top: 0.5rem;
  letter-spacing: 0.02em;
}

.photo-section {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 240, 245, 0.8) 0%, rgba(255, 228, 225, 0.8) 100%), url('../../../../assets/images/background/background-1.jpg') no-repeat center center;
  background-size: cover;
  text-align: center;
  padding: 2rem;
}

.couple-photo {
  position: relative;
  width: 80%;
  max-width: 300px;
  height: 80%;
  max-height: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 2;
}



.photo-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #FF69B4, #FF1493);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  opacity: 0.8;
}

.couple-avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.bride-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: url('@/assets/images/bride-avatar.jpg') no-repeat center center;
  background-size: cover;
}

.groom-avatar {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: url('@/assets/images/groom-avatar.jpg') no-repeat center center;
  background-size: cover;
}

.text-overlay {
  position: relative;
  text-align: center;
  z-index: 3;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
}

.overlay-title {
  font-size: 1.5rem;
  font-weight: 300;
  font-family: 'Paper Tiger', 'Cormorant Garamond', 'Crimson Text', 'Playfair Display', serif;
  margin-bottom: 0.5rem;
  color: #8B4513; /* Muted dark reddish-brown/maroon */
}

.overlay-couple {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #DAA520; /* Rich warm gold/bronze */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.overlay-greeting {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #8B4513; /* Muted dark reddish-brown/maroon */
}

.overlay-recipient {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #8B4513; /* Muted dark reddish-brown/maroon */
}

.guest-name {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #DAA520; /* Rich warm gold/bronze */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.overlay-disclaimer {
  font-size: 1rem;
  opacity: 0.8;
  color: #8B4513; /* Muted dark reddish-brown/maroon */
}

/* Guest Welcome Styles */
.guest-welcome {
  margin-bottom: 1rem;
}

.guest-relationship {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #DAA520; /* Gold color for relationship */
  font-weight: 500;
  font-style: italic;
}

.guest-message {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #8B4513;
  line-height: 1.4;
  font-style: italic;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.open-invitation-btn {
  position: relative;
  background: linear-gradient(45deg, #FF69B4, #FF1493);
  color: white;
  border: none;
  padding: .6rem 1.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 200px;
  text-align: center;
  margin: 2rem auto 0;
}

.open-invitation-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
}

.full-invitation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  color: white;
}

.hero-content {
  position: relative;
  z-index: 10;
  padding: 2rem;
  max-width: 400px;
  margin-bottom: 30%;
}

.hero-title {
  font-size: 1.75rem;
  font-weight: 300;
  font-family: 'Paper Tiger', 'Cormorant Garamond', 'Crimson Text', 'Playfair Display', serif;
  margin-bottom: 1rem;
  color: #8B4513;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.5s forwards;
}

.hero-couple-names {
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1s forwards;
}

.hero-bride, .hero-groom {
  font-size: 3rem;
  font-weight: 700;
  margin: 0.25rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  color: #DAA520;
}

.hero-and {
  font-size: 2.3rem;
  margin: 0 0.5rem;
  opacity: 0.8;
  color: #DAA520;
}

.hero-date {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #8B4513;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1.5s forwards;
}

.hero-greeting {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 2s forwards;
}

/* Main Content */
.main-sections {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Space between sections */
  padding: 2rem 1rem;
}

.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

.section-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 450px;
  width: 100%;
  text-align: center;
}

/* Opening Section */
.opening-content {
  color: white;
}

.main-title {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  animation: slideInDown 1s ease-out;
}

.couple-names-main {
  margin-bottom: 2rem;
  animation: slideInUp 1s ease-out 0.3s both;
}

.bride-name-main, .groom-name-main {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.and-symbol-main {
  font-size: 2.5rem;
  margin: 0 1rem;
  opacity: 0.8;
}

.wedding-date {
  animation: slideInUp 1s ease-out 0.6s both;
}

.date-text {
  font-size: 1.3rem;
  font-weight: 500;
  color: #f8f9fa;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Quotes Section */
.quotes-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quote-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInScale 1s ease-out;
}

.quote-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.quote-source {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

/* New Quote Card Design */
.quote-card {
  background: linear-gradient(135deg, rgba(255, 240, 245, 0.95) 0%, rgba(255, 228, 225, 0.95) 100%);
  border-radius: 30px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(139, 69, 19, 0.15);
  border: 2px solid rgba(255, 182, 193, 0.3);
  animation: fadeInScale 1s ease-out;
}

.quote-initials {
  font-size: 3.5rem;
  font-weight: 400;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #FFB6C1;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.quote-initials .ampersand {
  font-size: 2rem;
  margin: 0 0.5rem;
  opacity: 0.8;
}

.quote-card .quote-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-style: italic;
  color: #8B4513;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-weight: 400;
}

.quote-card .quote-source {
  font-size: 1rem;
  font-weight: 600;
  color: #8B4513;
  font-family: 'Playfair Display', 'Georgia', serif;
  opacity: 0.9;
}

        /* Decorative corner elements */
        .quote-corner {
          position: absolute;
          z-index: 2;
          width: 80px;
          height: 80px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        
        .quote-corner.top-left {
          top: -10px;
          left: -15px;
          transform: rotate(-15deg);
          background-image: url('../../../../assets/images/background/bunga2-1.png');
        }
        
        .quote-corner.top-right {
          top: -10px;
          right: -15px;
          transform: rotate(15deg);
          background-image: url('../../../../assets/images/background/bunga2-2.png');
        }

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Couple Section - New Arch Design */
.couple-section-right {
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.couple-arch-container {
  position: relative;
  width: 100%;
  max-width: 90%;
  margin: 0 auto;
}

.couple-arch-background {
  background: linear-gradient(135deg, rgba(255, 240, 245, 0.95) 0%, rgba(255, 228, 225, 0.95) 100%);
  border-radius: 50px 50px 30px 30px;
  padding: 3rem 2rem 2rem 2rem;
  position: relative;
  box-shadow: 0 20px 40px rgba(139, 69, 19, 0.15);
  border: 2px solid rgba(255, 182, 193, 0.3);
  overflow: hidden;
}

.couple-arch-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="arch-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(218,165,32,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23arch-pattern)"/></svg>');
  opacity: 0.3;
  z-index: 1;
}



.arch-title {
  font-size: 2.5rem;
  font-weight: 400;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #8B4513;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.arch-title-profile {
  font-size: 1.8rem;
  font-weight: 600;
  font-family: 'Playfair Display', 'Georgia', serif;
  color: #8B4513;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 15px;
}

.couple-profiles-arch {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.profile-card-arch {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 1.5rem;
  border: 2px solid rgba(255, 182, 193, 0.3);
  backdrop-filter: blur(10px);
}

.profile-image-arch {
  margin-bottom: 1.5rem;
  position: relative;
}

.image-frame {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(255, 182, 193, 0.3);
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(218, 165, 32, 0.4);
  background: linear-gradient(45deg, #FFB6C1, #FF69B4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder-arch {
  font-size: 3rem;
  color: white;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.profile-name-arch {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #8B4513;
  font-family: 'Playfair Display', 'Georgia', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.profile-desc-arch {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #8B4513;
  font-family: 'Playfair Display', 'Georgia', serif;
  opacity: 0.9;
}

.profile-parents-arch {
  font-size: 1rem;
  color: #8B4513;
  font-weight: 500;
  font-family: 'Playfair Display', 'Georgia', serif;
  line-height: 1.4;
  opacity: 0.9;
}

.arch-bottom-decoration {
  text-align: center;
  position: relative;
  z-index: 2;
}

.instagram-btn {
  background: linear-gradient(135deg, #F5DEB3, #DEB887);
  color: #8B0000;
  border: 2px solid #DAA520;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
  font-family: 'Playfair Display', 'Georgia', serif;
  min-width: 160px;
}

.instagram-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(218, 165, 32, 0.4);
  background: linear-gradient(135deg, #DEB887, #F5DEB3);
}

.instagram-btn i {
  font-size: 1.2rem;
  background: linear-gradient(45deg, #E1306C, #833AB4, #405DE6, #5851DB, #833AB4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Instagram button for individual profile cards */
.instagram-btn-profile {
  background: linear-gradient(135deg, #F5DEB3, #DEB887);
  color: #8B0000;
  border: 2px solid #DAA520;
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: 1rem auto 0 auto;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
  font-family: 'Playfair Display', 'Georgia', serif;
  min-width: 140px;
}

.instagram-btn-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(218, 165, 32, 0.4);
  background: linear-gradient(135deg, #DEB887, #F5DEB3);
}

.instagram-btn-profile i {
  font-size: 1rem;
  background: linear-gradient(45deg, #E1306C, #833AB4, #405DE6, #5851DB, #833AB4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Decorative corner elements */
.arch-corner {
  position: absolute;
  z-index: 3;
  width: 60px;
  height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
}

                 .arch-corner.top-left-arch {
           top: -15px;
           left: -15px;
           transform: rotate(-15deg);
           background-image: url('../../../../assets/images/background/bunga2-3.png');
         }

         .arch-corner.top-right-arch {
           top: -15px;
           right: -15px;
           transform: rotate(15deg);
           background-image: url('../../../../assets/images/background/bunga2-4.png');
         }

         .arch-corner.bottom-left-arch {
           bottom: -15px;
           left: -15px;
           transform: rotate(-25deg);
           background-image: url('../../../../assets/images/background/bunga2-1.png');
         }

         .arch-corner.bottom-right-arch {
           bottom: -15px;
           right: -15px;
           transform: rotate(25deg);
           background-image: url('../../../../assets/images/background/bunga2-2.png');
         }

/* Mobile responsive adjustments */
@media (max-width: 500px) {
  .couple-section-right {
    padding: 1.5rem 1rem;
  }
  
  .couple-arch-background {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    border-radius: 40px 40px 25px 25px;
  }
  
  .arch-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .arch-title-profile {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
  
  .profile-card-arch {
    padding: 1.25rem;
  }
  
  .image-frame {
    width: 100px;
    height: 100px;
  }
  
  .image-placeholder-arch {
    font-size: 2.5rem;
  }
  
  .profile-name-arch {
    font-size: 1.2rem;
  }
  
  .profile-desc-arch,
  .profile-parents-arch {
    font-size: 0.9rem;
  }
  
  .instagram-btn {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
    min-width: 140px;
  }
  
  .instagram-btn-profile {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    min-width: 120px;
    margin: 0.75rem auto 0 auto;
  }
  
  .arch-corner {
    width: 50px;
    height: 50px;
  }
  
  .arch-corner.top-left-arch,
  .arch-corner.top-right-arch {
    top: -10px;
  }
  
  .arch-corner.bottom-left-arch,
  .arch-corner.bottom-right-arch {
    bottom: -10px;
  }
}

/* Countdown Section */
.countdown-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  animation: fadeInScale 1s ease-out 0.3s both;
}

.countdown-item {
  text-align: center;
  min-width: 80px;
}

.countdown-number {
  display: block;
  font-size: 2.25rem;
  font-weight: 700;
  color: #FF69B4;
  line-height: 1.6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.countdown-label {
  font-size: 1rem;
  color: #8B4513;
  font-weight: 500;
}

.save-date-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  animation: fadeInScale 1s ease-out 0.6s both;
}

.save-date-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
}

/* Events Section */
.events-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.events-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  animation: slideInUp 1s ease-out;
}

.event-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 25px;
  border: 2px solid rgba(139, 69, 19, 0.1);
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 25px;
  z-index: 1;
}

.event-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #8B0000;
  position: relative;
  z-index: 2;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.event-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8B0000, transparent);
  border-radius: 1px;
}

.event-date {
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 2;
}

.date-main {
  font-size: 1.4rem;
  color: #8B0000;
  margin-bottom: 0.5rem;
  font-family: 'Paper Tiger', 'Cormorant Garamond', 'Crimson Text', 'Playfair Display', serif;
  font-weight: 400;
}

.date-month-year {
  margin-bottom: 1rem;
}

.month, .year {
  display: block;
  font-size: 1.2rem;
  color: #8B4513;
  margin: 0.25rem 0;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-time {
  font-size: 1.3rem;
  font-weight: 600;
  color: #8B0000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.event-time i {
  color: #8B4513;
  font-size: 1.1rem;
}

.event-location {
  position: relative;
  z-index: 2;
}

.event-location h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #8B0000;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-weight: 600;
}

.event-location p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #8B0000;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.maps-btn {
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
  font-family: 'Playfair Display', 'Georgia', serif;
  margin: 0 auto;
  width: fit-content;
}

.maps-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(139, 69, 19, 0.4);
  background: linear-gradient(135deg, #A0522D, #8B4513);
}

.maps-btn i {
  font-size: 1.1rem;
}

/* Dresscode Section */
.dresscode-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dresscode-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.color-palette {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeInScale 1s ease-out 0.3s both;
}

.color-item {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-1 { background: #ff6b6b; }
.color-2 { background: #4ecdc4; }
.color-3 { background: #45b7d1; }
.color-4 { background: #96ceb4; }

/* Streaming Section */
.streaming-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.streaming-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.streaming-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.streaming-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
}

/* Story Section */
.story-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: slideInUp 1s ease-out;
}

.timeline-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: left;
}

.timeline-date {
  font-size: 1rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.timeline-content {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
}

/* Gallery Section */
.gallery-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  animation: fadeInScale 1s ease-out 0.3s both;
}

.gallery-item {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-placeholder {
  min-width: 200px;
  height: 100%;
  max-width: 200px;
  font-size: 1rem;
  background: linear-gradient(45deg, #FFB6C1, #FF69B4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem;
}

/* Gift Section */
.gift-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.gift-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.gift-info-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.gift-info-btn:hover {
  transform: translateY(-2px);
}

.bank-accounts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bank-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.bank-card h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.account-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff6b6b;
  text-shadow: 2px 2px 4px rgba(139, 0, 0, 0.1);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  letter-spacing: 0.05em;
  text-align: left;
}


.account-holder {
  font-size: 1rem;
  color: #8B4513;
  text-align: left;
  font-weight: 500;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.copy-btn {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}


.physical-gift {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.physical-gift h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
}

.gift-info p {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.address {
  font-style: italic;
  margin-bottom: 1rem;
}

/* New Gift Section Styles */
.gift-section-right {
  max-width: 90%;
  margin: 0 auto 2rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gift-container {
  background: linear-gradient(135deg, rgba(255, 240, 245, 0.95) 0%, rgba(255, 228, 225, 0.95) 100%);
  border-radius: 50px;
  padding: 4rem 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(139, 69, 19, 0.2);
  border: 2px solid rgba(255, 182, 193, 0.3);
}

.gift-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="gift-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23gift-pattern)"/></svg>');
  opacity: 0.3;
  z-index: 1;
}

.gift-title {
  font-size: 3rem;
  font-weight: 700;
  color: #8B0000;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  font-family: 'Paper Tiger', 'Cormorant Garamond', 'Crimson Text', 'Playfair Display', serif;
  text-shadow: 2px 2px 4px rgba(139, 0, 0, 0.1);
}

.gift-message {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #8B4513;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}

.gift-options {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

.gift-option-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cashless-btn {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}

.cashless-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
}

.physical-btn {
  background: linear-gradient(135deg, #DAA520, #B8860B);
  color: white;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
}

.physical-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.6);
}

.bank-accounts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 2;
  max-width: 500px;
  margin: 0 auto;
}

.bank-account {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 2rem;
  border: 2px solid rgba(255, 182, 193, 0.4);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  flex: 1;
}

.bank-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.bank-logo {
  padding: 1.25rem 1.5rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bca-logo {
  background: linear-gradient(135deg, #1E40AF, #3B82F6);
}

.btn-logo {
  background: linear-gradient(135deg, #059669, #10B981);
}

   /* Cashless Section */
  .cashless-section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 2px solid rgba(255, 182, 193, 0.4);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
    animation: fadeInScale 0.5s ease-out;
    position: relative;
    z-index: 2;
  }

  .cashless-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #8B0000;
    margin-bottom: 1.5rem;
    text-align: center;
    font-family: 'Playfair Display', 'Georgia', serif;
  }

  .cashless-message {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #8B4513;
    margin-bottom: 2rem;
    text-align: center;
    font-family: 'Playfair Display', 'Georgia', serif;
  }

  /* Physical Gift Section */
  .physical-gift-section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 2px solid rgba(255, 182, 193, 0.4);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
    animation: fadeInScale 0.5s ease-out;
    position: relative;
    z-index: 2;
  }

 .physical-gift-title {
   font-size: 1.5rem;
   font-weight: 700;
   color: #8B0000;
   margin-bottom: 1.5rem;
   text-align: center;
   font-family: 'Playfair Display', 'Georgia', serif;
 }

 .physical-gift-address {
   font-size: 1.1rem;
   line-height: 1.6;
   color: #8B4513;
   margin-bottom: 2rem;
   text-align: center;
   font-family: 'Playfair Display', 'Georgia', serif;
 }

 .physical-gift-address strong {
   color: #8B0000;
   font-weight: 600;
 }

 .copy-address-btn {
   background: linear-gradient(135deg, #DAA520, #B8860B);
   color: white;
   border: none;
   padding: 0.75rem 1.5rem;
   font-size: 0.9rem;
   border-radius: 20px;
   cursor: pointer;
   transition: all 0.3s ease;
   font-weight: 600;
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 0.5rem;
   margin: 0 auto;
   box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
 }

 .copy-address-btn:hover {
   transform: translateY(-2px);
   box-shadow: 0 6px 20px rgba(218, 165, 32, 0.4);
 }

 .copy-address-btn i {
   font-size: 1rem;
 }

/* Wishes Section */
.wishes-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.wishes-desc {
  font-size: 1rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  text-align: center;
}

.wishes-form {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
  animation: fadeInScale 1s ease-out;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #8B4513;
  font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #FF69B4;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #FF69B4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

/* Attendance Section Styles */
.attendance-section {
  margin-bottom: 1.5rem;
}

.attendance-header {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.attendance-header::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(139, 69, 19, 0.3);
  z-index: 1;
}

.attendance-header span {
  background: white;
  padding: 0 1rem;
  color: #8B4513;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  z-index: 2;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.attendance-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.attendance-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 182, 193, 0.6);
  border-radius: 10px;
  background: white;
  color: #8B4513;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.attendance-btn.present-btn.active {
  background: rgba(255, 182, 193, 0.3);
  border-color: rgba(255, 182, 193, 0.8);
}

.attendance-btn.absent-btn.active {
  background: rgba(255, 182, 193, 0.3);
  border-color: rgba(255, 182, 193, 0.8);
}

.attendance-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.attendance-btn i {
  font-size: 0.8rem;
}

/* Wishes Display Section Styles */
.wishes-display-section {
  margin-top: 2rem;
  border-top: 1px solid rgba(139, 69, 19, 0.1);
  padding-top: 1.5rem;
}

.wishes-display-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #8B4513;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.wishes-container {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.wishes-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.no-wishes {
  text-align: center;
  padding: 2rem 1rem;
  color: #8B4513;
  opacity: 0.7;
}

.no-wishes p {
  font-style: italic;
  font-size: 0.9rem;
}

.wishes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wish-item {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.wish-item.present {
  border-left-color: #10B981;
}

.wish-item.absent {
  border-left-color: #EF4444;
}

.wish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.wish-name {
  font-weight: 600;
  color: #8B4513;
  font-size: 0.95rem;
}

.wish-attendance {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.wish-attendance.present {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.wish-attendance.absent {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.wish-attendance i {
  font-size: 0.7rem;
}

.wish-message {
  color: #8B4513;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  font-style: italic;
}

.wish-timestamp {
  font-size: 0.75rem;
  color: #8B4513;
  opacity: 0.6;
  text-align: right;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.pagination-btn {
  background: white;
  color: #8B4513;
  border: 1px solid rgba(139, 69, 19, 0.3);
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: fit-content;
  font-family: 'Playfair Display', 'Georgia', serif;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 182, 193, 0.2);
  border-color: rgba(255, 182, 193, 0.6);
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  color: white;
  border-color: #FF69B4;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  min-width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.prev-btn, .next-btn {
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.prev-btn i, .next-btn i {
  font-size: 0.75rem;
}

/* Mobile Pagination Adjustments */
@media (max-width: 500px) {
  .pagination-container {
    gap: 0.25rem;
    margin-top: 1rem;
  }
  
  .pagination-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .page-btn {
    min-width: 30px;
    height: 30px;
  }
  
  .prev-btn, .next-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
}

.submit-wish-btn {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.submit-wish-btn:hover {
  transform: translateY(-2px);
}

.wishes-counter {
  text-align: center;
  animation: fadeInScale 1s ease-out 0.3s both;
}

.counter-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ff6b6b;
}




.footer {
  text-align: center;
  opacity: 0.8;
}

.footer p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #FF69B4;
}

.contact-info h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.contact-assets {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.asset {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Bottom Navigation */
.bottom-nav {
  display: none; /* Hide the bottom navigation */
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1000;
  width: 100%;
  overflow: hidden;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.nav-scroll-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  padding: 0 1rem;
}

.nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  min-width: 20%;
  flex-shrink: 0;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.nav-item.active {
  background: rgba(102, 126, 234, 0.2);
}

.nav-item.active .nav-icon,
.nav-item.active .nav-label {
  color: #667eea;
}

.nav-icon {
  font-size: 1.25rem;
  color: #666;
  width: 1.25rem;
  text-align: center;
}

.nav-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 500px) {
  .wedding-invitation-02 {
    width: 100%;
  }
  
  .split-layout {
    flex-direction: column;
    height: auto;
  }

  .left-section {
    display: none; /* Hide left section on mobile */
  }

     .right-section {
     flex: none;
     width: 100%;
     height: 100vh; /* Full height on mobile */
     min-height: 100vh;
   }

     .photo-section {
     height: 100vh;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     padding: 2rem;
     position: relative;
   }

  .couple-photo {
    width: 80%;
    max-width: 250px;
    height: 40%;
    max-height: 200px;
    border-radius: 15px;
    margin-bottom: 2rem;
  }

  .photo-placeholder {
    font-size: 2rem;
  }

  .couple-avatar {
    width: 100px;
    height: 100px;
    border: 2px solid white;
  }

  .bride-avatar {
    width: 50%;
    height: 100%;
  }

  .groom-avatar {
    width: 50%;
    height: 100%;
  }

     .text-overlay {
     position: relative;
     transform: none;
     top: auto;
     left: auto;
     text-align: center;
     z-index: 3;
     color: white;
     text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
     padding: 1rem;
     margin-bottom: 2rem;
     width: 100%;
     max-width: 300px;
   }

     .overlay-title {
     font-size: 1.3rem;
     margin-bottom: 0.75rem;
   }

   .overlay-couple {
     font-size: 2rem;
     margin-bottom: 1rem;
   }

   .overlay-greeting, .overlay-recipient {
     font-size: 1rem;
     margin-bottom: 0.5rem;
   }
   
   .guest-name {
     font-size: 1.2rem;
     margin-bottom: 0.5rem;
   }

   .overlay-disclaimer {
     font-size: 0.8rem;
     margin-bottom: 1.5rem;
   }

                       .open-invitation-btn {
       padding: 1rem 2.5rem;
       font-size: 1.1rem;
       position: relative;
       width: 100%;
       max-width: 250px;
       min-width: 200px;
       display: flex;
       align-items: center;
       justify-content: center;
       gap: 0.5rem;
       box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
       margin: 2rem auto 0;
     }

                                           .open-invitation-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(255, 105, 180, 0.6);
      }
    
    /* Ensure button is centered on mobile */
    .photo-section {
      text-align: center;
    }
   
       /* Mobile content overlay styles */
     .content-overlay {
       height: 100vh;
       overflow-y: auto;
       padding: 0;
     }

    .section-right {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .hero-section-right {
      margin-bottom: 1.5rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

      .hero-title {
      font-size: 1.4rem;
    }

    .hero-bride, .hero-groom {
      font-size: 2rem;
    }

    .hero-video-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

  .section-title {
    font-size: 1.5rem;
  }

     .quote-text {
     font-size: 1rem;
   }
   
   /* Mobile Quote Card Styles */
   .quote-card {
     padding: 2rem 1.5rem;
     max-width: 90%;
     border-radius: 25px;
   }
   
   .quote-initials {
     font-size: 2.5rem;
     margin-bottom: 1.5rem;
   }
   
   .quote-card .quote-text {
     font-size: 1rem;
     line-height: 1.6;
     margin-bottom: 1rem;
   }
   
   .quote-card .quote-source {
     font-size: 0.9rem;
   }
   
           .quote-corner {
          width: 60px;
          height: 60px;
        }

  .profile-card {
    padding: 1.5rem;
  }

  .image-placeholder {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }

  .profile-name {
    font-size: 1.3rem;
  }

  .countdown-timer {
    gap: 1rem;
  }

  .countdown-item {
    min-width: 60px;
  }

  .countdown-number {
    font-size: 1.8rem;
  }

     .event-card {
     padding: 1.5rem;
     border-radius: 20px;
   }

   .event-title {
     font-size: 1.5rem;
   }

   .date-number {
     font-size: 3rem;
   }

   .date-main {
     font-size: 1.2rem;
   }

   .month, .year {
     font-size: 1rem;
   }

   .event-time {
     font-size: 1.1rem;
   }

   .maps-btn {
     padding: 0.75rem 1.5rem;
     font-size: 0.9rem;
     margin: 0 auto;
     width: fit-content;
   }

   /* Mobile Gift Section Styles */
   .gift-container {
     padding: 2.5rem 1.5rem;
     max-width: 90%;
   }

   .gift-title {
     font-size: 2.5rem;
   }

   .gift-message {
     font-size: 1.1rem;
     margin-bottom: 2rem;
   }

   .gift-options {
     gap: 1rem;
     margin-bottom: 2rem;
   }

   .gift-option-btn {
     padding: 0.75rem 1.5rem;
     font-size: 1rem;
     min-width: 120px;
   }

   .bank-account {
     padding: 1.5rem;
   }

   .account-number {
     font-size: 2rem;
     text-align: center;
   }

   .bank-row {
     flex-direction: column;
     gap: 1rem;
     text-align: center;
   }
   
   .account-details {
     align-items: center;
   }

   .copy-btn {
     padding: 0.5rem 1rem;
     font-size: 0.8rem;
   }

       /* Mobile Cashless Section */
    .cashless-section {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .cashless-title {
      font-size: 1.3rem;
    }

    .cashless-message {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    /* Mobile Physical Gift Section */
    .physical-gift-section {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .physical-gift-title {
      font-size: 1.3rem;
    }

    .physical-gift-address {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    .copy-address-btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

  .wishes-form {
    padding: 1.5rem;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    font-size: 1rem;
  }

  .attendance-section {
    margin-bottom: 1.25rem;
  }

  .attendance-header {
    margin-bottom: 1.25rem;
  }

  .attendance-header span {
    font-size: 0.9rem;
    padding: 0 0.75rem;
  }

  .attendance-buttons {
    gap: 0.75rem;
  }

  .attendance-btn {
    padding: 0.6rem 0.75rem;
    font-size: 0.8rem;
  }
  
  /* Mobile Wishes Display Styles */
  .wishes-display-section {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
  }
  
  .wishes-display-title {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .wishes-container {
    max-height: 250px;
  }
  
  .wish-item {
    padding: 0.75rem;
  }
  
  .wish-header {
    margin-bottom: 0.5rem;
  }
  
  .wish-name {
    font-size: 0.9rem;
  }
  
  .wish-attendance {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
  
  .wish-message {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  
  .wish-timestamp {
    font-size: 0.7rem;
  }

  /* Mobile Pagination Adjustments */
  .pagination-container {
    gap: 0.25rem;
    margin-top: 1rem;
  }
  
  .pagination-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .page-btn {
    min-width: 30px;
    height: 30px;
  }
  
  .prev-btn, .next-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }

  .submit-wish-btn {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  /* Mobile Gallery Styles */
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .gallery-item {
    border-width: 1px;
  }

     .gallery-desc {
     font-size: 0.8rem;
   }
   
       
 }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes sway {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.1); }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; transform: scaleX(1); }
  50% { opacity: 0.9; transform: scaleX(1.1); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Notification Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Content Scroll - for the overlay content */
.content-scroll {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
  position: relative;
  z-index: 1001;
  background: transparent;
}

.content-scroll::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome/Safari/Opera */
}

/* Right Section Content Styles */
.section-right {
  margin-bottom: 2rem;
  padding: 0;
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-section-right {
  text-align: center;
  margin-bottom: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-video-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-couple-names {
  margin-bottom: 1.5rem;
}

.hero-greeting {
  font-size: 0.9rem;
  color: #8B4513;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #FF69B4;
  text-align: center;
}

.quote-container {
  background: transparent;
  padding: 1rem;
  border-radius: 0;
  border: none;
}

.quote-text {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-style: italic;
}

.quote-source {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
  text-align: right;
}

.section-subtitle {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  text-align: center;
}

.section-description {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 1.5rem;
  opacity: 0.8;
  text-align: center;
}

.couple-profiles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-card {
  background: transparent;
  padding: 1rem;
  border-radius: 0;
  border: none;
  text-align: center;
}

.profile-image {
  margin-bottom: 0.75rem;
}

.image-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.profile-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.profile-desc {
  font-size: 1rem;
  color: #8B4513;
  margin-bottom: 0.25rem;
}

.profile-parents {
  font-size: 1rem;
  color: #8B4513;
  font-weight: 500;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.countdown-item {
  text-align: center;
  min-width: 50px;
}

.event-date {
  margin-bottom: 1rem;
}

.wishes-form {
  background: transparent;
  padding: 1rem;
  border-radius: 0;
  border: none;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(139, 69, 19, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  color: #8B4513;
  font-size: 0.8rem;
  backdrop-filter: none;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #FF69B4;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #FF69B4;
  box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.1);
}

.submit-wish-btn:hover {
  transform: translateY(-2px);
}

.wishes-counter {
  text-align: center;
}

.counter-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF69B4;
}



.signature {
  margin-bottom: 2rem;
  text-align: center;
}


/* Gallery Section Styles */
.gallery-section-right {
  margin-bottom: 0rem;
  background: linear-gradient(135deg, rgb(255, 240, 245) 0%, rgb(255, 228, 225) 100%);
  border-radius: 30px 30px 0 0;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 40px rgba(139, 69, 19, 0.15);
  border-style: solid;
  border-color: rgba(255, 182, 193, 0.3);
  border-width: 2px 2px 0 2px;
  position: relative;
  overflow: hidden;
}

.gallery-desc {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #8B4513;
  text-align: center;
  opacity: 0.8;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(139, 69, 19, 0.2);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

/* Alternative background image solutions for Vue.js */
.right-section {
  /* Try these alternative paths if the relative path doesn't work */
  background: url('../../../../assets/images/background/background-2.jpg') no-repeat center center;
  background-size: cover;
}

/* Content Overlay - appears over video background */
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: transparent;
}



/* Content appears immediately without animation */
.content-overlay {
  opacity: 1;
  transform: none;
}

/* Button positioning and styling */
.open-invitation-btn {
  /* Ensure proper spacing and centering */
  margin: 2rem auto 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Thanks Section */
.thanks-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.thanks-section-right {
  background: linear-gradient(20deg, rgba(255, 240, 245, 0.95) 0%, rgba(255, 228, 225, 0.95) 100%);
  border-radius: 0 0 30px 30px;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 40px rgba(139, 69, 19, 0.15);
  border-style: solid;
  border-color: rgba(255, 182, 193, 0.3);
  border-width: 0 2px 2px 2px;
  position: relative;
  overflow: hidden;
}

.thanks-desc {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  color: #8B4513;
  text-align: center;
}

.thanks-closing {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #8B4513;
  text-align: center;
}

.signature {
  margin-bottom: 3rem;
  animation: fadeInScale 1s ease-out 0.3s both;
}

.signature p {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #8B4513;
  opacity: 0.8;
}

.signature h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #FF69B4;
}

/* Additional styles for new elements */
</style>
