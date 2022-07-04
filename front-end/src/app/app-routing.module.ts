import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AssessmentComponent } from './body/assessment/assessment.component';
import { NearbyComponent } from './body/nearby/nearby.component';
import { ErrorDetectionComponent } from './body/error-detection/error-detection.component';
import { HomeComponent } from './body/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'assessment', component: AssessmentComponent },
  { path: 'nearby', component: NearbyComponent },
  { path: 'error-detection', component: ErrorDetectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
