import Payment from '../entity/payment.entity';
import { v4 as uuid } from 'uuid';

export default class PaymentFactory {
  static create(userId: string, planId: string, date: string, expirationDate: string, id?: string): Payment {
    return new Payment(id || uuid(), userId, planId, date, expirationDate);
  }
}
