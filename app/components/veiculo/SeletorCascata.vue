<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import type { VeiculoAtivo } from '~~/shared/veiculo'

const emit = defineEmits<{
  confirmar: [VeiculoAtivo]
}>()

const { data: opcoesIniciais } = await useFetch('/api/veiculos/opcoes')

const marca = ref('')
const modelo = ref('')
const ano = ref<number | null>(null)
const motor = ref('')

const modelos = ref<string[]>([])
const anos = ref<number[]>([])
const motores = ref<string[]>([])

async function aoMudarMarca() {
  modelo.value = ''
  ano.value = null
  motor.value = ''
  anos.value = []
  motores.value = []
  modelos.value = marca.value
    ? (await $fetch('/api/veiculos/opcoes', { query: { marca: marca.value } })).modelos
    : []
}

async function aoMudarModelo() {
  ano.value = null
  motor.value = ''
  motores.value = []
  anos.value = modelo.value
    ? (await $fetch('/api/veiculos/opcoes', { query: { marca: marca.value, modelo: modelo.value } })).anos
    : []
}

async function aoMudarAno() {
  motor.value = ''
  motores.value = ano.value
    ? (await $fetch('/api/veiculos/opcoes', { query: { marca: marca.value, modelo: modelo.value, ano: ano.value } })).motores
    : []
}

function confirmar() {
  if (!marca.value || !modelo.value || !ano.value || !motor.value) return
  emit('confirmar', { marca: marca.value, modelo: modelo.value, ano: ano.value, motor: motor.value })
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-end">
    <div class="flex flex-col gap-1">
      <label class="text-[10.5px] text-mute tracking-wide">MARCA</label>
      <select
        v-model="marca"
        class="border border-line rounded px-2.5 py-2 text-[14.5px] bg-white"
        @change="aoMudarMarca"
      >
        <option value="" disabled>Selecione</option>
        <option v-for="m in opcoesIniciais?.marcas ?? []" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-[10.5px] text-mute tracking-wide">MODELO</label>
      <select
        v-model="modelo"
        :disabled="!marca"
        class="border border-line rounded px-2.5 py-2 text-[14.5px] bg-white disabled:opacity-50"
        @change="aoMudarModelo"
      >
        <option value="" disabled>Selecione</option>
        <option v-for="m in modelos" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-[10.5px] text-mute tracking-wide">ANO</label>
      <select
        v-model.number="ano"
        :disabled="!modelo"
        class="border border-line rounded px-2.5 py-2 text-[14.5px] bg-white disabled:opacity-50"
        @change="aoMudarAno"
      >
        <option value="" disabled>Selecione</option>
        <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
      </select>
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-[10.5px] text-mute tracking-wide">MOTOR</label>
      <select
        v-model="motor"
        :disabled="!ano"
        class="border border-line rounded px-2.5 py-2 text-[14.5px] bg-white disabled:opacity-50"
      >
        <option value="" disabled>Selecione</option>
        <option v-for="m in motores" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>
    <Botao :disabled="!motor" @click="confirmar">Ver peças</Botao>
  </div>
</template>
