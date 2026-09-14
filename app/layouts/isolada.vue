<script setup lang="ts">
// Layout de /entrar, /cadastro e /conta: sem Cabecalho, FaixaVeiculo
// nem Rodape — a pessoa está num fluxo e qualquer link é chance de
// abandono. Ver "Página isolada" em docs/design/AUTENTICACAO.md
</script>

<template>
  <div class="bg-surface min-h-screen flex flex-col items-center py-14 px-5 font-texto">
    <a href="/" class="flex items-baseline gap-2 mb-8">
      <span class="font-titulo text-[26px] text-ki leading-none">トカ</span>
      <span class="font-titulo font-bold text-xl tracking-wide text-sumi">TOKA</span>
    </a>
    <slot />
  </div>
</template>
