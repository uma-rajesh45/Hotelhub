-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "loacationdescription" TEXT NOT NULL,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "spa" BOOLEAN NOT NULL DEFAULT false,
    "bar" BOOLEAN NOT NULL DEFAULT false,
    "laundry" BOOLEAN NOT NULL DEFAULT false,
    "restaurant" BOOLEAN NOT NULL DEFAULT false,
    "shopping" BOOLEAN NOT NULL DEFAULT false,
    "freeparking" BOOLEAN NOT NULL DEFAULT false,
    "bikerental" BOOLEAN NOT NULL DEFAULT false,
    "freewifi" BOOLEAN NOT NULL DEFAULT false,
    "movienights" BOOLEAN NOT NULL DEFAULT false,
    "swimmingpool" BOOLEAN NOT NULL DEFAULT false,
    "coffeshop" BOOLEAN NOT NULL DEFAULT false,
    "addedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bedcount" INTEGER NOT NULL DEFAULT 0,
    "guestcount" INTEGER NOT NULL DEFAULT 0,
    "bathroomcount" INTEGER NOT NULL DEFAULT 0,
    "kindbed" INTEGER NOT NULL DEFAULT 0,
    "queenbed" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "breakfastprice" INTEGER NOT NULL,
    "roomprice" INTEGER NOT NULL,
    "roomservice" BOOLEAN NOT NULL DEFAULT false,
    "tv" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "freewifi" BOOLEAN NOT NULL DEFAULT false,
    "cityview" BOOLEAN NOT NULL DEFAULT false,
    "oceanview" BOOLEAN NOT NULL DEFAULT false,
    "forestview" BOOLEAN NOT NULL DEFAULT false,
    "mountainview" BOOLEAN NOT NULL DEFAULT false,
    "aircondition" BOOLEAN NOT NULL DEFAULT false,
    "soundproofed" BOOLEAN NOT NULL DEFAULT false,
    "hotelid" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "roomid" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    "hotelownerid" TEXT NOT NULL,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3) NOT NULL,
    "breakfastincluded" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "totalprice" INTEGER NOT NULL,
    "paymentstatus" BOOLEAN NOT NULL DEFAULT false,
    "paymentintentid" TEXT NOT NULL,
    "bookedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Room_hotelid_idx" ON "Room"("hotelid");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentintentid_key" ON "Booking"("paymentintentid");

-- CreateIndex
CREATE INDEX "Booking_hotelid_idx" ON "Booking"("hotelid");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
