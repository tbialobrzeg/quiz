import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizData } from './model';
import { tap, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private quizData: QuizData | null = null;

  constructor(private http: HttpClient) { }

  public getData(): Observable<QuizData> {
    if (this.quizData) {
      return of(this.quizData)
    }
    else {
      return this.http.get<QuizData>('assets/data.json').pipe(tap((data) => {
        this.quizData = data;
      }))
    }
  }
}

