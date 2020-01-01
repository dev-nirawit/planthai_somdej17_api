import * as Knex from 'knex';

export class CustomerModel {
  getRequest(db: Knex) {
    return db('food_store')
      .where('status',1)
      // .where('food_store_id',id)

  }
  getRequestId(db: Knex,id: any) {
    return db('food_store')
      .where('status',1)
      .where('food_store_id',id)

  }
}