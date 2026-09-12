<script setup lang="ts">
import SeletorCascata from '~/components/veiculo/SeletorCascata.vue'
import type { VeiculoAtivo } from '~~/shared/veiculo'

const veiculoAtivo = useVeiculoAtivo()

function aoConfirmar(veiculo: VeiculoAtivo) {
  veiculoAtivo.value = veiculo
}
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <section class="bg-paper border border-line rounded-lg p-6">
      <h2 class="font-titulo font-bold text-sm tracking-wide mb-1">BUSCA POR APLICAÇÃO</h2>
      <p class="text-[12.5px] text-mute mb-4">só aparece o que encaixa no seu carro</p>
      <SeletorCascata @confirmar="aoConfirmar" />
    </section>
  </div>
</template>
