import { PutBucketPolicyCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

// cliente S3 genérico, não o SDK específico do MinIO — o mesmo código
// funciona contra o Cloudflare R2 só trocando endpoint/credenciais.
// Ver "a stack" em CONTEXT.md e PROJETO.md 4.4
const cliente = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: 'us-east-1', // MinIO ignora a região, mas o SDK exige o campo
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY ?? '',
    secretAccessKey: process.env.MINIO_SECRET_KEY ?? ''
  }
})

const ENDPOINT = process.env.MINIO_ENDPOINT ?? ''
const BUCKET = process.env.MINIO_BUCKET ?? 'toka'

const EXTENSAO_POR_TIPO: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

const TAMANHO_MAXIMO_BYTES = 8 * 1024 * 1024 // 8 MB

export type ArquivoRecebido = { data: Buffer; type?: string }

export function arquivoEhFotoValida(arquivo: ArquivoRecebido): boolean {
  return (
    !!arquivo.type &&
    arquivo.type in EXTENSAO_POR_TIPO &&
    arquivo.data.length > 0 &&
    arquivo.data.length <= TAMANHO_MAXIMO_BYTES
  )
}

// nunca o binário no banco — só a chave do objeto no MinIO. Ver
// "foto" em PROJETO.md 3.2
export async function enviarFoto(arquivo: ArquivoRecebido): Promise<string> {
  const extensao = EXTENSAO_POR_TIPO[arquivo.type!]
  const chave = `instalacao/${randomUUID()}.${extensao}`

  await cliente.send(new PutObjectCommand({ Bucket: BUCKET, Key: chave, Body: arquivo.data, ContentType: arquivo.type }))

  return chave
}

// foto de peça é conteúdo público da ficha, igual o resto — mesma
// regra de "nunca tem muro" do CONTEXT.md. URL assinada foi
// descartada: expira, e o crawler de imagem do Google pode revisitar
// bem depois do prazo, virando foto quebrada até o próximo recálculo
// do cache ISR. Bucket com policy de leitura pública (ver
// aplicarPoliticaLeituraPublica) resolve isso de vez
export function urlFoto(chave: string): string {
  return `${ENDPOINT}/${BUCKET}/${chave}`
}

// roda uma vez (script avulso), não em request — deixa o bucket com
// GetObject público pra qualquer chave, sem listagem nem escrita
export async function aplicarPoliticaLeituraPublica(): Promise<void> {
  const politica = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET}/*`]
      }
    ]
  }

  await cliente.send(new PutBucketPolicyCommand({ Bucket: BUCKET, Policy: JSON.stringify(politica) }))
}
