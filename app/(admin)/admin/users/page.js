"use client"
import React, { useEffect } from 'react'
import { Users, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useFetch } from '@/app/helper/hooks'
import { getUserLists } from '@/app/helper/backend'
import DataTable from '@/components/commons/data-table/dataTable'

export default function UsersPage() {
    const [data, getData, { loading }] = useFetch(getUserLists)
  


    const handleDataChange = ({ search, filters, page }) => {
        // Make API call with new parameters
        getData({ 
            page, 
            search, 
            role: filters.role !== 'all' ? filters.role : undefined 
        })
    }


    const handleEdit = (user) => {
        alert(`Edit user "${user.name}"`)
    }

    const handleDelete = (user) => {
        alert(`User "${user.name}" deleted!`)
        // Refresh data
        getData()
    }

    const columns = [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="subtitleText font-bold px-2 md:px-4 py-3 text-gray-800 flex items-center space-x-2">
            <Users className="size-5" />
            <span>User</span>
          </div>
        ),
        cell: (info) => (
          <div className="flex items-center space-x-3 px-2 md:px-4 py-1 subtitleText">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={info.row.original.image}
                alt={info.getValue()}
              />
              <AvatarFallback className={'subtitleText font-bold'}>
                {info.getValue()?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium ">{info.getValue()}</div>
              <div className="text-sm text-muted-foreground tertiaryText">
                {info.row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <div className="subtitleText font-bold px-2 md:px-4 py-3 text-gray-800 ">
            Role
          </div>
        ),
        cell: (info) => (
          <Badge
            variant={
              info.getValue()?.toLowerCase() === "admin"
                ? "default"
                : "secondary"
            }
            className={'subtitleText px-2 md:px-4 py-1 text-white'}
          >
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <div className="subtitleText font-bold px-2 md:px-4 py-3 text-gray-800">
            Phone Number
          </div>
        ),
        cell: (info) => (
          <div className="text-sm subtitleText">
            {info.getValue() || (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: ({ column }) => (
          <div className="subtitleText font-bold px-2 md:px-4 py-3 text-gray-800 text-end">
            Actions
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row.original)}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <Edit className="size-5 " />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot{row.original.name}
                    &quot?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(row.original)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      },
    ];

    return (
        <DataTable
            data={data?.docs || []}
            columns={columns}
            loading={loading}
            title="User Management"
            description="Manage your application users and their roles"
            icon={Users}
            searchConfig={{
                placeholder: "Search by name or email...",
                fields: ['name', 'email', "phone"], // Client-side search fields
                serverSide: true // Enable server-side search
            }}
            filterConfig={[
                {
                    key: 'role',
                    field: 'role',
                    type: 'select',
                    label: 'Roles',
                    placeholder: 'Filter by role',
                    options: [
                        { value: 'admin', label: 'Admin' },
                        { value: 'user', label: 'User' }
                    ]
                }
            ]}
            paginationConfig={{
                serverSide: true,
                itemsPerPage: 10,
                totalItems: data?.totalDocs || 0
            }}
            onDataChange={handleDataChange}
            emptyMessage="No users found"
            noResultsMessage="No users found matching your search"
        />
    )
}