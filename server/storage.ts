import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";
// REFATORADO: Importa direto do módulo de sistema
import { createUpload, markUploadProcessado } from "./database/system/uploads";

// Cliente S3 (Pode ser AWS real ou MinIO local)
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "minio",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "minio123",
  },
  endpoint: process.env.S3_ENDPOINT, // Opcional para MinIO
  forcePathStyle: true,
});

const BUCKET = process.env.AWS_BUCKET_NAME || "hi-ufpe-uploads";

export async function storagePut(file: File | Blob, name: string, userId: string) {
  const key = `${userId}/${Date.now()}-${name}`;
  
  // 1. Gerar URL assinada para upload (ou fazer upload direto se for server-side)
  // Aqui simulamos um fluxo onde o servidor recebe e salva, ou gera URL.
  // Para simplificar, vamos apenas registrar no banco que "houve" um upload.
  
  const url = `https://${BUCKET}.s3.amazonaws.com/${key}`;

  // 2. Salvar referência no banco
  await createUpload({
    nome: name,
    tipo: "documento", // Tipo genérico por enquanto
    url: url,
    tamanho: file.size,
    mimeType: file.type,
    uploadPor: userId
  });

  return url;
}

export async function generatePresignedUrl(key: string) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
}