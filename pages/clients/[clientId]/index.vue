<script setup>
import dayjs from "dayjs-ext";
// Props, emits, context, inject

// Nuxt

// Constant

// Data and composable data
const route = useRoute();

const client = useSupabaseClient();

const columns = [
  { key: "id", label: "Id" },
  { key: "number", label: "Número de factura" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "amount", label: "Monto total" },
  { key: "actions" },
];

const items = (row) => [
  [
    {
      label: "Ver factura",
      click: () =>
        navigateTo(`/clients/${route.params.clientId}/invoice/${row.id}`),
    },
    {
      label: "Editar",
      click: () => showFormAction(row.id),
    },
    {
      label: "Eliminar",
      click: () => handlerRemoveItem(row.id),
    },
  ],
];

const invoiceEdit = ref(null);

const showForm = ref(false);

// Computed

// Async data call
const { data, pending, error, execute } = await useAsyncData(
  "client",
  async () =>
    client
      .from("client")
      .select(`*, invoice(*, invoice_line(*))`)
      .eq("id", route.params.clientId)
      .single()
);

// Computed from data call

// Methods
const getTotal = (lines) =>
  Math.round(
    lines.reduce((acc, item) => {
      return acc + item.qty * item.price;
    }, 0)
  ) || 0;

const save = () => {
  showForm.value = false;
  execute();
};

const showFormAction = (id) => {
  showForm.value = false
  showForm.value = true
  invoiceEdit.value = id
}

const closeFormAction = (id) => {
  showForm.value = false
  invoiceEdit.value = null
}

// Lifecycle

// Provider

// UI
</script>

<template>
  <div class="flex gap-20">
    <div class="w-full md:w-1/2">
      <div class="mb-6">
        <div><strong>Nombre: </strong> {{ data?.data.name }}</div>
        <div><strong>Teléfono: </strong>{{ data?.data.phone }}</div>
        <div><strong>Correo electrónico: </strong>{{ data?.data.email }}</div>
        <div>
          <strong>Dirección: </strong
          >{{ `${data?.data.address_street}, ${data?.data.address_county}` }}
        </div>
        <div>
          <strong>Dinero facturado: </strong>${{
            data?.data.invoice.reduce(
              (acc, it) => acc + getTotal(it.invoice_line),
              0
            )
          }}
        </div>
      </div>
      <UButton class="mb-4" @click="showFormAction()">Nueva factura</UButton>
      <UTable :columns="columns" :rows="data?.data?.invoice">
        <template #id-data="{ row }">
          <span class="p-1 rounded" :class="{'bg-green-500 text-white': invoiceEdit == row.id }">
            {{ row.id }}
          </span>
        </template>
        <template #created_at-data="{ row }">
          <span>
            {{ dayjs(row.created_at).utc().format("YYYY-MM-DD") }}
          </span>
        </template>
        <template #amount-data="{ row }">
          <span> ${{ getTotal(row.invoice_line) }} </span>
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
    </div>
    <div class="w-full md:w-1/2">
      <InvoiceForm
        v-if="showForm"
        :invoiceEdit="invoiceEdit"
        @fire-save="save"
        @fire-cancel="closeFormAction"
      />
    </div>
  </div>
</template>
