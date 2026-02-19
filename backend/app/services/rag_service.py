import os
import re
import glob
import requests as http_requests
from typing import List
from openai import OpenAI
from app.core.config import settings
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# Resolve paths relative to THIS file (services/ -> app/ -> backend/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Global variables for RAG
VECTOR_STORE = None
embeddings = None

# OpenAI client
client = None

# Ollama config (fallback)
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "gemma3:1b"

# Supported languages
LANGUAGE_PROMPTS = {
    "en": "Answer in English.",
    "hi": "Answer in Hindi using DEVANAGARI script (हिंदी में देवनागरी लिपि में जवाब दें). Do NOT use Arabic or Urdu script. Example: 'आपके पास अधिकार हैं' is correct. Use only Hindi words in देवनागरी.",
    "ta": "Answer in Tamil using Tamil script (தமிழில் பதிலளிக்கவும்).",
    "te": "Answer in Telugu using Telugu script (తెలుగులో సమాధానం ఇవ్వండి).",
    "bn": "Answer in Bengali using Bengali script (বাংলায় উত্তর দিন).",
    "mr": "Answer in Marathi using Devanagari script (मराठीत उत्तर द्या).",
    "kn": "Answer in Kannada using Kannada script (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ).",
    "gu": "Answer in Gujarati using Gujarati script (ગુજરાતીમાં જવાબ આપો).",
    "pa": "Answer in Punjabi using Gurmukhi script (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ).",
}

def get_openai_client():
    global client
    if client is None:
        api_key = settings.OPENAI_API_KEY
        if api_key:
            client = OpenAI(api_key=api_key)
            print("✅ OpenAI client initialized.")
        else:
            print("⚠️ No OpenAI API key. Will use Ollama fallback.")
    return client

def get_embeddings():
    global embeddings
    if embeddings is None:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return embeddings

def initialize_vector_store():
    global VECTOR_STORE

    # Auto-discover ALL .txt files in data/ and data/legal_texts/
    data_dir = os.path.join(BASE_DIR, "data")
    data_files = glob.glob(os.path.join(data_dir, "*.txt")) + \
                 glob.glob(os.path.join(data_dir, "legal_texts", "*.txt"))

    loaded_docs = []
    for data_path in data_files:
        if os.path.exists(data_path):
            try:
                loader = TextLoader(data_path, encoding="utf-8")
                loaded_docs.extend(loader.load())
                print(f"✅ Loaded: {data_path}")
            except Exception as e:
                print(f"⚠️ Error loading {data_path}: {e}")

    if not loaded_docs:
        print(f"❌ No legal data files found. Searched:\n" + "\n".join(data_files))
        return

    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(loaded_docs)
        VECTOR_STORE = FAISS.from_documents(documents=splits, embedding=get_embeddings())
        print(f"✅ Vector store initialized with {len(splits)} chunks from {len(loaded_docs)} docs.")
    except Exception as e:
        print(f"❌ Error creating vector store: {e}")


def call_openai(system_prompt: str, user_message: str) -> str:
    """Call OpenAI GPT for proper NLP reasoning."""
    ai = get_openai_client()
    if not ai:
        return None  # Signal to use fallback

    try:
        response = ai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.4,
            max_tokens=800,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"⚠️ OpenAI error: {e}. Falling back to Ollama.")
        return None  # Signal to use fallback


def call_ollama(prompt: str) -> str:
    """Call Ollama local LLM as fallback."""
    try:
        resp = http_requests.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.3, "num_predict": 512}
        }, timeout=90)
        resp.raise_for_status()
        return resp.json().get("response", "I could not generate a response.")
    except http_requests.exceptions.ConnectionError:
        return "⚠️ AI service unavailable. Please try again or call Women Helpline 181."
    except Exception as e:
        return f"⚠️ AI error: {str(e)}"


def strip_markdown(text: str) -> str:
    """Remove markdown formatting so the chat shows clean text."""
    text = re.sub(r'#{1,6}\s*', '', text)        # headings
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)  # **bold**
    text = re.sub(r'\*(.+?)\*', r'\1', text)      # *italic*
    text = re.sub(r'__(.+?)__', r'\1', text)      # __bold__
    text = re.sub(r'_(.+?)_', r'\1', text)        # _italic_
    text = re.sub(r'`(.+?)`', r'\1', text)        # `code`
    text = re.sub(r'^[-*•]\s+', '  ', text, flags=re.MULTILINE)  # bullets
    text = re.sub(r'^\d+\.\s+', '', text, flags=re.MULTILINE)    # numbered
    # Remove smart/curly quotes
    text = text.replace('\u201c', '').replace('\u201d', '')  # “ ”
    text = text.replace('\u2018', '').replace('\u2019', "'")  # ‘ ’
    text = text.replace('"', '')  # regular double quotes at start/end
    return text.strip()


