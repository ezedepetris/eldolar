import Exchange, { IExchange } from '../models/exchange'
import axios from 'axios';
import BankOptions from './bankInterfaces';

import * as cheerio from 'cheerio';

import Nacion from './fetchers/nacion'

class FetchNewExchangeService {

  constructor() {}

  run() : Promise<IExchange> {
    let promises : Promise<BankOptions>[] = [
      (new Nacion).run(),
      this.fetchSantanderExchange(),
      this.fetchBBVAExchange(),
      this.fetchGaliciaExchange(),
      this.fetchSupervielleExchange()
    ];

    return Promise.all(promises)
    .then( (banks : BankOptions[]) => {
      // save record into db
      let exg = { banks };
      const newExchange : IExchange = new Exchange(exg);

      return newExchange.save()
    })
  }
  
  private fetchSantanderExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2O9Mvvm")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);
      const tRow = $('.fortable > table > tbody > tr:nth-child(2)');

      const sanitizedBuy = tRow.find('td:nth-child(2)').text().replace('$', '').replace(',', '.');
      const sanitizedSell = tRow.find('td:nth-child(3)').text().replace('$', '').replace(',', '.');
      const buy : string = parseFloat(sanitizedBuy).toFixed(2);
      const sell : string = parseFloat(sanitizedSell).toFixed(2);

      return {
        name: 'Santander',
        buy: parseFloat(buy),
        sell: parseFloat(sell)
      }
    })
    .catch(err => {
      return {
        name: 'Santander',
        buy: 0,
        sell: 0
      }
    })
  }

  private fetchBBVAExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2O0wxUt")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);
      const tRow = $('table.tb1 > tbody > tr.tr1');

      const sanitizedBuy = tRow.find('td:nth-child(2) span').text().replace(',', '.');
      const sanitizedSell = tRow.find('td:nth-child(3) span').text().replace(',', '.');
      const buy : string = parseFloat(sanitizedBuy).toFixed(2);
      const sell : string = parseFloat(sanitizedSell).toFixed(2);

      return {
        name: 'BBVA-Francés',
        buy:parseFloat(buy),
        sell: parseFloat(sell)
      }
    })
    .catch(err => {
      return {
        name: 'BBVA-Francés',
        buy: 0,
        sell: 0
      }
    })
  }

  private fetchGaliciaExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2wWvApx")
    .then(response => {
      const result = response.data
      let buy = parseFloat(result.buy.replace(',', '.'));
      let sell = parseFloat(result.sell.replace(',', '.'));

      return {
        name: 'Galicia',
        buy: buy,
        sell: sell
      }
    })
    .catch(err => {
      return {
        name: 'Galicia',
        buy: 0,
        sell: 0
      }
    })
  }

  private fetchSupervielleExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2N0GDZc")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);

      const tRow = $('#gvCotizaciones > tbody > tr:nth-child(2)');

      const sanitizedBuy = tRow.find('td:nth-child(2)').text().replace(',', '.');
      const sanitizedSell = tRow.find('td:nth-child(3)').text().replace(',', '.');
      const buy : string = parseFloat(sanitizedBuy).toFixed(2);
      const sell : string = parseFloat(sanitizedSell).toFixed(2);

      return {
        name: 'Supervielle',
        buy: parseFloat(buy),
        sell: parseFloat(sell)
      }
    })
    .catch(err => {
      return {
        name: 'Supervielle',
        buy: 0,
        sell: 0
      }
    })
  }
}

export default FetchNewExchangeService;
