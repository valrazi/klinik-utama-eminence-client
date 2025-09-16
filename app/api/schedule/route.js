// app/api/staff/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed
import dayjs from "dayjs";

export async function GET(req) {
    try {
        // get logged-in user
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const db = getDb();


        const { searchParams } = new URL(req.url);
        const services = searchParams.get("services");
        const staffId = searchParams.get('staffId');
        const date = searchParams.get('date');
        const formattedDate = dayjs(date).format('YYYY-MM-DD')

        if (services === 'injury') {
            // fetch staff by role + same gender
            const [schedules] = await db.query(
                "SELECT start_time, end_time " +
                "FROM doctor_schedules WHERE doctor_id = ? AND is_available = 1 AND schedule_date = ?" +
                "ORDER BY schedule_date DESC, start_time ASC",
                [staffId, formattedDate]
            );

            return NextResponse.json({ success: true, schedules });
        } else {
            const schedules = await getTherapistSchedule(staffId, formattedDate, db)
            return NextResponse.json({ success: true, schedules });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        // get logged-in user
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const db = getDb();


        const body = await req.json()
        const { services, staffId, date, schedule } = body

        const [patients] = await db.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [session.user.email]
        );

        if (patients.length === 0) {
            return NextResponse.json(
                { success: false, message: "Patient not found" },
                { status: 404 }
            );
        }

        const patientId = patients[0].id;
        const formattedDate = dayjs(date).format('YYYY-MM-DD')
        const [formattedStartTime, formattedEndTime] = schedule.split('-')

        const isReservationExist = await checkSchedule(staffId, formattedDate, formattedStartTime, formattedEndTime, db)

        if (isReservationExist.length) {
            return NextResponse.json(
                { success: false, message: "Jadwal tidak tersedia" },
                { status: 400 }
            );
        }

        const [create] = await db.query(
            `INSERT INTO reservations (patient_id, staff_id, service, schedule_date, start_time, end_time, status) ` +
            `VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [patientId, staffId, services, formattedDate, formattedStartTime, formattedEndTime, "booked"]
        )

        if (services === 'injury') {
            if (create.insertId) {
                await db.query(
                    `UPDATE doctor_schedules SET is_available = 0 WHERE schedule_date = ? AND start_time = ? AND end_time = ?`,
                    [formattedDate, formattedStartTime, formattedEndTime]
                )
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}

async function checkSchedule(staffId, formattedDate, formattedStartTime, formattedEndTime, db) {
    try {
        const [isReservationExist] = await db.query(
            `SELECT id from reservations WHERE staff_id = ? AND schedule_date = ? AND start_time = ? AND end_time = ?`,
            [staffId, formattedDate, formattedStartTime, formattedEndTime]
        )
        return isReservationExist
    } catch (error) {
        throw error
    }
}

async function getTherapistSchedule(staffId, formattedDate, db) {
    try {
        // cek apakah di tanggal itu sudah ada 3x jadwal utk staff
        const [staffReservations] = await db.query(
            `SELECT start_time, end_time FROM reservations WHERE staff_id = ? AND schedule_date = ? ORDER BY start_time ASC`,
            [staffId, formattedDate]
        )
        if (staffReservations.length >= 3) {
            return []
        }
        const arrSchedule = [
            '06:00:00-07:00:00',
            '07:00:00-08:00:00',
            '08:00:00-09:00:00',
            '09:00:00-10:00:00',
            '10:00:00-11:00:00',
            '11:00:00-12:00:00',
            '12:00:00-13:00:00',
            '13:00:00-14:00:00',
            '14:00:00-15:00:00',
            '15:00:00-16:00:00',
            '16:00:00-17:00:00',
            '17:00:00-18:00:00',
            '18:00:00-19:00:00',
            '19:00:00-20:00:00',
        ];

        for(const sr of staffReservations) {
            const time = `${sr.start_time}-${sr.end_time}`
            const scheduleToDelete = arrSchedule.findIndex((s) => s == time)
            if(scheduleToDelete != -1) {
                arrSchedule.splice(scheduleToDelete, 1)
            }
        }
        const arrScheduleMapped = arrSchedule.map((s) => {
            const [starTime, endTime] = s.split('-')
            const value = {
                start_time: starTime,
                end_time: endTime
            }
            return value
        })

        return arrScheduleMapped
    } catch (error) {
        throw error
    }
}

