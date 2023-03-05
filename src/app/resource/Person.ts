import { BillItem } from "./BillItem";

export class Person {
  id: number;
  name: string | undefined;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
