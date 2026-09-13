<script setup lang="ts">
const props = defineProps<{
  veiculo: { motor: string | null; kmAtual: number | null; dono: string | null }
}>()

const camposFaltando = computed(() => {
  const faltando: string[] = []
  if (!props.veiculo.motor) faltando.push('motor')
  if (!props.veiculo.kmAtual) faltando.push('km atual')
  if (!props.veiculo.dono) faltando.push('dono')
  return faltando
})

const completo = computed(() => camposFaltando.value.length === 0)
</script>

<template>
  <span
    class="inline-block rounded-md px-2.5 py-1 text-[11.5px] font-bold"
    :class="completo ? 'bg-seiji-lo text-seiji' : 'bg-ki-lo text-ki-txt'"
  >{{ completo ? 'Perfil completo' : `Falta preencher: ${camposFaltando.join(', ')}` }}</span>
</template>
