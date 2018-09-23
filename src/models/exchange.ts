import { Schema, model } from 'mongoose';
import { Decimal128 } from 'bson';

export const ExchangeSchema = new Schema({
  banks: [
    {
      name: String,
      buy:  { type: Decimal128, default: 0 },
      sell: { type: Decimal128, default: 0 }
    }
  ]
}, { timestamps: true });

const Exchange = model("Exchange", ExchangeSchema);
export default Exchange;
