import * as Knex from 'knex';
import { raw } from 'body-parser';

export class LineLiffModel {

  // get STEP 1  
  getbookingTimeSql(db: Knex, selectdate) {
    const sql = `
    SELECT
    b.id,
    b.booking_name,
    b.booking_time_start,
    b.booking_time_end,
    b.booking_limit,
    (SELECT count(*) FROM inorder_booking WHERE inorder_booking_selectdate = ${selectdate}) as count_inorder_booking
  FROM
    booking b
  WHERE
    status = 1
    `;
    return db.raw(sql);
  }
  getselectbooking_limit(db: Knex) {
    return db('booking_limit')
      .where('status', 1)
  }

  getCustomerProfile(db: Knex, userId: any) {
    return db('customer')
      .where('customer_line_userId', userId)
      .where('status', 1)
  }
  checkLiffFirst(db: Knex, userId: any) {
    return db('customer')
      .where('customer_line_userId', userId)
      .where('status', 1)
  }
  saveCustomer(db: Knex, data: any) {
    return db('customer')
      .insert(data);
  }
  // Save Order
  saveOrder(db: Knex, data: any) {
    return db('inorder_booking')
      .insert(data)
      .returning(['id'])
  }

  /*------------------------------
  ========  NOT Use Ex. =========
  -------------------------------*/
  // get STEP 2
  getBranchId(db: Knex, provinceId: any) {
    return db('branch AS b')
      .select('b.branch_id', 'b.branch_no', 'b.branch_name', 'b.branch_lat', 'b.branch_lng', 'a_p. CODE', 'a_p.name_in_thai', 'a_p.name_in_english')
      .leftJoin('addr_provinces AS a_p', 'a_p. CODE', 'b.branch_province')
      .where('b. STATUS', 1)
      .where('a_p.code', provinceId)
      .andWhereNot('b.branch_id', '1')
  }

  // get STEP 3
  getFoodStoreRequest(db: Knex, branchId: any) {
    return db('food_store as f')
      .select('*')
      .leftJoin('branch as b', 'b.branch_id', 'f.branch_id')
      .where('b.branch_id', branchId)
      .andWhere('f.status', 1)
      .andWhereNot('b.branch_id', 1);
  }
  // get STEP 4
  getFoodListMenuRequest(db: Knex, foodStoreId: any) {
    return db('food_list_menu as fl')
      .select('fl.*', 'f.branch_id', 'f.food_store_name', 'f.food_store_lat', 'f.food_store_lng')
      .leftJoin('food_store as f', 'f.food_store_id', 'fl.food_store_id')
      .where('fl.food_store_id', foodStoreId)
      .where('fl.status', 1)
      .orderBy('fl.food_list_menu_row', 'ASC')
  }

}