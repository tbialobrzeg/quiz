import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ResultsComponent } from './pages/results/results.component';

const routes: Routes = [
  { path: "", component: QuizComponent },
  { path: "results", component: ResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
