# services/lakehouse_service.py
import logging
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from databricks import sql
from constants import WORKSPACE_HOST, DATABRICKS_TOKEN, CATALOG_NAME, DATABRICKS_SQL_HTTP_PATH, SCHEMA_NAME
from dao.lakehouse_dao import LakehouseDAO
from models.rule_master_model import ValidationRule, ValidationParameter
from models.table_info_model import TableInfo

logger = logging.getLogger(__name__)

class LakehouseService:
    _catalog_cache = []
    _last_fetch_time = None

    @classmethod
    def _refresh_cache(cls):
        if (not cls._catalog_cache or
            (cls._last_fetch_time and
             (datetime.now() - cls._last_fetch_time).seconds > 300)):
            try:
                fetched_data = LakehouseDAO.fetch_catalog_structure()
                cls._catalog_cache = fetched_data if fetched_data is not None else []
                cls._last_fetch_time = datetime.now()
                logger.info("Catalog cache refreshed successfully.")
            except Exception as e:
                logger.error(f"Error refreshing catalog cache: {str(e)}", exc_info=True)
                if cls._catalog_cache is None:
                    cls._catalog_cache = []

    @classmethod
    def get_catalog_structure(cls, catalog_filter=None, schema_filter=None):
        cls._refresh_cache()

        results = {
            'catalogs': set(),
            'schemas': set(),
            'tables': []
        }

        if not cls._catalog_cache:
            return {
                'catalogs': [],
                'schemas': [],
                'tables': []
            }

        for row in cls._catalog_cache:
            catalog_name = getattr(row, 'catalog_name', None)
            schema_name = getattr(row, 'schema_name', None)
            table_name = getattr(row, 'table_name', None)

            if catalog_name is None or schema_name is None or table_name is None:
                continue

            if catalog_filter and catalog_name != catalog_filter:
                continue
            if schema_filter and schema_name != schema_filter:
                continue

            results['catalogs'].add(catalog_name)
            results['schemas'].add(f"{catalog_name}.{schema_name}")
            results['tables'].append({
                'catalog': catalog_name,
                'schema': schema_name,
                'table': table_name,
                'full_name': f"{catalog_name}.{schema_name}.{table_name}"
            })

        return {
            'catalogs': sorted(results['catalogs']),
            'schemas': sorted(results['schemas']),
            'tables': results['tables']
        }

    @classmethod
    def get_schemas_by_catalog(cls, catalog: str) -> List[str]:
        schemas = cls.get_catalog_structure(catalog_filter=catalog)['schemas']
        return sorted([s.split('.')[1] for s in schemas if '.' in s and s.split('.')[1]])

    @classmethod
    def get_tables_by_schema(cls, catalog: str, schema: str) -> List[str]:
        structure = cls.get_catalog_structure(catalog_filter=catalog, schema_filter=schema)
        return [t['full_name'] for t in structure['tables']]

    @staticmethod
    def get_table_details(table_name: str) -> Dict[str, Any]:
        # Implementation depends on your specific requirements
        return {}

    @staticmethod
    def get_column_details(catalog: str, schema: str, table: str) -> List[Dict[str, Any]]:
        # Implementation depends on your specific requirements
        return []

    @staticmethod
    def insert_data(table_name: str, data_list: List[Dict[str, Any]]):
        if not isinstance(data_list, list):
            raise TypeError("Expected 'data_list' to be a list of dictionaries for bulk insertion.")
            
        for data_row in data_list:
            if not isinstance(data_row, dict):
                raise TypeError(f"Expected each item in 'data_list' to be a dictionary, but got type: {type(data_row)} with value: {data_row}")
            LakehouseDAO.insert_row_dynamic(table_name, data_row)

    @staticmethod
    def build_merge_query(payload: dict) -> str:
        rules = payload["rules"]
        table_name_to_merge = "niagara_catalog.idq.trans_rule_store_tbl_test"

        select_statements = []
        for r in rules:
            rule_store_id = r.get("rule_store_id")
            raw_function_params = r.get("function_param", {})
            if not isinstance(raw_function_params, dict):
                raw_function_params = {}
            function_param_db_format = json.dumps({"kwargs": raw_function_params})

            select_statements.append(f"""
                SELECT
                    {rule_store_id if rule_store_id else 'NULL'} AS rule_store_id,
                    '{r.get("operation", "")}' AS operation,
                    '{r.get("catalog_name", "")}' AS catalog_name,
                    '{r.get("schema_name", "")}' AS schema_name,
                    '{r.get("table_name", "")}' AS table_name,
                    '{r.get("library_name", "")}' AS library_name,
                    '{r.get("column_name", "")}' AS column_name,
                    '{r.get("function_name", "")}' AS function_name,
                    '{function_param_db_format}' AS function_param,
                    '{r.get("dq_dimensions_name", "")}' AS dq_dimensions_name,
                    {str(r.get("is_active", True)).lower()} AS is_active
            """.strip())

        source_sql = "\nUNION ALL\n".join(select_statements)

        merge_sql = f"""
        MERGE INTO {table_name_to_merge} AS target
        USING (
            {source_sql}
        ) AS source
        ON target.rule_store_id = source.rule_store_id
        WHEN MATCHED AND source.operation = 'update' THEN UPDATE SET
            target.catalog_name = source.catalog_name,
            target.schema_name = source.schema_name,
            target.table_name = source.table_name,
            target.library_name = source.library_name,
            target.column_name = source.column_name,
            target.function_name = source.function_name,
            target.function_param = source.function_param,
            target.dq_dimensions_name = source.dq_dimensions_name,
            target.is_active = source.is_active
        WHEN NOT MATCHED AND source.operation = 'insert' THEN INSERT (
            catalog_name, schema_name, table_name, library_name, column_name, function_name,
            function_param, dq_dimensions_name, is_active
        ) VALUES (
            source.catalog_name, source.schema_name, source.table_name, source.library_name, source.column_name,
            source.function_name, source.function_param,
            source.dq_dimensions_name, source.is_active
        )
        """
        return merge_sql.strip()
    
    @staticmethod
    def save_rules(table_name: str, data_list: List[Dict[str, Any]]):
        if not isinstance(data_list, list):
            raise TypeError("Expected 'data_list' to be a list of dictionaries.")

        for data_row in data_list:
            if not isinstance(data_row, dict):
                raise TypeError(f"Each row must be a dictionary, got {type(data_row)}")
            LakehouseDAO.merge_row_by_id(table_name, data_row)

    @staticmethod
    def fetch_rules_by_library() -> List[ValidationRule]:
        try:
            with sql.connect(
                server_hostname=WORKSPACE_HOST,
                http_path=DATABRICKS_SQL_HTTP_PATH,
                access_token=DATABRICKS_TOKEN,
                timeout=15
            ) as conn:
                cursor = conn.cursor()
                cursor.execute(f"""
                    SELECT tvr.validation_id, tvr.validation_library_name, tvr.validation_name, tvr.validation_desc, 
                        tvr.validation_type, tvr.validation_metrics, tvrp.parameter_index, tvrp.parameter_name, 
                        tvrp.parameter_label_name, tvrp.parameter_desc, tvrp.is_mandatory, tvrp.parameter_data_type, 
                        tvrp.allowed_values, tvrp.default_value 
                    FROM {CATALOG_NAME}.{SCHEMA_NAME}.master_validation_rules_tbl tvr 
                    INNER JOIN {CATALOG_NAME}.{SCHEMA_NAME}.master_validation_parameters_tbl tvrp 
                    ON tvr.validation_id = tvrp.validation_id 
                    WHERE tvr.is_active = 1 AND tvrp.is_active = 1 
                    ORDER BY tvr.validation_id, tvrp.parameter_index ASC
                """)
                rows = cursor.fetchall()
                cursor.close()

                rule_map = {}
                for row in rows:
                    rule_id = row[0]
                    if rule_id not in rule_map:
                        rule_map[rule_id] = {
                            "rule": ValidationRule(
                                validation_id=row[0],
                                validation_library_name=row[1],
                                validation_name=row[2],
                                validation_desc=row[3],
                                validation_type=row[4],
                                validation_metrics=row[5],
                                validation_params=[]
                            )
                        }

                    param = ValidationParameter(
                        param_index=row[6],
                        param_name=row[7],
                        param_label_name=row[8],
                        param_description=row[9],
                        param_required=row[10],
                        datatype=row[11],
                        allowed_values=row[12],
                        default_value=row[13]
                    )

                    rule_map[rule_id]["rule"].validation_params.append(param)

                return [entry["rule"] for entry in rule_map.values()]

        except Exception as e:
            raise Exception(f"Unknown Error: {str(e)}")

    @staticmethod
    def get_table_metadata(catalog: str, schema: str, table: str) -> List[Dict[str, Any]]:
        rows = LakehouseDAO.fetch_table_metadata(catalog, schema, table)
        result = []

        for row in rows:
            result.append({
                "column_name": row.column_name,
                "data_type": row.data_type,
                "description": row.comment,
                "constraints": row.constraint_name,
                "is_nullable": row.is_nullable
            })

        return result

    @staticmethod
    def fetch_all_rule_summary() -> List[Dict[str, Any]]:
        query = f"""
            SELECT 
                catalog_name,
                schema_name,
                table_name,
                COUNT(*) AS total_rules
            FROM 
                {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
            GROUP BY 
                catalog_name, schema_name, table_name
            ORDER BY catalog_name, schema_name, table_name
        """
        try:
            rows = LakehouseDAO.execute_query(query)
            return rows if rows else []
        except Exception as e:
            logger.error(f"Error fetching all rule summary by asset: {str(e)}", exc_info=True)
            raise Exception(f"Failed to fetch rule summary: {str(e)}")

    @staticmethod
    def fetch_rule_details_by_table(catalog: str, schema: str, table: str) -> List[Dict[str, Any]]:
        query = f"""
            SELECT
                rule_store_id,
                catalog_name,
                schema_name,
                table_name, 
                library_name,
                column_name,
                function_name,
                function_param,	
                dq_dimensions_name,	
                is_active
            FROM 
                {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
            where catalog_name='{catalog}'
            AND schema_name='{schema}'
            AND table_name='{table}'
        """
        try:
            rows = LakehouseDAO.execute_query(query)
            return rows if rows else []
        except Exception as e:
            logger.error(f"Error fetching all rule summary by asset: {str(e)}", exc_info=True)
            raise Exception(f"Failed to fetch rule summary: {str(e)}")

    @staticmethod
    def fetch_ruleset_detail_by_asset(catalog: str, schema: str, table: str) -> Optional[Dict[str, Any]]:
        query = f"""
            SELECT
                rule_store_id,
                catalog_name,
                schema_name,
                table_name,
                library_name,
                column_name,
                function_name,
                function_param,
                dq_dimensions_name,
                is_active,
                created_by,
                created_date,
                last_modified_date
            FROM {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
            WHERE catalog_name = '{catalog}'
              AND schema_name = '{schema}'
              AND table_name = '{table}'
            ORDER BY rule_store_id ASC
        """
        try:
            rows = LakehouseDAO.execute_query(query)
            if not rows:
                return None

            first_row = rows[0]
            expectations = []
            for row in rows:
                function_param_dict = json.loads(row.function_param) if row.function_param else {"kwargs": {}}
                kwargs_from_db = function_param_dict.get("kwargs", {})

                expectations.append({
                    "id": row.rule_store_id,
                    "validation_name": row.function_name,
                    "library": row.library_name,
                    "params": kwargs_from_db,
                    "validation_metrics": row.dq_dimensions_name,
                    "source": "Existing",
                    "severity": 1
                })

            return {
                "id": f"{catalog}.{schema}.{table}", 
                "ruleset_name": f"{table} Rules",
                "catalog_name": catalog,
                "schema_name": schema,
                "table_name": table,
                "asset_name": f"{catalog}.{schema}.{table}",
                "library_name": first_row.library_name,
                "created_by": first_row.created_by,
                "created_timestamp": first_row.created_date,
                "last_modified_timestamp": first_row.last_modified_date,
                "is_active": bool(first_row.is_active),
                "expectations": expectations
            }
        except Exception as e:
            logger.error(f"Error fetching ruleset detail for asset {catalog}.{schema}.{table}: {str(e)}", exc_info=True)
            raise Exception(f"Failed to fetch ruleset detail: {str(e)}")

    @staticmethod
    def delete_single_rule_by_id(rule_store_id: int) -> int:
        query = f"""
            DELETE FROM {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
            WHERE rule_store_id = ?
        """
        try:
            deleted_count = LakehouseDAO.execute_query(
                query, 
                params=(rule_store_id,), 
                fetch_results=False
            )
            logger.info(f"Deleted {deleted_count} rules for rule_store_id {rule_store_id}")
            return deleted_count
        except Exception as e:
            logger.error(f"Error deleting rule with rule_store_id {rule_store_id}: {str(e)}", exc_info=True)
            raise Exception(f"Failed to delete rule: {str(e)}")

    @staticmethod
    def delete_multiple_rules(rule_store_ids: List[int]) -> int:
        if not rule_store_ids:
            return 0
        
        placeholders = ','.join(['?'] * len(rule_store_ids))
        query = f"""
            DELETE FROM {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
            WHERE rule_store_id IN ({placeholders})
        """
        try:
            params_tuple = tuple(rule_store_ids)
            deleted_count = LakehouseDAO.execute_query(
                query, 
                params=params_tuple, 
                fetch_results=False
            )
            logger.info(f"Deleted {deleted_count} rules for IDs: {rule_store_ids}")
            return deleted_count
        except Exception as e:
            logger.error(f"Error deleting multiple rules for IDs {rule_store_ids}: {str(e)}", exc_info=True)
            raise Exception(f"Failed to delete multiple rules: {str(e)}")

    @staticmethod
    def update_rule_by_id(rule_store_id: int, updated_params: Dict[str, Any]) -> int:
        retries = 3
        delay = 1
        
        for i in range(retries):
            try:
                updated_date = datetime.now(timezone.utc).isoformat(timespec='milliseconds')
                function_param_json = json.dumps({"kwargs": updated_params})
                
                updated_column_name = updated_params.get('column_name')
                
                if updated_column_name:
                    query = f"""
                        UPDATE {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
                        SET 
                            function_param = ?,
                            column_name = ?,
                            last_modified_date = ?
                        WHERE rule_store_id = ?
                    """
                    params = (function_param_json, updated_column_name, updated_date, rule_store_id)
                else:
                    query = f"""
                        UPDATE {CATALOG_NAME}.{SCHEMA_NAME}.trans_rule_store_tbl_test
                        SET 
                            function_param = ?,
                            last_modified_date = ?
                        WHERE rule_store_id = ?
                    """
                    params = (function_param_json, updated_date, rule_store_id)
                    
                updated_count = LakehouseDAO.execute_query(
                    query, 
                    params=params, 
                    fetch_results=False
                )
                if updated_count == 0:
                    raise Exception(f"Rule with ID {rule_store_id} not found for update.")
                
                logger.info(f"Updated rule with ID {rule_store_id} on attempt {i+1}. Rows affected: {updated_count}")
                return updated_count

            except Exception as e:
                if 'ConcurrentAppendException' in str(e) and i < retries - 1:
                    logger.warning(f"Concurrent update detected for rule {rule_store_id}. Retrying... (Attempt {i+1}/{retries})")
                    import time
                    time.sleep(delay)
                    delay *= 2
                else:
                    logger.error(f"Error updating rule {rule_store_id} after {i+1} attempts: {str(e)}", exc_info=True)
                    raise Exception(f"Failed to update rule: {str(e)}")

    @staticmethod
    def fetch_table_info(catalog: str, schema: str, table: str) -> Dict[str, int]:
        query = f"""
            SELECT
            (SELECT COUNT(*) FROM {catalog}.{schema}.{table}) AS row_count,
            (SELECT COUNT(*) 
            FROM system.information_schema.columns 
            WHERE table_catalog = '{catalog}' 
                AND table_schema = '{schema}' 
                AND table_name = '{table}') AS column_count;
        """
        try:
            rows = LakehouseDAO.execute_query(query)
            if rows:
                row = rows[0]
                return TableInfo(row["row_count"], row["column_count"]).to_dict()
            else:
                return {"row_count": 0, "column_count": 0}
        except Exception as e:
            logger.error(f"Error fetching table info: {str(e)}", exc_info=True)
            raise Exception(f"Failed to fetch table info: {str(e)}")

    @staticmethod
    def check_ruleset_existence(catalog: str, schema: str, table: str) -> bool:
        query = f"""
            SELECT 1 FROM niagara_catalog.idq.trans_rule_store_tbl_test
            WHERE catalog_name = '{catalog}' AND schema_name = '{schema}' AND table_name = '{table}'
            LIMIT 1
        """
        try:
            rows = LakehouseDAO.execute_query(query)
            return len(rows) > 0
        except Exception as e:
            logger.error(f"Error checking ruleset existence for {catalog}.{schema}.{table}: {str(e)}", exc_info=True)
            raise Exception(f"Failed to check ruleset existence: {str(e)}")