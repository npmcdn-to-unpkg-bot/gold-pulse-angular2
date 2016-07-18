import {
    Component,
    Input
}
from '@angular/core';

//import MatchPipe, which matches future dates to closing prices
import {
    MatchPipe
}
from '../pipes/match.pipe';

//import SortPipe which ranks stocks in descending order according to metric selected by user
import {
    SortPipe
}
from '../pipes/sort.pipe';

@Component({
    selector: 'stock-table',
    templateUrl: './templates/stock.table.html',
    styleUrls: ['./css/stock.table.css'],
    pipes: [MatchPipe, SortPipe]
})

export class StockTable {
    @Input() stocks
    @Input() metaDefs
    @Input() futureDates
    selection = null
    set(event, sid) {
        event.preventDefault();
        this.selection = sid;
    }

    ngOnChanges() {}
}