<script setup>
// Props, emits, context, inject

// Nuxt

// Constant

// Data and composable data
const client = useSupabaseClient();

// Computed

// Async data call
const {
  data: dataClient,
  pending: pendingClient,
  error: errorClient,
} = await useAsyncData("clients", async () =>
  client.from("client").select().order("created_at")
);

const {
  data: dataWorker,
  pending: pendingWorker,
  error: errorWorker,
} = await useAsyncData("workers", async () =>
  client.from("worker").select().order("created_at")
);

// Computed from data call

// Methods

// Lifecycle

// Provider

// UI
</script>

<template>
  <div class="flex gap-2">
    <UCard class="w-1/4">
      <div class="text-3xl font-semibold">{{ dataClient.data?.length }}</div>
      <div>Clientes</div>
    </UCard>
    <UCard class="w-1/4">
      <div class="text-3xl font-semibold">{{ dataWorker.data?.length }}</div>
      <div>Trabajadores</div>
    </UCard>
  </div>
</template>
