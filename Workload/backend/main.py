from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from azure.storage.filedatalake import DataLakeServiceClient
from azure.identity import DefaultAzureCredential
import os

app = FastAPI()

# Configure CORS to allow requests from the frontend
origins = [
    "http://localhost:60006",
    "https://localhost:60006",
    "http://127.0.0.1:60006",
    "https://127.0.0.1:60006",
    "*" # Allow all for dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreateItemPayload(BaseModel):
    workspaceId: str
    itemId: str

@app.get("/")
async def root():
    print("Fase 0: Verificación de despliegue - Backend alcanzado")
    return {"message": "Hola desde el Backend de Fabric - Fase 0 Validada"}

@app.post("/CreateItem")
async def create_item(payload: CreateItemPayload):
    print(f"CreateItem llamado para Workspace: {payload.workspaceId}, Item: {payload.itemId}")
    
    try:
        # Construir la URL de OneLake
        account_name = "onelake"
        account_url = f"https://{account_name}.dfs.fabric.microsoft.com"
        
        # En un entorno real, aquí usaríamos el token OBO.
        # Para desarrollo local/Codespace, intentamos usar DefaultAzureCredential 
        # (asegúrate de haber hecho 'az login' en el Codespace si es necesario)
        credential = DefaultAzureCredential()
        
        service_client = DataLakeServiceClient(account_url=account_url, credential=credential)
        
        # Definir el sistema de archivos (FileSystem) y la ruta
        # En Fabric, el FileSystem suele ser el Workspace ID
        file_system_client = service_client.get_file_system_client(file_system=payload.workspaceId)
        
        # Ruta del archivo: <itemId>/Files/content.md
        # OneLake requiere que los datos de usuario estén bajo 'Files' o 'Tables'.
        file_path = f"{payload.itemId}/Files/content.md"
        
        # Crear el cliente de archivo
        file_client = file_system_client.get_file_client(file_path)
        
        # Contenido inicial
        initial_content = "# Nuevo Documento\n\nCreado desde el Backend de Fabric."
        
        # Crear y escribir (sobrescribir si existe)
        file_client.create_file()
        file_client.upload_data(initial_content, overwrite=True)
        
        print(f"Archivo creado exitosamente en: {file_path}")
        return {"message": "Archivo creado exitosamente", "path": file_path}

    except Exception as e:
        print(f"Error en CreateItem: {e}")
        # Retornamos 500 pero con el detalle para depuración
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/GetItemPayload/{workspace_id}/{item_id}")
async def get_item_payload(workspace_id: str, item_id: str):
    print(f"GetItemPayload llamado para Workspace: {workspace_id}, Item: {item_id}")
    
    try:
        # Construir la URL de OneLake
        account_name = "onelake"
        account_url = f"https://{account_name}.dfs.fabric.microsoft.com"
        
        credential = DefaultAzureCredential()
        service_client = DataLakeServiceClient(account_url=account_url, credential=credential)
        file_system_client = service_client.get_file_system_client(file_system=workspace_id)
        
        # Ruta del archivo: <itemId>/Files/content.md
        file_path = f"{item_id}/Files/content.md"
        
        file_client = file_system_client.get_file_client(file_path)
        
        # Leer el contenido del archivo
        download = file_client.download_file()
        content = download.readall().decode("utf-8")
        
        print(f"Contenido leído exitosamente de: {file_path}")
        return {"content": content}

    except Exception as e:
        print(f"Error en GetItemPayload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
