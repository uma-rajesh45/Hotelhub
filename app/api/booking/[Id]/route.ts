import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { Id: string } }
) => {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorized", { status: 400 });
  }
  if (!params.Id) {
    return new NextResponse("Payment Intent Id Is Required", { status: 400 });
  }
  try {
    const booking = await prisma.booking.update({
      where: {
        paymentintentid: params.Id,
      },
      data: {
        paymentstatus: true,
      },
    });
    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return new NextResponse(
      "Something is wrong with server so please try again later"
    );
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { Id: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 400 });
    }
    if (!params.Id) {
      return new NextResponse("hotel Id Is Required", { status: 400 });
    }
    const yesterDay = new Date();
    yesterDay.setDate(yesterDay.getDate() - 1);
    const bookings = await prisma.booking.findMany({
      where: {
        roomid: params.Id,
        paymentstatus:true,
        enddate: {
          gt: yesterDay,
        },
      },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return new NextResponse(
      "Something is wrong with server so please try again later"
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { Id: string } }
) => {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorized", { status: 400 });
  }
  if (!params.Id) {
    return new NextResponse("Booking id is required", { status: 400 });
  }
  try {
    await prisma.booking.delete({
      where: {
        id: params.Id,
      },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return new NextResponse(
      "Something is wrong with server so please try again later",
      { status: 500 }
    );
  }
};
