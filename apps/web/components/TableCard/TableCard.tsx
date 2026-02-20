import React, { useState } from "react";
import {
    ChevronRight,
    Search,
    ChevronDown,
    ArrowUpDown,
    Info,
    ChevronLeft,
    Calendar
} from "lucide-react";

export interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

export interface TableCardProps<T> {
    // Header
    breadcrumbs?: { label: string; href?: string }[];
    title: string;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;

    // Search & Filters
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    onClearFilters?: () => void; // Added for 'Clear All' functionality
    filters?: {
        key: string;
        label: string;
        options: { label: string; value: string }[];
        value: string;
        onChange: (val: string) => void;
        isDate?: boolean;
    }[];

    // Stats
    stats?: {
        label: string;
        value: React.ReactNode;
        valueColorClass?: string;
    }[];

    // Table Data
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (item: T) => string;

    // Selection
    selectable?: boolean;
    selectedKeys?: Set<string>;
    onSelectionChange?: (keys: Set<string>) => void;

    // Actions
    onRowClick?: (item: T) => void;
    // Specify the index of a column that should trigger row click specifically (like the second column described)
    clickableColumnIndex?: number;
    onInfoClick?: (item: T) => void;

    // Sorting
    sortKey?: string;
    sortDirection?: "asc" | "desc";
    onSortChange?: (key: string) => void;

    // Pagination
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        onPageChange: (page: number) => void;
    };

    // Custom height (to prevent full page scroll)
    className?: string;
}

