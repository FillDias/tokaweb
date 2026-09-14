<script setup lang="ts">
import { montarSlug } from '~~/shared/slug'

type Post = {
  id: string
  data: string
  custo: string | null
  oficina: string | null
  nota: number | null
  oQueDeuErrado: string | null
  peca: { fabricante: string; nome: string; codigo: string }
  veiculo: { marca: string; modelo: string; dono: string | null }
  fotos: string[]
  curtidas: number
  curtidoPorMim: boolean
}

const props = defineProps<{ post: Post }>()

const route = useRoute()
const { loggedIn } = useUserSession()

// espelha o total/estado local pra não esperar o servidor pra reagir
// ao clique — igual ao padrão de FaixaCompletarPerfil.vue
const curtidoLocal = ref(props.post.curtidoPorMim)
const totalLocal = ref(props.post.curtidas)
const enviando = ref(false)

const linkFicha = computed(
  () => `/peca/${montarSlug(props.post.peca.fabricante, props.post.peca.nome, props.post.peca.codigo)}`
)
const linkLogin = computed(() => `/entrar?redirect=${encodeURIComponent(route.path)}`)

function formatarEstrelas(nota: number | null): string {
  if (nota === null) return ''
  return '★'.repeat(nota) + '☆'.repeat(5 - nota)
}

function formatarCusto(custo: string | null): string | null {
  if (custo === null) return null
  return Number(custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const metaPartes = computed(() =>
  [props.post.nota ? formatarEstrelas(props.post.nota) : null, formatarCusto(props.post.custo), props.post.oficina].filter(
    Boolean
  )
)

async function alternarCurtida() {
  if (enviando.value) return
  enviando.value = true
  try {
    const resultado = curtidoLocal.value
      ? await $fetch(`/api/instalacao/${props.post.id}/curtida`, { method: 'DELETE' })
      : await $fetch(`/api/instalacao/${props.post.id}/curtida`, { method: 'POST' })
    curtidoLocal.value = resultado.curtido
    totalLocal.value = resultado.total
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <article class="bg-paper border-[0.5px] border-line rounded-xl p-4">
    <p class="text-[13.5px]">
      <span v-if="post.veiculo.dono" class="font-bold">@{{ post.veiculo.dono }}</span>
      instalou
      <a :href="linkFicha" class="font-bold underline">{{ post.peca.fabricante }} {{ post.peca.nome }}</a>
      no {{ post.veiculo.marca }} {{ post.veiculo.modelo }}
    </p>

    <p v-if="post.oQueDeuErrado" class="text-[14px] mt-2">"{{ post.oQueDeuErrado }}"</p>

    <div v-if="post.fotos.length > 0" class="flex gap-2 mt-3">
      <img
        v-for="url in post.fotos"
        :key="url"
        :src="url"
        alt="Foto da instalação"
        class="w-24 h-24 object-cover rounded-lg border border-line"
      >
    </div>

    <p v-if="metaPartes.length > 0" class="text-[12.5px] text-mute mt-3">{{ metaPartes.join(' · ') }}</p>

    <div class="mt-2.5">
      <button
        v-if="loggedIn"
        type="button"
        class="flex items-center gap-1.5 text-[13px]"
        :class="curtidoLocal ? 'text-shu font-bold' : 'text-mute'"
        :disabled="enviando"
        @click="alternarCurtida"
      >
        <span>{{ curtidoLocal ? '♥' : '♡' }}</span>
        <span>{{ totalLocal }} curtida{{ totalLocal === 1 ? '' : 's' }}</span>
      </button>
      <a v-else :href="linkLogin" class="flex items-center gap-1.5 text-[13px] text-mute">
        <span>♡</span>
        <span>{{ totalLocal }} curtida{{ totalLocal === 1 ? '' : 's' }}</span>
      </a>
    </div>
  </article>
</template>
