import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomerModel, APIResponseModel } from '../../../model/skyline-model';

const STORAGE_KEY = 'skyline_customers';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  getAllCustomers(): Observable<APIResponseModel> {
    const data: CustomerModel[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return of({ result: true, message: 'Success', data });
  }
}