export function TableCard<T>({
    breadcrumbs,
    title,
    primaryAction,
    secondaryAction,
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    filters,
    stats,
    columns,
    data,
    keyExtractor,
    selectable,
    selectedKeys,
    onSelectionChange,
    onRowClick,
    onClearFilters,
    // clickableColumnIndex, // Removed as per instructions
    onInfoClick, // Retaining for backwards compatibility though not explicitly used in Screen 1
    sortKey,
    sortDirection,
    onSortChange,
    pagination,
    className = ""
}: TableCardProps<T>) {

    // Internal Sorting State
    const [internalSortKey, setInternalSortKey] = useState<string | undefined>(sortKey);
    const [internalSortDirection, setInternalSortDirection] = useState<"asc" | "desc">(sortDirection || "asc");

    // Allow overriding from props if provided
    const activeSortKey = sortKey !== undefined ? sortKey : internalSortKey;
    const activeSortDirection = sortDirection !== undefined ? sortDirection : internalSortDirection;

    const handleSortClick = (key: string) => {
        let newDir: "asc" | "desc" = "asc";
        if (activeSortKey === key) {
            newDir = activeSortDirection === "asc" ? "desc" : "asc";
        }

        if (sortKey === undefined || sortDirection === undefined) {
            setInternalSortKey(key);
            setInternalSortDirection(newDir);
        }

        onSortChange?.(key);
    };

    const sortedData = React.useMemo(() => {
        if (!activeSortKey) return data;

        return [...data].sort((a, b) => {
            const aVal = (a as any)[activeSortKey];
            const bVal = (b as any)[activeSortKey];

            if (aVal === bVal) return 0;
            if (aVal == null) return activeSortDirection === "asc" ? 1 : -1;
            if (bVal == null) return activeSortDirection === "asc" ? -1 : 1;

            if (typeof aVal === "string" && typeof bVal === "string") {
                return activeSortDirection === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            if (aVal < bVal) return activeSortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return activeSortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, activeSortKey, activeSortDirection]);

    // Handle select all
    const handleSelectAll = (checked: boolean) => {
        if (!onSelectionChange) return;
        if (checked) {
            const allKeys = new Set(data.map(keyExtractor));
            onSelectionChange(allKeys);
        } else {
            onSelectionChange(new Set());
        }
    };

    const handleSelectRow = (key: string, checked: boolean) => {
        if (!onSelectionChange || !selectedKeys) return;
        const newKeys = new Set(selectedKeys);
        if (checked) {
            newKeys.add(key);
        } else {
            newKeys.delete(key);
        }
        onSelectionChange(newKeys);
    };

    const isAllSelected = data.length > 0 && selectedKeys?.size === data.length;

    return (
        <div className={`flex flex-col h-full w-full bg-white/40 backdrop-blur-[42px] border border-white/10 rounded-3xl shadow-sm overflow-hidden ${className}`}>
            {/* Header Section */}
            <div className="p-6 shrink-0 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={idx}>
                                    <span className={idx === breadcrumbs.length - 1 ? "text-[#0C335C]" : "text-[#FE641F]"}>
                                        {crumb.label}
                                    </span>
                                    {idx < breadcrumbs.length - 1 && <ChevronRight size={16} className="text-gray-400" />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                    {/* Title */}
                    <h2 className="text-[#0C335C] text-xl font-semibold">
                        {title}
                    </h2>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {secondaryAction}
                    {primaryAction}
                </div>
            </div>

            {/* Toolbar Section: Search, Filters, Stats */}
            <div className="px-6 flex items-center gap-4 shrink-0">
                <div className="flex-1 flex items-center gap-3">
                    {/* Search */}
                    {(onSearchChange || searchValue !== undefined) && (
                        <div className="flex-1 max-w-[480px] flex items-center gap-2 bg-black/5 border border-black/5 rounded-2xl px-4 py-3">
                            <Search size={18} className="text-gray-500 shrink-0" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchValue || ""}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-[#111] placeholder:text-gray-500"
                            />
                        </div>
                    )}

                    {/* Filters */}
                    {filters?.map((filter) => (
                        <div key={filter.key} className="flex items-center justify-between border border-[#CBCBCB] rounded-2xl px-3 py-2 h-[34px] min-w-[120px] bg-white cursor-pointer hover:bg-gray-50">
                            {filter.isDate && filter.value === "" && <Calendar size={16} className="text-[#0C335C] mr-2" />}
                            <select
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="bg-transparent text-[#0C335C] font-['IBM_Plex_Sans'] text-sm w-full outline-none appearance-none cursor-pointer"
                                style={{ textAlignLast: filter.isDate && filter.value === "" ? 'left' : 'right' }}
                            >
                                {filter.isDate && filter.value === "" && (
                                    <option value="" disabled hidden>{filter.label}</option>
                                )}
                                <option value="all">{filter.label}</option>
                                {filter.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="text-[#0C335C]" />
                        </div>
                    ))}

                    {/* Clear Filters (Only show if passed and at least one filter isn't empty/'all') */}
                    {onClearFilters && (
                        <button
                            onClick={onClearFilters}
                            className="text-[#FE641F] text-sm font-medium hover:underline ml-2"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Stats */}
                {stats && stats.length > 0 && (
                    <div className="flex items-center gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col px-3 gap-0.5">
                                <span className="text-sm text-[#111]">{stat.label}</span>
                                <span className={`text-base font-semibold ${stat.valueColorClass || 'text-[#111]'}`}>
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="flex-1 mt-6 overflow-hidden relative flex flex-col px-6 pb-2">
                {sortedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 w-full text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Info className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[#0C335C]">No agents found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query to find what you're looking for.</p>
                        {onClearFilters && (
                            <button
                                onClick={onClearFilters}
                                className="mt-4 px-4 py-2 bg-white border border-[#CBCBCB] text-[#0C335C] rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="w-full text-left text-sm flex flex-col h-full overflow-hidden">
                        <thead className="flex shrink-0 w-full z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2">
                            <tr className="flex w-full items-center">
                                {selectable && (
                                    <th className="py-1 px-3 w-[40px] shrink-0 flex justify-center items-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-[#FE641F] focus:ring-[#FE641F] cursor-pointer"
                                        />
                                    </th>
                                )}
                                {columns.map((col, colIndex) => (
                                    <th
                                        key={col.key.toString()}
                                        className={`font-normal text-[#0C335C] ${col.sortable ? 'cursor-pointer hover:bg-black/5 rounded-lg transition-colors' : ''} ${col.width ? col.width + ' shrink-0' : 'flex-1'}`}
                                        onClick={() => col.sortable && handleSortClick(col.key.toString())}
                                    >
                                        <div className="flex p-3 justify-start items-center gap-2 self-stretch w-full h-full">
                                            {col.label}
                                            {col.sortable && (
                                                <ArrowUpDown size={14} className={activeSortKey === col.key ? 'text-[#FE641F]' : 'text-gray-400'} />
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {onInfoClick && (
                                    <th className="p-3 w-[60px] shrink-0">
                                        {/* Actions Column Header (Empty) */}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="flex-1 overflow-y-auto flex flex-col w-full pt-2">
                            {sortedData.map((row, rowIndex) => {
                                const rowKey = keyExtractor(row);
                                const isSelected = selectedKeys?.has(rowKey);
                                const rowBg = isSelected ? "bg-orange-50" : rowIndex % 2 === 0 ? "bg-transparent" : "bg-black/5";

                                return (
                                    <tr
                                        key={rowKey}
                                        className={`flex w-full items-center ${rowBg} hover:bg-orange-50/50 transition-colors group cursor-default rounded-2xl mb-1 shrink-0`}
                                    >
                                        {selectable && (
                                            <td className="py-2 px-3 w-[40px] shrink-0 flex justify-center items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected || false}
                                                    onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-[#FE641F] focus:ring-[#FE641F] cursor-pointer"
                                                />
                                            </td>
                                        )}
                                        {columns.map((col, colIndex) => {
                                            // const isClickableCol = colIndex === clickableColumnIndex; // Removed as per instructions
                                            const isClickableCol = false; // Default to false if clickableColumnIndex is removed
                                            return (
                                                <td
                                                    key={col.key.toString()}
                                                    className={`py-2 px-3 flex items-center text-[#0C335C] ${isClickableCol ? 'cursor-pointer group-hover:text-[#FE641F] transition-colors font-medium' : ''} ${col.width ? col.width + ' shrink-0' : 'flex-1 overflow-hidden truncate'}`}
                                                    onClick={() => {
                                                        if (isClickableCol && onRowClick) {
                                                            onRowClick(row);
                                                        }
                                                    }}
                                                >
                                                    {col.render ? col.render(row) : (row as any)[col.key]}
                                                </td>
                                            );
                                        })}
                                        {/* Row Actions */}
                                        {onInfoClick && (
                                            <td className="py-2 px-3 w-[60px] shrink-0 flex justify-end items-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onInfoClick(row);
                                                    }}
                                                    className="border border-[#CBCBCB] rounded-2xl h-[32px] w-[32px] inline-flex items-center justify-center text-gray-500 hover:text-[#FE641F] hover:border-[#FE641F] transition-colors bg-white shrink-0"
                                                >
                                                    <Info size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Footer */}
            {pagination && (
                <div className="px-6 py-4 flex items-center justify-between shrink-0 border-t border-black/5 mt-auto bg-white/50 backdrop-blur-sm">
                    <span className="text-[#0C335C] text-sm font-medium">
                        Showing {Math.min(pagination.totalItems, (pagination.currentPage - 1) * pagination.itemsPerPage + 1)}-
                        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} {pagination.totalItems === 1 ? 'item' : 'items'}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            className="h-8 w-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed text-[#111]"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page Numbers Logics (Simplified for brevity, usually you'd render 1 2 3 ... 8) */}
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                            const pageNum = i + 1; // Basic math for now
                            const isActive = pageNum === pagination.currentPage;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => pagination.onPageChange(pageNum)}
                                    className={`h-8 w-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${isActive ? 'bg-[#FE641F] text-white shadow-sm' : 'border border-black/5 text-[#111] hover:bg-black/5'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {pagination.totalPages > 5 && (
                            <span className="h-8 w-8 flex items-center justify-center text-[#111] text-sm">...</span>
                        )}

                        {pagination.totalPages > 5 && (
                            <button
                                onClick={() => pagination.onPageChange(pagination.totalPages)}
                                className={`h-8 w-8 rounded-full text-sm font-medium flex items-center justify-center border border-black/5 text-[#111] hover:bg-black/5 transition-colors`}
                            >
                                {pagination.totalPages}
                            </button>
                        )}

                        <button
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            className="h-8 w-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed text-[#111]"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
