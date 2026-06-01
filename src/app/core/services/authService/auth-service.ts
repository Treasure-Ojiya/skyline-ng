import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CustomerModel } from '../../../model/skyline-model';

const CUSTOMERS_KEY = 'skyline_customers';
const SESSION_KEY = 'skyline_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  private readCustomers(): CustomerModel[] {
    return JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
  }

  private writeCustomers(customers: CustomerModel[]): void {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }

  registerUser(user: Omit<CustomerModel, 'customerId'>): Observable<any> {
    const customers = this.readCustomers();
    const exists = customers.find((c) => c.email === user.email);
    if (exists) {
      return of({ result: false, message: 'Email already registered', data: null });
    }
    const newId = customers.length > 0 ? Math.max(...customers.map((c) => c.customerId)) + 1 : 1;
    const newCustomer: CustomerModel = { ...user, customerId: newId };
    customers.push(newCustomer);
    this.writeCustomers(customers);
    this.saveUser(newCustomer);
    return of({ result: true, message: 'Registration successful', data: newCustomer });
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    const customers = this.readCustomers();
    const customer = customers.find(
      (c) => c.email === credentials.email && c.password === credentials.password,
    );
    if (customer) {
      this.saveUser(customer);
      return of({ result: true, message: 'Login successful', data: customer });
    }
    return of({ result: false, message: 'Invalid email or password', data: null });
  }

  saveUser(userData: CustomerModel): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    this.isLoggedIn$.next(true);
  }

  getUser(): CustomerModel | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  getUserId(): number | null {
    return this.getUser()?.customerId ?? null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(SESSION_KEY);
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.isLoggedIn$.next(false);
  }
}
