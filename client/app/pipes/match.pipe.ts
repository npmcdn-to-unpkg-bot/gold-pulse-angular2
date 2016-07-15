import {
    Pipe,
    PipeTransform
}
from '@angular/core';

@Pipe({
    name: 'match'
})
export class MatchPipe implements PipeTransform {
    transform(value, args) {
        const ymd = args,
        match = value.find(el => el.ymd === ymd);
        return (match) ? match.change : 'NA';
    }

}