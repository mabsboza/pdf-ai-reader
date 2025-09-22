import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii, toNamespace } from "./utils";
import { getEmbedding } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("pdf-reader");
    const namespace = pineconeIndex.namespace(toNamespace(fileKey));

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    console.log("Pinecone query result:", queryResult);
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbedding(query);
  console.log("Query embeddings:", queryEmbeddings);
  if (!queryEmbeddings) {
    throw new Error("Failed to generate embeddings for the query.");
  }
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("Pinecone matches:", matches);
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  const docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  console.log("Found docs for context:", docs);
  return docs.join("\n").substring(0, 3000);
}