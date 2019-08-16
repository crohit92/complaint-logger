import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';

@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {

  constructor(private readonly dataService: ComplaintsListService) { }

  ngOnInit() {
  }

}
