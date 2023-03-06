import { BillEntry } from './BillEntry';
import { BillItem } from './BillItem';
import { Person } from './Person';

export class SplitEngine {
  groupName: string;
  group: Person[];
  spending: { person: Person; haveSpent: number; toSpend: number }[];
  solution: { personToPay: Person; personToReceive: Person; amount: string }[];
  entries: BillEntry[];

  constructor(groupName?: string, group?: Person[]) {
    this.groupName = groupName || '';
    this.group = group || [];
    this.spending = [];
    this.entries = [];

    for (let i = 0; i < this.group.length; i++) {
      this.spending.push({ person: this.group[i], haveSpent: 0, toSpend: 0 });
    }

    this.solution = [];
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

  doesPersonHaveEntries(person: Person) {
    return !!this.entries.find((entry) => entry.paidBy.id === person.id);
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

  getPersonEntries(person: Person) {
    return this.entries.filter((entry) => entry.paidBy.id === person.id);
  }

  doSplit() {
    for (let i = 0; i < this.group.length; i++) {
      if (this.group[i].name === '') {
        this.group[i].name = 'Person ' + (this.group[i].id + 1);
      }

      this.spending[i].haveSpent = this.generatePersonTotalItemCost(
        this.spending[i].person
      );
    }

    this.resetEngine();

    let totalPool: number = 0;
    this.spending.forEach((spender) => {
      totalPool += spender.haveSpent;
    });

    let eachPersonShouldSpend: number = totalPool / this.group.length;

    this.spending.forEach((spender) => {
      spender.toSpend = parseFloat(
        (eachPersonShouldSpend - spender.haveSpent).toFixed(2)
      );
    });

    let peopleToPay: { person: Person; amount: number }[] = [];
    let peopleToReceive: { person: Person; amount: number }[] = [];

    this.spending.forEach((spender) => {
      if (spender.toSpend < 0) {
        peopleToReceive.push({
          person: spender.person,
          amount: spender.toSpend,
        });
      }

      if (spender.toSpend > 0) {
        peopleToPay.push({
          person: spender.person,
          amount: spender.toSpend,
        });
      }
    });

    peopleToPay.sort((a, b) => a.amount - b.amount);
    peopleToReceive.sort((a, b) => b.amount - a.amount);
    this.runSolution(peopleToPay, peopleToReceive);
  }

  runSolution(
    peopleToPay: { person: Person; amount: number }[],
    peopleToReceive: { person: Person; amount: number }[]
  ) {
    while (peopleToPay.length !== 0 || peopleToReceive.length !== 0) {
      console.log('Running an iteration');
      let personToReceive = peopleToReceive.pop();
      let personToPay = peopleToPay.pop();

      if (personToReceive && personToPay) {
        //receiver needs more than payer will pay
        if (Math.abs(personToReceive.amount) > Math.abs(personToPay.amount)) {
          personToReceive.amount += personToPay.amount;
          peopleToReceive.push(personToReceive);

          this.solution.push({
            personToPay: personToPay.person,
            personToReceive: personToReceive.person,
            amount: personToPay.amount.toFixed(2),
          });
        } else if (
          Math.abs(personToReceive.amount) < Math.abs(personToPay.amount)
        ) {
          personToPay.amount += personToReceive.amount;
          peopleToPay.push(personToPay);

          this.solution.push({
            personToPay: personToPay.person,
            personToReceive: personToReceive.person,
            amount: Math.abs(personToReceive.amount).toFixed(2),
          });
        } else {
          this.solution.push({
            personToPay: personToPay.person,
            personToReceive: personToReceive.person,
            amount: personToPay.amount.toFixed(2),
          });
        }
      }
    }
  }

  isCompleted() {
    return this.solution.length !== 0;
  }

  resetEngine() {
    this.solution = [];
  }
}
