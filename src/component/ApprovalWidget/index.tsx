"use client"

import React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import "./approval.css"

// Types for our approval subjects
type SubjectType = "travel" | "expense" | "leave" | "purchase"

interface ApprovalSubject {
    id: string
    title: string
    requester: string
    date: string
    type: SubjectType
    details: Record<string, any>
}

// Sample data
const initialSubjects: ApprovalSubject[] = [
    {
        id: "req-001",
        title: "Business Trip to New York",
        requester: "Alex Johnson",
        date: "2025-04-15",
        type: "travel",
        details: {
            destination: "New York, NY",
            departureDate: "2025-04-20",
            returnDate: "2025-04-25",
            estimatedCost: "$1,200",
            purpose: "Client meeting and industry conference",
        },
    },
    {
        id: "req-002",
        title: "Office Supplies Reimbursement",
        requester: "Sam Taylor",
        date: "2025-04-08",
        type: "expense",
        details: {
            amount: "$85.50",
            items: "Notebooks, pens, desk organizer",
            purchaseDate: "2025-04-05",
            receipt: "Available",
        },
    },
    {
        id: "req-003",
        title: "Annual Leave Request",
        requester: "Jamie Rivera",
        date: "2025-04-07",
        type: "leave",
        details: {
            startDate: "2025-05-10",
            endDate: "2025-05-17",
            totalDays: "5 working days",
            coveringColleague: "Morgan Smith",
        },
    },
    {
        id: "req-004",
        title: "Software License Purchase",
        requester: "Casey Wilson",
        date: "2025-04-09",
        type: "purchase",
        details: {
            item: "Adobe Creative Cloud License",
            cost: "$599.99/year",
            justification: "Required for design team projects",
            alternatives: "Considered Affinity Suite, but team is trained on Adobe",
        },
    },
    {
        id: "req-005",
        title: "Conference Registration Fee",
        requester: "Alex Johnson",
        date: "2025-04-12",
        type: "expense",
        details: {
            amount: "$499.00",
            items: "Tech Summit 2025 Registration",
            purchaseDate: "2025-04-10",
            receipt: "Available",
        },
    },
    {
        id: "req-006",
        title: "Team Building Event",
        requester: "Jamie Rivera",
        date: "2025-04-18",
        type: "purchase",
        details: {
            item: "Team lunch and activities",
            cost: "$850.00",
            justification: "Quarterly team building event",
            alternatives: "Considered virtual event, but in-person provides better engagement",
        },
    },
    {
        id: "req-007",
        title: "Client Visit to Chicago",
        requester: "Sam Taylor",
        date: "2025-04-22",
        type: "travel",
        details: {
            destination: "Chicago, IL",
            departureDate: "2025-05-05",
            returnDate: "2025-05-07",
            estimatedCost: "$950",
            purpose: "Client presentation and product demo",
        },
    },
]

// Filter types
interface Filters {
    types: SubjectType[]
    requesters: string[]
    dateRange: {
        from: string | null
        to: string | null
    }
    searchQuery: string
}

// Custom hook for detecting screen size
function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(query)
        setMatches(mediaQuery.matches)

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        mediaQuery.addEventListener("change", handler)
        return () => {
            mediaQuery.removeEventListener("change", handler)
        }
    }, [query])

    return matches
}

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

// Fuzzy search function
function fuzzySearch(item: ApprovalSubject, query: string): boolean {
    if (!query) return true

    const searchableText = `
    ${item.title.toLowerCase()} 
    ${item.requester.toLowerCase()} 
    ${item.type.toLowerCase()}
    ${Object.values(item.details).join(" ").toLowerCase()}
  `

    const searchTerms = query.toLowerCase().split(" ")
    return searchTerms.every((term) => {
        // Allow for typos by checking if the term is within edit distance 1
        return (
            searchableText.includes(term) ||
            Object.keys(item.details).some((key) => String(item.details[key]).toLowerCase().includes(term))
        )
    })
}

// Highlight component for search results
interface HighlightProps {
    text: string
    highlight: string
}

