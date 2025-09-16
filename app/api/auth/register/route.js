// app/api/patients/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getDb } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, whatsapp_number, password, gender, existing_patient } = body;

    if (!name || !email || !whatsapp_number || !password || !gender) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new patient
    const [result] = await db.query(
      `INSERT INTO users 
        (name, email, whatsapp_number, password, role, gender, is_active, existing_patient) 
       VALUES (?, ?, ?, ?, 'patient', ?, true, ?)`,
      [name, email, whatsapp_number, hashedPassword, gender, existing_patient ? 1 : 0]
    );

    return NextResponse.json({
      success: true,
      message: "Patient registered successfully",
      userId: result.insertId,
    }, {
        status: 200
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
