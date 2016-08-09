import {
    Injectable
}
from '@angular/core';

import {
    Http
}
from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class DateService {
    constructor(private http: Http) {}
    getValidDates() {
        return this.http.get('../valid-dates-api.php').map(response => response.json());
    }

}