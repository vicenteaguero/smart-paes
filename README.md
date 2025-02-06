# SmartPAES

[Ir al Sitio Web](https://smartpaes.vicenteaguero.com)

Proyecto web para ayudar a estudiantes a prepararse para la Prueba de Acceso a la Educación Superior (PAES). Ofrece ensayos con lógica de descarte, niveles de confianza, temporizador y envío de respuestas a Google Apps Script. Además, incluye scripts de scraping en Python para procesar datos relacionados con carreras.

## Tecnologías

- **Front-End:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/).
- **Estilos:** CSS con modo claro/oscuro y variables de tema.
- **Persistencia:** Almacenamiento local con `localStorage` y con [Google Apps Script](https://www.google.com/script/start/).
- **Python (opcional):** Scripts en `smartpaes/scraping/` y notebooks en `notebooks/`.

## Funcionalidades Principales

1. **Ensayos con Descarte**

   - Marcar opciones “descartadas” con estrellas.
   - Seleccionar respuesta y nivel de confianza.
   - Temporizador que fuerza el envío al agotarse el tiempo.

2. **Envío de Respuestas**

   - Valida que todas las preguntas tengan respuesta y confianza distinta de “--”.
   - Envía respuestas (con `started_at` y `ended_at`) a Google Apps Script.

3. **Reanudación de Ensayos**
   - Almacena progreso en `localStorage`.
   - Permite continuar un ensayo en progreso o iniciar uno nuevo.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/smartpaes.git
   ```
2. Entrar a la carpeta `website`:
   ```bash
   cd smartpaes/website
   ```
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Iniciar modo desarrollo:
   ```bash
   npm run dev
   ```
   El proyecto estará en `http://localhost:5173` (o puerto similar).
5. Construir para producción:
   ```bash
   npm run build
   ```

## Despliegue en GitHub Pages

Este repositorio incluye un flujo de GitHub Actions (`.github/workflows/deploy.yml`) que:

1. Instala dependencias y ejecuta `npm run build`.
2. Despliega la carpeta `dist` a la rama `gh-pages`.
3. Soporta dominio personalizado en `CNAME` (p.ej., `smartpaes.vicenteaguero.com`).

## Futuras Funcionalidades

- [ ] Tutorial metodología “No estudies como Nacional”.
- [ ] Simulador de Ponderaciones.
- [ ] Explicación de la PAES y de las Carreras Universitarias.
- [ ] Agregar datos DEMRE Open Source.
- [ ] Simulador de postulaciones (listas de espera).
- [ ] Plantilla de habilidad de descarte.

---

¡Gracias por usar **SmartPAES**! Para sugerencias o errores, abre un _issue_ o envía un _pull request_.
