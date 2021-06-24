import * as Knex from 'knex';
export class ManagerModel {

    getHolidayAll(db: Knex) {
        return db('holiday AS h')
            .select('h.holiday_date', 'h.holiday_name', 'h.ref_datetime', 'm.member_fullname')
            .leftJoin('member AS m', 'm.member_id', 'h.ref_member_id')
            .orderBy('holiday_date', 'DESC')
    }

    holidayDate(db: Knex, date: any) {
        return db('holiday')
            .where('holiday_date', date)
    }

    saveHoliday(db: Knex, data: any) {
        return db('holiday')
            .insert(data)
    }
    updateHoliday(db: Knex, data: any, date) {
        return db('holiday')
            .update(data)
            .where('holiday_date', date)
    }
    delHoliday(db: Knex, date) {
        return db('holiday')
            .where('holiday_date', date)
            .del()
    }

    specialDayDate(db: Knex, date: any, ref_booking_limit_id: any) {
        return db('booking_limit_day_special')
            .where('date', date)
            .where('ref_booking_limit_id', ref_booking_limit_id)
            .where('status', 1)
    }
    saveSpecialDay(db: Knex, data: any) {
        return db('booking_limit_day_special')
            .insert(data)
    }
    updateSpecialDay(db: Knex, data: any, id: number) {
        return db('booking_limit_day_special')
            .update(data)
            .where('id', id)
    }
    delSpecialDay(db: Knex, id: number) {
        return db('booking_limit_day_special')
            .where('id', id)
            .del()
    }

    getSpecialDay(db: Knex) {
        return db('booking_limit_day_special AS bs')
            .select('bs.*', 'm.member_fullname', 'sp.id AS service_id', 'sp.service_name', 'sp.service_img_url', 'bl.id AS booking_id', 'bl.booking_name', 'bl.booking_time_start', 'bl.booking_time_end', 'bl.color_row')
            .leftJoin('member AS m', 'm.member_id', 'bs.ref_member_id')
            .leftJoin('booking_limit AS bl', 'bl.id', 'bs.ref_booking_limit_id')
            .leftJoin('service_planthai AS sp', 'sp.id', 'bl.ref_service_planthai_id')
            .where('sp.status', 1)
            .orderBy('bs.date', 'DESC')
    }
    // รอเจ้าหน้าที่

    approvedStatusApproval(db: Knex,) {             //Fix BUG send note
        return db('approved_status')
            .where('id', 1)
    }

