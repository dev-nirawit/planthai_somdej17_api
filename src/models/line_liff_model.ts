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
        .select('b.branch_id','b.branch_no','b.branch_name','a_p. CODE','a_p.name_in_thai','a_p.name_in_english')
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
  getFoodStoreRequest(db: Knex,provinceId: any){
    return db('food_store as f')
        .select('*')
        .leftJoin('branch as b','b.branch_id','f.branch_id')
        .where('b.branch_province',provinceId)
        .andWhere('f.status',1)
        .andWhereNot('b.branch_id',1);
  }
// get STEP 3
  getFoodListMenuRequest(db: Knex,foodStoreId:any){
    return db('food_list_menu')
      .where('status',1)
      .where('food_store_id',foodStoreId)
  }

  getRequestId(db: Knex,id: any) {
    return db('food_store')
      .where('status',1)
      .where('food_store_id',id)

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
}