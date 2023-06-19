import { Component, Input } from '@angular/core';
import { Question } from 'src/app/services/model';

@Component({
  selector: 'qa-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  @Input()
  public question !: Question;

  @Input()
  public index !: number;

  constructor() { }

  protected setAnswer(index: number) {
    this.question.userAnswer = index;
  }

}
