"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useFetch } from "@/app/helper/hooks";
import { fetchOrders } from "@/app/helper/backend";
import dayjs from "dayjs";

export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, getOrders, { loading }] = useFetch(fetchOrders);

  const handleDetailClick = (order) => {

    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    return status === "confirmed" ? "text-yellow-500" : "text-red-500";
  };

  // Skeleton Loader for table
  const renderSkeletonTable = () => (
    <div className="border rounded-md my-10">
      <Table className="table-auto subtitleText">
        <TableHeader>
          <TableRow>
            {["ORDER ID", "DATE", "STATUS", "TOTAL", "ACTION"].map((head) => (
              <TableHead key={head} className="font-semibold textColor">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-16 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const totalDiscounted = selectedOrder
    ? selectedOrder?.products.reduce(
        (sum, p) => sum + p?.discount_price * p.quantity,
        0
      )
    : 0;

  return (
    <div className="min-h-screen py-[64px] flex justify-end">
      <div className="pl-12 w-full">
        <h1 className="mb-4 secondaryText font-bold textColor">Order History</h1>

        {!orders && loading ? (
          renderSkeletonTable()
        ) : (
          <div className="border rounded-md my-10">
            <Table className="table-auto subtitleText">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold textColor">ORDER ID</TableHead>
                  <TableHead className="font-semibold w-auto textColor">DATE</TableHead>
                  <TableHead className="font-semibold w-auto textColor">STATUS</TableHead>
                  <TableHead className="font-semibold w-auto textColor">TOTAL</TableHead>
                  <TableHead className="font-semibold textColor">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="textColor">
                {orders?.docs?.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order?.orderId}</TableCell>
                    <TableCell>{dayjs(order?.createdAt).format("MMMM D, YYYY")}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getStatusColor(order?.order_status)}`}>
                        {order?.order_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      ${order?.total_price.toFixed(2)} / {order?.products.length} ITEMS
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDetailClick(order)}
                        className="subtitleText cursor-pointer"
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              disabled={orders?.page === 1}
              onClick={() => getOrders({ page: orders?.page - 1 })}
              className={"subtitleText textColor cursor-pointer w-[100px]"}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={orders?.page === orders?.totalPages}
              onClick={() => getOrders({ page: orders?.page + 1 })}
              className={"subtitleText textColor cursor-pointer w-[100px]"}
            >
              Next
            </Button>
          </div>
        )}

        {/* Order Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="lg:!max-w-[60vw] !max-w-[100vw] max-h-[90vh] overflow-hidden py-0 flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between py-6 px-6 flex-shrink-0">
              <DialogTitle className="text-[28px] font-bold textColor">
                Order Details
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-4 primaryText textColor">
                      <span>{selectedOrder?.orderId}</span>
                      <span>{dayjs(selectedOrder?.createdAt).format("MMMM D, YYYY")}</span>
                      <span>{selectedOrder?.products.length} ITEMS</span>
                      <span className={getStatusColor(selectedOrder?.order_status)}>
                        {selectedOrder?.order_status}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table className="primaryText textColor">
                      <TableHeader className="border-t">
                        <TableRow>
                          <TableHead className="w-auto textColor font-semibold">Image</TableHead>
                          <TableHead className="w-auto textColor font-semibold">PRODUCT</TableHead>
                          <TableHead className="text-center min-w-[80px] textColor font-semibold">
                            QUANTITY
                          </TableHead>
                          <TableHead className="text-right min-w-[80px] textColor font-semibold">
                            PRICE
                          </TableHead>
                          <TableHead className="text-right min-w-[80px] textColor font-semibold">
                            TOTAL
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder?.products?.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {product?.thumbnail_image ? (
                                <Image
                                  src={product.thumbnail_image}
                                  alt={product?.name || "Product Image"}
                                  className="w-10 h-10 rounded bg-gray-100"
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                  N/A
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="min-w-[300px]">
                              <div className="flex items-center gap-3">
                                <span>{product?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{product?.quantity}</TableCell>
                            <TableCell className="text-right">
                              ${product?.discount_price?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              ${(product?.discount_price * product?.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-semibold">
                            Discount
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-500">
                            ${(totalDiscounted - selectedOrder?.total_price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-semibold">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${selectedOrder?.total_price.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
