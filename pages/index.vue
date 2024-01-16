<script setup>
definePageMeta({
  layout: "login",
});

const user = useSupabaseUser();

const { auth } = useSupabaseClient();

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`;

const email = ref('yanielbf2015@gmail.com')

const password = ref('Yaniel123+++')

const login = () => {
  auth.signInWithPassword({
    email: email.value,
    password: password.value,
    options: { redirectTo },
  });
};

watchEffect(() => {
  if (user.value) {
    navigateTo("/dashboard");
  }
});
</script>

<template>
  <div class="w-1/3 mx-auto h-screen flex justify-center items-center">
    <UCard :ui="{base: 'w-full'}">
      <template #header>
        <h2 class="text-xl">Acceder</h2>
      </template>
      <UInput v-model="email" placeholder="Email"/>
      <div class="my-6"></div>
      <UInput v-model="password" type="password" placeholder="Contraseña" />
      <template #footer>
        <UButton @click="login" size="lg" block>Acceder</UButton>
      </template>
    </UCard>
  </div>
</template>
