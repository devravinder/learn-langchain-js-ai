import { vectorStore } from "./vectorStore.js";

//===
import { loadPdfAsSingleDocument } from "./loaders/pdf-loader.js";
import { loadTextAsSigleDoc } from "./loaders/text-loader.js";



const pdfPath = "./data/Ravinder_Reddy _Full_Stack_Developer_ CV.pdf"
const pdfDocument = await loadPdfAsSingleDocument(pdfPath)

const mdPath = "./data/AI_developer_CV.md"
const mdDocument = await loadTextAsSigleDoc(mdPath)

async function seedDatabase(): Promise<void> {
  try {
    await vectorStore.delete({ filter: {} });

    await vectorStore.addDocuments([pdfDocument, mdDocument]);

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    console.log("close");
  }
}

seedDatabase().catch(console.error);
