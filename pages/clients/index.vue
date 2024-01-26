<script setup>
import dayjs from 'dayjs'
// Props, emits, context, inject

// Nuxt

// Constant

// Data and composable data
const router = useRouter()

const client = useSupabaseClient()

const columns = [
  { key: "id", label: "Id" },
  { key: "client_invoice_id", label: "Identificador" },
  { key: "name", label: "Nombre" },
  { key: "phone", label: "Telefono" },
  { key: "email", label: "Correo" },
  { key: "address", label: "Direccion" },
  { key: "created_at", label: "Fecha de creacion" },
  { key: "actions" },
];

const items = (row) => [
  [
    {
      label: "Ver detalles",
      click: () => navigateTo(`/clients/${row.id}`),
    },
    {
      label: "Editar",
      click: () => navigateTo(`/clients/edit/${row.id}`),
    },
    {
      label: "Eliminar",
      click: () => handlerRemoveItem(row.id),
    },
  ],
];

// Computed

// Async data call
const {
  data: dataClients,
  pending,
  error,
  execute
} = await useAsyncData("clients", async () =>
  client.from("client").select().order("created_at")
);

// Computed from data call

// Methods
const handlerRemoveItem = async (id) => {
  await client.from('client').delete().match({ id })
  execute()
}

// Lifecycle

// Provider

// UI
</script>

<template>
  <UButton @click="navigateTo('clients/create')" class="mb-4">Nuevo cliente</UButton>
  <UTable :columns="columns" :rows="dataClients.data">
    <template #address-data="{ row }">
      <span>
        {{ `${row.address_street}, ${row.address_county}` }}
      </span>
    </template>
    <template #created_at-data="{ row }">
      <span>
        {{ dayjs(row.created_at).format('DD/MM/YYYY') }}
      </span>
    </template>
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>
    </template>
  </UTable>
</template>
