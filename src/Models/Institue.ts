export interface Institute {
  id: number;
  name: string;
  aliases: { alias: string[] };
  created_at?: string;
  updated_at?: string;
}
