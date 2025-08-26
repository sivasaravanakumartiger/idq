# main.py
import os
import sys
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to sys.path for module imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from controllers.ruleset_controller import ruleset_router
from controllers.test_suite_controller import test_suite_router
from controllers.lakehouse_controller import lakehouse_router

app = FastAPI(title="Niagara IDQ UI", version="1.0.0")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Include routers
app.include_router(ruleset_router, prefix="/manage_rulesets", tags=["Ruleset Management"])
app.include_router(test_suite_router, prefix="/test_suite_configuration", tags=["Test Suite Configuration"])
app.include_router(lakehouse_router, prefix="/lakehouse", tags=["Lakehouse Operations"])

# --- Frontend Routes ---
@app.get("/", response_class=HTMLResponse)
async def index_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/manage_rulesets", response_class=HTMLResponse)
async def ruleset_management_page(request: Request):
    """Renders the single page for creating and managing rulesets."""
    return templates.TemplateResponse("manage_rulesets.html", {"request": request})

@app.get("/test_suite_configuration", response_class=HTMLResponse)
async def test_suite_configuration_page(request: Request):
    return templates.TemplateResponse("test_suite_configuration.html", {"request": request})

@app.get("/manage_rulesets_test", response_class=HTMLResponse)
async def ruleset_management_page_test(request: Request):
    return templates.TemplateResponse("manage_rulesets_test.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)