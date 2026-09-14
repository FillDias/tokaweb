<script setup lang="ts">
const route = useRoute()
const termoAtual = computed(() => (route.query.q as string) ?? '')

const { loggedIn, user } = useUserSession()

const navegacao = [
  { pt: 'Peças', jp: 'パーツ' },
  { pt: 'Minha garagem', jp: '愛車' },
  { pt: 'Livro de manutenção', jp: '整備手帳' },
  { pt: 'Feira', jp: '市場' },
  { pt: 'Oficinas', jp: '工場' },
  { pt: 'Guias', jp: 'ガイド' }
]
</script>

<template>
  <header class="bg-paper border-b border-line sticky top-0 z-40">
    <div class="max-w-[1180px] mx-auto px-5">
      <div class="flex items-center gap-4.5 py-3 flex-wrap">
        <a href="/" class="flex items-baseline gap-2 flex-none">
          <span class="font-titulo text-[26px] text-ki leading-none">トカ</span>
          <span class="font-titulo font-bold text-xl tracking-wide">TOKA</span>
        </a>

        <form
          data-testid="cabecalho-busca"
          method="get"
          action="/buscar"
          class="flex border-2 border-sumi rounded-[10px] overflow-hidden bg-white flex-1 order-3 w-full sm:order-none sm:w-auto"
        >
          <input
            name="q"
            :value="termoAtual"
            placeholder="Código da peça, nome ou fabricante — ex.: VSTB8-C1SS3"
            class="flex-1 border-0 px-3.5 py-2.5 text-[14.5px] outline-none min-w-0"
          >
          <button type="submit" class="border-0 bg-ki px-5 font-bold text-[14.5px]">Buscar</button>
        </form>

        <div class="flex gap-4 text-[12.5px] text-mute flex-none items-center">
          <a href="/garagem" class="text-center block">Garagem</a>
          <a href="/oficinas" class="text-center block">Oficinas</a>
          <template v-if="loggedIn">
            <a href="/conta" class="font-bold text-sumi" data-testid="cabecalho-usuario">{{ user?.nome ?? 'Minha conta' }}</a>
            <form method="post" action="/api/auth/logout">
              <button type="submit" class="text-mute underline">Sair</button>
            </form>
          </template>
          <a v-else :href="`/entrar?redirect=${encodeURIComponent(route.fullPath)}`" class="text-center block">Entrar</a>
        </div>
      </div>
    </div>

    <nav class="bg-ai text-white overflow-x-auto">
      <div class="max-w-[1180px] mx-auto px-5">
        <ul class="flex list-none flex-nowrap sm:flex-wrap">
          <li v-for="item in navegacao" :key="item.pt">
            <a href="#" class="block px-4.5 py-2.5 text-sm whitespace-nowrap border-r border-white/10">
              {{ item.pt }}<span class="text-[10.5px] opacity-60 ml-1.5">{{ item.jp }}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
