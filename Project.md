Entendido. Ajustamos el flujo de trabajo a tu ciclo **GitOps**: Editas en Antigravity $\rightarrow$ Push a GitHub $\rightarrow$ Pull en Visual Studio Codespace (donde corre el runtime).

Aquí tienes el plan de desarrollo incremental, diseñado para validar cada pieza del rompecabezas paso a paso, asegurando que la lógica de negocio (Python) y la UI se hablen correctamente a través de OneLake.

### **Fase 0: Sincronización y Configuración Base**
*Antes de empezar la lógica nueva, asegúrate de que el ciclo de despliegue funciona.*
1.  **Acción:** Haz un cambio trivial en un `print()` del Backend o un `console.log` del Frontend en Antigravity.
2.  **Git:** Commit & Push.
3.  **Codespace:** `git pull` y reinicia los servicios.
4.  **Validación:** Verifica que el cambio se refleje en los logs del Codespace. Esto confirma que tu tubería de desarrollo está lista.

---

### **Fase 1: Registro del Manifiesto (Identidad)**
*Objetivo: Que Fabric sepa que existe un "Markdown Document" y cómo llamarlo.*

1.  **Editar Manifiestos (Antigravity):**
    * [cite_start]En `Item.xml` (o `Item.json`), define el `JobType` o `ItemType` como `Org.MarkdownDoc`[cite: 247].
    * [cite_start]Define el nombre visible: "Markdown Document"[cite: 247].
    * [cite_start]Asegúrate de que el `WorkloadManifest.xml` tenga el `AppID` correcto de tu registro en Entra ID[cite: 244].
2.  **Git:** Push $\rightarrow$ Pull en Codespace.
3.  **Ejecución:**
    * Si modificaste `WorkloadManifest.xml`, es posible que debas reiniciar el DevGateway o actualizar la carga en el Workload Hub (en modo dev).
4.  **Prueba:** Ve a Fabric $\rightarrow$ Nuevo ítem. Deberías ver el icono y el nombre de tu documento. Si intentas crearlo, fallará (porque no hay backend aún), pero la UI ya lo reconoce.

---

### **Fase 2: Backend - Creación del Archivo (La "Mente")**
*Objetivo: Cuando Fabric dice "Crea esto", Python obedece y crea un archivo físico en OneLake.*

1.  **Código Backend (Python):**
    * Implementa el endpoint `CreateItem`.
    * **Lógica:**
        * [cite_start]Recibe el `workspaceId` y `itemId` del payload[cite: 278].
        * [cite_start]Obtén el token *On-Behalf-Of* (OBO) para Azure Storage[cite: 29].
        * Usa `azure-storage-file-datalake` para crear un archivo en:
            [cite_start]`https://<onelake_endpoint>/<workspaceId>/MarkdownStore/Files/<itemId>.md`[cite: 282].
        * [cite_start]Escribe un contenido inicial: `# Nuevo Documento`[cite: 25].
2.  **Git:** Push $\rightarrow$ Pull en Codespace $\rightarrow$ Reiniciar servicio Python.
3.  **Prueba:**
    * En Fabric: Crea el ítem "Markdown Document".
    * Resultado esperado: Fabric debe mostrar éxito (spinner se detiene).
    * Verificación: Usa OneLake File Explorer o Azure Storage Explorer para ver si el archivo `.md` apareció realmente en la carpeta.

---

### **Fase 3: Backend - Lectura de Payload (La "Memoria")**
*Objetivo: Que el Backend sepa leer el archivo que acaba de crear y enviárselo al Frontend.*

1.  **Código Backend (Python):**
    * [cite_start]Implementa el endpoint `GetItemPayload`[cite: 268].
    * **Lógica:**
        * Recibe el `itemId`.
        * Reconstruye la ruta del archivo en OneLake.
        * [cite_start]Lee el contenido del archivo `.md` como string[cite: 290].
        * [cite_start]Retorna un JSON: `{"content": "# Nuevo Documento"}`[cite: 291].
2.  **Git:** Push $\rightarrow$ Pull en Codespace $\rightarrow$ Reiniciar servicio Python.
3.  **Prueba:**
    * Abre el ítem en Fabric.
    * Aunque el Frontend aún no muestre nada, revisa los **Logs del Codespace** (Backend). Deberías ver la petición `GET /GetItemPayload` con status 200 y el contenido leído.

---

### **Fase 4: Frontend - Visualización (La "Cara")**
*Objetivo: Conectar los cables para que el usuario vea el texto.*

1.  **Código Frontend (React/JS):**
    * [cite_start]En el componente principal, usa el SDK de Fabric para llamar a `getItem()` al montar el componente (`useEffect`)[cite: 257].
    * Asigna el resultado (el JSON que viene de Python) a una variable de estado.
    * [cite_start]Renderiza un simple `<textarea>` que muestre ese estado[cite: 258].
2.  **Git:** Push $\rightarrow$ Pull en Codespace $\rightarrow$ Recompilar/Hot-reload Frontend.
3.  **Prueba:**
    * Refresca la página en Fabric.
    * Ahora deberías ver el texto `# Nuevo Documento` dentro de la caja de texto en tu iframe.

---

### **Fase 5: Ciclo Completo - Guardado (Persistencia)**
*Objetivo: Cerrar el círculo. Editar $\rightarrow$ Guardar $\rightarrow$ OneLake.*

1.  **Código Frontend:**
    * Añade un botón "Guardar".
    * [cite_start]Al hacer click, llama a la API del Workload Client para ejecutar una acción, pasando el contenido actual del `<textarea>`[cite: 259].
2.  **Código Backend:**
    * [cite_start]Implementa el endpoint `UpdateItem` (o como hayas nombrado la acción)[cite: 269].
    * **Lógica:**
        * Recibe el nuevo texto.
        * [cite_start]Sobrescribe el archivo `.md` existente en OneLake usando el SDK[cite: 293].
        * Devuelve `200 OK`.
3.  **Git:** Push $\rightarrow$ Pull en Codespace $\rightarrow$ Reiniciar ambos servicios.
4.  **Prueba:**
    * Escribe "Hola Mundo desde VS Code" en el editor de Fabric.
    * Dale a Guardar.
    * Recarga la página. Si el texto persiste, ¡tienes un workload funcional!

---

### **Fase 6: Limpieza y Pulido (Opcional para MVP)**
*Objetivo: Que no queden archivos basura y se vea bonito.*

1.  [cite_start]**Limpieza:** Implementa `DeleteItem` en el Backend para borrar el `.md` de OneLake cuando el usuario borre el ítem en Fabric[cite: 270].
2.  [cite_start]**Renderizado:** En el Frontend, integra una librería como `markdown-it` y agrega un toggle para ver el HTML renderizado en lugar del código fuente[cite: 261].

¿Te gustaría que generemos el código Python para la **Fase 2** (Crear el archivo en OneLake) ahora mismo para que lo pegues en Antigravity?