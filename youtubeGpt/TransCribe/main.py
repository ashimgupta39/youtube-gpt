from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from helper_functions import get_llm, extract_transcript, chroma_embeddings
from prompts import CHAT_TEMPLATE
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
import json 
from pydantic import BaseModel
# from qdrant_client import QdrantClient
# from qdrant_client.http import models
# from sentence_transformers import SentenceTransformer
# from langchain.vectorstores import Chroma
from sentence_transformers import SentenceTransformer
# from qdrant_client import QdrantClient
# from qdrant_client.http.models import Distance, VectorParams
import time
import chromadb
from chromadb.utils import embedding_functions

# from fastembed.embedding import DefaultEmbedding
# from qdrant_client import QdrantClient
# from qdrant_client.http.models import Distance, VectorParams
# import time
# from qdrant_client import QdrantClient
# from qdrant_client.http import models
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
# from transformers import pipeline
# from langchain.embeddings import HuggingFaceInstructEmbeddings
import pickle
# import faiss
# from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
app = FastAPI()
from langchain.chains.question_answering import load_qa_chain
from langchain.chains import LLMChain, SimpleSequentialChain
origins = [
    "http://localhost:3000",  # Frontend origin (React app running on localhost:3000)
    "http://127.0.0.1:3000",  # Another way of accessing localhost
    # Add any other origins you want to allow
    "http://localhost:3001",  # Frontend origin (React app running on localhost:3000)
    "http://127.0.0.1:3001",  # Another way of accessing localhost
    "http://localhost:3002",  # Frontend origin (React app running on localhost:3000)
    "http://127.0.0.1:3002",  # Another way of accessing localhost
    "http://0.0.0.0:3002",  # Another way of accessing localhost
    "http://100.25.147.28:3002",
    "http://100.25.147.28:3000",
    "http://100.25.147.28",
    "chrome-extension://*"
    # Add any other origins you want to allow
    
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def root():
    return {"hello": "world"}

# @app.post("/items")
# def create_items(item: dict):
#     items.append(item)
#     return items
from typing import Optional

class InputData(BaseModel):
    query: str
    youtube_link: Optional[str] = None  # Making youtube_link optional    # model_name: str

    
class OutputData(BaseModel):
    response: str

    
@app.post("/chat", response_model=OutputData)
def chatbot(input_data: InputData):
    try:

        print(input_data)
        query = input_data.query
        link = input_data.youtube_link
        # model_name = input_data.model_name
        if link:
            transcript = extract_transcript(link)
            # print(transcript)
            
            r_splitter = RecursiveCharacterTextSplitter(
                chunk_size=450,
                chunk_overlap=0,
                separators=["\n\n", "\n", " ", ""]
            )
            docs = r_splitter.split_text(transcript)
            info = chroma_embeddings(docs, query)
            info = info[0]
        else : 
            COLLECTION_NAME = "demo_docs"
            CHROMA_DATA_PATH = "chroma_data/"
            EMBED_MODEL = "all-MiniLM-L6-v2"
            embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=EMBED_MODEL
            )
            client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
            collection = client.get_collection(
                name=COLLECTION_NAME,
                # embedding_function=embedding_func,
                # metadata={"hnsw:space": "cosine"},
            )
            query_results = collection.query(
                query_texts=[query],
                n_results=3,
            )
            info = query_results['documents'][0]
            
            
        
        context = "" 
        for i in info: 
            context += i
        
        llm = get_llm()
        
        # memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input")
        
        template = CHAT_TEMPLATE
        prompt = PromptTemplate(
            input_variables=["context" , "human_input"],
            template=template,
        )
        final_prompt = prompt.format(context=context, human_input=query)
        response = llm.invoke(final_prompt)
        # Assuming response.content is a string, parse it into a dictionary
        # response_dict = json.loads(response.content)

        # Serialize the response dictionary to JSON
        return OutputData(response=response.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))