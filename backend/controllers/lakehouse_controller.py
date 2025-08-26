# controllers/lakehouse_controller.py
from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any

from services.lakehouse_service import LakehouseService
from utils.databricks_sql_connector import DatabricksConnector

lakehouse_router = APIRouter()

@lakehouse_router.get("/catalogs/{catalog}/schemas")
async def get_schemas(catalog: str):
    try:
        schemas = LakehouseService.get_schemas_by_catalog(catalog)
        return schemas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@lakehouse_router.get("/catalogs/{catalog}/schemas/{schema}/tables")
async def get_tables_by_schema(catalog: str, schema: str):
    try:
        tables = LakehouseService.get_tables_by_schema(catalog, schema)
        return tables
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@lakehouse_router.get("/tables/details")
async def get_table_details(table_name: str = Query(...)):
    try:
        details = LakehouseService.get_table_details(table_name)
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@lakehouse_router.get("/tables/{catalog}/{schema}/{table}/columns")
async def get_column_details(catalog: str, schema: str, table: str):
    try:
        columns = LakehouseService.get_column_details(catalog, schema, table)
        return columns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@lakehouse_router.post("/execute-query")
async def execute_query(payload: Dict[str, Any]):
    try:
        query = payload.get('query')
        
        if not query:
            raise HTTPException(status_code=400, detail='No query provided')
            
        if not query.strip().lower().startswith('select'):
            raise HTTPException(status_code=400, detail='Only SELECT queries are allowed')

        conn = DatabricksConnector.get_connection()
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        
        columns = [column[0] for column in cursor.description]
        formatted_result = [dict(zip(columns, row)) for row in result]
        
        cursor.close()
        conn.close()
        
        return {
            'status': 'success',
            'data': formatted_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))