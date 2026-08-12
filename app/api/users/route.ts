import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

// GET USERS

export async function GET() {
  try {
    const user = await requirePermission("users.view");

    const users = await prisma.user.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Forbidden",
      },
      {
        status: 403,
      },
    );
  }
}

// CREATE USER

export async function POST(req: Request) {
  try {
    const currentUser = await requirePermission("users.create");

    const body = await req.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const roleId = body.roleId;
    const active = body.active ?? true;

    if (!fullName || !email || !password || !roleId) {
      return NextResponse.json(
        {
          message: "Missing fields",
        },
        {
          status: 400,
        },
      );
    }

    // check email

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        },
      );
    }

    // check role belongs to company

    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        companyId: currentUser.companyId,
      },
    });

    if (!role) {
      return NextResponse.json(
        {
          message: "Invalid role",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,

        email,

        password: hashedPassword,

        roleId,

        companyId: currentUser.companyId,
      },
    });

    // activity log

    await prisma.activityLog.create({
      data: {
        companyId: currentUser.companyId,

        userId: currentUser.id,

        action: "CREATE_USER",

        entity: "User",

        entityId: newUser.id,
      },
    });

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json(safeUser, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error creating user",
      },
      {
        status: 500,
      },
    );
  }
}
