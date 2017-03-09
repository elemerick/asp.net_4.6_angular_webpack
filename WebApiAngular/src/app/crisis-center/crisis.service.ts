import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Crisis }         from './crisis';
import { API_CRISES }     from '../shared/api';
import { handleError }    from '../shared/handle-error';

@Injectable()
export class CrisisService {
  static nextCrisisId = 100;
  constructor (private http: Http) {}
  public getCrises(): Observable<Crisis[]> {
    return this.http.get(API_CRISES)
                    .map((res: Response) => res.json())
                    .catch(handleError);
  }

  public getCrisis(id: number | string): Observable<Crisis> {
    return this.http.get(API_CRISES + '/' + id)
                .map((res: Response) => res.json())
                .catch(handleError);
  }
}
