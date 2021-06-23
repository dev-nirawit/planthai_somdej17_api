import * as Knex from 'knex';
import { raw } from 'body-parser';

export class LineLiffModel {

  getbooking_rangetime(db: Knex, service_planthai_id, date: any) {
    // const sql = `SELECT
    // a.id,a.booking_name,a.booking_time_start,a.booking_time_end,a.booking_limit_num,if(a.booking_limit_num >a.booking_day,1,0) as status_booking_day
    // FROM
    // (SELECT
    //   b.*,(
    //   SELECT
    //     COUNT(*)
    //   FROM
    //     inorder_booking i 
    //   WHERE
    //     i.inorder_booking_date = ${date}
    //     AND i.ref_booking_limit_id = b.id AND i.status = 1 AND i.ref_approved_status_id = 1 ) AS booking_day 
    // FROM booking_limit b
    // WHERE
    //    b.status = 1 
    //   AND b.ref_service_planthai_id = ${service_planthai_id}
    //   ORDER BY b.set_row desc
    //   ) as a`;
    const sql = `
    SELECT
    a.id,a.booking_name,a.booking_time_start,a.booking_time_end,a.booking_limit_num,a.booking_day,
	if(IFNULL((SELECT num from booking_limit_day_special WHERE date = '${date}' and ref_booking_limit_id  =a.id),a.booking_limit_num) > a.booking_day,1,0) as status_booking_day
    FROM
    (SELECT
      b.*,(
      SELECT
        COUNT(*)
      FROM
        inorder_booking i 
      WHERE
        i.inorder_booking_date =  '${date}'
        AND i.ref_booking_limit_id = b.id AND i.status = 1 AND i.ref_approved_status_id = 1 ) AS booking_day 
    FROM booking_limit b
    WHERE
       b.status = 1 
      AND b.ref_service_planthai_id = ${service_planthai_id}
      ORDER BY b.set_row desc
      ) as a
    `;
    return db.raw(sql)
  }

  getservice_planthai(db: Knex) {
    return db('service_planthai')
      .where('status', 1)
      .orderBy('set_row')
  }

  getHolidayInYear(db: Knex) {
    return db('holiday')
      .whereRaw('YEAR(holiday_date) = YEAR(DATE(NOW()))')
  }

  getServicePlanthaiMore(db: Knex, id: string = null) {
    if (id) {
      return db('service_planthai_more')
        .where('status', 1)
        .where('ref_service_planthai_id', id)
        .orderBy('set_row')
    } else {
      return db('service_planthai_more')
        .where('status', 1)
        .orderBy('set_row')
    }
  }

  checkUserInorderDuplicate(db: Knex, userId: number, booking_date: any, service_planthai_id: number) {
    return db('inorder_booking')
      .where('ref_member_id', userId)
      .where('inorder_booking_date', booking_date)
      .where('ref_service_planthai_id', service_planthai_id)
      .where('status', 1)
  }

  getUserProfile(db: Knex, lineId: any) {
    return db('member')
      .where('member_line_userId', lineId)
      .where('status', 1)
  }

  getUserProfileMemberId(db: Knex, id: any) {
    return db('member')
      .where('member_id', id)
      .where('status', 1)
  }

  updateUserProfile(db: Knex, lineId: any, data: any) {
    return db('member')
      .update(data)
      .where('member_line_userId', lineId)
      .where('status', 1)
  }

  checkLiffFirst(db: Knex, userId: any) {
    return db('member')
      // .select('member_fullname', 'member_birthday', 'member_congenitaldisease', 'member_img', 'member_line_userId', 'member_tel', 'member_gender', 'member_status_level')
      .where('member_line_userId', userId)
      .where('status', 1)
  }
  saveMember(db: Knex, data: any) {
    return db('member')
      .insert(data);
  }
  // Save Order
  saveInOrerOrder(db: Knex, data: any) {
    return db('inorder_booking')
      .insert(data)
      .returning(['id'])
  }


  getOrderBooking(db: Knex, lineUserId: any) {
    return db('inorder_booking AS ib')
      .select('ib.*', 'bl.booking_name', 'bl.booking_time_start', 'bl.booking_time_end', 's.service_name', 's.service_img_url', 'm2.member_fullname AS approved_fullname', 'ap.approved_status_name',
        'ap.approved_status_note')
      .leftJoin('member AS m', 'm.member_id', 'ib.ref_member_id')
      .leftJoin('booking_limit AS bl', 'bl.id', 'ib.ref_booking_limit_id')
      .leftJoin('service_planthai AS s', 's.id', 'ib.ref_service_planthai_id')
      .leftJoin('member AS m2', 'm2.member_id', 'ib.ref_approved_member_id')
      .leftJoin('approved_status AS ap', 'ap.id', 'ib.ref_approved_status_id')
      .where('m.member_line_userId', lineUserId)
      .where('m.status', 1)
      .where('ib.status', 1)
      .whereRaw('ib.inorder_booking_date >= DATE(NOW())')
  }

  getOrderBookingHistory(db: Knex, lineUserId: any) {
    return db('inorder_booking AS ib')
      .select('ib.id', 'ib.inorder_booking_create_datetime', 'ib.ref_approved_status_id', 'ib.inorder_booking_date', 'bl.booking_name', 'bl.booking_time_start', 'bl.booking_time_end', 's.service_name', 's.service_img_url', 'm2.member_fullname AS approved_fullname', 'ap.approved_status_name',
        'ap.approved_status_note')
      .leftJoin('member AS m', 'm.member_id', 'ib.ref_member_id')
      .leftJoin('booking_limit AS bl', 'bl.id', 'ib.ref_booking_limit_id')
      .leftJoin('service_planthai AS s', 's.id', 'ib.ref_service_planthai_id')
      .leftJoin('member AS m2', 'm2.member_id', 'ib.ref_approved_member_id')
      .leftJoin('approved_status AS ap', 'ap.id', 'ib.ref_approved_status_id')
      .where('m.member_line_userId', lineUserId)
      .where('m.status', 1)
      .where('ib.status', 1)
      .whereRaw('ib.inorder_booking_date < DATE(NOW())')
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