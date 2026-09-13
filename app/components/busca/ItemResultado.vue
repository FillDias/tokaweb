<script setup lang="ts">
import { montarSlug } from '~~/shared/slug'
import BlocoCodigo from '~/components/base/BlocoCodigo.vue'
import SeloCompat from '~/components/base/SeloCompat.vue'

defineProps<{
  resultado: { fabricante: string; nome: string; codigo: string }
  compatibilidade?: 'direto' | 'adaptacao' | 'nao_serve' | 'sem_dados'
}>()
</script>

<template>
  <a
    :href="`/peca/${montarSlug(resultado.fabricante, resultado.nome, resultado.codigo)}`"
    class="flex items-center justify-between gap-3"
  >
    <div>
      <div class="text-[12.5px] font-bold text-mute tracking-wide">{{ resultado.fabricante }}</div>
      <div class="font-bold">{{ resultado.nome }}</div>
      <BlocoCodigo :codigo="resultado.codigo" />
    </div>
    <SeloCompat v-if="compatibilidade" :estado="compatibilidade" />
  </a>
</template>