function Highlight({ text, highlight }: HighlightProps) {
    if (!highlight.trim()) {
        return <span>{text}</span>
    }

    const regex = new RegExp(`(${highlight.toLowerCase()})`, "gi")
    const parts = text.split(regex)

    return (
        <span>
      {parts.map((part, i) =>
          regex.test(part.toLowerCase()) ? (
              <mark key={i} className="approval-highlight">
                  {part}
              </mark>
          ) : (
              <span key={i}>{part}</span>
          ),
      )}
    </span>
    )
}

// Custom tooltip component
interface TooltipProps {
    content: React.ReactNode
    isOpen: boolean
    onClose: () => void
    triggerRef: React.RefObject<HTMLElement>
}

function Tooltip({ content, isOpen, onClose, triggerRef }: TooltipProps) {
    const tooltipRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (isOpen && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()

            // Position to the right of the trigger button
            setPosition({
                top: triggerRect.top + window.scrollY - tooltipRect.height / 2 + triggerRect.height / 2,
                left: triggerRect.right + window.scrollX + 10, // 10px offset from the button
            })
        }
    }, [isOpen, triggerRef])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("keydown", handleEscapeKey)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscapeKey)
        }
    }, [isOpen, onClose, triggerRef])

    if (!isOpen) return null

    return createPortal(
        <div
            ref={tooltipRef}
            className="approval-tooltip"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            role="tooltip"
            tabIndex={-1}
        >
            <div className="approval-tooltip-content">{content}</div>
        </div>,
        document.body,
    )
}

