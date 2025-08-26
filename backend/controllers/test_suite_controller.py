# controllers/test_suite_controller.py
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from services.test_suite_service import TestSuiteService

test_suite_router = APIRouter()

@test_suite_router.get("/get_test_suite_names")
async def get_test_suite_names():
    try:
        result = TestSuiteService.get_test_suite_name_list()
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result.get("message", "Unknown error"))
        
        return {
            "status": "success",
            "data": result["data"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@test_suite_router.get("/get_test_suite_rules")
async def get_test_suite_rules():
    try:
        result = TestSuiteService.get_test_suite_rule_list()
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result.get("message", "Unknown error"))
        
        return {
            "status": "success",
            "data": result["data"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@test_suite_router.post("/save_test_suite")
async def save_rulesets(payload: Dict[str, Any]):
    try:
        if not payload or "testsuite_name" not in payload:
            raise HTTPException(status_code=400, detail="Invalid payload")

        TestSuiteService.create_testsuite(payload)
        return {"status": "success", "message": "Test suite created successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@test_suite_router.get("/get_testsuite_definition_info")
async def get_testsuite_definition_info():
    table = "niagara_catalog.idq.master_testsuite_definition_tbl_test"
    try:
        table_info = TestSuiteService.fetch_testsuite_definition_info(table)
        return {
            "status": "success",
            "message": "Test suite definitions fetched successfully.",
            "data": table_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch all rulesets: {str(e)}")