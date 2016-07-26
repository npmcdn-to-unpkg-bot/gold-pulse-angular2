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
  stocks = []
  metaDefs = []
  futureDates = []
  limit = limitOptions[0]
  limitOptions = limitOptions
  spread = spread
  spreadOptions = spreadOptions
  update(event) {
    this.currentDate = event;
    this._dataService.getData(event).subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates] = processedData;
      if (this.limit > this.stocks.length || this.limitOptions.indexOf(this.limit) === -1) {
        this.limit = this.stocks.length
      }
    });
  }
  modifySpread(event) {
    this.spread = event;
    this.stocks = this._dataService.modifySpread(this.stocks, this.futureDates, this.spread);
  }
  ngOnInit() {
    this._dataService.getData().subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates] = processedData;
    });
  }
}