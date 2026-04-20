export interface LevelCommission {
  id: number;
  level_no: number;
  level_name:string;
  commission_percentage: string;
  team_size: string;
  ir_direct:string;
  ir_commission:string;
  bima:string;
  created_at: string;
}

export interface LevelCapping{
  id:number;
  level_id:string;
  level_no:number;
  level_name:string;
  day_limit:string;
  week_limit:string;
  monthly_limit:string;
  created_at:string;
}