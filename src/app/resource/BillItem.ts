export class BillItem {
  name: string | undefined;
  cost: number | undefined;

  constructor(name: string, cost: number) {
    this.name = name;
    this.cost = cost;
  }
}
