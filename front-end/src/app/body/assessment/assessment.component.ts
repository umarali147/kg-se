import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NgForm } from '@angular/forms';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

import weightsFile from '../../../assets/weights.json';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent implements OnInit {
  assessmentObj: Record<string, any> = [];
  weights: Record<string, any> = weightsFile;
  results: any = {};
  finalScore: number = 0;

  public doughnutChartLabels: string[] = [
    'Accessibility',
    'Correctness',
    'Completeness',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [10, 20, 30],
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private httpService: HttpService) {}

  async ngOnInit(): Promise<void> {
    this.httpService.getAssessment().then((data) => {
      let d: any = {};
      d['accessibility'] = data[0];
      d['correctness'] = data[1];
      d['completeness'] = data[2];
      this.assessmentObj = d;
      this.updateResults();
    });
  }
  onSubmitIntro(val: NgForm): void {
    console.log(val.value);
    // this.assessmentObj = val;
  }
  getWeight(a?: any, b?: any): number {
    return this.weights[a][b];
  }
  getResult(a: any, b: any): number {
    return a * b;
  }
  keepOrder = (a: any, b: any): any => {
    return a;
  };
  dataChanged(e: Event, a: any, b: any) {
    this.weights[a][b] = (e.target as HTMLInputElement).value;
    this.updateResults();
  }
  updateResults(): void {
    this.results.accessibilityR =
      this.assessmentObj['accessibility']['availability'] *
        this.weights['accessibility']['availability'] +
      this.assessmentObj['accessibility']['structured'] *
        this.weights['accessibility']['structured'] +
      this.assessmentObj['accessibility']['contNego'] *
        this.weights['accessibility']['contNego'];

    this.results.correctnessR =
      this.assessmentObj['correctness']['syntactic'] *
        this.weights['correctness']['syntactic'] +
      this.assessmentObj['correctness']['semantic'] *
        this.weights['correctness']['semantic'];
    this.results.completenessR =
      this.assessmentObj['completeness']['instance'] *
        this.weights['completeness']['instance'] +
      this.assessmentObj['completeness']['domain'] *
        this.weights['completeness']['domain'];

    this.finalScore =
      (this.results.accessibilityR +
        this.results.correctnessR +
        this.results.completenessR) /
      3;
    // this.doughnutChartData = {
    //   datasets: [
    //     {
    //       data: [
    //         this.assessmentObj['accessibility']['availability'] *
    //           this.weights['accessibility']['availability'],
    //         this.assessmentObj['accessibility']['structured'] *
    //           this.weights['accessibility']['structured'],
    //         this.assessmentObj['accessibility']['contNego'] *
    //           this.weights['accessibility']['contNego'],
    //       ],
    //       backgroundColor: ['red', 'blue', 'green'],
    //       label: 'this.doughnutChartLabels',
    //     },
    //     {
    //       data: [
    //         this.assessmentObj['correctness']['syntactic'] *
    //           this.weights['correctness']['syntactic'],
    //         this.assessmentObj['correctness']['semantic'] *
    //           this.weights['correctness']['semantic'],
    //       ],
    //       backgroundColor: ['orange', 'yellow'],
    //     },
    //     {
    //       data: [
    //         this.assessmentObj['completeness']['instance'] *
    //           this.weights['completeness']['instance'],
    //         this.assessmentObj['completeness']['domain'] *
    //           this.weights['completeness']['domain'],
    //       ],
    //       backgroundColor: ['#AAA', '#777'],
    //     },
    //   ],
    // };

    this.doughnutChartData = {
      datasets: [
        {
          data: [
            this.results.accessibilityR,
            this.results.correctnessR,
            this.results.completenessR,
          ],
        },
      ],
    };
  }
}
