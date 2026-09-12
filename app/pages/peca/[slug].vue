<script setup lang="ts">
import { extrairCodigoDoSlug } from '~~/shared/slug'
import FichaCabecalho from '~/components/peca/FichaCabecalho.vue'
import FichaMetricas from '~/components/peca/FichaMetricas.vue'
import RelatosDefeito from '~/components/peca/RelatosDefeito.vue'
import ListaInstalacoes from '~/components/peca/ListaInstalacoes.vue'
import FichaVazia from '~/components/peca/FichaVazia.vue'

const route = useRoute()
const codigo = extrairCodigoDoSlug(route.params.slug as string)

const { data: peca, error } = await useFetch(`/api/peca/${codigo}`)

const descricao = computed(() => {
  if (!peca.value) return 'Peça não encontrada na TOKA.'
  const { fabricante, nome, codigo, estatisticas } = peca.value
  if (estatisticas.totalRegistros > 0) {
    const nota = estatisticas.notaMedia!.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
    const registros =
      estatisticas.totalRegistros === 1
        ? '1 instalação registrada'
        : `${estatisticas.totalRegistros} instalações registradas`
    return `${registros}, nota média ${nota}. Veja o que os donos relatam sobre a ${fabricante} ${nome}.`
  }
  return `Ficha da peça ${codigo} — ${fabricante} ${nome}. Ainda sem instalações registradas na TOKA.`
})

useSeoMeta({
  title: () => (peca.value ? `${peca.value.nome} — ${peca.value.codigo} | TOKA` : 'Peça não encontrada | TOKA'),
  description: descricao,
  ogTitle: () => (peca.value ? `${peca.value.fabricante} ${peca.value.nome}` : undefined),
  ogDescription: descricao,
  robots: () => (error.value ? 'noindex' : undefined)
})

useHead({
  script: () =>
    peca.value
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: peca.value.nome,
              brand: { '@type': 'Brand', name: peca.value.fabricante },
              mpn: peca.value.codigo,
              category: peca.value.categoria,
              ...(peca.value.estatisticas.totalRegistros > 0 && peca.value.estatisticas.notaMedia !== null
                ? {
                    aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: peca.value.estatisticas.notaMedia,
                      reviewCount: peca.value.estatisticas.totalRegistros
                    }
                  }
                : {})
            })
          }
        ]
      : []
})
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <p v-if="error">Peça não encontrada.</p>
    <template v-else-if="peca">
      <FichaCabecalho :peca="peca" />
      <template v-if="peca.estatisticas.totalRegistros > 0">
        <FichaMetricas :estatisticas="peca.estatisticas" />
        <RelatosDefeito :relatos-defeito="peca.relatosDefeito" />
        <ListaInstalacoes :instalacoes="peca.instalacoes" />
      </template>
      <FichaVazia v-else />
    </template>
  </div>
</template>
