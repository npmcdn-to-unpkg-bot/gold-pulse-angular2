import {
    Component,
    Input,
    Output,
    EventEmitter
}
from '@angular/core';

import {
    DateService
}
from '../services/date.service';

//import constants
import {
    jump,
    jumpOptions,
    gap,
    gapOptions
}
from '../constants';

@Component({
    selector: 'date-component',
    templateUrl: './templates/date.component.html',
    styleUrls: ['./css/date.component.css']
})
export class DateComponent {
    @Input() currentDate
    jump = jump
    jumpOptions = jumpOptions
    gap = gap
    gapOptions = gapOptions
    validDates = []
    inputDate = {
        'ymd': '',
        'valid': true
    }
    @Output() updateCurrentDate = new EventEmitter()
    min
    max
    constructor(private dateService: DateService) {}
    ngOnInit() {
        this.dateService.getValidDates().subscribe(dates => {
            this.validDates = dates;
            const length = dates.length
            if (length) {
                this.min = dates[0];
                this.max = dates[length - 1];
            }
        });
    }
    flag(event) {
        const invalid = isNaN(Date.parse(event));
        this.inputDate.valid = !invalid;
    }
    submit() {
        const timeStamp = Date.parse(this.inputDate.ymd);
        if (!isNaN(timeStamp)) {
            const closest = this.validDates.filter((ymd) => Date.parse(ymd) >= timeStamp).reduce(
                (acc, curr) => {
                    const diff1 = Date.parse(curr) - timeStamp,
                        diff2 = Date.parse(acc) - timeStamp;
                    return (diff1 < diff2) ? curr : acc;
                }
            );
            this.inputDate.ymd = closest;
            this.updateCurrentDate.emit(this.inputDate.ymd);
        }
        else {
            alert('Invalid date!');
        }

    }
    increment(change) {
        const index = this.validDates.indexOf(this.currentDate),
            indexLast = this.validDates.length - 1;
        if (index - this.jump >= 0 && index + this.jump <= indexLast) {
            const newIndex = (change === 'up') ? (index + this.jump) : (index - this.jump),
                newCurrentDate = this.validDates[newIndex];
            this.inputDate.ymd = newCurrentDate;
            this.updateCurrentDate.emit(newCurrentDate);
        }
    }
    ngOnChanges() {

    }
}