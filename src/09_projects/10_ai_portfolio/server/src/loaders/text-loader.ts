import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { combineDocs } from "./loader-util.js";
import { randomUUID } from "crypto";

const loadTextDocs = async (pathOrBlob: string | Blob) => {
  const loader = new TextLoader(pathOrBlob);
  const docs = await loader.load();

  return docs;
};

export const loadTextAsSigleDoc=async(pathOrBlob: string | Blob)=>{
  const docs = await loadTextDocs(pathOrBlob);

  if (docs.length < 1) throw Error(`Empty Text file`);

  const metadata = docs[0]?.metadata!;
  metadata.id = randomUUID()
  metadata.text = { ...metadata.text, totalPages: 1, pageNumber: 1  };

  const fullDocument = combineDocs(docs, metadata);
  return fullDocument;
}