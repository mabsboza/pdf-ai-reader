/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/pinecone.ts

import { PineconeRecord} from "@pinecone-database/pinecone";

export async function chunkedUpsert(
  namespaceIndex: any, // ya es el namespace, no el index completo
  vectors: PineconeRecord[],
  chunkSize = 100
) {
  for (let i = 0; i < vectors.length; i += chunkSize) {
    const chunk = vectors.slice(i, i + chunkSize);
    await namespaceIndex.upsert(chunk); // ✅ Upsert sobre el namespace
  }
}
