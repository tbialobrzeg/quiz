import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Question, QuizData } from 'src/app/services/model';

export interface CategoriesIsLockedState {
  [key: string]: boolean;
}

@Component({
  selector: 'qa-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {

  private readonly QUIZ_LIST = ["design patterns", "angular", "java"];
  private subscription !: Subscription;
  protected quizData: QuizData = {};
  protected currentQuizCategory: string = "";
  protected currentQuestionIndex: number = 0;
  protected error: string | null = null;
  protected categoriesIsLockedState: CategoriesIsLockedState = {};


  constructor(protected dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.dataService.loadQuiz(this.QUIZ_LIST).subscribe(
      {
        next: data => {
          this.quizData = data;
          this.currentQuizCategory = Object.keys(data)[0] || "";
          Object.keys(this.quizData).forEach(q => this.categoriesIsLockedState[q] = false);
        },
        error: (error) => {
          this.error = "Cannot load quiz data."
        }
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected get isLoaded() {
    return Object.keys(this.quizData).length > 0;
  }

  protected get question(): Question {
    return this.quizData[this.currentQuizCategory][this.currentQuestionIndex];
  }

  protected get questions(): Question[] {
    return this.quizData[this.currentQuizCategory];
  }

  protected get title(): string {
    return this.currentQuizCategory.toUpperCase();
  }

  protected get questionIndex() {
    return 1 + this.questions.indexOf(this.question);
  }

  protected get categories(): string[] {
    return Object.keys(this.quizData);
  }

  protected setCategory(event: Event) {
    this.currentQuizCategory = (event.target as HTMLSelectElement).value;
    this.currentQuestionIndex = 0;
  }

  protected next() {
    this.currentQuestionIndex = Math.min(this.currentQuestionIndex + 1, this.questions.length - 1);
  }

  protected previous() {
    this.currentQuestionIndex = Math.max(this.currentQuestionIndex - 1, 0);
  }

  protected selectQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  protected lockCurrentCategory() {
    this.categoriesIsLockedState[this.currentQuizCategory] = true;
    let activeCategories = Object.keys(this.quizData).filter(name => !this.categoriesIsLockedState[name]);
    if (activeCategories.length > 0) {
      this.currentQuizCategory = activeCategories[0];
    }
    else {
      this.currentQuizCategory = "";
    }
    this.currentQuestionIndex = 0;
  }

  protected isCategoryLocked(name?: string) {
    let categoryName = name ? name : this.currentQuizCategory
    return this.categoriesIsLockedState[categoryName];
  }

  protected submitAll() {
    this.router.navigateByUrl("results");
  }
}
