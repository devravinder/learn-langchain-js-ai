import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { Document } from "@langchain/core/documents";
import fs from "fs/promises";


// utility to load pdf as documents ( or single document )

type LODER_TYPE = "WEB" | "FS";

const LODER_TYPE: LODER_TYPE = "FS";

const webLoader = async (path: string) => {
  const buffer = await fs.readFile(path);

  const pdfBlob = new Blob([buffer], { type: "application/pdf" });

  const loader = new WebPDFLoader(pdfBlob, {});

  return loader;
};

const fsLoader = (path: string) => {
  const loader = new PDFLoader(path);
  return loader;
};

const getLoader = async (path: string, loaderType: LODER_TYPE = "FS") => {
  if (loaderType == "WEB") return webLoader(path);
  return fsLoader(path);
};


export const loadPdfDocs = async (
  path: string,
  loaderType: LODER_TYPE = "FS"
) => {
  const loader = await getLoader(path, loaderType);

  const docs = await loader.load();

  return docs;
};


const combineDocs=(docs: Document<Record<string, any>>[])=>{

  if(!docs[0])
    throw Error("At lest one document is required")

  const metadata = docs[0]?.metadata

  metadata.pdf.totalPages=1
  metadata.loc.pageNumber=1

  const combinedDoc = new Document({
    pageContent: docs.map(doc => doc.pageContent).join('\n\n'),
    metadata
  });

  return combinedDoc
}


export const loadPdfDocument = async (
  path: string,
  loaderType: LODER_TYPE = "FS"
)=>{
  const docs = await loadPdfDocs(path, loaderType)

  if(docs.length<1)
    throw Error(`Empty PDF: {path}`)

  const fullDocument = combineDocs(docs)
  return fullDocument
}