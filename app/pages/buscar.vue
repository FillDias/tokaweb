<script setup lang="ts">
import { montarSlug } from '~~/shared/slug'
import BlocoCodigo from '~/components/base/BlocoCodigo.vue'
import SeloCompat from '~/components/base/SeloCompat.vue'

const veiculoAtivo = useVeiculoAtivo()

const route = useRoute()
const termo = computed(() => (route.query.q as string) ?? '')

const { data: resultados } = await useFetch('/api/buscar', {
  query: { q: termo },
  watch: [termo]
})

useSeoMeta({
  title: () => (termo.value ? `Busca por "${termo.value}" | TOKA` : 'Buscar peça | TOKA')
})
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <h1 class="font-titulo text-2xl mb-6">
      {{ termo ? `Resultados para "${termo}"` : 'Digite um código, nome ou fabricante' }}
    </h1>

    <p v-if="termo && resultados?.length === 0" class="text-mute">
      Nenhuma peça encontrada para "{{ termo }}".
    </p>

    <ul v-else-if="resultados && resultados.length > 0" class="divide-y divide-line">
      <li v-for="resultado in resultados" :key="resultado.codigo" class="py-4">
        <a
          :href="`/peca/${montarSlug(resultado.fabricante, resultado.nome, resultado.codigo)}`"
          class="flex items-center justify-between gap-3"
        >
          <div>
            <div class="text-[12.5px] font-bold text-mute tracking-wide">{{ resultado.fabricante }}</div>
            <div class="font-bold">{{ resultado.nome }}</div>
            <BlocoCodigo :codigo="resultado.codigo" />
          </div>
          <SeloCompat v-if="veiculoAtivo" :estado="resultado.compatibilidade" />
        </a>
      </li>
    </ul>
  </div>
</template>
