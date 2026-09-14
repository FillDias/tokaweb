<script setup lang="ts">
import SeletorCascata from '~/components/veiculo/SeletorCascata.vue'
import CartaoPost from '~/components/feed/CartaoPost.vue'
import type { VeiculoAtivo } from '~~/shared/veiculo'

const veiculoAtivo = useVeiculoAtivo()

function aoConfirmar(veiculo: VeiculoAtivo) {
  veiculoAtivo.value = veiculo
}

const { data: feed } = await useFetch('/api/feed')
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-5 py-16">
    <section class="bg-paper border border-line rounded-lg p-6">
      <h2 class="font-titulo font-bold text-sm tracking-wide mb-1">BUSCA POR APLICAÇÃO</h2>
      <p class="text-[12.5px] text-mute mb-4">só aparece o que encaixa no seu carro</p>
      <SeletorCascata @confirmar="aoConfirmar" />
    </section>

    <section class="mt-8 max-w-[640px]">
      <h2 class="font-titulo font-bold text-sm tracking-wide mb-4">INSTALAÇÕES RECENTES</h2>

      <p v-if="feed && feed.length === 0" class="text-[13.5px] text-mute">
        Nenhuma instalação registrada ainda — seja a primeira.
      </p>

      <div class="flex flex-col gap-4">
        <CartaoPost v-for="post in feed" :key="post.id" :post="post" />
      </div>
    </section>
  </div>
</template>
