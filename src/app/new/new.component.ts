import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyGuard } from '../my-guard.guard';
import { BillEntry } from '../resource/BillEntry';
import { BillItem } from '../resource/BillItem';
import { Person } from '../resource/Person';
import { SplitEngine } from '../resource/SplitEngine';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
  @ViewChildren('itemNameInput') inputEls: QueryList<ElementRef> | undefined;

  myGuard = new MyGuard();
  canDeactivate = () => this.myGuard;

  engine: SplitEngine = new SplitEngine();
  items: { name: string | undefined; cost: number | undefined }[] = [];
  shouldShowResultTable: boolean = false;
  currency: string = '£';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.doSetUp();
  }

  doSetUp() {
    const numOfPeople = this.route.snapshot.params['num'];
    const groupName = this.route.snapshot.params['name'];
    let group: Person[] = [];
    for (let i = 0; i < numOfPeople; i++) {
      let person: Person = new Person(i, '');
      group.push(person);
      this.items.push({ name: undefined, cost: undefined });
    }

    this.engine = new SplitEngine(groupName, group);
  }

  addItemToBill(id: number, idx: number) {
    if (this.items[id].name != undefined && this.items[id].cost != undefined) {
      this.engine.createNewBillEntry(this.items[id], this.engine.group[id], this.engine.group)
      this.items[id] = { name: undefined, cost: undefined };
    }

    if (this.inputEls) {
      const inputArray = this.inputEls.toArray();
      inputArray[idx].nativeElement.focus();
    }
  }

  showItemsTable(person: Person): boolean {
    return this.engine.doesPersonHaveEntries(person);
  }

  deleteEntry(entry: BillEntry) {
    this.engine.deleteEntry(entry);
  }

  getPersonEntries(person: Person) {
    return this.engine.getPersonEntries(person);
  }

  doSplit() {
    console.log(this.currency);
    this.engine.doSplit();
    this.shouldShowResultTable = this.engine.isCompleted();
  }

  confirmNavigationToHome() {
    if (confirm('Have you screenshotted the Result?')) {
      this.router.navigate(['/home']);
      return true;
    } else {
      return false;
    }
  }

  confirmRestartSplit() {
    if (confirm('Are you sure to restart the Split?')) {
      this.restartSplit();
      return true;
    } else {
      return false;
    }
  }

  randomGroupName(): string {
    let arr = ['The Incredibles', 'The Unstoppables', 'The Avengers'];

    return arr[Math.floor(Math.random() * arr.length)];
  }

  getNamePlaceholder(id: number): string {
    return 'Person ' + (id + 1);
  }

  scrollToResult() {
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById('result-div')!.offsetTop,
        behavior: 'smooth',
      });
    }, 200);
  }

  restartSplit() {
    location.reload();
  }
}
