import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-error-detection',
  templateUrl: './error-detection.component.html',
  styleUrls: ['./error-detection.component.scss'],
})
export class ErrorDetectionComponent implements OnInit {
  errorList: any;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.getErrors().subscribe((data) => {
      this.errorList = data.filter((d: any) => d.property !== null);
      console.log(this.errorList);
    });
  }
}
