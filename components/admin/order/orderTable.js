"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/commons/data-table/dataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFetch } from "@/app/helper/hooks";
import { fetchSingleOrder, orderByAdmin, updateOrderStatus } from "@/app/helper/backend";

export default function OrdersTable({dashboard,dashboardData }) {
  const [openView, setOpenView] = useState(false);
  const [data, getData, { loading }] = useFetch(orderByAdmin, {limit:dashboard ? 5 : 10});
  const [singleData, setSingleData] = useState({});
  const handleDataChange = ({ search, filters, page }) => {
    let payload = {
      page,
      search,
      ...(filters.order_status && {
        order_status:
          filters.order_status !== "all" ? filters.order_status : undefined,
      }),
      ...(filters.payment && {
        payment:
          filters.payment !== "all" ? filters.payment : undefined,
      }),
      ...(filters.payment_method && {
        payment_method:
          filters.payment_method !== "all" ? filters.payment_method : undefined,
      }),
    };
    getData(payload);
  };

  const columns = [
    {
      accessorKey: "order_id",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Order ID
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.orderId || "—"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Email
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.user_details?.email}
        </span>
      ),
    },
    {
      accessorKey: "mobile",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Mobile
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.user_details?.mobile}
        </span>
      ),
    },
    {
      accessorKey: "payment_type",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Payment Type
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.payment_type}
        </span>
      ),
    },
    {
      accessorKey: "payment_method",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Payment Method
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.payment_method}
        </span>
      ),
    },
    {
      accessorKey: "total_price",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Total Price
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.total_price}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const handleStatusChange = async (value) => {
          const data = await updateOrderStatus({
            _id: row.original._id,
            order_status: value,
          });

          if (data.success) {
            toast.success(data.message || "Order status updated successfully!");
            getData({ page: 1 });
            if(dashboard){
               dashboardData()
            }
          }
        };

        return (
          <div>
            {row.original.order_status === "cancelled" ? (
              <span className="text-red-500 subtitleText">
                {row.original.order_status}
              </span>
            ) : (
              <Select
                defaultValue={row.original.order_status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue
                    placeholder="Select status"
                    className={"subtitleText placeholder:subtitleText"}
                  />
                </SelectTrigger>
                <SelectContent className={"subtitleText"}>
                  {row.original.payment !== "paid" && <SelectItem value="pending">Pending</SelectItem>}
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  {row.original.payment !== "paid" &&<SelectItem value="cancelled">Cancelled</SelectItem>}
                  {/* <SelectItem value="return">Returned</SelectItem> */}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "payment",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Payment Status
        </div>
      ),
      cell: ({ row }) => (
        <p
          className={`text-center subtitleText ${row.original.payment === "paid" ? "text-green-600" : "text-red-600"}`}
        >
          {row.original.payment}
        </p>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="subtitleText font-bold px-4  text-gray-800 text-end">
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const single = await fetchSingleOrder({ id: row.original._id });
              setSingleData(single?.data);
              setOpenView(true);
            }}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <Eye className="size-5" />
          </Button>
        </div>
      ),
    },
  ];

  const filter = [
          {
            key: 'payment_method',
            field: 'payment_method',
            type: 'select',
            label: 'Payment Method',
            placeholder: 'Filter by payment_method',
            options: [
              { value: 'stripe', label: 'Stripe' },
              { value: 'paypal', label: 'Paypal' },
              { value: 'cod', label: 'Cod' },
            ]
          },
          {
            key: 'order_status',
            field: 'order_status',
            type: 'select',
            label: 'Order Status',
            placeholder: 'Filter by role',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'returned', label: 'Returned' },
              { value: 'cancelled', label: 'Cancelled' },
            ]
          },
          {
            key: 'payment',
            field: 'payment',
            type: 'select',
            label: 'Payment Status',
            placeholder: 'Filter by role',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'failed', label: 'Failed' },
            ]
          },
        ]


  return (
    <>
      <DataTable
        data={data?.docs || []}
        columns={columns}
        loading={loading}
        title={ "Orders List"}
        description=""
        icon={!dashboard && LayoutDashboard}
        searchConfig={!dashboard && {
          placeholder: "Search by order ID...",
          fields: ["order_id"],
          serverSide: true,
        }}
        filterConfig={dashboard ? [] : filter}
        paginationConfig={dashboard ? {} :{
          serverSide: true,
          itemsPerPage: 10,
          totalItems: data?.totalDocs || 0,
        }}
        onDataChange={handleDataChange}
        emptyMessage="No orders found"
        noResultsMessage="No matching orders"
      // actionButton={actionButton}
      />
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="overflow-hidden p-0 flex flex-col lg:!max-w-[60vw] !max-w-[100vw]">
          {/* Header */}
          <DialogHeader className="border-b">
            <DialogTitle className="p-4 text-center text-lg font-semibold">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5 space-y-6">
            {/* Customer & Shipping Information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Info */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Customer Information</h3>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {singleData?.user_details?.first_name}{" "}
                  {singleData?.user_details?.last_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {singleData?.user_details?.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {singleData?.user_details?.mobile}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>
                  <span className="text-blue-600 ml-1">
                    {singleData?.payment_method}
                  </span>
                </p>
                {singleData?.payment?.transaction_id && <p>
                  <span className="font-medium">Transaction Id:</span>
                  <span className="text-blue-600 ml-1">
                    {singleData?.payment?.transaction_id}
                  </span>
                </p>}
              </div>

              {/* Shipping Info */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Shipping Information</h3>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {singleData?.user_details?.address}
                </p>
                <p>
                  <span className="font-medium">City:</span>{" "}
                  {singleData?.user_details?.city}
                </p>
                <p>
                  <span className="font-medium">Zip Code:</span>{" "}
                  {singleData?.user_details?.zip_code}
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>
                  <span
                    className={`ml-1 ${singleData?.payment?.status === "paid"
                      ? "text-green-600"
                      : "text-orange-500"
                      }`}
                  >
                    {singleData?.payment?.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Product List */}
            <div>
              <h3 className="font-semibold mb-2">Product List</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Product</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Discount</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {singleData?.products?.map((product, idx) => (
                    <tr key={`${product.name}-${product.price}-${idx}`} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2">${product.price}</td>
                      <td className="py-2 text-red-500">
                        {product.discount_price
                          ? `$${product.price - product.discount_price}`
                          : "—"}
                      </td>
                      <td className="py-2">{product.quantity}</td>
                      <td className="py-2">
                        $
                        {product.discount_price
                          ? product.discount_price * product.quantity
                          : product.price * product.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Subtotal & Total */}
              <div className="flex justify-end items-end flex-col mt-4 space-y-1">
                <p className="subtitleText ">
                  <span className="font-medium">Subtotal:</span> $
                  {singleData?.payment?.amount}
                </p>
                <p className="subtitleText">
                  <span className="font-medium">Total:</span> $
                  {singleData?.total_price}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
