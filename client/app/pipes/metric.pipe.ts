import {
    Pipe,
    PipeTransform
}
from '@angular/core';

import {
    excluded
}
from '../constants';

@Pipe({
    name: 'metric'
})

export class MetricPipe implements PipeTransform {
    transform(metaDefs) {
        return metaDefs.filter((metaDef) => excluded.indexOf(metaDef.sid) === -1);
    }
}