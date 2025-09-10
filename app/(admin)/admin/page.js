"use client";

import { useEffect, useState } from "react";
import { fetchDashboard } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import OrdersTable from "@/components/admin/order/orderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [data, getData, { loading }] = useFetch(fetchDashboard, {});

  // 📌 Set current year & month on first load
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState  (currentYear);
  const [selectedMonth, setSelectedMonth] = useState  (currentMonth);

  // Fetch when year/month changes
  useEffect(() => {
    getData({
      year: selectedYear,
      month: selectedMonth,
    });
  }, [selectedYear, selectedMonth]);

  // === Placeholder skeletons ===
  const skeletonArray = [1, 2, 3, 4];

  const month = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Orders Summary Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {skeletonArray.map((i) => (
            <Card
              key={i}
              className="animate-pulse rounded-2xl h-28 bg-gray-100"
            />
          ))}
        </div>

        {/* Revenue Summary Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {skeletonArray.map((i) => (
            <Card
              key={i}
              className="animate-pulse rounded-2xl h-28 bg-gray-100"
            />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="space-y-4">
          {["week", "month", "year"].map((i) => (
            <Card
              key={i}
              className="animate-pulse rounded-2xl h-80 bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/*  */}

      <div className="flex gap-2">
        <Select
          value={String(selectedYear)}
          onValueChange={(val) => setSelectedYear(Number(val))}
        >
          <SelectTrigger className="w-[130px] !h-12 subtitleText">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {data?.yearList?.map((item, idx) => (
              <SelectItem key={idx} value={String(item)}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(selectedMonth)}
          onValueChange={(val) => setSelectedMonth(Number(val))}
        >
          <SelectTrigger className="w-[130px] !h-12 subtitleText">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {month.map((item) => (
              <SelectItem key={item.value} value={String(item.value)}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card className="rounded-2xl shadow-md col-span-2">
          <CardContent className={'relative'}>
            <div className="space-y-2 border-b text-center py-5">
              <p className="capitalize primaryText font-semibold">Total Revenue</p>
              <p className="primaryText">${data?.revenue?.totalRevenue}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-10 place-items-center">
              <div className="space-y-1 text-center">
                <p className="subtitleText font-semibold ">Weekly Revenue</p>
                <p className="subtitleText">${data?.revenue?.weeklyRevenue}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="subtitleText font-semibold">Monthly Revenue</p>
                <p className="subtitleText">${data?.revenue?.monthlyRevenue}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="subtitleText font-semibold">Yearly Revenue</p>
                <p className="subtitleText">${data?.revenue?.yearlyRevenue}</p>
              </div>
            </div>


          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md col-span-2">
          <CardContent className={''}>
            <div className="space-y-2 border-b text-center py-5">
              <p className="capitalize primaryText font-semibold">Total Order</p>
              <p className="primaryText">{data?.orders?.total_order}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-10 place-items-center">
              <div className="space-y-1 text-center">
                <p className="subtitleText font-semibold ">Tries</p>
                <p className="subtitleText">{data?.orders?.tires}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="subtitleText font-semibold">Wheels</p>
                <p className="subtitleText">{data?.orders?.wheels}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="subtitleText font-semibold ">Accessories</p>
                <p className="subtitleText">{data?.orders?.accessories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md py-5 px-6 ">
          <CardHeader className={"!px-0"}>
            <CardTitle className="capitalize primaryText font-semibold text-center">Total User</CardTitle>
          </CardHeader>
          <CardContent className={""}>
            <p className="text-2xl primaryText text-center">{data?.users?.total_users}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md py-5 px-6 ">
          <CardHeader className={"!px-0"}>
            <CardTitle className="capitalize primaryText font-semibold text-center">Paypal</CardTitle>
          </CardHeader>
          <CardContent className={""}>
            <p className="text-2xl primaryText text-center">${data?.bankBalance?.paypal}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md py-5 px-6 ">
          <CardHeader className={"!px-0"}>
            <CardTitle className="capitalize primaryText font-semibold text-center">Stripe</CardTitle>
          </CardHeader>
          <CardContent className={""}>
            <p className="text-2xl primaryText text-center">${data?.bankBalance?.stripe}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md py-5 px-6 ">
          <CardHeader className={"!px-0"}>
            <CardTitle className="capitalize primaryText font-semibold text-center">COD</CardTitle>
          </CardHeader>
          <CardContent className={""}>
            <p className="text-2xl primaryText text-center">${data?.bankBalance?.cod}</p>
          </CardContent>
        </Card>




      </div>


      {/* ===== Charts ===== */}
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="week" className={"subtitleText"}>
            Weekly
          </TabsTrigger>
          <TabsTrigger value="month" className={"subtitleText"}>
            Monthly
          </TabsTrigger>
          <TabsTrigger value="year" className={"subtitleText"}>
            Yearly
          </TabsTrigger>
        </TabsList>

        {/* Week Chart */}
        <TabsContent value="week">
          <Card className="rounded-2xl shadow-md w-full px-5 py-10">
            <CardHeader>
              <CardTitle>Weekly Orders & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.week}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Orders" />
                    <Bar dataKey="totalRevenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Month Chart */}
        <TabsContent value="month">
          <Card className="rounded-2xl shadow-md w-full px-5 py-10">
            <CardHeader>
              <CardTitle>Monthly Orders & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Orders" />
                    <Bar dataKey="totalRevenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Year Chart */}
        <TabsContent value="year">
          <Card className="rounded-2xl shadow-md w-full px-5 py-10">
            <CardHeader>
              <CardTitle>Yearly Orders & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.year}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Orders" />
                    <Bar dataKey="totalRevenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <OrdersTable dashboard={true} dashboardData={getData} />
    </div>
  );
}


