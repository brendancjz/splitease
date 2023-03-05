import { BillEntry } from "./BillEntry";
import { Person } from "./Person";
import { SplitEngine } from "./SplitEngine";

export class Bill {
  entries: BillEntry[] | undefined;
  pools: {group: Person[] | undefined}[] | undefined;
  splitEngine: SplitEngine | undefined;

  constructor() {
    this.entries = [];
    this.pools = [];
    this.splitEngine = new SplitEngine();
  }
}
