<script setup>
// Props, emits, context, inject

// Nuxt
useHead({
  htmlAttrs: {
    'dark-theme': 'light',
  },
})

// Constant

// Data and composable data
const route = useRoute()

const client = useSupabaseClient()

const user = useSupabaseUser()

const menuActive = ref(false) 

// Computed
const pageName = computed(() => {
  const routesName = {
    'dashboard': 'Dashboard',
    'clients': 'Clientes',
    'clients-create': 'Nuevo cliente',
    'clients-edit-clientId': 'Editar cliente',
    'clients-clientId': 'Detalles del cliente',
    'workers': 'Trabajadores'
  }
  return routesName[route.name]
})

// Async data call

// Computed from data call

// Methods
const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}

// Lifecycle

// Provider

// UI
</script>

<template>
  <div class="min-h-full">
  <nav class="bg-violet-500">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-8 w-8" src="data:image/png;base64,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">
          </div>
          <div class="hidden md:block">
            <div class="ml-3 flex items-baseline space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <NuxtLink to="/dashboard" active-class="bg-violet-600 text-white" class="text-gray-300 rounded-md px-3 py-2 text-sm font-medium ">Dashboard</NuxtLink>
              <NuxtLink to="/clients" active-class="bg-violet-600 text-white" class=" text-gray-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Clientes</NuxtLink>
              <NuxtLink to="/workers" active-class="bg-violet-600 text-white" class="text-gray-300  hover:text-white rounded-md px-3 py-2 text-sm font-medium">Trabajadores</NuxtLink>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <div class="relative ml-3">
              <div @click="menuActive = !menuActive">
                <button type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="absolute -inset-1.5"></span>
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                </button>
              </div>
              <div v-if="menuActive" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Perfil</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Configuracion</a>
                <span @click="logout" class="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-200">Salir</span>
              </div>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button type="button" class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" aria-controls="mobile-menu" aria-expanded="false">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <a href="#" class="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Dashboard</a>
        <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>
        <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>
        <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
        <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Reports</a>
      </div>
      <div class="border-t border-gray-700 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
          </div>
          <div class="ml-3">
            <div class="text-base font-medium leading-none text-white">Tom Cook</div>
            <div class="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
          </div>
          <button type="button" class="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
        </div>
        <div v-if="menuActive" class="mt-3 space-y-1 px-2">
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Your Profile</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Settings</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Sign out</a>
        </div>
      </div>
    </div>
  </nav>

  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ pageName }}</h1>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>
</div>
</template>