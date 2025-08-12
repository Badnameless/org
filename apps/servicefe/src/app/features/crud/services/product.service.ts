import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryStatus } from '../interfaces/inventory-status.interface';
import { Product } from '../interfaces/product.interface';

@Injectable()
export class ProductService {
    getProductsData() {
        return [];
    }

    getProductsWithOrdersData() {
        return [];
    }

    productNames: string[] = [];

    constructor(private http: HttpClient) {}

    getProducts() {
        return Promise.resolve(this.getProductsData());
    }
}
