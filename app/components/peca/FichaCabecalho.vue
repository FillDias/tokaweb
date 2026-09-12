<script setup lang="ts">
import BlocoCodigo from '~/components/base/BlocoCodigo.vue'

defineProps<{
  peca: {
    fabricante: string
    nome: string
    codigo: string
    categoria: string
  }
}>()
</script>

<template>
  <div>
    <div class="text-[12.5px] font-bold text-mute tracking-wide">
      {{ peca.fabricante }} · {{ peca.categoria }}
    </div>
    <h1 class="font-titulo text-2xl leading-tight mt-1 mb-3">{{ peca.nome }}</h1>
    <BlocoCodigo :codigo="peca.codigo" tamanho="grande" />
  </div>
</template>
