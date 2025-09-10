"use client";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { fetchPublicSiteSettings, paymentList } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import dayjs from "dayjs";
import { printInvoice } from "@/components/commons/printInvoice";

export default function BillingDetailsPage() {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [dataList, getDataList, { loading }] = useFetch(paymentList);
    const [settings, getSettings, { loading: settingsLoading }] = useFetch(
        fetchPublicSiteSettings
    );

    


    const handleViewInvoice = (invoice) => {

        setSelectedInvoice({
            ...invoice,
            name: settings.site_name,
            phone: settings.site_phone,
            email: settings.site_email,
            address: settings.site_address,
        });
        setIsInvoiceModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "text-red-500";
            case "paid":
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    const renderSkeletonTable = () => (
        <div className="overflow-x-auto border rounded-lg my-20">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="font-semibold textColor py-3 px-2">INVOICE ID</th>
                        <th className="font-semibold textColor py-3 px-2">DATE</th>
                        <th className="font-semibold textColor py-3 px-2">STATUS</th>
                        <th className="font-semibold textColor py-3 px-2 text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <tr key={idx}>
                            <td className="py-4 px-2"><div className="bg-gray-200 h-4 w-24 rounded animate-pulse" /></td>
                            <td className="py-4 px-2"><div className="bg-gray-200 h-4 w-32 rounded animate-pulse" /></td>
                            <td className="py-4 px-2"><div className="bg-gray-200 h-4 w-20 rounded animate-pulse" /></td>
                            <td className="py-4 px-2 text-center"><div className="bg-gray-200 h-8 w-24 rounded animate-pulse mx-auto" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-screen py-[64px] flex justify-end ">
            <div className="pl-12 w-full  ">
                <Tabs defaultValue="invoice" className="w-full">
                    <TabsList className=" w-[50%] grid-cols-3 mb-6  h-auto hidden">
                        <TabsTrigger
                            value="invoice"
                            className={"primaryText textColor font-semibold"}
                        >
                            INVOICE
                        </TabsTrigger>
                        <TabsTrigger
                            value="payments"
                            className={"primaryText textColor font-semibold"}
                        >
                            PAYMENTS
                        </TabsTrigger>
                        <TabsTrigger
                            value="statements"
                            className={"primaryText textColor font-semibold"}
                        >
                            STATEMENTS
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="invoice">
                        <h1 className="secondaryText font-semibold textColor mb-6">
                            Your Latest Invoices
                        </h1>

                        {loading ? (
                            renderSkeletonTable()
                        ) : (
                            <div className="overflow-x-auto border rounded-lg">
                                <Table className={"primaryText"}>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold textColor">
                                                INVOICE ID
                                            </TableHead>
                                            <TableHead className="font-semibold textColor">
                                                DATE
                                            </TableHead>
                                            <TableHead className="font-semibold textColor">
                                                STATUS
                                            </TableHead>
                                            <TableHead className="font-semibold textColor text-center">
                                                ACTION
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className={"textColor"}>
                                        {dataList?.docs?.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="">{data?.invoice_id}</TableCell>
                                                <TableCell>
                                                    {dayjs(data?.createdAt).format("MMMM D, YYYY")}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={` ${getStatusColor(data.status)}`}>
                                                        {data.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={"flex justify-center"}>
                                                    <div className="flex gap-2 ">
                                                        <Button
                                                            variant="outline"
                                                            className={"primaryText cursor-pointer"}
                                                            onClick={() => handleViewInvoice(data)}
                                                        >
                                                            View Invoice
                                                        </Button>
                                                        {/* <Button
                                                        variant="outline"
                                                        className="flex items-center cursor-pointer gap-2 primaryText"
                                                    // onClick={() => printInvoice(data, "$")}
                                                    >
                                                        Download
                                                        <Download className="w-6 h-6" />
                                                    </Button> */}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {!loading && (
                            <div className="flex gap-2 justify-end mt-5">
                                <Button
                                    variant="outline"
                                    disabled={dataList?.page === 1}
                                    onClick={() => getDataList({ page: dataList?.page - 1 })}
                                    className={"subtitleText textColor cursor-pointer w-[100px]"}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={dataList?.page === dataList?.totalPages}
                                    onClick={() => getDataList({ page: dataList?.page + 1 })}
                                    className={"subtitleText textColor cursor-pointer w-[100px]"}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    {/* <TabsContent value="payments">
            <h1 className="secondaryText font-semibold textColor mb-6">
              Your Payments
            </h1>
            <div className="p-8 text-center primaryText textColor">
              Payments content coming soon...
            </div>
          </TabsContent> */}

                    {/* <TabsContent value="statements">
            <h1 className="secondaryText font-semibold textColor mb-6">
              Statement
            </h1>

            <div className="overflow-x-auto border rounded-lg">
              <Table className={"primaryText"}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold textColor">
                      ORDER ID
                    </TableHead>
                    <TableHead className="font-semibold textColor">
                      DATE
                    </TableHead>
                    <TableHead className="font-semibold textColor">
                      DETAILS
                    </TableHead>
                    <TableHead className="font-semibold textColor text-right">
                      TOTAL
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statements.map((statement, index) => (
                    <TableRow key={index} className="textColor">
                      <TableCell>{statement.orderId}</TableCell>
                      <TableCell>{statement.date}</TableCell>
                      <TableCell className="max-w-xs">
                        {statement.details}
                      </TableCell>
                      <TableCell className="text-right ">
                        {statement.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="flex items-center gap-2 primaryText"
              >
                Download
                <Download className="!w-6 !h-6" />
              </Button>
            </div>
          </TabsContent> */}
                </Tabs>
            </div>

            <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
                <DialogContent className="lg:!max-w-[60vw] !max-w-[100vw] max-h-[100vh] textColor font-poppins overflow-hidden py-0 flex flex-col">
                    <DialogHeader className="py-6 px-6 flex-shrink-0">
                        <DialogTitle className="text-xl font-semibold hidden">
                            Invoice Preview
                        </DialogTitle>
                    </DialogHeader>

                    {selectedInvoice && (
                        <div className="flex-1 overflow-y-auto px-6 pb-6">
                            <div className="bg-white p-2 space-y-6">
                                <div className="flex justify-between items-center border-b pb-3">
                                    <div>
                                        <Image
                                            src={"/logo_b.png"}
                                            alt="logo"
                                            className="w-40 h-20"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="primaryText font-semibold">INVOICE</h2>
                                    </div>
                                    <div className="text-sm text-[#404040] invoiceText">
                                        <h2 className=" font-semibold">Invoice No:</h2>
                                        <div className=" space-y-1 ">
                                            <div>{selectedInvoice?.invoice_id}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <div className="space-y-1.5 text-sm">
                                            <p>
                                                <span className="font-semibold">Sold to:</span>{" "}
                                                {selectedInvoice?.user_details?.first_name} {selectedInvoice?.user_details?.last_name}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Phone No:</span>{" "}
                                                {selectedInvoice?.user_details?.mobile}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Email:</span>{" "}
                                                {selectedInvoice?.user_details?.email}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Address:</span>{" "}
                                                {selectedInvoice?.user_details?.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div></div>
                                    <div className=" space-y-1.5 text-sm ">
                                        <p>
                                            <span className="font-semibold">Order No:</span>{" "}
                                            {selectedInvoice?.order_id}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Order Date:</span>{" "}
                                            {dayjs(selectedInvoice?.order_date).format("MMMM D, YYYY")}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Invoice Date:</span>{" "}
                                            {dayjs(selectedInvoice?.createdAt).format("MMMM D, YYYY")}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Payment terms:</span>{" "}
                                            {selectedInvoice?.paymentTerms}
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto my-10">
                                    <table className="w-full border">
                                        <thead>
                                            <tr className="bg-[#DEE2E6] border-gray-300 border-b">
                                                <th className="text-left py-3 font-semibold pl-4">
                                                    Product
                                                </th>
                                                <th className="text-center py-3 font-semibold">QTY</th>
                                                <th className="text-center py-3 font-semibold">
                                                    Price
                                                </th>
                                                <th className="text-center py-3 font-semibold">
                                                    Discount Price
                                                </th>
                                                <th className="text-right py-3 font-semibold pr-4">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedInvoice?.products?.map((product, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-4 pl-4">
                                                        <p className="font-medium text-sm">
                                                            {product?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {product?.description.en.slice(0,60)}...
                                                        </p>
                                                    </td>
                                                    <td className="text-center py-4 w-[100px]">
                                                        {product?.quantity}
                                                    </td>
                                                    <td className="text-center py-4 w-[100px] ">
                                                        ${product?.price}
                                                    </td>
                                                    <td className="text-center py-4 w-[140px]">
                                                        ${product?.price - product?.discount_price}
                                                    </td>
                                                    <td className="text-right py-4 font-medium px-4">
                                                        ${product?.discount_price * product?.quantity}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="text-end font-semibold py-4">
                                                    Discount:
                                                </td>
                                                <td className="text-right py-4 font-semibold px-4">
                                                    $
                                                    {selectedInvoice?.total_price -
                                                        selectedInvoice?.amount}
                                                </td>
                                            </tr>
                                            <tr className="bg-[#DEE2E6]">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="text-end font-semibold py-4">Total:</td>
                                                <td className="text-right py-4 font-semibold px-4">
                                                    ${selectedInvoice?.amount}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="mt-8 pt-6 border-gray-200">
                                        <div>
                                            <span className="font-semibold text-sm mb-2">
                                                Terms and Policy:
                                            </span>{" "}
                                            <span className="text-xs">
                                                {" "}
                                                Please review the following important details
                                            </span>
                                        </div>
                                        <div className="text-xs  space-y-1">
                                            <p>1. Please review the following important details.</p>
                                            <p>
                                                2. Our satisfaction guarantee ensures high standards are
                                                met for all products.
                                            </p>
                                            <p>
                                                3. Returns are accepted on unused items within 7 - 14
                                                days of delivery.
                                            </p>
                                            <p>
                                                4. Please visit their repair and repair damages on site
                                                before acceptance.
                                            </p>
                                            <p>
                                                5. Goods will be delivered within 2-3 working days from
                                                confirmation of order.
                                            </p>
                                            <p>
                                                6. For support or questions, contact us through our
                                                website or customer service email.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Image
                                            src={"/logo_b.png"}
                                            alt="logo"
                                            className="w-25 h-13"
                                            width={300}
                                            height={300}
                                        />
                                        <div className="">
                                            <h3 className="">Thank You!</h3>
                                            <p className="-leading-1">For being with us</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-center">
                                    <p className="text-sm text-gray-600">
                                        {settings.site_address}, Helpline:
                                        {settings.site_phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        className="m-4 w-40 self-end cursor-pointer bg-primary text-white"
                        onClick={() => printInvoice(selectedInvoice, "$")}
                    >
                        print
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}





