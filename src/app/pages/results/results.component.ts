import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { QuizData } from 'src/app/services/model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  protected quizData: QuizData = {};
  protected error: string | null = null;
  private subscription !: Subscription
  protected totalScore: number = 0;
  protected totalQuestions: number = 0;

  constructor(protected dataService: DataService) { }


  ngOnInit(): void {
    this.subscription = this.dataService.getData().subscribe(
      {
        next: data => {
          this.quizData = data;
          this.initScore();
        },
        error: (error) => {
          this.error = "Cannot load quiz data."
        }
      })
  }

  initScore() {
    for (const category in this.quizData) {
      for (const question of this.quizData[category]) {
        this.totalQuestions++;
        if (question.userAnswer === question.correctAnswerID) {
          this.totalScore++;
        }
      }
    }
  }

  public get isLoaded() {
    return this.quizData != null;
  }

  public getScores(categoryName: string) {
    let score = 0;
    let total = this.quizData[categoryName].length;
    for (let question of this.quizData[categoryName]) {
      if (question.userAnswer != null && question.correctAnswerID == question.userAnswer) {
        score++;
      }
    }
    return `${score} of ${total}`;
  }

  public get categoryNames() {
    return Object.keys(this.quizData);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
