import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";



// GET INVOICE SETTINGS

export async function GET() {

  try {

    const user = await requirePermission("settings.view");



    let settings = await prisma.setting.findUnique({

      where: {
        companyId: user.companyId,
      },

    });



    // Create default settings if missing

    if (!settings) {

      settings = await prisma.setting.create({

        data: {

          companyId: user.companyId,

        },

      });

    }



    return NextResponse.json(settings);



  } catch(error) {


    return NextResponse.json(

      {
        message:
          error instanceof Error
            ? error.message
            : "Unauthorized",
      },

      {
        status:401,
      }

    );


  }

}







// UPDATE INVOICE SETTINGS

export async function PUT(req: Request) {


  try {


    const user = await requirePermission(
      "settings.update"
    );



    const body = await req.json();



    const settings = await prisma.setting.upsert({

      where: {

        companyId: user.companyId,

      },


      create: {

        companyId: user.companyId,


        quotationPrefix:
          body.quotationPrefix || "QTN",


        invoicePrefix:
          body.invoicePrefix || "INV",


        paymentPrefix:
          body.paymentPrefix || "PAY",


        quotationCounter:
          Number(body.quotationCounter) || 1,


        invoiceCounter:
          Number(body.invoiceCounter) || 1,


        paymentCounter:
          Number(body.paymentCounter) || 1,


        defaultTax:
          Number(body.defaultTax) || 0,

      },


      update: {


        quotationPrefix:
          body.quotationPrefix,


        invoicePrefix:
          body.invoicePrefix,


        paymentPrefix:
          body.paymentPrefix,


        quotationCounter:
          Number(body.quotationCounter),


        invoiceCounter:
          Number(body.invoiceCounter),


        paymentCounter:
          Number(body.paymentCounter),


        defaultTax:
          Number(body.defaultTax),


      },

    });





    await prisma.activityLog.create({

      data: {


        companyId:user.companyId,


        userId:user.id,


        action:"UPDATE_INVOICE_SETTINGS",


        entity:"Setting",


        entityId:settings.id,


      },

    });




    return NextResponse.json(settings);



  } catch(error) {


    return NextResponse.json(

      {
        message:
          error instanceof Error
          ? error.message
          :"Failed updating invoice settings",
      },

      {
        status:500,
      }

    );


  }


}