<script setup lang="ts">
withDefaults(
  defineProps<{
    codigo: string
    tamanho?: 'pequeno' | 'grande'
  }>(),
  { tamanho: 'pequeno' }
)
</script>

<template>
  <span
    v-if="tamanho === 'pequeno'"
    class="inline-block rounded font-dado text-[11.5px] text-ai bg-surface px-1.5 py-0.5"
  >{{ codigo }}</span>
  <div v-else class="rounded-lg bg-ai px-3.5 py-2.5">
    <div class="text-[10.5px] tracking-wide text-white/65">CÓDIGO DA PEÇA</div>
    <div class="font-dado text-xl text-ki mt-0.5">{{ codigo }}</div>
  </div>
</template>
