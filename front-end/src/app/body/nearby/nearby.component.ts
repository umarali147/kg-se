import { KeyValue } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
// import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss'],
})
export class NearbyComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  // Pie
  // public pieChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //     datalabels: {
  //       formatter: (value, ctx) => {
  //         if (ctx.chart.data.labels) {
  //           return ctx.chart.data.labels[ctx.dataIndex];
  //         }
  //       },
  //     },
  //   },
  // };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Place', 'PointOfInterest', 'Organization', 'Trail'],
    datasets: [
      {
        data: [48, 231, 84, 12],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  // public pieChartPlugins = [DatalabelsPlugin];

  place: any[] = [];
  poi: any[] = [];
  organization: any[] = [];
  trail: any[] = [];
  bigObject: Record<string, any[]> = {
    Place: [],
    PointOfInterest: [],
    Organization: [],
    Trail: [],
  };
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    const listArray: any = [];
    this.httpService.getNearbyList().subscribe((data) => {
      console.log(data);
      data.results.bindings.forEach((element: any) => {
        listArray.push(element);
      });
      this.place = listArray.filter(
        (element: any) => element.type.value === 'https://schema.org/Place'
      );
      this.poi = listArray.filter(
        (element: any) =>
          element.type.value === 'https://odta.io/voc/PointOfInterest'
      );
      this.organization = listArray.filter(
        (element: any) =>
          element.type.value === 'https://schema.org/Organization'
      );
      this.trail = listArray.filter(
        (element: any) => element.type.value === 'https://odta.io/voc/Trail'
      );
      this.bigObject['Place'] = this.place;
      this.bigObject['PointOfInterest'] = this.poi;
      this.bigObject['Organization'] = this.organization;
      this.bigObject['Trail'] = this.trail;

      this.pieChartData = {
        labels: ['Place', 'PointOfInterest', 'Organization', 'Trail'],
        datasets: [
          {
            data: [
              this.place.length,
              this.poi.length,
              this.organization.length,
              this.trail.length,
            ],
          },
        ],
      };
    });
  }
  keepOrder = (a: any, b: any): any => {
    return a;
  };
  toArray(list: any) {
    console.log(list);
  }
}
