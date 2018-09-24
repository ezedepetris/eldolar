import Exchange, { IExchange } from '../models/exchange'
import axios from 'axios';
import BankOptions from './bankInterfaces';

import * as cheerio from 'cheerio';

class FetchNewExchangeService {

  constructor() {}

  run() : Promise<IExchange> {
    let promises : Promise<BankOptions>[] = [
      this.fetchNacionExchange(),
      this.fetchSantanderExchange(),
      this.fetchBBVAExchange(),
      this.fetchGaliciaExchange(),
      this.fetchSupervielleExchange()
    ];

    return Promise.all(promises)
    .then(results => {
      let banks : BankOptions[] = [];

      results.forEach(result => {
        banks.push(result);
      });

      // save record into db
      let exg = { banks: banks };
      const newExchange : IExchange = new Exchange(exg);

      return newExchange.save()
    })
  }

  fetchNacionExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2NvKhcM")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);
      const tRow = $('#billetes > table > tbody > tr:nth-child(1)');
      const buy : number = parseFloat(tRow.find('td:nth-child(2)').text().replace(',', '.')).toFixed(2);
      const sell : number = parseFloat(tRow.find('td:nth-child(3)').text().replace(',', '.')).toFixed(2);

      return {
        name: 'Nación',
        buy: buy,
        sell: sell
      }
    })
    .catch(err => {
      return {
        name: 'Nación',
        buy: 0,
        sell: 0
      }
    })
  }

  fetchSantanderExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2O9Mvvm")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);
      const tRow = $('.fortable > table > tbody > tr:nth-child(2)');

      const sanitizedBuy = tRow.find('td:nth-child(2)').text().replace('$', '').replace(',', '.');
      const sanitizedSell = tRow.find('td:nth-child(3)').text().replace('$', '').replace(',', '.');
      const buy : number = parseFloat(sanitizedBuy).toFixed(2);
      const sell : number = parseFloat(sanitizedSell).toFixed(2);

      return {
        name: 'Santander',
        buy: buy,
        sell: sell
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

  fetchBBVAExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2O0wxUt")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);
      const tRow = $('table.tb1 > tbody > tr.tr1');

      const sanitizedBuy = tRow.find('td:nth-child(2) span').text().replace(',', '.');
      const sanitizedSell = tRow.find('td:nth-child(3) span').text().replace(',', '.');
      const buy : number = parseFloat(sanitizedBuy).toFixed(2);
      const sell : number = parseFloat(sanitizedSell).toFixed(2);

      return {
        name: 'BBVA-Francés',
        buy: buy,
        sell: sell
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

  fetchGaliciaExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2wWvApx")
    .then(response => {
      let result = JSON.parse(response.data);
      let buy = 0;
      let sell = 0;

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

  fetchSupervielleExchange () : Promise<BankOptions> {
    return axios.get("https://bit.ly/2N0GDZc")
    .then(response => {
      let html : string  = response.data
      const $ = cheerio.load(html);

      const tRow = $('#gvCotizaciones > tbody > tr:nth-child(2)');

      const sanitizedBuy = tRow.find('td:nth-child(2)').text().replace(',', '.');
      const sanitizedSell = tRow.find('td:nth-child(3)').text().replace(',', '.');
      const buy : number = parseFloat(sanitizedBuy).toFixed(2);
      const sell : number = parseFloat(sanitizedSell).toFixed(2);

      return {
        name: 'Supervielle',
        buy: buy,
        sell: sell
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