SAKHI_SYSTEM_PROMPT = """You are Sakhi, a knowledgeable legal guide for women in India. You give REAL, USEFUL legal information.

CURRENT DATE: February 2026. 
IMPORTANT LEGAL UPDATE: As of July 1, 2024, the Indian Penal Code (IPC) has been replaced by the Bharatiya Nyaya Sanhita (BNS) 2023, and the Code of Criminal Procedure (CrPC) has been replaced by the Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023. Always use the new law names and section numbers. If a user refers to old IPC sections, you should mention the new BNS equivalent.

TRUTHFULNESS RULES:
- ONLY provide information from the LEGAL KNOWLEDGE provided below. This is real, verified Indian law.
- If the user asks about something NOT covered in the knowledge, say clearly: I do not have specific information about that in my legal database, but I strongly recommend calling the Women Helpline at 181 where free lawyers can guide you.
- NEVER invent law names, section numbers, procedures, or court orders that are not in the LEGAL KNOWLEDGE.
- Real women in danger may act on your advice. Accuracy is a matter of safety.

RESPONSE STRUCTURE (follow this order every time):
1. ONE short empathetic sentence (max 15 words). Example: I understand, this is a tough situation.
2. Then immediately give the LEGAL ANSWER with specific laws, rights, and sections from the LEGAL KNOWLEDGE below.
3. Then give EXACT STEPS the woman should take — where to go, what to say, what documents to carry.
4. End with ONE relevant helpline number (181 for Women Helpline, 112 for Police, 1091 for Domestic Abuse).

RULES:
- NEVER say you cannot help. You CAN help. That is your entire purpose.
- NEVER dodge or refuse a question. Always provide the best legal information you have.
- NEVER pad with excessive empathy or filler. Keep empathy to ONE sentence, then get to the useful info.
- Use ONLY facts from the LEGAL KNOWLEDGE provided. If a specific section number is not in the knowledge, describe the right without a number rather than making one up.
- NEVER use markdown, asterisks, or quotation marks in your response.
- Write in plain conversational text. Use simple everyday words.
- Be direct and informative. Every sentence should add value.

EXAMPLE OF A GOOD RESPONSE:
I hear you, and the law is on your side. Under the Protection of Women from Domestic Violence Act 2005, physical violence by your husband is a criminal offence. You have the right to continue living in your shared home even if it is not in your name. Here is what you should do: Go to your nearest police station and ask to file a Domestic Incident Report. Carry your Aadhaar card and marriage certificate. You can also call the Women Helpline at 181 to get connected to a free lawyer and a Protection Officer who will help you get a court order to stop the violence.

EXAMPLE OF A BAD RESPONSE (never do this):
That must be so hard. I hear you. You are brave. I am not sure about that but call 181. You deserve better. Stay strong.
"""


def web_search_legal(query: str) -> str:
    """Search the web for Indian legal info using DuckDuckGo."""
    try:
        from duckduckgo_search import DDGS
        search_query = f"Indian law women rights {query} site:indiacode.nic.in OR site:ncw.nic.in OR site:wcd.nic.in"
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(search_query, max_results=3):
                results.append(f"{r['title']}: {r['body']}")
        if results:
            return "\n\n".join(results)
    except Exception as e:
        print(f"Web search failed (non-critical): {e}")
    return ""


def query_rag(query_text: str, language: str = "en") -> str:
    global VECTOR_STORE

    if VECTOR_STORE is None:
        initialize_vector_store()
        if VECTOR_STORE is None:
            return "System is initializing. Please try again in a moment."

    # 1. Retrieve context from local vector store (more chunks for better coverage)
    docs = VECTOR_STORE.similarity_search(query_text, k=4)
    local_context = "\n\n".join([doc.page_content for doc in docs])

    # 2. Also search the web for latest legal info
    web_context = web_search_legal(query_text)
    
    # 3. Combine both sources
    if web_context:
        context = f"LOCAL LEGAL DATABASE:\n{local_context}\n\nLIVE WEB SEARCH RESULTS (verify before citing):\n{web_context}"
    else:
        context = local_context

    # 4. Build language-aware prompt
    lang_instruction = LANGUAGE_PROMPTS.get(language, LANGUAGE_PROMPTS["en"])

    full_system = f"{SAKHI_SYSTEM_PROMPT}\n\n{lang_instruction}\n\nLEGAL KNOWLEDGE:\n{context}"

    # 5. Try OpenAI first, fallback to Ollama
    result = call_openai(full_system, query_text)
    if result:
        return strip_markdown(result)

    # Fallback: Ollama
    ollama_prompt = f"{full_system}\n\nUSER'S MESSAGE: {query_text}\n\nSAKHI'S RESPONSE (plain text, no markdown):"
    return strip_markdown(call_ollama(ollama_prompt))
