import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear database (development only)
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.company.deleteMany();

  // Create Company
  const company = await prisma.company.create({
    data: {
      name: "TinaSoft Nexus",
      email: "sales@tinasoftnexus.com",
      phone: "+263712471209",
      currency: "USD",
    },
  });

  // Permissions

  const permissions = [
    // Roles
    "roles.view",
    "roles.create",
    "roles.update",
    "roles.delete",

    // Permissions
    "permissions.view",

    // Users
    "users.view",
    "users.create",
    "users.update",
    "users.delete",

    // Clients
    "clients.view",
    "clients.create",
    "clients.update",
    "clients.delete",

    // Products
    "products.view",
    "products.create",
    "products.update",
    "products.delete",

    // Services
    "services.view",
    "services.create",
    "services.update",
    "services.delete",

    // Quotations
    "quotations.view",
    "quotations.create",
    "quotations.update",
    "quotations.delete",
    "quotations.approve",
    "quotations.send",

    // Invoices
    "invoices.view",
    "invoices.create",
    "invoices.update",
    "invoices.delete",
    "invoices.send",

    // Payments
    "payments.view",
    "payments.create",
    "payments.delete",

    // Reports
    "reports.view",

    // Settings
    "settings.view",
    "settings.update",
  ];

  const createdPermissions = [];

  for (const permission of permissions) {
    const created = await prisma.permission.create({
      data: {
        name: permission,
      },
    });

    createdPermissions.push(created);
  }

  // Create Roles

  const superAdminRole = await prisma.role.create({
    data: {
      name: "SUPER_ADMIN",
      description: "Full system access",
      companyId: company.id,
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "ADMIN",
      description: "Company administrator",
      companyId: company.id,
    },
  });

  const staffRole = await prisma.role.create({
    data: {
      name: "STAFF",
      description: "Normal staff user",
      companyId: company.id,
    },
  });

  // SUPER ADMIN gets everything

  await prisma.rolePermission.createMany({
    data: createdPermissions.map((permission) => ({
      roleId: superAdminRole.id,

      permissionId: permission.id,
    })),
  });

  // ADMIN permissions

  await prisma.rolePermission.createMany({
    data: createdPermissions

      .filter((permission) =>
        [
          "users.view",
          "users.create",
          "users.update",

          "roles.view",

          "clients.view",
          "clients.create",
          "clients.update",

          "products.view",
          "products.create",
          "products.update",

          "services.view",
          "services.create",
          "services.update",

          "quotations.view",
          "quotations.create",
          "quotations.update",
          "quotations.approve",
          "quotations.send",

          "invoices.view",
          "invoices.create",
          "invoices.update",
          "invoices.send",

          "payments.view",
          "payments.create",

          "reports.view",

          "settings.view",
        ].includes(permission.name),
      )

      .map((permission) => ({
        roleId: adminRole.id,

        permissionId: permission.id,
      })),
  });

  // STAFF permissions

  await prisma.rolePermission.createMany({
    data: createdPermissions

      .filter((permission) =>
        [
          "clients.view",

          "products.view",

          "services.view",

          "quotations.view",
          "quotations.create",

          "invoices.view",

          "payments.view",
        ].includes(permission.name),
      )

      .map((permission) => ({
        roleId: staffRole.id,

        permissionId: permission.id,
      })),
  });

  // Create Settings

  await prisma.setting.create({
    data: {
      companyId: company.id,
    },
  });

  // Create Super Admin User

  const password = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      fullName: "Super Admin",

      email: "admin@tinasoft.com",

      password,

      companyId: company.id,

      roleId: superAdminRole.id,
    },
  });

  console.log("Seed completed 🚀");
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
