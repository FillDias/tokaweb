<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'

type Veiculo = {
  marca: string
  modelo: string
  ano: number
  motor: string
  km: number
}

defineProps<{
  veiculo?: Veiculo
}>()

const formatarKm = (km: number) => `${km.toLocaleString('pt-BR')} km`
</script>

<template>
  <div class="bg-ki-lo border-b border-ki-borda">
    <div class="max-w-[1180px] mx-auto px-5 py-3 flex items-center gap-3.5 flex-wrap">
      <template v-if="veiculo">
        <span class="text-[11.5px] tracking-wide text-ki-txt font-bold">SEU VEÍCULO</span>
        <span class="font-bold text-base">
          {{ veiculo.marca }} {{ veiculo.modelo }}
          <small class="font-normal text-mute text-[13px] ml-2">
            {{ veiculo.ano }} · {{ veiculo.motor }} · {{ formatarKm(veiculo.km) }}
          </small>
        </span>
        <Botao pill variante="ghost" class="ml-auto text-[13px]">trocar veículo</Botao>
      </template>
      <template v-else>
        <span class="text-mute text-[13px]">Nenhum veículo selecionado</span>
        <Botao pill variante="ghost" class="ml-auto text-[13px]">Selecionar veículo</Botao>
      </template>
    </div>
  </div>
</template>
