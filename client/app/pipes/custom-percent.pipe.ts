//Built-in Percent pipe is unreliable outside of Chrome at the moment, so we build our own.

import {
    Pipe,
    PipeTransform
}
from '@angular/core';

@Pipe({
    name: 'cpercent'
})

export class CustomPercentPipe implements PipeTransform {
    transform(value) {
        //NOTE: no need to multiply by 100 because that occured in data.service
        return !isNaN(value) && value !== null ? `${(value).toFixed(1)}%` : null;
    }
}