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
    fixedRight?: boolean;
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
        <div className={`flex flex-col w-full justify-start items-start p-6 gap-6 rounded-[24px] border border-white/10 shadow-[0_4px_8px_0_rgba(26,26,26,0.12)] backdrop-blur-[42px] overflow-hidden bg-white/50 ${className}`}
            style={{
                background: "linear-gradient(95deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.80) 100%)"
            }}
        >
            {/* Header Section */}
            <div className="flex justify-between items-center self-stretch shrink-0 w-full">
                <div className="flex flex-col gap-1">
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="flex items-start gap-1 font-sans text-sm font-normal">
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={idx}>
                                    <span className={idx === breadcrumbs.length - 1 ? "text-[#0C335C]" : "text-[#FE641F]"}>
                                        {crumb.label}
                                    </span>
                                    {idx < breadcrumbs.length - 1 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                                            <path d="M5.14644 4.18624C5.09732 4.14046 5.05792 4.08526 5.03059 4.02393C5.00326 3.9626 4.98857 3.89639 4.98738 3.82925C4.9862 3.76212 4.99855 3.69543 5.0237 3.63317C5.04884 3.57092 5.08627 3.51436 5.13375 3.46688C5.18123 3.4194 5.23779 3.38197 5.30005 3.35682C5.3623 3.33168 5.42899 3.31933 5.49613 3.32051C5.56326 3.3217 5.62947 3.33639 5.6908 3.36372C5.75214 3.39105 5.80734 3.43045 5.85311 3.47957L10.5198 8.14624C10.6134 8.23999 10.666 8.36707 10.666 8.49957C10.666 8.63207 10.6134 8.75915 10.5198 8.85291L5.85311 13.5196C5.80734 13.5687 5.75214 13.6081 5.6908 13.6354C5.62947 13.6628 5.56326 13.6774 5.49613 13.6786C5.42899 13.6798 5.3623 13.6675 5.30005 13.6423C5.23779 13.6172 5.18123 13.5797 5.13375 13.5323C5.08627 13.4848 5.04884 13.4282 5.0237 13.366C4.99855 13.3037 4.9862 13.237 4.98738 13.1699C4.98857 13.1028 5.00326 13.0365 5.03059 12.9752C5.05792 12.9139 5.09732 12.8587 5.14644 12.8129L9.45978 8.49957L5.14644 4.18624Z" fill="#0C335C" />
                                        </svg>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                    {/* Title */}
                    <h2 className="text-[#0C335C] font-sans text-base font-medium">
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
            <div className="flex flex-wrap items-center gap-4 self-stretch shrink-0 justify-between">
                <div className="flex-1 flex flex-wrap items-center gap-4 min-w-[320px]">
                    {/* Search */}
                    {(onSearchChange || searchValue !== undefined) && (
                        <div className="flex min-w-[200px] max-w-[480px] p-4 items-center gap-2 flex-1 bg-black/5 border border-black/5 rounded-2xl overflow-hidden">
                            <Search size={18} className="text-gray-500 shrink-0" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchValue || ""}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-[#111] font-sans text-sm font-medium placeholder:text-[#111] placeholder:opacity-50 overflow-hidden text-ellipsis"
                            />
                        </div>
                    )}

                    {/* Filters */}
                    {filters?.map((filter) => (
                        <div key={filter.key} className="flex h-[34px] px-3 py-1.5 justify-center items-center gap-1 border border-[#CBCBCB] rounded-[100px] bg-white cursor-pointer hover:bg-gray-50">
                            {filter.isDate && filter.value === "" && <Calendar size={16} className="text-[#0C335C] shrink-0" />}
                            <select
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="bg-transparent text-[#0C335C] text-right font-sans text-sm font-normal w-full outline-none appearance-none cursor-pointer"
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
                            <ChevronDown size={16} className="text-[#0C335C] shrink-0" />
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
            <div className="flex-1 relative flex flex-col w-full min-h-0 overflow-x-auto">
                {sortedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 w-full text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Info className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[#0C335C]">No data found</h3>
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
                    <div className="flex-1 w-full min-h-0 overflow-auto relative">
                        <table className="flex flex-col items-start min-w-max text-left text-sm relative">
                            <thead className="flex flex-col items-start self-stretch shrink-0 w-full z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2 sticky top-0 bg-white/50 backdrop-blur-[42px]">
                                <tr className="flex p-3 justify-start items-center gap-2 self-stretch w-full shrink-0 relative">
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
                                            className={`flex items-center gap-2 text-[#0C335C] font-sans text-sm font-normal ${col.sortable ? 'cursor-pointer hover:bg-black/5 rounded-lg transition-colors' : ''} ${col.width ? col.width + ' shrink-0' : 'flex-1'} ${col.fixedRight ? 'sticky right-0 bg-white/90 backdrop-blur z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]' : ''}`}
                                            onClick={() => col.sortable && handleSortClick(col.key.toString())}
                                        >
                                            <div className={`flex items-center gap-2 self-stretch w-full h-full ${col.fixedRight ? 'justify-center' : 'justify-start'}`}>
                                                {col.label}
                                                {col.sortable && (
                                                    <ArrowUpDown size={14} className={activeSortKey === col.key ? 'text-[#FE641F] shrink-0' : 'text-gray-400 shrink-0'} />
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
                            <tbody className="flex flex-col w-full pt-2">
                                {sortedData.map((row, rowIndex) => {
                                    const rowKey = keyExtractor(row);
                                    const isSelected = selectedKeys?.has(rowKey);
                                    const rowBg = isSelected ? "bg-orange-50" : rowIndex % 2 === 0 ? "bg-transparent" : "bg-black/5";

                                    return (
                                        <tr
                                            key={rowKey}
                                            className={`flex p-3 justify-start items-center gap-2 self-stretch w-full ${rowBg} hover:bg-orange-50/50 transition-colors group cursor-default rounded-2xl mb-1 shrink-0 relative`}
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
                                                        className={`flex items-center text-[#0C335C] font-sans text-sm ${isClickableCol ? 'cursor-pointer group-hover:text-[#FE641F] transition-colors font-medium' : 'font-normal'} ${col.width ? col.width + ' shrink-0' : 'flex-1 overflow-hidden truncate'} ${col.fixedRight ? 'sticky right-0 bg-[#F5F6FA] z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.02)] justify-center group-hover:bg-orange-50/50 transition-colors' : ''}`}
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
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            {pagination && (
                <div className="flex justify-between items-center self-stretch pt-4 border-t border-black/5 mt-auto bg-transparent">
                    <span className="text-[#0C335C] font-sans text-xs font-medium">
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
