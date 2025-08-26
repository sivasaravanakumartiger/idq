# dao/lakehouse_dao.py
from typing import List, Dict, Any, Optional, Tuple
from databricks import sql

from constants import WORKSPACE_HOST, DATABRICKS_TOKEN, CATALOG_NAME, DATABRICKS_SQL_HTTP_PATH
from models.column_metadata_model import ColumnMetadata
from utils.databricks_sql_connector import DatabricksConnector

class LakehouseDAO:
    @staticmethod
    def fetch_catalog_structure() -> List[Any]:
        query = """
        SELECT 
            table_catalog as catalog_name,
            table_schema as schema_name,
            table_name
        FROM system.information_schema.tables
        ORDER BY table_catalog, table_schema, table_name
        """
        
        try:
            with sql.connect(
                server_hostname=WORKSPACE_HOST,
                http_path=DATABRICKS_SQL_HTTP_PATH,
                access_token=DATABRICKS_TOKEN,
                timeout=15
            ) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query)
                    return cursor.fetchall()
        except Exception as e:
            raise Exception(f"Failed to fetch catalog structure: {str(e)}")

    @staticmethod
    def insert_row_dynamic(table_name: str, data_dict: Dict[str, Any]):
        placeholders = ", ".join(["?"] * len(data_dict))
        columns = ", ".join(data_dict.keys())
        values = tuple(data_dict.values())

        try:
            with sql.connect(
                server_hostname=WORKSPACE_HOST,
                http_path=DATABRICKS_SQL_HTTP_PATH,
                access_token=DATABRICKS_TOKEN,
                timeout=15
            ) as connection:
                cursor = connection.cursor()
                query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
                cursor.execute(query, values)
                cursor.close()
        except Exception as e:
            raise Exception(f"[DatabaseDAO] Error inserting into `{table_name}`: {e}")

    @staticmethod
    def merge_row_by_id(table_name: str, data_dict: Dict[str, Any]):
        all_columns = list(data_dict.keys())
        insert_columns = [c for c in all_columns if not (c == "rule_store_id" and data_dict[c] is None)]
        insert_values = [f"source.{c}" for c in insert_columns]
        update_columns = [c for c in all_columns if c != "rule_store_id"]
        values_tuple = tuple(data_dict.values())

        match_condition = "target.rule_store_id = source.rule_store_id"

        merge_sql = f"""
        MERGE INTO {table_name} AS target
        USING (SELECT {', '.join(['? AS ' + col for col in all_columns])}) AS source
        ON {match_condition}
        WHEN MATCHED THEN
          UPDATE SET {', '.join([f"target.{c} = source.{c}" for c in update_columns])}
        WHEN NOT MATCHED AND source.rule_store_id IS NULL THEN
          INSERT ({', '.join(insert_columns)})
          VALUES ({', '.join(insert_values)})
        """

        try:
            with sql.connect(
                server_hostname=WORKSPACE_HOST,
                http_path=DATABRICKS_SQL_HTTP_PATH,
                access_token=DATABRICKS_TOKEN,
                timeout=30
            ) as connection:
                cursor = connection.cursor()
                cursor.execute(merge_sql, values_tuple)
                cursor.close()
        except Exception as e:
            raise Exception(f"[LakehouseDAO] Error merging into `{table_name}`: {e}")

    @staticmethod
    def fetch_table_metadata(catalog: str, schema: str, table: str) -> List[ColumnMetadata]:
        query = f"""
            SELECT 
                c.column_name,
                c.data_type,
                c.comment,
                c.is_nullable,
                con.constraint_name,
                c.ordinal_position
            FROM system.INFORMATION_SCHEMA.COLUMNS AS c
            LEFT JOIN system.INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS con
                ON c.table_catalog = con.table_catalog
                AND c.table_schema = con.table_schema
                AND c.table_name = con.table_name
                AND c.column_name = con.column_name
            WHERE 
                c.table_catalog = '{catalog}' AND
                c.table_schema = '{schema}' AND
                c.table_name = '{table}'
            ORDER BY c.ordinal_position
        """
        
        try:
            with DatabricksConnector.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return [ColumnMetadata(*row) for row in rows]
        except Exception as e:
            raise Exception(f"Failed to fetch table metadata: {str(e)}")

    @staticmethod
    def upsert_rules(payload: Dict[str, Any]) -> int:
        from services.lakehouse_service import LakehouseService
        query = LakehouseService.build_merge_query(payload)
        return LakehouseDAO.execute_query(query, fetch_results=False)
    
    @staticmethod
    def execute_query(query: str, params: Optional[Tuple] = None, fetch_results: bool = True) -> Any:
        try:
            with DatabricksConnector.get_connection() as conn:
                with conn.cursor() as cursor:
                    if params:
                        cursor.execute(query, params)
                    else:
                        cursor.execute(query)
                    
                    if fetch_results:
                        rows = cursor.fetchall()
                        if hasattr(cursor, 'description') and cursor.description:
                            columns = [col[0] for col in cursor.description]
                            return [dict(zip(columns, row)) for row in rows]
                        return rows
                    else:
                        return cursor.rowcount
        except Exception as e:
            raise Exception(f"Failed to execute query: {str(e)}")