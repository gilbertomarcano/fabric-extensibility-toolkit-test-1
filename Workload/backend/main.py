from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS to allow requests from the frontend
origins = [
    "http://localhost:60006",
    "https://localhost:60006",
    "http://127.0.0.1:60006",
    "https://127.0.0.1:60006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    print("Fase 0: Verificación de despliegue - Backend alcanzado")
    return {"message": "Hola desde el Backend de Fabric - Fase 0 Validada"}
