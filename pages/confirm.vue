<script setup>
const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/dashboard");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <p class="u-text-black">Redirecting...</p>
  </div>
</template>
