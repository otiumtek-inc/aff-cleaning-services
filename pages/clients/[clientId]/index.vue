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
  { key: "status", label: "Estado" },
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
const invoices = computed(() => {
  return data.value.data?.invoice?.slice().sort((a, b) => {
    // Convierte las fechas a objetos Date y compáralos
    return new Date(b.number) - new Date(a.number);
  });
});

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

const handlerRemoveItem = async (id) => {
  await client.from('invoice').delete().match({ id })
  execute()
}

const showFormAction = (id) => {
  showForm.value = false;
  showForm.value = true;
  invoiceEdit.value = id;
};

const closeFormAction = (id) => {
  showForm.value = false;
  invoiceEdit.value = null;
};

// Lifecycle

// Provider

// UI
</script>

<template>
  <div class="flex gap-20">
    <div class="w-full md:w-7/12">
      <div class="mb-6">
        <div><strong>Identificador: </strong> {{ data?.data.client_invoice_id }}</div>
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
      <UTable :columns="columns" :rows="invoices">
        <template #id-data="{ row }">
          <span
            class="p-1 rounded"
            :class="{ 'bg-green-500 text-white': invoiceEdit == row.id }"
          >
            {{ row.id }}
          </span>
        </template>
        <template #number-data="{ row }">
          <div class="font-bold text-center">{{ `${data?.data.client_invoice_id}-${row.number}` }}</div>
        </template>
        <template #status-data="{ row }">
          <div v-if="row.status == 0" class="font-bold text-center text-gray-400">En edicion</div>
          <div v-if="row.status == 1" class="font-bold text-center text-red-400">Pendiente</div>
          <div v-if="row.status == 2" class="font-bold text-center text-green-400">Pagada</div>
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
    <div class="w-full md:w-5/12">
      <InvoiceForm
        :nextInvoice="invoices?.length ? parseInt(invoices[0].number) + 1 : 1"
        :idClient="data?.data.client_invoice_id"
        v-if="showForm"
        :invoiceEdit="invoiceEdit"
        @fire-save="save"
        @fire-cancel="closeFormAction"
      />
    </div>
  </div>
</template>
