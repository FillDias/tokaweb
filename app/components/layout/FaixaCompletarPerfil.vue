<script setup lang="ts">
const { user, fetch: recarregarSessao } = useUserSession()

const faltaDado = computed(() => !!user.value && (!user.value.cep || !user.value.telefone))
const mostrar = computed(() => faltaDado.value && !user.value?.perfilLembreteDispensado)

async function dispensar() {
  await $fetch('/api/auth/perfil/dispensar-lembrete', { method: 'POST' })
  await recarregarSessao()
}
</script>

<template>
  <div v-if="mostrar" class="bg-ki-lo border-b border-ki-borda">
    <div class="max-w-[1180px] mx-auto px-5 py-2.5 flex items-center gap-3 flex-wrap">
      <span class="text-[13px] text-ki-txt">Complete seu perfil com CEP e telefone para poder anunciar peças.</span>
      <a href="/conta" class="text-[13px] font-bold underline ml-auto">Completar</a>
      <button type="button" class="text-[13px] text-mute underline" @click="dispensar">Dispensar</button>
    </div>
  </div>
</template>
