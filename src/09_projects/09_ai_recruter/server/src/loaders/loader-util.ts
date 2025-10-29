import { Document } from "@langchain/core/documents";

export const bufferToBlob = (buffer: ArrayBuffer) => new Blob([buffer]);

export const combineDocs = (docs: Document<Record<string, any>>[], metadata: Record<string, any>) => {
    if (!docs[0]) throw Error("At lest one document is required");
   
    const combinedDoc = new Document({
      pageContent: docs.map((doc) => doc.pageContent).join("\n\n"),
      metadata,
    });
  
    return combinedDoc;
  };