<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import { nomeProvedor } from '~~/shared/provedores'

const props = defineProps<{
  provedor: string
  email?: string | null
}>()

// nunca casa contas pelo email — só aponta o caminho certo. Ver
// "Conflito de email" em CONTEXT.md e Tela 5 em
// docs/design/AUTENTICACAO.md
const ehSocial = computed(() => props.provedor !== 'email')
const nome = computed(() => nomeProvedor(props.provedor))
</script>

<template>
  <div class="bg-ki-lo border-l-[3px] border-ki rounded-md px-4 py-3.5 mb-4">
    <p class="font-bold text-[14px] text-ki-txt mb-1">Essa conta entra {{ ehSocial ? 'pelo' : 'com' }} {{ nome }}</p>
    <p class="text-[13px] text-ki-txt mb-3">
      <template v-if="email">O email {{ email }} foi cadastrado {{ ehSocial ? `pelo ${nome}` : `com ${nome}` }}.</template>
      Use o mesmo caminho para entrar.
    </p>
    <Botao v-if="ehSocial" :href="`/api/auth/${provedor}`" variante="ghost" chapado class="h-11">
      Entrar com {{ nome }}
    </Botao>
    <p v-if="ehSocial" class="text-[12px] text-mute mt-2.5">Quer usar senha? Vincule depois em Minha conta.</p>
  </div>
</template>
