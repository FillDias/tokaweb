<script setup lang="ts">
type Condicao = 'novo' | 'nos' | 'usado' | 'retirada' | 'sucata'

const props = defineProps<{
  condicao: Condicao
}>()

const config: Record<Condicao, { rotulo: string; classe: string }> = {
  novo: { rotulo: 'NOVO', classe: 'bg-seiji text-white' },
  nos: { rotulo: 'NOS', classe: 'bg-ki text-sumi' },
  usado: { rotulo: 'USADO', classe: 'bg-sumi text-white' },
  retirada: { rotulo: 'RETIRADA', classe: 'bg-sumi text-white' },
  sucata: { rotulo: 'SUCATA', classe: 'bg-shu text-white' }
}

const atual = computed(() => config[props.condicao])
</script>

<template>
  <span
    class="inline-block rounded-full px-3 py-1 text-[10.5px] font-bold tracking-wide"
    :class="atual.classe"
  >{{ atual.rotulo }}</span>
</template>
