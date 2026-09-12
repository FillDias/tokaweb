<script setup lang="ts">
const props = defineProps<{
  estatisticas: {
    totalRegistros: number
    notaMedia: number | null
    precoMedio: number | null
  }
}>()

const nota = computed(() =>
  props.estatisticas.notaMedia === null
    ? '—'
    : props.estatisticas.notaMedia.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      })
)

const precoMedio = computed(() => {
  const valor = props.estatisticas.precoMedio
  if (valor === null) return '—'
  if (valor < 1000) return valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
  return `${(valor / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`
})
</script>

<template>
  <div class="grid grid-cols-3 border border-line rounded-lg overflow-hidden mb-4">
    <div class="p-3 text-center border-r border-line">
      <div class="text-[10.5px] text-mute tracking-wide">REGISTROS</div>
      <div class="font-titulo font-bold text-xl mt-0.5">
        {{ estatisticas.totalRegistros.toLocaleString('pt-BR') }}
      </div>
    </div>
    <div class="p-3 text-center border-r border-line">
      <div class="text-[10.5px] text-mute tracking-wide">NOTA</div>
      <div class="font-titulo font-bold text-xl mt-0.5">{{ nota }}</div>
    </div>
    <div class="p-3 text-center">
      <div class="text-[10.5px] text-mute tracking-wide">PREÇO MÉDIO</div>
      <div class="font-titulo font-bold text-xl mt-0.5">{{ precoMedio }}</div>
    </div>
  </div>
</template>
