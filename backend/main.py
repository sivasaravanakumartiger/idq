import os, sys, logging
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
    force=True
)
logger = logging.getLogger("app")

# --- FastAPI App ---
app = FastAPI(title="Simple FastAPI + React App")

# Serve static files (from vite build)
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

# Root route
@app.get("/")
async def serve_frontend():
    index_html = os.path.join(static_dir, "index.html")
    if os.path.exists(index_html):
        logger.info("Serving index.html for /")
        return FileResponse(index_html)
    logger.error("Frontend not built. index.html missing.")
    raise HTTPException(status_code=404, detail="Frontend not built.")
