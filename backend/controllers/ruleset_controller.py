# controllers/ruleset_controller.py
from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional, Dict, Any
import json
import traceback

from services.lakehouse_service import LakehouseService
from dao.lakehouse_dao import LakehouseDAO

ruleset_router = APIRouter()

@ruleset_router.get("/create_ruleset")
async def home():
    return {"message": "Create ruleset endpoint"}

@ruleset_router.get("/catalog_structure")
async def get_full_structure():
    try:
        data = LakehouseService.get_catalog_structure()
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@ruleset_router.get("/get_rules")
async def get_rules():
    try:
        rules = LakehouseService.fetch_rules_by_library()
        rule_data = []
        for rule in rules:
            rule_dict = rule.__dict__.copy()
            
            if 'validation_params' in rule_dict and isinstance(rule_dict['validation_params'], list):
                processed_params = []
                for param in rule_dict['validation_params']:
                    if hasattr(param, '__dict__'):
                        processed_params.append(param.__dict__)
                    else:
                        processed_params.append(param)
                rule_dict['validation_params'] = processed_params
            else:
                rule_dict['validation_params'] = []

            rule_data.append(rule_dict)
        return rule_data
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@ruleset_router.get("/table_metadata")
async def table_metadata(
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        metadata = LakehouseService.get_table_metadata(catalog, schema, table)
        return {
            "status": "success",
            "data": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@ruleset_router.post("/add_rule_to_ruleset")
async def add_rule_to_ruleset(payload: Dict[str, Any]):
    try:
        if not payload:
            raise HTTPException(status_code=400, detail="Invalid JSON payload or missing 'rules' array.")

        table_name_to_insert = "niagara_catalog.idq.trans_rule_store_tbl_test"
        data_for_db_insert = []
        created_by_user = "UI_User"

        raw_function_params = payload.get("function_params_raw", {})
        if not isinstance(raw_function_params, dict):
            raw_function_params = {}

        function_param_db_format = json.dumps({"kwargs": raw_function_params})
        is_active = bool(payload.get("is_active", True))

        data_for_db_insert.append({
            "catalog_name": payload.get("catalog_name"),
            "schema_name": payload.get("schema_name"),
            "table_name": payload.get("table_name"),
            "library_name": payload.get("library_name"),
            "column_name": payload.get("column_name"),
            "function_name": payload.get("function_name"),
            "function_param": function_param_db_format,
            "dq_dimensions_name": payload.get("dq_dimensions_name"),
            "is_active": is_active,
            "created_by": created_by_user
        })

        LakehouseService.insert_data(table_name_to_insert, data_for_db_insert)

        return {"status": "success", "message": f"Rule inserted successfully into `{table_name_to_insert}`"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save rule: {str(e)}")

@ruleset_router.post("/upsert_rules")
async def upsert_rules(payload: Dict[str, Any]):
    try:
        if not payload or "rules" not in payload:
            raise HTTPException(status_code=400, detail="Invalid payload")
        
        affected_rows = LakehouseDAO.upsert_rules(payload)
        return {
            "status": "success",
            "message": "Rules Configured Successfully",
            "rows_affected": affected_rows
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save Rules: {str(e)}")

@ruleset_router.post("/save_rulesets")
async def save_rulesets(payload: Dict[str, Any]):
    try:
        if not payload or "rules" not in payload:
            raise HTTPException(status_code=400, detail="Invalid JSON payload or missing 'rules' array.")

        rules_to_process = payload.get("rules", [])
        if not rules_to_process:
            raise HTTPException(status_code=400, detail="No rules provided to save.")

        table_name_to_insert = "niagara_catalog.idq.trans_rule_store_tbl_test"
        data_for_db_insert = []
        created_by_user = "UI_User"

        for rule_data_from_js in rules_to_process:
            raw_function_params = rule_data_from_js.get("function_params_raw", {})
            if not isinstance(raw_function_params, dict):
                raw_function_params = {}

            function_param_db_format = json.dumps({"kwargs": raw_function_params})
            is_active_value = rule_data_from_js.get("is_active", True)

            data_for_db_insert.append({
                "catalog_name": rule_data_from_js.get("catalog_name"),
                "schema_name": rule_data_from_js.get("schema_name"),
                "table_name": rule_data_from_js.get("table_name"),
                "library_name": rule_data_from_js.get("library_name"),
                "column_name": rule_data_from_js.get("column_name"),
                "function_name": rule_data_from_js.get("function_name"),
                "function_param": function_param_db_format,
                "dq_dimensions_name": rule_data_from_js.get("dq_dimensions_name"),
                "is_active": is_active_value,
                "created_by": created_by_user
            })

        LakehouseService.insert_data(table_name_to_insert, data_for_db_insert)

        return {"status": "success", "message": f"Rules inserted successfully into `{table_name_to_insert}`"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save rules: {str(e)}")

@ruleset_router.get("/get_all_rule_summary")
async def get_all_rule():
    try:
        rule_summary = LakehouseService.fetch_all_rule_summary()
        return {"data": rule_summary}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch rules from the server: {str(e)}")

@ruleset_router.get("/get_rules_details")
async def get_rule_details_by_table(
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        rule_summary = LakehouseService.fetch_rule_details_by_table(catalog, schema, table)
        return {"data": rule_summary}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch all rule: {str(e)}")

@ruleset_router.put("/update_rule_by_id/{rule_store_id}")
async def update_rule_by_id(rule_store_id: int, payload: Dict[str, Any]):
    try:
        if not payload or not payload.get('function_params_raw'):
            raise HTTPException(status_code=400, detail="Invalid payload, missing function_params_raw.")

        updated_params = payload['function_params_raw']
        LakehouseService.update_rule_by_id(rule_store_id, updated_params)
        
        return {"status": "success", "message": f"Rule {rule_store_id} updated successfully."}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to update rule {rule_store_id}: {str(e)}")

@ruleset_router.delete("/delete_rule_by_id/{rule_store_id}")
async def delete_single_ruleset_rule(rule_store_id: int):
    try:
        LakehouseService.delete_single_rule_by_id(rule_store_id)
        return {
            "status": "success",
            "message": f"Rules for {rule_store_id} deleted successfully."
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to delete rule for {rule_store_id}: {str(e)}")

@ruleset_router.post("/delete_multiple_rules")
async def delete_multiple_rules(payload: Dict[str, Any]):
    try:
        rule_store_ids = payload.get("rule_store_ids")
        if not rule_store_ids or not isinstance(rule_store_ids, list):
            raise HTTPException(status_code=400, detail="Invalid payload, expected a list of rule_store_ids.")

        deleted_count = LakehouseService.delete_multiple_rules(rule_store_ids)
        return {
            "status": "success",
            "message": f"{deleted_count} rules deleted successfully."
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to delete multiple rules: {str(e)}")

@ruleset_router.get("/detail")
async def get_ruleset_detail_by_asset(
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        ruleset_detail = LakehouseService.fetch_ruleset_detail_by_asset(catalog, schema, table)
        if ruleset_detail:
            return {
                "status": "success",
                "data": ruleset_detail
            }
        else:
            raise HTTPException(status_code=404, detail=f"Rule for {catalog}.{schema}.{table} not found or has no rules.")
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch rule details for {catalog}.{schema}.{table}: {str(e)}")

@ruleset_router.get("/get_table_info")
async def get_table_info(
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        table_info = LakehouseService.fetch_table_info(catalog, schema, table)
        return {"data": table_info}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch all rules: {str(e)}")

@ruleset_router.get("/check_ruleset_existence")
async def check_ruleset_existence(
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        exists = LakehouseService.check_ruleset_existence(catalog, schema, table)
        return {
            "status": "success",
            "exists": exists
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to check rules existence: {str(e)}")