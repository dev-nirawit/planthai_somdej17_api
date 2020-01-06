import * as Knex from 'knex';
import { raw } from 'body-parser';

export class LineLiffModel {
  getRequest(db: Knex) {
    return db('food_store')
      .where('status',1)
      // .where('food_store_id',id)

  }
  // get STEP 1
  getBranchProvince(db: Knex){
    return db('branch AS b')
        .select('b.branch_id','a_p. CODE','a_p.name_in_thai','a_p.name_in_english')
        .leftJoin('addr_provinces AS a_p','a_p. CODE','b.branch_province')
        .where('b. STATUS',1)
        .andWhereNot('b.branch_id','1')
        .groupByRaw('a_p. CODE');
  }
  
  getBranchProvinceSql(db: Knex) {
    const sql = `
    SELECT
    b.branch_id,
    b.branch_no,
    b.branch_name,
    a_p. CODE,
    a_p.name_in_thai,
    a_p.name_in_english
  FROM
    branch AS b
  LEFT JOIN addr_provinces AS a_p ON a_p. CODE = b.branch_province
  WHERE
    b. STATUS = 1
  AND b.branch_id != 1
  GROUP BY
    a_p. CODE
    `;
    return db.raw(sql);
  }

  // get STEP 2
  getBranchId(db: Knex,provinceId: any){
    return db('branch AS b')
        .select('b.branch_id','b.branch_no','b.branch_name','b.branch_lat','b.branch_lng','a_p. CODE','a_p.name_in_thai','a_p.name_in_english')
        .leftJoin('addr_provinces AS a_p','a_p. CODE','b.branch_province')
        .where('b. STATUS',1)
        .where('a_p.code',provinceId)
        .andWhereNot('b.branch_id','1')
  }

  // get STEP 3
  getFoodStoreRequest(db: Knex,branchId: any){
    return db('food_store as f')
        .select('*')
        .leftJoin('branch as b','b.branch_id','f.branch_id')
        .where('b.branch_id',branchId)
        .andWhere('f.status',1)
        .andWhereNot('b.branch_id',1);
  }
// get STEP 4
  getFoodListMenuRequest(db: Knex,foodStoreId:any){
    return db('food_list_menu as fl')
      .select('fl.*','f.branch_id','f.food_store_name','f.food_store_lat','f.food_store_lng')
      .leftJoin('food_store as f','f.food_store_id','fl.food_store_id')
      .where('fl.food_store_id',foodStoreId)
      .where('fl.status',1)
      .orderBy('fl.food_list_menu_row','ASC')
  }

  getCustomerProfile(db: Knex,userId: any) {
    return db('customer')
      .where('customer_line_userId',userId)
      .where('status',1)
  }
  checkLiffFirst(db: Knex,userId: any){
    return db('customer')
      .where('customer_line_userId',userId)
      .where('status',1)
  }
  saveCustomer(db: Knex,data: any){
    return db('customer')
    .insert(data);
  }
// Save Order
  saveInOrder(db:Knex,data: any){
    return db('in_order')
    .insert(data)
    .returning(['id'])
  }
  saveOrderList(db:Knex,data: any){
    return db('in_order_list')
    .insert(data)
  }




}