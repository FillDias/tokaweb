<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch('/api/auth/confirmar-email', { query: { token: route.query.token } })

useSeoMeta({ title: 'Confirmar email | TOKA', robots: 'noindex' })
</script>

<template>
  <div class="max-w-[420px] mx-auto px-5 py-24 text-center">
    <p v-if="data?.confirmado" class="text-seiji font-bold">Email confirmado.</p>
    <p v-else class="text-shu font-bold">Link inválido ou expirado.</p>
  </div>
</template>
