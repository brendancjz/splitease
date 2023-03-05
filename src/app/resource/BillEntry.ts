import { BillItem } from "./BillItem";
import { Person } from "./Person";

export class BillEntry {
  billItem: BillItem;
  paidBy: Person;
  sharedBy: Person[];

  constructor(billItem: BillItem, paidBy: Person, sharedBy: Person[]) {
    this.billItem = billItem;
    this.paidBy = paidBy;
    this.sharedBy = sharedBy;
  }
}
