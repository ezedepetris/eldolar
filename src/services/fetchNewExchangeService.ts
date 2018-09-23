import Exchange, { IExchange } from '../models/exchange'
import axios from 'axios';
import BankOptions from './bankInterfaces';

class FetchNewExchangeService {

  constructor() {}

  run() : Promise<IExchange> {
    let promises : Promise<BankOptions>[] = [this.fetchNacionExchange()];

    return Promise.all(promises)
    .then(results => {
      console.log(results);
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
    .then(data => {
      console.log('feching...')

      // hard work here ...

      return {
        name: 'Nacion',
        buy: 10.33,
        sell: 11.33
      }
    })
  }
}

export default FetchNewExchangeService;
