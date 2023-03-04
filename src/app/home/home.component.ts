import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  groupName: string = '';
  numOfPeople: number | undefined;

  submitForm() {
    if (this.numOfPeople && this.numOfPeople >= 2) {
      let data = { name: this.groupName, num: this.numOfPeople };
      this.router.navigate(['/new', this.numOfPeople, this.groupName || this.randomGroupName()], {
        state: data,
      });
    }
  }

  randomGroupName(): string {
    let arr = ['The Incredibles', 'The Unstoppables', 'The Avengers'];
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