export default function ApprovalWidget() {
    const [subjects, setSubjects] = useState<ApprovalSubject[]>(initialSubjects)
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
    const tooltipTriggerRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>({})
    const [filters, setFilters] = useState<Filters>({
        types: [],
        requesters: [],
        dateRange: { from: null, to: null },
        searchQuery: "",
    })
    const [searchInput, setSearchInput] = useState("")
    const debouncedSearchInput = useDebounce(searchInput, 300)
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

    // Update search query when debounced input changes
    useEffect(() => {
        setFilters((prev) => ({ ...prev, searchQuery: debouncedSearchInput }))
    }, [debouncedSearchInput])

    // Use media query to determine if we should show table or card view
    const isDesktop = useMediaQuery("(min-width: 768px)")

    // Get unique requesters for filter dropdown
    const uniqueRequesters = useMemo(() => {
        return Array.from(new Set(subjects.map((subject) => subject.requester)))
    }, [subjects])

    // Get all subject types for filter
    const subjectTypes: SubjectType[] = ["travel", "expense", "leave", "purchase"]

    // Initialize refs for each subject
    useEffect(() => {
        subjects.forEach((subject) => {
            if (!tooltipTriggerRefs.current[subject.id]) {
                tooltipTriggerRefs.current[subject.id] = React.createRef<HTMLButtonElement>()
            }
        })
    }, [subjects])

    // Apply filters to subjects
    const filteredSubjects = useMemo(() => {
        return subjects.filter((subject) => {
            // Type filter
            if (filters.types.length > 0 && !filters.types.includes(subject.type)) {
                return false
            }

            // Requester filter
            if (filters.requesters.length > 0 && !filters.requesters.includes(subject.requester)) {
                return false
            }

            // Date range filter
            if (filters.dateRange.from) {
                const subjectDate = new Date(subject.date)
                const fromDate = new Date(filters.dateRange.from)
                if (subjectDate < fromDate) {
                    return false
                }
            }

            if (filters.dateRange.to) {
                const subjectDate = new Date(subject.date)
                const toDate = new Date(filters.dateRange.to)
                // Set time to end of day for "to" date
                toDate.setHours(23, 59, 59, 999)
                if (subjectDate > toDate) {
                    return false
                }
            }

            // Search query
            if (filters.searchQuery && !fuzzySearch(subject, filters.searchQuery)) {
                return false
            }

            return true
        })
    }, [subjects, filters])

    // Handle approve action
    const handleApprove = (id: string) => {
        setSubjects(subjects.filter((subject) => subject.id !== id))
        // In a real app, you would call an API to update the approval status
    }

    // Handle reject action
    const handleReject = (id: string) => {
        setSubjects(subjects.filter((subject) => subject.id !== id))
        // In a real app, you would call an API to update the rejection status
    }

    // Toggle tooltip visibility
    const toggleTooltip = (id: string) => {
        setActiveTooltip(activeTooltip === id ? null : id)
    }

    // Handle keyboard events for the info button
    const handleInfoKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleTooltip(id)
        }
    }

    // Toggle type filter
    const toggleTypeFilter = (type: SubjectType) => {
        setFilters((prev) => {
            if (prev.types.includes(type)) {
                return { ...prev, types: prev.types.filter((t) => t !== type) }
            } else {
                return { ...prev, types: [...prev.types, type] }
            }
        })
    }

    // Toggle requester filter
    const toggleRequesterFilter = (requester: string) => {
        setFilters((prev) => {
            if (prev.requesters.includes(requester)) {
                return { ...prev, requesters: prev.requesters.filter((r) => r !== requester) }
            } else {
                return { ...prev, requesters: [...prev.requesters, requester] }
            }
        })
    }

    // Update date range filter
    const updateDateRange = (field: "from" | "to", value: string) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value || null,
            },
        }))
    }

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            types: [],
            requesters: [],
            dateRange: { from: null, to: null },
            searchQuery: "",
        })
        setSearchInput("")
    }

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return (
            filters.types.length > 0 ||
            filters.requesters.length > 0 ||
            filters.dateRange.from !== null ||
            filters.dateRange.to !== null ||
            filters.searchQuery !== ""
        )
    }, [filters])

    // Render the appropriate tooltip content based on subject type
    const renderTooltipContent = (subject: ApprovalSubject) => {
        switch (subject.type) {
            case "travel":
                return (
                    <div className="approval-tooltip-details">
                        <h3 className="approval-tooltip-title">{subject.title} Details</h3>
                        <div className="approval-tooltip-info">
                            <p>
                                <strong>Destination:</strong>{" "}
                                <Highlight text={subject.details.destination} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Dates:</strong>{" "}
                                <Highlight
                                    text={`${subject.details.departureDate} to ${subject.details.returnDate}`}
                                    highlight={filters.searchQuery}
                                />
                            </p>
                            <p>
                                <strong>Estimated Cost:</strong>{" "}
                                <Highlight text={subject.details.estimatedCost} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Purpose:</strong> <Highlight text={subject.details.purpose} highlight={filters.searchQuery} />
                            </p>
                        </div>
                    </div>
                )
            case "expense":
                return (
                    <div className="approval-tooltip-details">
                        <h3 className="approval-tooltip-title">{subject.title} Details</h3>
                        <div className="approval-tooltip-info">
                            <p>
                                <strong>Amount:</strong> <Highlight text={subject.details.amount} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Items:</strong> <Highlight text={subject.details.items} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Purchase Date:</strong>{" "}
                                <Highlight text={subject.details.purchaseDate} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Receipt:</strong> <Highlight text={subject.details.receipt} highlight={filters.searchQuery} />
                            </p>
                        </div>
                    </div>
                )
            case "leave":
                return (
                    <div className="approval-tooltip-details">
                        <h3 className="approval-tooltip-title">{subject.title} Details</h3>
                        <div className="approval-tooltip-info">
                            <p>
                                <strong>Period:</strong>{" "}
                                <Highlight
                                    text={`${subject.details.startDate} to ${subject.details.endDate}`}
                                    highlight={filters.searchQuery}
                                />
                            </p>
                            <p>
                                <strong>Total:</strong> <Highlight text={subject.details.totalDays} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Coverage:</strong>{" "}
                                <Highlight text={subject.details.coveringColleague} highlight={filters.searchQuery} />
                            </p>
                        </div>
                    </div>
                )
            case "purchase":
                return (
                    <div className="approval-tooltip-details">
                        <h3 className="approval-tooltip-title">{subject.title} Details</h3>
                        <div className="approval-tooltip-info">
                            <p>
                                <strong>Item:</strong> <Highlight text={subject.details.item} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Cost:</strong> <Highlight text={subject.details.cost} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Justification:</strong>{" "}
                                <Highlight text={subject.details.justification} highlight={filters.searchQuery} />
                            </p>
                            <p>
                                <strong>Alternatives:</strong>{" "}
                                <Highlight text={subject.details.alternatives} highlight={filters.searchQuery} />
                            </p>
                        </div>
                    </div>
                )
            default:
                return <p>No additional details available</p>
        }
    }

    // Get badge class based on subject type
    const getTypeClass = (type: SubjectType) => {
        switch (type) {
            case "travel":
                return "approval-badge-travel"
            case "expense":
                return "approval-badge-expense"
            case "leave":
                return "approval-badge-leave"
            case "purchase":
                return "approval-badge-purchase"
            default:
                return "approval-badge-default"
        }
    }

    // Render info button with tooltip
    const renderInfoButton = (subject: ApprovalSubject) => (
        <div className="approval-info-container">
            <button
                ref={tooltipTriggerRefs.current[subject.id]}
                className="approval-info-button"
                aria-label={`View details for ${subject.title}`}
                onClick={() => toggleTooltip(subject.id)}
                onKeyDown={(e) => handleInfoKeyDown(e, subject.id)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="approval-icon"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            </button>
            {tooltipTriggerRefs.current[subject.id] && (
                <Tooltip
                    content={renderTooltipContent(subject)}
                    isOpen={activeTooltip === subject.id}
                    onClose={() => setActiveTooltip(null)}
                    triggerRef={tooltipTriggerRefs.current[subject.id]}
                />
            )}
        </div>
    )

    // Render action buttons
    const renderActionButtons = (subject: ApprovalSubject) => (
        <div className="approval-actions">
            <button className="approval-button approval-button-reject" onClick={() => handleReject(subject.id)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="approval-icon"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reject
            </button>
            <button className="approval-button approval-button-approve" onClick={() => handleApprove(subject.id)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="approval-icon"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Approve
            </button>
        </div>
    )

    // Render filter panel
    const renderFilterPanel = () => (
        <div className={`approval-filter-panel ${isFilterPanelOpen ? "approval-filter-panel-open" : ""}`}>
            <div className="approval-filter-header">
                <h3 className="approval-filter-title">Filters</h3>
                <button
                    className="approval-filter-close"
                    onClick={() => setIsFilterPanelOpen(false)}
                    aria-label="Close filters"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div className="approval-filter-section">
                <h4 className="approval-filter-section-title">Subject Type</h4>
                <div className="approval-filter-options">
                    {subjectTypes.map((type) => (
                        <label key={type} className="approval-filter-option">
                            <input
                                type="checkbox"
                                checked={filters.types.includes(type)}
                                onChange={() => toggleTypeFilter(type)}
                                className="approval-filter-checkbox"
                            />
                            <span className={`approval-filter-badge ${getTypeClass(type)}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="approval-filter-section">
                <h4 className="approval-filter-section-title">Requester</h4>
                <div className="approval-filter-options">
                    {uniqueRequesters.map((requester) => (
                        <label key={requester} className="approval-filter-option">
                            <input
                                type="checkbox"
                                checked={filters.requesters.includes(requester)}
                                onChange={() => toggleRequesterFilter(requester)}
                                className="approval-filter-checkbox"
                            />
                            <span className="approval-filter-text">{requester}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="approval-filter-section">
                <h4 className="approval-filter-section-title">Date Range</h4>
                <div className="approval-filter-date-range">
                    <div className="approval-filter-date-field">
                        <label htmlFor="date-from" className="approval-filter-label">
                            From
                        </label>
                        <input
                            id="date-from"
                            type="date"
                            value={filters.dateRange.from || ""}
                            onChange={(e) => updateDateRange("from", e.target.value)}
                            className="approval-filter-date-input"
                        />
                    </div>
                    <div className="approval-filter-date-field">
                        <label htmlFor="date-to" className="approval-filter-label">
                            To
                        </label>
                        <input
                            id="date-to"
                            type="date"
                            value={filters.dateRange.to || ""}
                            onChange={(e) => updateDateRange("to", e.target.value)}
                            className="approval-filter-date-input"
                        />
                    </div>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="approval-filter-actions">
                    <button className="approval-filter-clear" onClick={clearAllFilters} aria-label="Clear all filters">
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    )

    // Render search and filter controls
    const renderControls = () => (
        <div className="approval-controls">
            <div className="approval-search-container">
                <div className="approval-search-input-wrapper">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="approval-search-icon"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        className="approval-search-input"
                        placeholder="Search subjects..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        aria-label="Search subjects"
                    />
                    {searchInput && (
                        <button className="approval-search-clear" onClick={() => setSearchInput("")} aria-label="Clear search">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>
                <button
                    className={`approval-filter-toggle ${hasActiveFilters ? "approval-filter-active" : ""}`}
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    aria-label="Toggle filters"
                    aria-expanded={isFilterPanelOpen}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="approval-filter-icon"
                    >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span className="approval-filter-text">Filters</span>
                    {hasActiveFilters && (
                        <span className="approval-filter-badge-count">
              {filters.types.length +
                  filters.requesters.length +
                  (filters.dateRange.from ? 1 : 0) +
                  (filters.dateRange.to ? 1 : 0) +
                  (filters.searchQuery ? 1 : 0)}
            </span>
                    )}
                </button>
            </div>

            {renderFilterPanel()}
        </div>
    )

    // Render table view for desktop
    const renderTableView = () => (
        <div className="approval-table-container">
            <table className="approval-table">
                <thead>
                <tr>
                    <th className="approval-table-header">Subject</th>
                    <th className="approval-table-header">Type</th>
                    <th className="approval-table-header">Requester</th>
                    <th className="approval-table-header">Date</th>
                    <th className="approval-table-header">Details</th>
                    <th className="approval-table-header">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredSubjects.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="approval-table-empty">
                            No matching subjects found
                        </td>
                    </tr>
                ) : (
                    filteredSubjects.map((subject) => (
                        <tr key={subject.id} className="approval-table-row">
                            <td className="approval-table-cell approval-table-title">
                                <Highlight text={subject.title} highlight={filters.searchQuery} />
                            </td>
                            <td className="approval-table-cell">
                  <span className={`approval-badge ${getTypeClass(subject.type)}`}>
                    {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
                  </span>
                            </td>
                            <td className="approval-table-cell">
                                <Highlight text={subject.requester} highlight={filters.searchQuery} />
                            </td>
                            <td className="approval-table-cell">{new Date(subject.date).toLocaleDateString()}</td>
                            <td className="approval-table-cell approval-table-info">{renderInfoButton(subject)}</td>
                            <td className="approval-table-cell approval-table-actions">{renderActionButtons(subject)}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    )

    // Render card view for mobile
    const renderCardView = () => (
        <div className="approval-list">
            {filteredSubjects.length === 0 ? (
                <div className="approval-empty">
                    <p>No matching subjects found</p>
                </div>
            ) : (
                filteredSubjects.map((subject) => (
                    <div key={subject.id} className="approval-card">
                        <div className="approval-card-header">
                            <h3 className="approval-card-title">
                                <Highlight text={subject.title} highlight={filters.searchQuery} />
                            </h3>
                            <span className={`approval-badge ${getTypeClass(subject.type)}`}>
                {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
              </span>
                        </div>
                        <div className="approval-card-content">
                            <div className="approval-card-info">
                <span>
                  From: <Highlight text={subject.requester} highlight={filters.searchQuery} />
                </span>
                                <span>Submitted: {new Date(subject.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="approval-card-footer">
                            {renderInfoButton(subject)}
                            {renderActionButtons(subject)}
                        </div>
                    </div>
                ))
            )}
        </div>
    )

    return (
        <div className="approval-container">
            {renderControls()}

            <div className={`approval-content ${isDesktop ? "approval-desktop" : "approval-mobile"}`}>
                {isDesktop ? renderTableView() : renderCardView()}
            </div>
        </div>
    )
}
