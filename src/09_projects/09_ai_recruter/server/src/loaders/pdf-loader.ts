import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import fs from "fs/promises";
import { combineDocs } from "./loader-util.js";
import { randomUUID } from "crypto";

// utility to load pdf as documents ( or single document )

type LODER_TYPE = "WEB" | "FS";

const LODER_TYPE: LODER_TYPE = "FS";

const webLoader = async (pathOrBlob: string | Blob) => {
  const pdfBlob =
    typeof pathOrBlob === "string"
      ? new Blob([await fs.readFile(pathOrBlob)], { type: "application/pdf" })
      : pathOrBlob;

  const loader = new WebPDFLoader(pdfBlob, {});

  return loader;
};

const fsLoader = (pathOrBlob: string | Blob) => {
  const loader = new PDFLoader(pathOrBlob);
  return loader;
};

const getLoader = async (
  pathOrBlob: string | Blob,
  loaderType: LODER_TYPE = "FS"
) => {
  if (loaderType == "WEB") {
    return await webLoader(pathOrBlob);
  }
  return fsLoader(pathOrBlob);
};

const loadPdfDocs = async (
  pathOrBlob: string | Blob,
  loaderType: LODER_TYPE = "FS"
) => {
  const loader = await getLoader(pathOrBlob, loaderType);

  const docs = await loader.load();

  return docs;
};

export const loadPdfAsSingleDocument = async (
  pathOrBlob: string | Blob,
  loaderType: LODER_TYPE = "FS"
) => {
  const docs = await loadPdfDocs(pathOrBlob, loaderType);

  if (docs.length < 1) throw Error(`Empty PDF`);

  const metadata = docs[0]?.metadata!;
  metadata.id = randomUUID()
  metadata.pdf = { ...metadata.pdf, totalPages: 1 };
  metadata.loc = { ...metadata.loc, pageNumber: 1 };

  const fullDocument = combineDocs(docs, metadata);
  return fullDocument;
};
