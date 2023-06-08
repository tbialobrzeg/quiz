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
  protected totalScore: number = 0;
  protected totalQuestions: number = 0;

  constructor(protected dataService: DataService) { }

  ngOnInit(): void {
    this.quizData = this.dataService.getLoadedQuizData();
    this.calculateScore();
  }

  private calculateScore() {
    for (const category in this.quizData) {
      for (const question of this.quizData[category]) {
        this.totalQuestions++;
        if (question.userAnswer === question.correctAnswerID) {
          this.totalScore++;
        }
      }
    }
  }

  protected get categoryNames() {
    return Object.keys(this.quizData);
  }

  protected get isLoaded() {
    return this.categoryNames.length > 0;
  }

  protected getScores(categoryName: string) {
    let score = 0;
    let total = this.quizData[categoryName].length;
    for (let question of this.quizData[categoryName]) {
      if (question.userAnswer != null && question.correctAnswerID == question.userAnswer) {
        score++;
      }
    }
    return `${score} of ${total}`;
  }
}
