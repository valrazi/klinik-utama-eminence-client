// app/api/staff/route.js
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route"; // adjust path if needed
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
        const [user] = await db.query(
            "SELECT name, gender, whatsapp_number FROM users WHERE email = ? LIMIT 1",
            [session.user.email]
        )
        return NextResponse.json({ success: true, user: user[0] });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
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
        const name = body.nama_lengkap
        const whatsappNumber = body.no_telepon
        if(!name || !whatsappNumber) {
            return NextResponse.json(
                { success: false, message: "Nama Lengkap dan No Whatsapp wajib diisi!", },
                { status: 400 }
            );
        }
        const [user] = await db.query(
            "SELECT name, gender, whatsapp_number FROM users WHERE email = ? LIMIT 1",
            [session.user.email]
        )
        if (user.length == 0) {
            return NextResponse.json(
                { success: false, message: "User not found", },
                { status: 404 }
            );
        }

        await db.query(
            "UPDATE users SET name = ?, whatsapp_number = ? WHERE email = ?",
            [name, whatsappNumber, session.user.email]
        )
        return NextResponse.json({ success: true, user: user[0] });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}