import { Router, Request, Response } from 'express';
import Exchange from '../models/exchange';

const router: Router = Router();

// - GET /exchanges # returns all exchanges
function allExchanges(req: Request, res: Response) : void {
  Exchange.find({})
    .then(exchanges => {
      res.send(exchanges)
    })
    .catch(err => {
      res.send(err)
    }) 
}

// - POST /exchanges # insert new one
function addExchange(req: Request, res: Response) : void {
  let exchange = new Exchange(req.body);

  exchange.save()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
}

router.get('/', allExchanges);
router.post('/', addExchange);

export default router;
