import { Pipe, PipeTransform } from '@angular/core';
import { Complaint } from '@complaint-logger/models';

@Pipe({
  name: 'complaintsListFilter'
})
export class ComplaintsListFilter implements PipeTransform {

  transform(complaints: Complaint[], matchingOp: string, resolutionStatus: string): any {
    if (complaints && complaints.length) {
      switch (matchingOp) {
        case '===':
          return complaints.filter(c => c.resolution && c.resolution.status === resolutionStatus);
        case '!==':
          return complaints.filter(c => c.resolution && c.resolution.status !== resolutionStatus);
        default:
          return complaints;
      }
    } else {
      return complaints;
    }
  }

}
