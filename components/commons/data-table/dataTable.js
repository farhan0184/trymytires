"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  title = "Data Table",
  description = "",
  icon: Icon = null,
  searchConfig = null,
  filterConfig = [],
  paginationConfig = null,
  onDataChange = null,
  emptyMessage = "No data available",
  noResultsMessage = "No results found",
  showHeader = true,
  className = "",
  actionButton = null,
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectSearchTerms, setSelectSearchTerms] = React.useState({});

  // Reset page when data changes (important for server-side pagination)
  React.useEffect(() => {
    if (paginationConfig?.serverSide) {
      setCurrentPage(1);
    }
    // Only trigger when filters/search change
  }, [searchTerm, filters, paginationConfig?.serverSide]);


  const filteredData = React.useMemo(() => {
    // For server-side operations, return data as-is since filtering happens on server
    if (paginationConfig?.serverSide || searchConfig?.serverSide) {
      return data;
    }

    let filtered = data;

    // Apply search filter (client-side only)
    if (searchConfig && searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        searchConfig.fields.some((field) => {
          const value = getNestedValue(item, field);
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply other filters (client-side only)
    filterConfig.forEach((config) => {
      const filterValue = filters[config.key];
      if (filterValue && filterValue !== "all") {
        filtered = filtered.filter((item) => {
          const itemValue = getNestedValue(item, config.field);

          if (config.type === "select") {
            // Handle both string and object comparisons
            const valueToCompare = itemValue?.toString().toLowerCase();
            const filterToCompare = filterValue.toLowerCase();
            return valueToCompare === filterToCompare;
          }
          return true;
        });
      }
    });

    return filtered;
  }, [
    data,
    searchTerm,
    filters,
    searchConfig,
    filterConfig,
    paginationConfig?.serverSide,
  ]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search

    if (searchConfig?.serverSide && onDataChange) {
      onDataChange({ search: value, filters, page: 1 });
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    // Handle dependent filters
    const categoryFilterChanged = filterConfig.some(
      (f) => f.key === key && f.key === "category"
    );
    if (categoryFilterChanged) {
      filterConfig.forEach((f) => {
        if (f.dependsOn === "category" && f.key !== "category") {
          newFilters[f.key] = "all";
        }
      });
    }

    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change

    if (onDataChange) {
      onDataChange({ search: searchTerm, filters: newFilters, page: 1 });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (paginationConfig?.serverSide && onDataChange) {
      onDataChange({ search: searchTerm, filters, page });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({});
    setCurrentPage(1);
    setSelectSearchTerms({}); // Clear all select search terms
    if (onDataChange) {
      onDataChange({ search: "", filters: {}, page: 1 });
    }
  };

  const hasActiveFilters =
    searchTerm || Object.values(filters).some((v) => v && v !== "all");

  const itemsPerPage = paginationConfig?.itemsPerPage || 10;

  // For server-side pagination, use the provided totals
  // For client-side pagination, use filtered data length
  const totalItems = paginationConfig?.serverSide
    ? paginationConfig.filteredTotalItems ?? paginationConfig.totalItems ?? 0
    : filteredData.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page doesn't exceed total pages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const newPage = Math.max(1, totalPages);
      setCurrentPage(newPage);
      if (paginationConfig?.serverSide && onDataChange) {
        onDataChange({ search: searchTerm, filters, page: newPage });
      }
    }
  }, [
    currentPage,
    totalPages,
    paginationConfig?.serverSide,
    onDataChange,
    searchTerm,
    filters,
  ]);

  // Calculate data to display
  const currentData = React.useMemo(() => {
    if (paginationConfig?.serverSide) {
      // For server-side pagination, use data as-is (already paginated by server)
      return filteredData;
    } else {
      // For client-side pagination, slice the filtered data
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredData.slice(startIndex, endIndex);
    }
  }, [filteredData, currentPage, itemsPerPage, paginationConfig?.serverSide]);

  const paginatedTable = useReactTable({
    data: currentData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const shouldShowPagination = paginationConfig && totalPages > 1;

  // Calculate display numbers for "Showing X of Y results"
  const displayStartIndex =
    totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const displayEndIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="size-6" />}
            <h3 className="primaryText font-bold">{title}</h3>
          </div>
          {description && (
            <p className="subtitleText text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="flex justify-between">
        {(searchConfig || filterConfig.length > 0) &&
          (data.length > 0 || hasActiveFilters) && (
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 w-full items-center">
              <div className="flex flex-wrap w-full space-x-4">
                {searchConfig && (
                  <div className="relative">
                    <Search className="absolute left-3 top-3 size-6 text-muted-foreground" />
                    <Input
                      placeholder={searchConfig.placeholder || "Search..."}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 h-12 lg:w-[300px] w-full subtitleText placeholder:lg:text-xl placeholder:md:text-[18px] placeholder:text-base"
                    />
                  </div>
                )}

                {filterConfig.map((config) => {
                  let optionsToShow = config.options;
                  if (
                    config.dependsOn &&
                    typeof config.filterOptionsFn === "function"
                  ) {
                    optionsToShow = config.filterOptionsFn(
                      filters,
                      config.options
                    );
                  }

                  return (
                    <div key={config.key}>
                      {config.type === "select" && (
                        <Select
                          value={filters[config.key] || "all"}
                          onValueChange={(value) =>
                            handleFilterChange(config.key, value)
                          }
                          onOpenChange={(open) => {
                            // Clear search when select closes
                            if (!open) {
                              setSelectSearchTerms((prev) => ({
                                ...prev,
                                [config.key]: "",
                              }));
                            }
                          }}
                        >
                          <SelectTrigger className="w-full md:w-[180px] !h-12 subtitleText">
                            <Filter className="size-5" />
                            <SelectValue placeholder={config.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Search input inside the select dropdown */}
                            <div className="p-2 border-b sticky top-0 bg-background">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder={`Search ${config.label.toLowerCase()}...`}
                                  value={selectSearchTerms[config.key] || ""}
                                  onChange={(e) => {
                                    e.stopPropagation(); // Prevent select from closing
                                    setSelectSearchTerms((prev) => ({
                                      ...prev,
                                      [config.key]: e.target.value,
                                    }));
                                  }}
                                  onKeyDown={(e) => e.stopPropagation()} // Prevent select keyboard navigation
                                  onClick={(e) => e.stopPropagation()} // Prevent select from closing on click
                                  className="pl-8 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                  autoFocus={false}
                                />
                              </div>
                            </div>

                            <SelectItem value="all">
                              All {config.label}
                            </SelectItem>

                            {/* Filter options based on search term */}
                            {optionsToShow
                              .filter((option) => {
                                const searchTerm =
                                  selectSearchTerms[config.key] || "";
                                if (!searchTerm.trim()) return true;
                                return option.label
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase());
                              })
                              .map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}

                            {/* Show "No results" message if search yields no results */}
                            {optionsToShow.filter((option) => {
                              const searchTerm =
                                selectSearchTerms[config.key] || "";
                              if (!searchTerm.trim()) return true;
                              return option.label
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase());
                            }).length === 0 &&
                              selectSearchTerms[config.key]?.trim() && (
                                <div className="p-3 text-sm text-muted-foreground text-center">
                                  No results found for &quot;
                                  {selectSearchTerms[config.key]}&quot;
                                </div>
                              )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="h-12 flex gap-1 subtitleText"
                  onClick={clearFilters}
                >
                  <X className="size-5" /> Clear filters
                </Button>
              )}
            </div>
          )}

        {actionButton && (
          <div className="mt-4 md:mt-0 right-0">{actionButton}</div>
        )}
      </div>

      {(data.length > 0 || hasActiveFilters) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">
              {totalItems > 0 ? displayStartIndex : 0}
            </span>
            {totalItems > 0 && (
              <>
                - <span className="font-medium">{displayEndIndex}</span>
              </>
            )}{" "}
            of <span className="font-medium">{totalItems}</span> results
          </div>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {paginatedTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center space-y-2">
                    {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
                    <div className="text-muted-foreground">
                      {hasActiveFilters ? noResultsMessage : emptyMessage}
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original?._id || row.original?.orderId || `row-${row.id}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell ??
                        cell.column.columnDef.accessorKey,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {shouldShowPagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center space-x-1">
              {getPageNumbers(currentPage, totalPages).map((num, idx) =>
                num === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${num}`}
                    variant={num === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(num)}
                    disabled={num === currentPage || loading}
                    className="w-8"
                  >
                    {num}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

function getPageNumbers(current, total) {
  if (total <= 1) return [1];

  const delta = 1;
  const range = [];
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (current - delta > 2) range.unshift("...");
  if (current + delta < total - 1) range.push("...");

  range.unshift(1);
  if (total > 1) range.push(total);

  return [...new Set(range)]; // Remove duplicates
}
