import { BillEntry } from "./BillEntry";
import { BillItem } from "./BillItem";
import { Person } from "./Person";
import { SplitEngine } from "./SplitEngine";

export class Bill {
  entries: BillEntry[];
  pools: Person[][];
  poolEntries: BillEntry[][];
  splitEngine: SplitEngine;
  solution: { personToPay: Person; personToReceive: Person; amount: string }[];

  constructor() {
    this.entries = [];
    this.pools = [];
    this.poolEntries = [];
    this.splitEngine = new SplitEngine();
    this.solution = [];
  }

  createNewBillEntry(billItem: BillItem, paidBy: Person, sharedBy: Person[]) {
    const newEntry = new BillEntry(billItem, paidBy, sharedBy);
    this.entries.push(newEntry);
  }

  deleteEntry(entry: BillEntry) {
    let idx = this.entries.indexOf(entry);
    if (idx > -1) {
      this.entries.splice(idx, 1);
    }
  }

  doesPersonHaveEntries(person: Person) {
    return !!this.entries.find((entry) => entry.paidBy.id === person.id);
  }

  getPersonEntries(person: Person) {
    return this.entries.filter((entry) => entry.paidBy.id === person.id);
  }

  runSplitEngine() {
    this.resetData();

    //find out all the pools
    this.entries.forEach((entry) => {
      if (!this.pools.includes(entry.sharedBy)) {
        this.pools.push(entry.sharedBy);

        let newPoolEntry: BillEntry[] = [];
        newPoolEntry.push(entry);
        this.poolEntries.push(newPoolEntry);
      } else {
        const idx = this.pools.indexOf(entry.sharedBy);
        this.poolEntries[idx].push(entry);
      }
    })

    //attach a splitengine to each pool along w the relevant entries

    for (let i = 0; i < this.pools.length; i++) {
      this.splitEngine.entries = this.poolEntries[i];
      this.splitEngine.doSplit(this.pools[i], this.poolEntries[i]);
      this.solution.push(...this.splitEngine.getSolution());
    }

    console.log("Solutions", this.solution)

  }

  isCompleted() {
    return this.solution.length !== 0;
  }

  generatePersonTotalItemCost(person: Person): number {
    let total: number = 0;
    let personEntries = this.entries.filter(
      (entry) => entry.paidBy.id === person.id
    );

    personEntries.forEach((entry) => {
      total += entry.billItem.cost ? entry.billItem.cost : 0;
    });

    return Number(total.toFixed(2));
  }

  resetData() {
    this.solution = [];
    this.poolEntries = [];
    this.pools = [];
  }
}
