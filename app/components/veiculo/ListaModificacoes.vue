<script setup lang="ts">
import { montarSlug } from '~~/shared/slug'
import BlocoCodigo from '~/components/base/BlocoCodigo.vue'

type Modificacao = {
  id: string
  data: string
  km: number | null
  peca: { fabricante: string; nome: string; codigo: string; categoria: string }
}

defineProps<{
  sistemas: { categoria: string; itens: Modificacao[] }[]
}>()

function formatarData(data: string): string {
  const [ano, mes] = data.split('-')
  return `${mes}/${ano}`
}
</script>

<template>
  <div class="mt-5">
    <div v-for="sistema in sistemas" :key="sistema.categoria" class="mb-6">
      <h2 class="text-[12.5px] font-bold text-mute tracking-wide mb-2">{{ sistema.categoria }}</h2>
      <div class="bg-paper border border-line rounded-lg divide-y divide-line">
        <a
          v-for="item in sistema.itens"
          :key="item.id"
          :href="`/peca/${montarSlug(item.peca.fabricante, item.peca.nome, item.peca.codigo)}`"
          class="flex items-center justify-between gap-3 p-3.5"
        >
          <div>
            <div class="text-[12.5px] font-bold text-mute tracking-wide">{{ item.peca.fabricante }}</div>
            <div class="font-bold">{{ item.peca.nome }}</div>
            <BlocoCodigo :codigo="item.peca.codigo" />
          </div>
          <div class="text-[12px] text-mute text-right">
            {{ formatarData(item.data) }}
            <template v-if="item.km"><br>{{ item.km.toLocaleString('pt-BR') }} km</template>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
