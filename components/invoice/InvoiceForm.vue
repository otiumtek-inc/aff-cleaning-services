<script setup>
import dayjs from "dayjs-ext";
// Props, emits, context, inject
const props = defineProps({
  invoiceEdit: {
    type: Number,
  },
  nextInvoice: {
    type: Number,
  },
  idClient: {
    type: String,
  }
});

const emit = defineEmits(["fireSave", "fireCancel"]);

// Nuxt

// Constant

// Data and composable data
const route = useRoute();

const client = useSupabaseClient();

const state = reactive({
  number: props.nextInvoice,
  subject: undefined,
  created_at: undefined,
  due_date: undefined,
  po_number: undefined,
  notes: undefined,
  status: 0,
  client_id: route.params.clientId,
});

const statusList = [{
  name: 'En edicion',
  value: 0
}, {
  name: 'Pendiente',
  value: 1,
}, {
  name: 'Pagada',
  value: 2
}]

const lines = ref([{ detail: "", qty: "", price: "" }]);

const errorMessage = ref("");

// Computed

// Async data call

// Computed from data call

// Methods
const addLines = () => {
  lines.value = lines.value.concat([{ detail: "", qty: "", price: "" }]);
};

const removeLines = (index) => {
  lines.value.splice(index, 1);
};

const validate = (state) => {
  const errors = [];
  if (!state.number) errors.push({ path: "number", message: "Required" });
  if (!state.subject) errors.push({ path: "subject", message: "Required" });
  if (!state.created_at)
    errors.push({ path: "created_at", message: "Required" });
  if (!state.due_date) errors.push({ path: "due_date", message: "Required" });
  return errors;
};

const onSubmit = async (event) => {
  if (props.invoiceEdit) {
  } else {
    const { data, error } = await client
      .from("invoice")
      .upsert(event.data)
      .select()
      .single();

    if (error) errorMessage.value = error.message;
    else {
      const lineData = lines.value.map((x) => {
        x.invoice_id = data.id;
        return x;
      });
      const { data1, error1 } = await client
        .from("invoice_line")
        .insert(lineData);

      if (error1) errorMessage.value = error.message;
      else emit("fireSave");
    }
  }
};

const loadInvoice = async () => {
  if (props.invoiceEdit) {
    const { data, error } = await client
      .from("invoice")
      .select(`*, invoice_line(*)`)
      .eq("id", props.invoiceEdit)
      .single();

    const { invoice_line, ...rest } = data;
    state.number = rest.number;
    state.status = rest.status;
    state.subject = rest.subject;
    state.po_number = rest.po_number;
    state.created_at = dayjs(rest.created_at).utc().format("YYYY-MM-DD");
    state.due_date = dayjs(rest.due_date).utc().format("YYYY-MM-DD");
    state.notes = rest.notes;
    lines.value = invoice_line;
  }
};

// Lifecycle
onMounted(loadInvoice);
 
watch(() => props.invoiceEdit, loadInvoice);

// Provider

// UI
</script>

<template>
  <div>
    <div class="font-medium text-lg mb-3" v-if="invoiceEdit">
      Editar factura
    </div>
    <div class="font-medium text-lg mb-3" v-else>Nueva factura</div>
    <UAlert
      v-if="errorMessage"
      class="mb-6"
      icon="i-heroicons-exclamation-circle"
      color="red"
      variant="solid"
      title="Ha ocurrido un error"
      :description="errorMessage"
    />
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="flex items-end">
        <div class="w-1/6 mb-2">{{ idClient }} - </div>
        <UFormGroup label="Número de factura" name="number" class="w-full">
          <UInput v-model="state.number" />
        </UFormGroup>
      </div>
      <UFormGroup label="Estado" name="status">
        <USelect v-model="state.status" :options="statusList" option-attribute="name" />
      </UFormGroup>
      <UFormGroup label="Asunto" name="subject">
        <UInput v-model="state.subject" />
      </UFormGroup>
      <UFormGroup label="Fecha de creación" name="created_at">
        <vue-date-picker v-model="state.created_at" :enable-time-picker="false" format="yyyy-MM-dd" />
      </UFormGroup>
      <UFormGroup label="Fecha de vencimiento" name="due_date">
        <vue-date-picker v-model="state.due_date" :enable-time-picker="false" format="yyyy-MM-dd" />
      </UFormGroup>
      <UFormGroup label="Número PO" name="po_number">
        <UInput v-model="state.po_number" />
      </UFormGroup>
      <UFormGroup label="Notas" name="notes">
        <UTextarea v-model="state.notes" />
      </UFormGroup>
      <div class="mb-6">
        <div class="mb-3 font-medium text-lg">Líneas</div>
        <div
          v-for="(item, index) in lines"
          :key="index"
          class="flex gap-3 mb-6"
        >
          <UFormGroup label="Servicio" name="detail" class="w-6/12">
            <UInput v-model="lines[index].detail" />
          </UFormGroup>
          <UFormGroup label="Unidades" name="unit" class="w-3/12">
            <UInput v-model="lines[index].qty" />
          </UFormGroup>
          <UFormGroup label="Precio" name="price" class="w-3/12">
            <UInput v-model="lines[index].price" />
          </UFormGroup>
          <div class="flex gap-2 items-end">
            <UButton size="xs" @click="addLines">+</UButton>
            <UButton
              size="xs"
              @click="removeLines(index)"
              :disabled="lines.length == 1 || index == 0"
              >-</UButton
            >
          </div>
        </div>
      </div>
      <div class="flex gap-1 mt-5">
        <UButton type="submit">Guardar</UButton>
        <UButton @click="$emit('fireCancel')" color="gray"> Cancelar </UButton>
      </div>
    </UForm>
  </div>
</template>
