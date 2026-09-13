<script setup lang="ts">
import Cabecalho from '~/components/layout/Cabecalho.vue'
import FaixaVeiculo from '~/components/layout/FaixaVeiculo.vue'
import Rodape from '~/components/layout/Rodape.vue'
import CtaFlutuante from '~/components/layout/CtaFlutuante.vue'

const veiculoAtivo = useVeiculoAtivo()
</script>

<template>
  <div class="bg-surface text-sumi min-h-screen flex flex-col font-texto">
    <Cabecalho />
    <FaixaVeiculo :veiculo="veiculoAtivo ?? undefined" />
    <main class="flex-1">
      <slot />
    </main>
    <Rodape />
    <CtaFlutuante />
  </div>
</template>
