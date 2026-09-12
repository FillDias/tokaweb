<script setup lang="ts">
import { extrairCodigoDoSlug } from '~~/shared/slug'
import FichaCabecalho from '~/components/peca/FichaCabecalho.vue'
import FichaMetricas from '~/components/peca/FichaMetricas.vue'

const route = useRoute()
const codigo = extrairCodigoDoSlug(route.params.slug as string)

const { data: peca, error } = await useFetch(`/api/peca/${codigo}`)
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <p v-if="error">Peça não encontrada.</p>
    <template v-else-if="peca">
      <FichaCabecalho :peca="peca" />
      <FichaMetricas :estatisticas="peca.estatisticas" />
    </template>
  </div>
</template>
