import {
    Pipe,
    PipeTransform
}
from '@angular/core';

@Pipe({
    name: 'shorten',
    pure: false
})

export class ShortenPipe implements PipeTransform {
    transform(limitOptions, upperBound) {
        return limitOptions.filter((option) => option < upperBound);
    }
}