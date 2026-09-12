<script setup lang="ts">
type RelatosDefeito =
  | { modo: 'estatistica'; totalElegiveis: number; relatos: { texto: string; percentual: number }[] }
  | { modo: 'cru'; textos: string[] }

const LIMIAR_DESTAQUE = 15

defineProps<{
  relatosDefeito: RelatosDefeito
}>()
</script>

<template>
  <div class="bg-paper border border-line rounded-lg p-5 mt-5">
    <div class="flex items-baseline justify-between mb-3">
      <h2 class="font-titulo font-bold text-sm tracking-wide">O QUE OS DONOS RELATAM</h2>
      <span v-if="relatosDefeito.modo === 'estatistica'" class="text-xs text-mute">
        {{ relatosDefeito.totalElegiveis }} registros
      </span>
    </div>

    <div v-if="relatosDefeito.modo === 'estatistica'">
      <div
        v-for="relato in relatosDefeito.relatos"
        :key="relato.texto"
        class="flex items-center gap-3 mb-2"
      >
        <span class="text-[13.5px] w-[210px] shrink-0">{{ relato.texto }}</span>
        <span class="flex-1 h-3.5 bg-surface rounded overflow-hidden">
          <span
            class="block h-full"
            :class="relato.percentual >= LIMIAR_DESTAQUE ? 'bg-shu' : 'bg-ki'"
            :style="{ width: `${relato.percentual}%` }"
          />
        </span>
        <span class="text-[13px] font-bold w-10 text-right">{{ relato.percentual }}%</span>
      </div>
    </div>

    <p v-else-if="relatosDefeito.textos.length === 0" class="text-[13.5px] text-mute">
      Nenhum relato de defeito registrado ainda.
    </p>

    <ul v-else class="list-disc pl-5 space-y-1">
      <li v-for="texto in relatosDefeito.textos" :key="texto" class="text-[13.5px]">{{ texto }}</li>
    </ul>

    <p class="text-[12.5px] text-mute mt-3">
      Percentual sobre registros com mais de 6 meses de uso. Abaixo de 5 registros o
      produto mostra os textos crus, sem estatística.
    </p>
  </div>
</template>
