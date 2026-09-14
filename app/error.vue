<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'

const props = defineProps<{
  error: { statusCode: number; statusMessage?: string }
}>()
</script>

<template>
  <NuxtLayout>
    <div class="max-w-[1180px] mx-auto px-5 py-24 text-center">
      <h1 class="font-titulo text-2xl mb-3">
        {{ props.error.statusCode === 404 ? 'Página não encontrada' : 'Algo deu errado' }}
      </h1>
      <p class="text-mute mb-6">{{ props.error.statusMessage || 'Tente voltar pra home.' }}</p>
      <Botao href="/">Voltar pra home</Botao>
    </div>
  </NuxtLayout>
</template>
