<script setup lang="ts">
import ItemResultado from '~/components/busca/ItemResultado.vue'

const veiculoAtivo = useVeiculoAtivo()

const route = useRoute()
const termo = computed(() => (route.query.q as string) ?? '')

const { data } = await useFetch('/api/buscar', {
  query: { q: termo },
  watch: [termo]
})

const resultados = computed(() => data.value?.resultados ?? [])
const proximas = computed(() => data.value?.proximas ?? [])

useSeoMeta({
  title: () => (termo.value ? `Busca por "${termo.value}" | TOKA` : 'Buscar peça | TOKA')
})
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <h1 class="font-titulo text-2xl mb-6">
      {{ termo ? `Resultados para "${termo}"` : 'Digite um código, nome ou fabricante' }}
    </h1>

    <ul v-if="resultados.length > 0" class="divide-y divide-line">
      <li v-for="resultado in resultados" :key="resultado.codigo" class="py-4">
        <ItemResultado
          :resultado="resultado"
          :compatibilidade="veiculoAtivo ? resultado.compatibilidade : undefined"
        />
      </li>
    </ul>

    <div v-else-if="termo">
      <p class="text-mute">Nenhuma peça encontrada para "{{ termo }}".</p>

      <template v-if="proximas.length > 0">
        <p class="text-mute mt-6 mb-2">Peças parecidas com o que você digitou:</p>
        <ul class="divide-y divide-line">
          <li v-for="proxima in proximas" :key="proxima.codigo" class="py-4">
            <ItemResultado :resultado="proxima" />
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>
