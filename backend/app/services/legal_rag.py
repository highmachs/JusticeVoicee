import os
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

class LegalRAGService:
    def __init__(self):
        # Resolve paths relative to this file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.vector_store_path = os.path.join(base_dir, "data", "faiss_index")
        self.legal_text_path = os.path.join(base_dir, "data", "legal_texts", "pwdva_summary.txt")
        self.vector_store = None
        
        # 1. Embeddings (using a lightweight local model or HuggingFace API)
        # using sentence-transformers/all-MiniLM-L6-v2 for speed/efficiency
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # 2. Vector Store
        if os.path.exists(self.vector_store_path):
            self.vector_store = FAISS.load_local(self.vector_store_path, self.embeddings, allow_dangerous_deserialization=True)
        else:
            self._create_knowledge_base()

        # 3. LLM (Groq)
        try:
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                print("⚠️ GROQ_API_KEY not found. Using dummy LLM for testing.")
                self.llm = None
            else:
                self.llm = ChatGroq(
                    temperature=0.3,
                    model_name="llama3-8b-8192",
                    api_key=api_key
                )
        except Exception as e:
            print(f"Error initializing Groq: {e}")
            self.llm = None


        # 4. Prompt Template (Sakhi Persona)
        self.sakhi_prompt = """You are 'Sakhi', a supportive sister and legal guide for women in rural India.
        
        Your Core Rules:
        1. **Trauma-Informed**: If the user mentions violence ("he hit me"), FIRST acknowledge their pain ("I am so sorry you are going through this"). Ask if they are safe now.
        2. **Safety First**: If there is immediate danger, tell them to run to a safe place or call 112/181.
        3. **Simple Language**: No legalese ("plaintiff", "petition"). Use "You", "Your Husband", "Police", "Court".
        4. **Actionable Advice**: Tell them exactly what to do (e.g., "Go to the Protection Officer", "Visit the One Stop Centre").
        5. **RAG Grounding**: Use the context below to answer legal questions. If the context doesn't have the answer, say "I don't know that specific law, but a lawyer at the One Stop Centre can help."

        Context:
        {context}

        User Question: {question}
        
        Answer (as Sakhi):"""

    def _create_knowledge_base(self):
        """Loads text, splits it, and builds the FAISS index."""
        if not os.path.exists(self.legal_text_path):
             # Fallback if file missing (should not happen in prod)
             print("Warning: Legal text not found.")
             return

        loader = TextLoader(self.legal_text_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = text_splitter.split_documents(documents)
        
        self.vector_store = FAISS.from_documents(docs, self.embeddings)
        self.vector_store.save_local(self.vector_store_path)
        print("✅ Knowledge Base Created.")

    def query(self, user_question: str) -> str:
        """Retrieves context and generates a response."""
        if not self.llm:
            return "I am Sakhi. I cannot connect to my brain right now (Missing API Key). But you can visit the nearest One Stop Centre."

        if not self.vector_store:
            return "I am Sakhi. My knowledge base is not ready yet. Please try again later."

        retriever = self.vector_store.as_retriever(search_kwargs={"k": 2})
        
        prompt = ChatPromptTemplate.from_template(self.sakhi_prompt)
        
        chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        return chain.invoke(user_question)

# Singleton
legal_rag_service = LegalRAGService()