    getManagerOrderBookingWaitConfirm(db: Knex, ref_service_planthai_id: number) {
        return db('inorder_booking AS ib')
            .select('ib.id', 'm.member_id', 'm.member_fullname', 'm.member_img', 'm.member_gender', 'm.member_congenitaldisease', 'm.member_birthday', 'ib.inorder_booking_create_datetime', 'ib.ref_approved_status_id', 'ib.inorder_booking_date', 'bl.booking_name', 'bl.booking_time_start', 'bl.booking_time_end', 'bl.color_row', 's.service_name', 's.service_img_url', 'm2.member_fullname AS approved_fullname', 'ap.approved_status_name',
                'ap.approved_status_note')
            .leftJoin('member AS m', 'm.member_id', 'ib.ref_member_id')
            .leftJoin('booking_limit AS bl', 'bl.id', 'ib.ref_booking_limit_id')
            .leftJoin('service_planthai AS s', 's.id', 'ib.ref_service_planthai_id')
            .leftJoin('member AS m2', 'm2.member_id', 'ib.ref_approved_member_id')
            .leftJoin('approved_status AS ap', 'ap.id', 'ib.ref_approved_status_id')
            //Fix BUG send note use =>   approvedStatusApproval()
            .where('ib.ref_service_planthai_id', ref_service_planthai_id)
            .where('ib.ref_approved_status_id', 0)
            .where('m.status', 1)
            .where('ib.status', 1)
            .whereRaw('ib.inorder_booking_date >= DATE(NOW())')
    }
    // ยืนยันจองคิว
    getManagerOrderBookingConfirm(db: Knex, ref_service_planthai_id: number) {
        return db('inorder_booking AS ib')
            .select('ib.id', 'ib.check_in', 'm.member_id', 'm.member_fullname', 'm.member_img', 'm.member_gender', 'm.member_congenitaldisease', 'm.member_birthday', 'ib.inorder_booking_create_datetime', 'ib.ref_approved_status_id', 'ib.inorder_booking_date', 'bl.booking_name', 'bl.booking_time_start', 'bl.booking_time_end', 'bl.color_row', 's.service_name', 's.service_img_url', 'm2.member_fullname AS approved_fullname', 'ap.approved_status_name',
                'ap.approved_status_note')
            .leftJoin('member AS m', 'm.member_id', 'ib.ref_member_id')
            .leftJoin('booking_limit AS bl', 'bl.id', 'ib.ref_booking_limit_id')
            .leftJoin('service_planthai AS s', 's.id', 'ib.ref_service_planthai_id')
            .leftJoin('member AS m2', 'm2.member_id', 'ib.ref_approved_member_id')
            .leftJoin('approved_status AS ap', 'ap.id', 'ib.ref_approved_status_id')
            .where('ib.ref_service_planthai_id', ref_service_planthai_id)
            .where('ib.ref_approved_status_id', 1)
            .where('m.status', 1)
            .where('ib.status', 1)
            .whereRaw('ib.inorder_booking_date >= DATE(NOW())')
    }
    // คิวเต็ม
    getManagerOrderBookingQFull(db: Knex, ref_service_planthai_id: number) {
        return db('inorder_booking AS ib')
            .select('ib.id', 'm.member_id', 'm.member_fullname', 'm.member_img', 'm.member_gender', 'm.member_congenitaldisease', 'm.member_birthday', 'ib.inorder_booking_create_datetime', 'ib.ref_approved_status_id', 'ib.inorder_booking_date', 'bl.booking_name', 'bl.booking_time_start', 'bl.booking_time_end', 'bl.color_row', 's.service_name', 's.service_img_url', 'm2.member_fullname AS approved_fullname', 'ap.approved_status_name',
                'ap.approved_status_note')
            .leftJoin('member AS m', 'm.member_id', 'ib.ref_member_id')
            .leftJoin('booking_limit AS bl', 'bl.id', 'ib.ref_booking_limit_id')
            .leftJoin('service_planthai AS s', 's.id', 'ib.ref_service_planthai_id')
            .leftJoin('member AS m2', 'm2.member_id', 'ib.ref_approved_member_id')
            .leftJoin('approved_status AS ap', 'ap.id', 'ib.ref_approved_status_id')
            .where('ib.ref_service_planthai_id', ref_service_planthai_id)
            .where('ib.ref_approved_status_id', 2)
            .where('m.status', 1)
            .where('ib.status', 1)
            .whereRaw('ib.inorder_booking_date >= DATE(NOW())')
    }

    getMemberList(db: Knex, member_status_level: string = 'member') {
        return db('member')
            .where('member_status_level', member_status_level)
            .orderBy('member_date_create', 'desc')
    }

    updateMemberStatus(db: Knex, data: any) {
        return db('member')
            .update('status', data.new_user_status)
            .update('member_status_level', data.new_status_level)
            .where('member_id', data.member_id)
    }

    updateApprovedQ(db: Knex, data: any) {
        return db('inorder_booking')
            .update('ref_approved_status_id', '1')
            .update('ref_approved_member_id', data.approved_member_id)
            .update('inorder_booking_approved_datetime', data.datetime)
            .where('id', data.id)
    }
    updatecheckInQ(db: Knex, data: any) {
        return db('inorder_booking')
            .update('check_in', 1)
            .update('check_in_datetime',)
            .where('id', data.id)
    }

    getMasseusePerson(db: Knex) {
        return db('masseuse')
            .orderBy('masseuse_status', 'DESC')
    }
    saveMasseuse(db: Knex, data) {
        return db('masseuse')
            .insert(data)
    }
    updateMasseuse(db: Knex, id, data) {
        return db('masseuse')
            .update(data)
            .where('id', id)
    }
}
