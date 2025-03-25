
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface DatabaseTables {
  Tables: {
    [key: string]: {
      Row: Record<string, any>;
      Insert: Record<string, any>;
      Update: Record<string, any>;
    }
  }
}
