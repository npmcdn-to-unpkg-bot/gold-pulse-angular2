import {
  Component
}
from '@angular/core';
import {
  HTTP_PROVIDERS
}
from '@angular/http';

//import constants
import {
  hp,
  limit,
  limitOptions,
  start,
  spread,
  spreadOptions
}
from '../constants';

//import subcomponents (directives)
import {
  StockTable
}
from './stock.table';
import {
  DateComponent
}
from './date.component';

//import services
import {
  DataService
}
from '../services/data.service';
import {
  DateService
}
from '../services/date.service';
import {
  QuantileService
}
from '../services/quantile.service';

//import pipes
import {
  ShortenPipe
}
from '../pipes/shorten.pipe';

@Component({
  selector: 'exploration-viewer',
  templateUrl: './templates/exploration.viewer.html',
  styleUrls: ['./css/exploration.viewer.css'],
  directives: [StockTable, DateComponent],
  pipes: [ShortenPipe],
  providers: [HTTP_PROVIDERS, DataService, DateService, QuantileService]
})
export class ExplorationViewer {
  constructor(private _dataService: DataService) {

  }
  currentDate = start
  hp = hp
  stocks = []
  metaDefs = []
  futureDates = []
  cpMetaDefs = []
  benchmarks = {}
  limit = limit
  limitOptions = limitOptions
  spread = spread
  spreadOptions = spreadOptions
  update(event) {
    /* The event is either an update to the current date or an update to the holding period. */
    if (isNaN(event)) {
      this.currentDate = event;
    }
    else {
      this.hp = event;
    }
    this._dataService.getData(this.currentDate, this.hp).subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates, this.cpMetaDefs, this.benchmarks] = processedData;
      if (this.limit > this.stocks.length || this.limitOptions.indexOf(this.limit) === -1) {
        this.limit = this.stocks.length
      }

      if (this.spread !== 0) {
        this.modifySpread(this.spread);
      }
    });
  }
  modifySpread(event) {
    this.spread = event;
    this.stocks = this._dataService.modifySpread(this.stocks, this.futureDates, this.spread);

  }
  ngOnInit() {
    this._dataService.getData(this.currentDate).subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates, this.cpMetaDefs, this.benchmarks] = processedData;
    });
  }
}