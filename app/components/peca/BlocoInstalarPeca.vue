<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import FormularioInstalacao from '~/components/instalacao/FormularioInstalacao.vue'

const props = defineProps<{ pecaId: string }>()

const route = useRoute()
const { loggedIn } = useUserSession()

// guarda a própria ficha como destino pós-login — ver "Voltar para
// onde estava" em CONTEXT.md e docs/design/AUTENTICACAO.md. loggedIn
// só fica certo depois da hidratação no cliente (a página é servida
// via ISR, então o HTML em cache nunca carrega sessão — ver
// session.server.js do nuxt-auth-utils), o que é seguro aqui porque
// o conteúdo da ficha em si nunca depende de estar logado
const linkLogin = computed(() => `/entrar?redirect=${encodeURIComponent(route.path)}`)

const instalado = computed(() => route.query.instalado === '1')
const erroInstalacao = computed(() => route.query.erro === 'instalacao-invalida')
const erroFoto = computed(() => route.query.erro === 'foto-invalida')

const mostrarFormulario = ref(erroInstalacao.value || erroFoto.value)
</script>

<template>
  <div class="mb-8">
    <p v-if="instalado" class="bg-seiji-lo text-seiji text-[13.5px] rounded-lg px-4 py-3 mb-3">
      Instalação registrada. Obrigado por contribuir com o catálogo.
    </p>
    <p v-if="erroInstalacao" class="bg-shu-lo text-shu text-[13.5px] rounded-lg px-4 py-3 mb-3">
      Não deu pra registrar — confira os dados e tente de novo.
    </p>
    <p v-if="erroFoto" class="bg-shu-lo text-shu text-[13.5px] rounded-lg px-4 py-3 mb-3">
      Alguma foto não deu — só jpg, png ou webp, até 8 MB cada. Tente de novo.
    </p>

    <FormularioInstalacao v-if="loggedIn && mostrarFormulario" :peca-id="pecaId" />
    <Botao v-else-if="loggedIn" type="button" chapado @click="mostrarFormulario = true">
      Instalei essa peça
    </Botao>
    <Botao v-else :href="linkLogin" chapado>Instalei essa peça</Botao>
  </div>
</template>
