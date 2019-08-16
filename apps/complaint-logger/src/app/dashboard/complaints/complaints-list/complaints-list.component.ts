import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Complaint } from '@complaint-logger/models';
import { switchMap, combineLatest, map } from 'rxjs/operators';

@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {
  paginationSubject = new BehaviorSubject({
    pageSize: 10,
    pageNumber: 1
  });
  pagination$ = this.paginationSubject.asObservable();

  complaintsSubject: BehaviorSubject<Complaint[]> = new BehaviorSubject<Complaint[]>([]);
  complaints$: Observable<Complaint[]> = this.complaintsSubject.asObservable();
  constructor(private readonly dataService: ComplaintsListService) {
    this.paginationSubject.pipe(
      switchMap(pagination => {
        return this.dataService.pastComplaints(pagination);
      }),
      map(complaints => {
        this.complaintsSubject.next(complaints);
      }));
  }

  ngOnInit() {
  }

}
