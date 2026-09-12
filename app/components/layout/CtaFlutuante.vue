<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
</script>

<template>
  <div class="fixed right-5 bottom-5 z-50 flex flex-col gap-2 items-end">
    <Botao href="#" pill variante="ghost" class="hidden sm:inline-flex text-[13px]">
      Não achei minha peça
    </Botao>
    <Botao href="#" pill>✍ Registrar peça</Botao>
  </div>
</template>
