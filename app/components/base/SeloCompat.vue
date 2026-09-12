<script setup lang="ts">
type Estado = 'direto' | 'adaptacao' | 'nao_serve' | 'sem_dados'

const props = defineProps<{
  estado: Estado
  texto?: string
}>()

const config: Record<Estado, { rotulo: string; classe: string }> = {
  direto: { rotulo: 'Encaixe direto', classe: 'bg-seiji-lo text-seiji' },
  adaptacao: { rotulo: 'Precisa de adaptação', classe: 'bg-ki-lo text-ki-txt' },
  nao_serve: { rotulo: 'Não serve', classe: 'bg-shu-lo text-shu' },
  sem_dados: { rotulo: 'Sem dados', classe: 'bg-surface text-mute' }
}

const atual = computed(() => config[props.estado])
const rotuloExibido = computed(() => props.texto ?? atual.value.rotulo)
</script>

<template>
  <span
    class="inline-block rounded-md px-2.5 py-1 text-[11.5px] font-bold"
    :class="atual.classe"
  >{{ rotuloExibido }}</span>
</template>
