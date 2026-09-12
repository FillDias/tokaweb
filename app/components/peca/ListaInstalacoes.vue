<script setup lang="ts">
type Instalacao = {
  id: string
  data: string
  km: number | null
  custo: string | null
  oficina: string | null
  nota: number | null
  oQueDeuErrado: string | null
  veiculo: {
    marca: string
    modelo: string
    ano: number
    motor: string | null
    dono: string | null
  }
}

defineProps<{
  instalacoes: Instalacao[]
}>()

function linhaVeiculo(instalacao: Instalacao): string {
  const { marca, modelo, ano, motor } = instalacao.veiculo
  return [`${marca} ${modelo}`, ano, motor].filter(Boolean).join(' · ')
}

function linhaMeta(instalacao: Instalacao): string {
  const partes = [
    instalacao.veiculo.dono ? `@${instalacao.veiculo.dono}` : null,
    `instalada em ${formatarData(instalacao.data)}${instalacao.km ? ` aos ${instalacao.km.toLocaleString('pt-BR')} km` : ''}`,
    instalacao.oficina,
    formatarCusto(instalacao.custo)
  ]
  return partes.filter(Boolean).join(' · ')
}

function formatarData(data: string): string {
  const [ano, mes] = data.split('-')
  return `${mes}/${ano}`
}

function formatarCusto(custo: string | null): string | null {
  if (custo === null) return null
  return Number(custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarEstrelas(nota: number | null): string {
  if (nota === null) return ''
  return '★'.repeat(nota) + '☆'.repeat(5 - nota)
}
</script>

<template>
  <div class="mt-5">
    <p v-if="instalacoes.length === 0" class="text-[13.5px] text-mute">
      Nenhuma instalação registrada ainda.
    </p>

    <div
      v-for="instalacao in instalacoes"
      :key="instalacao.id"
      class="border-t border-line py-3.5 first:border-t-0"
    >
      <div class="font-bold text-sm">{{ linhaVeiculo(instalacao) }}</div>
      <div class="text-[11.5px] text-mute mt-0.5 mb-1">
        {{ linhaMeta(instalacao) }}
        <span v-if="instalacao.nota" class="text-ki">{{ formatarEstrelas(instalacao.nota) }}</span>
      </div>
      <p v-if="instalacao.oQueDeuErrado" class="text-[13.5px]">{{ instalacao.oQueDeuErrado }}</p>
    </div>
  </div>
</template>
