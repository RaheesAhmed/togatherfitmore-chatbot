import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { createAndStoreEmbeddings } from "./langchain_rag.js";

export const processUrl = async (url) => {
  const loader = new CheerioWebBaseLoader(url);

  const docs = await loader.load();

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new HtmlToTextTransformer();

  const sequence = splitter.pipe(transformer);

  const newDocuments = await sequence.invoke(docs);

  const vectorStore = await createAndStoreEmbeddings(newDocuments);

  return vectorStore;
};
