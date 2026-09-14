<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variante?: 'primario' | 'ghost'
    pill?: boolean
    // sem sombra deslocada nem hover de deslocamento — pras telas de
    // autenticação, onde a ação principal não está isolada e a sombra
    // vira ruído. Ver "Botão chapado" em docs/design/AUTENTICACAO.md
    chapado?: boolean
    href?: string
    disabled?: boolean
  }>(),
  {
    variante: 'primario',
    pill: false,
    chapado: false
  }
)

const classes = computed(() => [
  'inline-flex items-center justify-center font-texto font-bold border-2 border-sumi transition-all',
  props.pill ? 'rounded-full px-6 py-3' : 'rounded-[10px] px-4 py-3',
  props.variante === 'primario'
    ? props.chapado
      ? 'bg-ki text-sumi'
      : 'bg-ki text-sumi shadow-[4px_4px_0_theme(colors.sumi)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_theme(colors.sumi)]'
    : 'bg-paper text-sumi'
])
</script>

<template>
  <a v-if="href" :href="href" :class="classes">
    <slot />
  </a>
  <button v-else :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
