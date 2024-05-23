from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
import os
from pprint import pprint
from langchain_groq import ChatGroq
from youtube_transcript_api import YouTubeTranscriptApi
import pickle
# import faiss
# from langchain.vectorstores import FAISS
import chromadb
from chromadb.utils import embedding_functions



load_dotenv()
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

from pprint import pprint
from langchain_groq import ChatGroq

def extract_transcript(youtube_url):  
    try:
        vid_id = youtube_url.split("=")[1] 
        transcript_text = YouTubeTranscriptApi.get_transcript(vid_id, languages = [
    "af", "ak", "sq", "am", "ar", "hy", "as", "ay", "az", "bn", "eu", "be", "bho", "bs", 
    "bg", "my", "ca", "ceb", "zh-Hans", "zh-Hant", "co", "hr", "cs", "da", "dv", "nl", 
    "en", "eo", "et", "ee", "fil", "fi", "fr", "gl", "lg", "ka", "de", "el", "gn", "gu", 
    "ht", "ha", "haw", "iw", "hi", "hmn", "hu", "is", "ig", "id", "ga", "it", "ja", "jv", 
    "kn", "kk", "km", "rw", "ko", "kri", "ku", "ky", "lo", "la", "lv", "ln", "lt", "lb", 
    "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "ne", "nso", "no", "ny", "or", "om", 
    "ps", "fa", "pl", "pt", "pa", "qu", "ro", "ru", "sm", "sa", "gd", "sr", "sn", "sd", 
    "si", "sk", "sl", "so", "st", "es", "su", "sw", "sv", "tg", "ta", "tt", "te", "th", 
    "ti", "ts", "tr", "tk", "uk", "ur", "ug", "uz", "vi", "cy", "fy", "xh", "yi", "yo", "zu"
]) 
        transcript= "" 
        
        for i in transcript_text: 
            transcript += " "+i["text"] 
        return transcript    
    except Exception as e: 
        raise e
        
def get_llm(model="llama3-70b-8192"):
    try: 
        GROQ_LLM = ChatGroq(model=model) 
        return GROQ_LLM
    except Exception as e: 
        raise e

# def load_embeddings(sotre_name, path):
#     with open(f"{path}/faiss_{sotre_name}.pkl", "rb") as f:
#         VectorStore = pickle.load(f)
#     return VectorStore

# def store_embeddings(docs, embeddings, sotre_name, path):
    
#     vectorStore = FAISS.from_documents(docs, embeddings)

#     with open(f"{path}/faiss_{sotre_name}.pkl", "wb") as f:
#         pickle.dump(vectorStore, f)

def chroma_embeddings(docs, query): 
    CHROMA_DATA_PATH = "chroma_data/"
    EMBED_MODEL = "all-MiniLM-L6-v2"
    COLLECTION_NAME = "demo_docs"
    client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBED_MODEL
    )
    collections = client.list_collections()
    if COLLECTION_NAME in [collection.name for collection in collections]:
        client.delete_collection(name=COLLECTION_NAME)
    else:
        print(f"Collection '{COLLECTION_NAME}' does not exist and cannot be deleted.")

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_func,
        metadata={"hnsw:space": "cosine"},
    )
    
    collection.add(
        documents=docs,
        ids=[f"id{i}" for i in range(len(docs))]
    )
    query_results = collection.query(
        query_texts=[query],
        n_results=3,
    )
    
    return query_results['documents']