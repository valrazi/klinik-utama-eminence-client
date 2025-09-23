// app/api/staff/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path if needed
import dayjs from "dayjs";

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = params; // 👈 here’s your reservation id
    const db = getDb();

    try {
        const [rows] = await db.query(
            `SELECT 
      reservations.*,
      patient.name AS patient_name,
      patient.whatsapp_number AS patient_whatsapp_number,
      staff.name AS staff_name
    FROM reservations
    JOIN users AS patient ON patient.id = reservations.patient_id
    JOIN users AS staff ON staff.id = reservations.staff_id
    WHERE reservations.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Reservation not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}