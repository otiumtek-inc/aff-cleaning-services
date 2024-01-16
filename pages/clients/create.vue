<script setup>
// Props, emits, context, inject

// Nuxt

// Constant

// Data and composable data
const client = useSupabaseClient();

const state = reactive({
  name: undefined,
  phone: undefined,
  email: undefined,
  address_street: undefined,
  address_county: undefined,
  created_at: undefined,
});

const errorMessage = ref("");

// Computed

// Async data call

// Computed from data call

// Methods
const validate = (state) => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (!state.phone) errors.push({ path: "phone", message: "Required" });
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.address_street)
    errors.push({ path: "address_street", message: "Required" });
  if (!state.address_county)
    errors.push({ path: "address_county", message: "Required" });
  return errors;
};

const onSubmit = async (event) => {
  event.data.created_at = new Date();
  const { data, error } = await client
    .from("client")
    .upsert(event.data)
    .select()
    .single();
  console.log(error);
  if (error) errorMessage.value = error.message;
  else navigateTo("/clients");
};

// Lifecycle

// Provider

// UI
</script>

<template>
  <div>
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
      <UFormGroup label="Nombre" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Teléfono" name="phone">
        <UInput v-model="state.phone" />
      </UFormGroup>
      <UFormGroup label="Correo electrónico" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Dirección" name="address_street">
        <UInput v-model="state.address_street" />
      </UFormGroup>
      <UFormGroup label="Condado" name="address_county">
        <UInput v-model="state.address_county" />
      </UFormGroup>
      <div class="flex gap-1">
        <UButton type="submit"> Guardar </UButton>
        <UButton @click="navigateTo('/clients')" color="gray">
          Cancelar
        </UButton>
      </div>
    </UForm>
  </div>
</template>
