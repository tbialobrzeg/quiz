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

  protected quizData: QuizData = {};
  protected currentQuizCategory: string = "";
  protected currentQuestion: number = 0;
  protected error: string | null = null;
  protected isLoaded: boolean = false;
  private subscription !: Subscription;
  protected categoriesIsLockedState: CategoriesIsLockedState = {};

  constructor(protected dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.dataService.getData().subscribe(
      {
        next: data => {
          this.quizData = data;
          this.currentQuizCategory = Object.keys(data)[0];
          this.isLoaded = true;
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

  get question(): Question {
    return this.quizData[this.currentQuizCategory][this.currentQuestion];
  }

  get questions(): Question[] {
    return this.quizData[this.currentQuizCategory];
  }

  get title(): string {
    return this.currentQuizCategory.toUpperCase();
  }

  get questionIndex() {
    return 1 + this.questions.indexOf(this.question);
  }

  get categories(): string[] {
    return Object.keys(this.quizData);
  }

  setCategory(event: Event) {
    this.currentQuizCategory = (event.target as HTMLSelectElement).value;
    this.currentQuestion = 0;
  }

  next() {
    this.currentQuestion = Math.min(this.currentQuestion + 1, this.questions.length - 1);
  }

  previous() {
    this.currentQuestion = Math.max(this.currentQuestion - 1, 0);
  }

  useQuestion(index: number) {
    this.currentQuestion = index;
  }

  lockCurrentCategory() {
    this.categoriesIsLockedState[this.currentQuizCategory] = true;
    let activeCategories = Object.keys(this.quizData).filter(name => !this.categoriesIsLockedState[name]);
    if (activeCategories.length > 0)
      this.currentQuizCategory = activeCategories[0]
    else this.currentQuizCategory = "";
  }

  isCategoryLocked(name?: string) {
    let categoryName = name ? name : this.currentQuizCategory
    return this.categoriesIsLockedState[categoryName];
  }

  submitAll() {
    this.router.navigateByUrl("results");
  }



}
