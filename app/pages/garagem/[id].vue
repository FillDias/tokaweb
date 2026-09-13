<script setup lang="ts">
import CabecalhoGaragem from '~/components/veiculo/CabecalhoGaragem.vue'
import ListaModificacoes from '~/components/veiculo/ListaModificacoes.vue'
import GaragemVazia from '~/components/veiculo/GaragemVazia.vue'

const route = useRoute()
const id = route.params.id as string

const { data: veiculo, error } = await useFetch(`/api/garagem/${id}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Garagem não encontrada', fatal: true })
}

useSeoMeta({
  title: () => (veiculo.value ? `${veiculo.value.marca} ${veiculo.value.modelo} | TOKA` : 'Garagem | TOKA')
})
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <template v-if="veiculo">
      <CabecalhoGaragem :veiculo="veiculo" />
      <ListaModificacoes v-if="veiculo.sistemas.length > 0" :sistemas="veiculo.sistemas" />
      <GaragemVazia v-else />
    </template>
  </div>
</template>
