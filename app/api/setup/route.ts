import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      companyName,
      companyEmail,
      companyPhone,
      fullName,
      email,
      password,
    } = body;

    // =========================================
    // VALIDATION
    // =========================================

    if (!companyName || !fullName || !email || !password) {
      return NextResponse.json(
        {
          message: "Company name, full name, email and password are required",
        },
        {
          status: 400,
        },
      );
    }

    // =========================================
    // CHECK IF SYSTEM IS ALREADY INITIALIZED
    // =========================================

    const existingUser = await prisma.user.findFirst();

    if (existingUser) {
      return NextResponse.json(
        {
          message: "System already initialized",
        },
        {
          status: 400,
        },
      );
    }

    // =========================================
    // HASH PASSWORD
    // =========================================

    const hashedPassword = await bcrypt.hash(password, 12);

    // =========================================
    // CREATE COMPANY + SUPER ADMIN ROLE + USER
    // =========================================

    const result = await prisma.$transaction(async (tx) => {
      // -----------------------------------------
      // CREATE COMPANY
      // -----------------------------------------

      const company = await tx.company.create({
        data: {
          name: companyName,
          email: companyEmail || null,
          phone: companyPhone || null,
        },
      });

      // -----------------------------------------
      // CREATE SUPER ADMIN ROLE
      // -----------------------------------------

      const role = await tx.role.create({
        data: {
          name: "SUPER_ADMIN",

          description: "System Super Administrator",

          companyId: company.id,

          isSystem: true,
        },
      });

      // -----------------------------------------
      // CREATE USER
      // -----------------------------------------

      const user = await tx.user.create({
        data: {
          fullName,

          email,

          password: hashedPassword,

          active: true,

          companyId: company.id,

          roleId: role.id,
        },
      });

      return {
        company,
        role,
        user,
      };
    });

    // =========================================
    // REMOVE PASSWORD FROM RESPONSE
    // =========================================

    const { password: _password, ...safeUser } = result.user;

    // =========================================
    // RESPONSE
    // =========================================

    return NextResponse.json(
      {
        message: "System setup completed",

        company: result.company,

        role: result.role,

        user: safeUser,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("SETUP ERROR:", error);

    return NextResponse.json(
      {
        message: "Setup failed",
      },
      {
        status: 500,
      },
    );
  }
}
