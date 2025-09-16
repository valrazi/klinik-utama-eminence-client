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
        console.log({ session });

        const [user] = await db.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [session.user.email]
        )


        const [reservations] = await db.query(
            `SELECT 
        reservations.*,
        patient.name AS patient_name,
        patient.whatsapp_number AS patient_whatsapp_number,
        staff.name AS staff_name
     FROM reservations
     JOIN users AS patient ON patient.id = reservations.patient_id
     JOIN users AS staff ON staff.id = reservations.staff_id
     WHERE patient.id = ?
     ORDER BY reservations.schedule_date DESC, reservations.start_time ASC`,
            [user[0].id]
        );


        return NextResponse.json({ success: true, reservations });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}
