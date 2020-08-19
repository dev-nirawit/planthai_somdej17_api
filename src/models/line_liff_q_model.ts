import * as Knex from 'knex';
import { raw } from 'body-parser';

export class LineLiffQModel {

  getCustomerProfile(db: Knex,userId: any) {
    return db('customer')
      .where('customer_line_userId',userId)
      .where('status',1);
  }
  checkLiffFirst(db: Knex,userId: any){
    return db('customer')
      .where('customer_line_userId',userId)
      .where('status',1);
  }
  saveCustomer(db: Knex,data: any){
    return db('customer')
    .insert(data);
  }
// Save Order
  saveOrder(db:Knex,data: any){
    return db('inorder_booking')
    .insert(data)
    .returning(['id']);
  }

}