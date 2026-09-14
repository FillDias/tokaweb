<script setup lang="ts">
import Botao from '~/components/base/Botao.vue'
import { instalacaoSchema } from '~~/shared/schemas'

const props = defineProps<{ pecaId: string }>()

const hoje = new Date().toISOString().slice(0, 10)

const marca = ref('')
const modelo = ref('')
const ano = ref('')
const motor = ref('')
const data = ref(hoje)
const km = ref('')
const custo = ref('')
const oficina = ref('')
const nota = ref('')
const oQueDeuErrado = ref('')
const compatibilidade = ref('')

const erroValidacao = ref<string | null>(null)

// o servidor busca um veiculo com essa marca/modelo/ano/motor ou cria
// um na hora — o formulário nunca sabe o veiculoId de antemão. Ver
// "Como o formulário de instalação escolhe o veiculoId" em CONTEXT.md
function validarAntesDeEnviar(evento: Event) {
  const resultado = instalacaoSchema.safeParse({
    pecaId: props.pecaId,
    marca: marca.value,
    modelo: modelo.value,
    ano: ano.value,
    motor: motor.value,
    data: data.value,
    km: km.value,
    custo: custo.value,
    oficina: oficina.value,
    nota: nota.value,
    oQueDeuErrado: oQueDeuErrado.value,
    compatibilidade: compatibilidade.value
  })

  if (!resultado.success) {
    evento.preventDefault()
    erroValidacao.value = resultado.error.issues[0]?.message ?? 'Confira os dados.'
  }
}
</script>

<template>
  <div class="bg-paper border-[0.5px] border-line rounded-xl p-5">
    <h2 class="font-bold text-sm mb-4">Registrar instalação</h2>

    <form
      method="post"
      action="/api/instalacao"
      enctype="multipart/form-data"
      class="flex flex-col gap-4"
      @submit="validarAntesDeEnviar"
    >
      <input type="hidden" name="pecaId" :value="pecaId">

      <p v-if="erroValidacao" class="text-shu text-[13px]">{{ erroValidacao }}</p>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-[11.5px] text-mute uppercase tracking-wide font-medium mb-1">Veículo</legend>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="marca" name="marca" placeholder="Marca" required class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          <input v-model="modelo" name="modelo" placeholder="Modelo" required class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          <input v-model="ano" name="ano" type="number" placeholder="Ano" required class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          <input v-model="motor" name="motor" placeholder="Motor" required class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
        </div>
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <legend class="text-[11.5px] text-mute uppercase tracking-wide font-medium mb-1">Instalação</legend>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-[11px] text-mute">Data</span>
            <input v-model="data" name="data" type="date" required :max="hoje" class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] text-mute">Quilometragem</span>
            <input v-model="km" name="km" type="number" class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] text-mute">Custo (R$)</span>
            <input v-model="custo" name="custo" type="number" step="0.01" class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] text-mute">Oficina</span>
            <input v-model="oficina" name="oficina" placeholder="Opcional" class="h-10 border border-line rounded-lg px-3 text-[14px] focus:border-ki focus:outline-none">
          </label>
        </div>
      </fieldset>

      <label class="flex flex-col gap-1">
        <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">Compatibilidade</span>
        <select v-model="compatibilidade" name="compatibilidade" class="h-10 border border-line rounded-lg px-3 text-[14px] bg-white">
          <option value="">Não informar</option>
          <option value="direto">Encaixe direto</option>
          <option value="adaptacao">Precisou de adaptação</option>
          <option value="nao_serve">Não serve</option>
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">Nota</span>
        <select v-model="nota" name="nota" class="h-10 border border-line rounded-lg px-3 text-[14px] bg-white">
          <option value="">Não avaliar</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} estrela{{ n > 1 ? 's' : '' }}</option>
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">O que deu errado (se algo deu)</span>
        <textarea
          v-model="oQueDeuErrado"
          name="oQueDeuErrado"
          rows="3"
          placeholder="Opcional — o defeito, se apareceu algum"
          class="border border-line rounded-lg px-3 py-2 text-[14px] focus:border-ki focus:outline-none"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-[11.5px] text-mute uppercase tracking-wide font-medium">Fotos</span>
        <input
          name="fotos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="text-[13.5px] border border-line rounded-lg px-3 py-2 bg-white"
        >
        <span class="text-[11px] text-mute">Opcional — jpg, png ou webp, até 8 MB cada</span>
      </label>

      <Botao type="submit" chapado class="h-11 self-start">Registrar instalação</Botao>
    </form>
  </div>
</template>
