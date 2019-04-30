import { Component, OnInit } from '@angular/core';
import { Test } from './test.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTestScores();
  }

  async loadTestScores() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {

    } else {
      tests = await this.loadTestsfromJson();
    }
    console.log('this.testscores from ngOninit...', this.tests);
    this.tests = tests;
    return tests;
  }

  async loadTestsfromJson() {
    const tests = await this.http.get('assets/contacts.json').toPromise();
    return tests.json();
  }

  addTest() {
    const test: ITest = {
      id: 1,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null,
    };
    this.tests.unshift(test);
    this.savetoLocalStorage();
  }


  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.savetoLocalStorage();
  }

  savetoLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.tests));
  }

  computeGrade() {
    const data = this.calculate();
    localStorage.setItem('calculatedData', JSON.stringify(data));
    this.router.navigate(['home', data]);
  }

  calculate() {
    let grade = 0;
    for (let i = 0; i < this.tests.length; i++) {
      grade += this.tests[i].grade;
  }
  return {
    pointsPossible: this.tests.length,
    pointsReceived: grade,
    percentage: grade * .10,
    finalGrade: grade + (grade * .10)
  };
}

search(params: string) {
  this.tests = this.tests.filter((tests: ITest) => {
    return tests.testName.toLowerCase() === params.toLowerCase();
  });
}
}
