import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question, QuizData } from './model';
import { Observable, of, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private quizData: QuizData = {};

  constructor(private http: HttpClient) { }

  public loadQuiz(quizList: string[]) {

    let fileNames = quizList.map(name => name.replace(/ /g, "_") + ".json");
    let streams: Observable<Question[]>[] = [];

    for (let fileName of fileNames) {
      streams.push(this.http.get<Question[]>('assets/' + fileName));
    }

    return forkJoin(streams).pipe(map(quizArray => {
      this.quizData = {}
      for (let i = 0; i < quizList.length; i++) {
        let qName = quizList[i];
        let qData = quizArray[i]
        this.quizData[qName] = qData;
      }
      return this.quizData;
    }))

  }

  public getLoadedQuizData() {
    return this.quizData;
  }
}

