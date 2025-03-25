
export interface DatabaseFunctions {
  Functions: {
    check_table_exists: {
      Args: {
        table_name: string
      }
      Returns: boolean
    }
    execute_sql: {
      Args: {
        sql: string
      }
      Returns: undefined
    }
  }
}
