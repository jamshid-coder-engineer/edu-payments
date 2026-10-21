/** Backend javoblari (Swagger: http://localhost:3000/docs). */

export interface Student {
  id: number;
  name: string;
  phone: string;
  group: string;
  monthlyFee: number;
  joinedAt: string; // YYYY-MM-DD
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paidAt: string; // YYYY-MM-DD
}

export interface Debtor {
  studentId: number;
  name: string;
  phone: string;
  group: string;
  monthlyFee: number;
  paid: number;
  debt: number;
}

export interface CreatePaymentInput {
  studentId: number;
  amount: number;
  paidAt: string;
}
