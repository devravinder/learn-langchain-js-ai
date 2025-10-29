import { vectorStore } from "./vectorStore.js";

//===
import { loadPdfDocument } from "./pdf-loader.js";



const pdfPath = "./src/Ravinder_Reddy _Full_Stack_Developer_ CV.pdf"

const document = await loadPdfDocument(pdfPath)

async function seedDatabase(): Promise<void> {
  try {
    await vectorStore.delete({ filter: {} });

    await vectorStore.addDocuments([document]);

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    console.log("close");
  }
}

seedDatabase().catch(console.error);
