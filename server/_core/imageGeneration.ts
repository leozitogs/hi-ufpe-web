import { storagePut } from "../storage"; 
import { ENV } from "./env";

export type GenerateImageOptions = {
  prompt: string;
  userId?: string; 
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  if (!ENV.forgeApiUrl) {
    throw new Error("BUILT_IN_FORGE_API_URL is not configured");
  }
  if (!ENV.forgeApiKey) {
    throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
  }

  const ownerId = options.userId || "system";

  const baseUrl = ENV.forgeApiUrl.endsWith("/")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/`;
  const fullUrl = new URL(
    "images.v1.ImageService/GenerateImage",
    baseUrl
  ).toString();

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "connect-protocol-version": "1",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify({
      prompt: options.prompt,
      original_images: options.originalImages || [],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Image generation request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
    );
  }

  const result = (await response.json()) as {
    image: {
      b64Json: string;
      mimeType: string;
    };
  };
  
  const base64Data = result.image.b64Json;
  const buffer = Buffer.from(base64Data, "base64");

  // Cria o Blob com o tipo correto
  const blob = new Blob([buffer], { type: result.image.mimeType });
  const filename = `generated/${Date.now()}.png`;

  // [CORREÇÃO] Invertemos a ordem: (Blob, Nome, UserId)
  // O erro indicava que o primeiro argumento esperava um Blob, mas recebia uma string.
  const url = await storagePut(
    blob,      // 1º: O arquivo
    filename,  // 2º: O nome
    ownerId    // 3º: O dono
  );

  return {
    url,
  };
}