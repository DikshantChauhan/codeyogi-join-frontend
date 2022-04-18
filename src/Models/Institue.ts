import { Entity } from "./Entity";

export interface Institute extends Entity {
  name: string;
  aliases: { alias: string[] };
}
