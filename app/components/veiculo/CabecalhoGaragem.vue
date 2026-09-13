<script setup lang="ts">
defineProps<{
  veiculo: {
    marca: string
    modelo: string
    ano: number
    motor: string | null
    kmAtual: number | null
    dono: string | null
  }
}>()
</script>

<template>
  <div>
    <div v-if="veiculo.dono" class="text-[12.5px] font-bold text-mute tracking-wide">@{{ veiculo.dono }}</div>
    <h1 class="font-titulo text-2xl leading-tight mt-1 mb-1">{{ veiculo.marca }} {{ veiculo.modelo }}</h1>
    <div class="text-mute text-[14px]">
      {{ veiculo.ano }}
      <template v-if="veiculo.motor"> · {{ veiculo.motor }}</template>
      <template v-if="veiculo.kmAtual"> · {{ veiculo.kmAtual.toLocaleString('pt-BR') }} km</template>
    </div>
  </div>
</template>
