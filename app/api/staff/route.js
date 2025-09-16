// app/api/staff/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed

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

        const role = services === "injury" ? "doctor" : "therapist";

        if (services === 'injury') {
            // fetch staff by role + same gender
            const [staff] = await db.query(
                "SELECT id, name, email, whatsapp_number, role, gender " +
                "FROM users WHERE role = ? AND is_active = 1",
                [role]
            );

            return NextResponse.json({ success: true, staff });
        } else {
            if (services == 'massage') {
                const [patients] = await db.query(
                    "SELECT gender FROM users WHERE email = ? LIMIT 1",
                    [session.user.email]
                );

                if (patients.length === 0) {
                    return NextResponse.json(
                        { success: false, message: "Patient not found" },
                        { status: 404 }
                    );
                }

                const patientGender = patients[0].gender;
                // fetch staff by role + same gender
                const [staff] = await db.query(
                    "SELECT id, name, email, whatsapp_number, role, gender " +
                    "FROM users WHERE role = ? AND gender = ? AND is_active = 1",
                    [role, patientGender]
                );

                return NextResponse.json({ success: true, staff });
            } else {
                const [staff] = await db.query(
                    "SELECT id, name, email, whatsapp_number, role, gender " +
                    "FROM users WHERE role = ? AND is_active = 1",
                    [role]
                );

                return NextResponse.json({ success: true, staff });
            }

        }
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}
