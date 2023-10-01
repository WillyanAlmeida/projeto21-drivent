import { ApplicationError } from '@/protocols';

export function paymentRequired(details: string): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: `err ${details}`,
  };
}