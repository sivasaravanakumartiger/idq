# services/test_suite_service.py
import logging
import json
from typing import Dict, Any, List

from dao.lakehouse_dao import LakehouseDAO

logger = logging.getLogger(__name__)

class TestSuiteService:
    @staticmethod
    def get_test_suite_name_list() -> Dict[str, Any]:
        table_name = "niagara_catalog.idq.master_testsuite_definition_tbl_test"
        query = f"""
            SELECT testsuite_name
            FROM {table_name}
        """

        try:
            rows = LakehouseDAO.execute_query(query)
            test_suite_names = [row['testsuite_name'] for row in rows] if rows else []
            return {"status": "success", "data": test_suite_names}
            
        except Exception as e:
            print(f"Error fetching test suite names: {str(e)}")
            return {"status": "error", "data": [], "message": str(e)}
    
    @staticmethod
    def get_test_suite_rule_list() -> Dict[str, Any]:
        query = f"""
            SELECT rule_store_id, catalog_name, schema_name, table_name, column_name,
                    function_name, function_param, dq_dimensions_name
                FROM niagara_catalog.idq.trans_rule_store_tbl_test
                WHERE is_active = true
                ORDER BY catalog_name, schema_name, table_name
        """
        try:
            rows = LakehouseDAO.execute_query(query)
            result = {}

            for row in rows:
                rule_store_id = row['rule_store_id']
                catalog = row['catalog_name']
                schema = row['schema_name']
                table = row['table_name']
                column = row['column_name']
                rule_type = row['function_name']
                params_str = row['function_param']
                dq_dim = row['dq_dimensions_name']
                
                try:
                    params = json.loads(params_str) if params_str else {}
                except Exception:
                    params = {}

                if catalog not in result:
                    result[catalog] = {}
                if schema not in result[catalog]:
                    result[catalog][schema] = {}
                if table not in result[catalog][schema]:
                    result[catalog][schema][table] = []

                result[catalog][schema][table].append({
                    "rule_type": rule_type,
                    "column": column,
                    "params": params.get("kwargs", params),
                    "dq_dimension": dq_dim,
                    "rule_store_id": rule_store_id
                })

            return {"status": "success", "data": result}
            
        except Exception as e:
            logger.error(f"Error fetching all rule summary by asset: {str(e)}", exc_info=True)
            return {"status": "error", "message": f"Failed to fetch rule summary: {str(e)}"}

    @staticmethod
    def create_testsuite(payload: Dict[str, Any]) -> int:
        testsuite_name = payload.get("testsuite_name")
        scheduled_type = payload.get("scheduled_type")
        quartz_cron = payload.get("schedule_quartz_cron")
        is_active = payload.get("is_active", True)
        start_date = payload.get("schedule_start_date")
        end_date = payload.get("schedule_end_date")

        query_check = """
            SELECT testsuite_id 
            FROM niagara_catalog.idq.master_testsuite_definition_tbl_test
            WHERE testsuite_name = ?
        """
        existing = LakehouseDAO.execute_query(query_check, (testsuite_name,))
        if existing:
            raise Exception(f"Test suite '{testsuite_name}' already exists.")

        table_info = payload.get("table_info", {})
        asset_list = ",".join(table_info.keys()) if table_info else None

        insert_query = """
            INSERT INTO niagara_catalog.idq.master_testsuite_definition_tbl_test
            (testsuite_name, asset_list, scheduled_type, schedule_quartz_cron,
             schedule_description, is_active, schedule_start_date, schedule_end_date)
            VALUES (?, ?, ?, ?, NULL, ?, ?, ?)
        """
        LakehouseDAO.execute_query(
            insert_query,
            (testsuite_name, asset_list, scheduled_type, quartz_cron, is_active, start_date, end_date),
            fetch_results=False
        )

        get_id_query = """
            SELECT testsuite_id 
            FROM niagara_catalog.idq.master_testsuite_definition_tbl_test
            WHERE testsuite_name = ?
        """
        result = LakehouseDAO.execute_query(get_id_query, (testsuite_name,))
        if not result:
            raise Exception("Failed to retrieve testsuite_id after insert.")
        testsuite_id = result[0]["testsuite_id"]

        for table, details in table_info.items():
            rule_ids = details.get("rule_store_id", [])
            for rule_id in rule_ids:
                insert_map = """
                    INSERT INTO niagara_catalog.idq.master_testsuite_rule_map_tbl_test
                    (testsuite_id, rule_store_id)
                    VALUES (?, ?)
                """
                LakehouseDAO.execute_query(insert_map, (testsuite_id, rule_id), fetch_results=False)

        return testsuite_id

    @staticmethod
    def fetch_testsuite_definition_info(table: str) -> List[Dict[str, Any]]:
        query = f"SELECT * FROM {table}"
        try:
            rows = LakehouseDAO.execute_query(query)
            return rows if rows else []
        except Exception as e:
            logger.error(f"Error fetching table info: {str(e)}", exc_info=True)
            raise Exception(f"Failed to fetch table info: {str(e)}")