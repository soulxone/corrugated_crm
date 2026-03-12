/**
 * Welch Global Navigation Rail
 * Replaces Frappe's native .body-sidebar with the Welch-branded 56px dark-navy
 * navigation rail + slide-out drawer on EVERY Frappe desk page.
 *
 * Skips injection on /desk/customer-map (has its own built-in rail).
 * Loaded globally via app_include_js in corrugated_crm/hooks.py.
 */

(function () {
	"use strict";

	/* ── Navigation data ──────────────────────────────────────────────────────── */

	const NAV_GROUPS = [
		{
			id: "tools", icon: "fa-cube", label: "Tools", title: "Welch Custom Tools",
			sections: [
				{
					heading: "Customer Map",
					links: [
						{ label: "Customer Map",     href: "/desk/customer-map",  icon: "fa-map",         active: true },
						{ label: "Upload Customers", href: "#upload",             icon: "fa-upload",      action: "upload" },
					],
				},
				{
					heading: "Corrugated Estimating",
					links: [
						{ label: "All Estimates", href: "/app/corrugated-estimate",                        icon: "fa-file-text-o" },
						{ label: "New Estimate",  href: "/app/corrugated-estimate/new-corrugated-estimate-1", icon: "fa-plus-circle" },
					],
				},
				{
					heading: "Frappe CRM",
					links: [
						{ label: "CRM Home",  href: "/crm",          icon: "fa-tachometer" },
						{ label: "Leads",     href: "/crm/leads",    icon: "fa-user-plus" },
						{ label: "Deals",     href: "/crm/deals",    icon: "fa-handshake-o" },
						{ label: "Contacts",  href: "/crm/contacts", icon: "fa-address-card-o" },
						{ label: "Call Logs", href: "/crm/call-logs",icon: "fa-phone" },
					],
				},
			],
		},
		{
			id: "crm", icon: "fa-briefcase", label: "CRM", title: "CRM & Sales",
			sections: [
				{
					heading: "Frappe CRM",
					links: [
						{ label: "CRM Home",  href: "/crm",           icon: "fa-tachometer" },
						{ label: "Leads",     href: "/crm/leads",     icon: "fa-user-plus" },
						{ label: "Deals",     href: "/crm/deals",     icon: "fa-handshake-o" },
						{ label: "Contacts",  href: "/crm/contacts",  icon: "fa-address-card-o" },
						{ label: "Call Logs", href: "/crm/call-logs", icon: "fa-phone" },
					],
				},
				{
					heading: "ERPNext Selling",
					links: [
						{ label: "Selling",         href: "/app/selling",         icon: "fa-shopping-bag" },
						{ label: "Customers",       href: "/app/customer",        icon: "fa-users" },
						{ label: "Contacts",        href: "/app/contact",         icon: "fa-address-card-o" },
						{ label: "Leads",           href: "/app/lead",            icon: "fa-user-plus" },
						{ label: "Opportunities",   href: "/app/opportunity",     icon: "fa-star-o" },
						{ label: "Quotations",      href: "/app/quotation",       icon: "fa-file-text-o" },
						{ label: "Sales Orders",    href: "/app/sales-order",     icon: "fa-shopping-cart" },
						{ label: "Delivery Notes",  href: "/app/delivery-note",   icon: "fa-truck" },
						{ label: "Sales Invoices",  href: "/app/sales-invoice",   icon: "fa-file" },
						{ label: "Sales Return",    href: "/app/sales-invoice?is_return=1", icon: "fa-undo" },
						{ label: "Price Lists",     href: "/app/price-list",      icon: "fa-tag" },
						{ label: "Sales Analytics", href: "/app/sales-analytics", icon: "fa-line-chart" },
					],
				},
			],
		},
		{
			id: "finance", icon: "fa-money", label: "Finance", title: "Finance & Accounting",
			sections: [
				{
					heading: "Accounting",
					links: [
						{ label: "Accounts Home",     href: "/app/accounts",           icon: "fa-money" },
						{ label: "Chart of Accounts", href: "/app/account",            icon: "fa-sitemap" },
						{ label: "Journal Entry",     href: "/app/journal-entry",      icon: "fa-pencil" },
						{ label: "Payment Entry",     href: "/app/payment-entry",      icon: "fa-credit-card" },
					],
				},
				{
					heading: "Invoices",
					links: [
						{ label: "Sales Invoices",    href: "/app/sales-invoice",      icon: "fa-file" },
						{ label: "Purchase Invoices", href: "/app/purchase-invoice",   icon: "fa-file-o" },
						{ label: "Credit Notes",      href: "/app/sales-invoice?is_return=1", icon: "fa-undo" },
					],
				},
				{
					heading: "Financial Reports",
					links: [
						{ label: "Accounts Receivable", href: "/app/query-report/Accounts%20Receivable", icon: "fa-inbox" },
						{ label: "Accounts Payable",    href: "/app/query-report/Accounts%20Payable",    icon: "fa-share-square-o" },
						{ label: "Trial Balance",       href: "/app/query-report/Trial%20Balance",       icon: "fa-balance-scale" },
						{ label: "Profit & Loss",       href: "/app/query-report/Profit%20and%20Loss%20Statement", icon: "fa-line-chart" },
						{ label: "Cash Flow",           href: "/app/query-report/Cash%20Flow",           icon: "fa-tint" },
					],
				},
			],
		},
		{
			id: "procurement", icon: "fa-shopping-cart", label: "Buying", title: "Procurement & Buying",
			sections: [
				{
					heading: "Buying",
					links: [
						{ label: "Buying Home",      href: "/app/buying",              icon: "fa-shopping-cart" },
						{ label: "Suppliers",        href: "/app/supplier",            icon: "fa-industry" },
						{ label: "Purchase Orders",  href: "/app/purchase-order",      icon: "fa-file-text-o" },
						{ label: "Purchase Invoices",href: "/app/purchase-invoice",    icon: "fa-file-o" },
						{ label: "Purchase Receipts",href: "/app/purchase-receipt",    icon: "fa-clipboard" },
						{ label: "RFQ",              href: "/app/request-for-quotation", icon: "fa-question-circle-o" },
						{ label: "Supplier Quotations",href: "/app/supplier-quotation",icon: "fa-file-text" },
					],
				},
			],
		},
		{
			id: "inventory", icon: "fa-archive", label: "Stock", title: "Inventory & Stock",
			sections: [
				{
					heading: "Stock",
					links: [
						{ label: "Stock Home",       href: "/app/stock",               icon: "fa-archive" },
						{ label: "Items",            href: "/app/item",                icon: "fa-cube" },
						{ label: "Warehouses",       href: "/app/warehouse",           icon: "fa-building-o" },
						{ label: "Stock Entries",    href: "/app/stock-entry",         icon: "fa-exchange" },
						{ label: "Stock Ledger",     href: "/app/query-report/Stock%20Ledger", icon: "fa-book" },
						{ label: "Stock Balance",    href: "/app/query-report/Stock%20Balance", icon: "fa-bar-chart" },
						{ label: "Item Price",       href: "/app/item-price",          icon: "fa-tag" },
						{ label: "Batch",            href: "/app/batch",               icon: "fa-th-large" },
						{ label: "Serial No",        href: "/app/serial-no",           icon: "fa-barcode" },
					],
				},
			],
		},
		{
			id: "operations", icon: "fa-cogs", label: "Ops", title: "Operations & Projects",
			sections: [
				{
					heading: "Manufacturing",
					links: [
						{ label: "Manufacturing",    href: "/app/manufacturing",       icon: "fa-industry" },
						{ label: "BOM",              href: "/app/bom",                 icon: "fa-sitemap" },
						{ label: "Work Orders",      href: "/app/work-order",          icon: "fa-cogs" },
					],
				},
				{
					heading: "Projects",
					links: [
						{ label: "Projects",         href: "/app/project",             icon: "fa-tasks" },
						{ label: "Tasks",            href: "/app/task",                icon: "fa-check-square-o" },
						{ label: "Timesheets",       href: "/app/timesheet",           icon: "fa-clock-o" },
					],
				},
				{
					heading: "Support",
					links: [
						{ label: "Issues",           href: "/app/issue",               icon: "fa-bug" },
						{ label: "Customers (Support)",href: "/app/customer",          icon: "fa-users" },
					],
				},
			],
		},
		{
			id: "hr", icon: "fa-users", label: "HR", title: "HR & People",
			sections: [
				{
					heading: "Employees",
					links: [
						{ label: "HR Home",          href: "/app/hr",                  icon: "fa-users" },
						{ label: "Employees",        href: "/app/employee",            icon: "fa-user" },
						{ label: "Departments",      href: "/app/department",          icon: "fa-building-o" },
					],
				},
				{
					heading: "Leave & Attendance",
					links: [
						{ label: "Leave Applications",href: "/app/leave-application",  icon: "fa-calendar-o" },
						{ label: "Attendance",       href: "/app/attendance",          icon: "fa-check" },
						{ label: "Shift Type",       href: "/app/shift-type",          icon: "fa-clock-o" },
					],
				},
				{
					heading: "Payroll",
					links: [
						{ label: "Salary Slips",     href: "/app/salary-slip",         icon: "fa-money" },
						{ label: "Payroll Entry",    href: "/app/payroll-entry",       icon: "fa-calculator" },
					],
				},
			],
		},
		{
			id: "reports", icon: "fa-bar-chart", label: "Reports", title: "Reports & Analytics",
			sections: [
				{
					heading: "Analytics Platforms",
					links: [
						{ label: "Frappe Insights",  href: "/insights",                icon: "fa-lightbulb-o" },
						{ label: "Dashboards",       href: "/app/dashboard",           icon: "fa-tachometer" },
						{ label: "Report Builder",   href: "/app/query-report",        icon: "fa-table" },
						{ label: "All Reports",      href: "/app/report",              icon: "fa-list" },
					],
				},
				{
					heading: "Sales Reports",
					links: [
						{ label: "Sales Analytics",        href: "/app/sales-analytics",  icon: "fa-line-chart" },
						{ label: "Sales Register",         href: "/app/query-report/Sales%20Register", icon: "fa-file-text" },
						{ label: "Ordered Items Summary",  href: "/app/query-report/Ordered%20Items%20To%20Be%20Delivered", icon: "fa-truck" },
						{ label: "Customer Credit Balance",href: "/app/query-report/Customer%20Credit%20Balance", icon: "fa-credit-card" },
					],
				},
				{
					heading: "Finance Reports",
					links: [
						{ label: "Accounts Receivable", href: "/app/query-report/Accounts%20Receivable", icon: "fa-inbox" },
						{ label: "Accounts Payable",    href: "/app/query-report/Accounts%20Payable",    icon: "fa-share-square-o" },
						{ label: "Trial Balance",       href: "/app/query-report/Trial%20Balance",       icon: "fa-balance-scale" },
						{ label: "Profit & Loss",       href: "/app/query-report/Profit%20and%20Loss%20Statement", icon: "fa-line-chart" },
						{ label: "Cash Flow",           href: "/app/query-report/Cash%20Flow",           icon: "fa-tint" },
					],
				},
				{
					heading: "Inventory Reports",
					links: [
						{ label: "Stock Balance",       href: "/app/query-report/Stock%20Balance",       icon: "fa-bar-chart" },
						{ label: "Stock Ledger",        href: "/app/query-report/Stock%20Ledger",        icon: "fa-book" },
					],
				},
			],
		},
		{
			id: "settings", icon: "fa-cog", label: "Admin", title: "Settings & Administration",
			sections: [
				{
					heading: "System",
					links: [
						{ label: "System Settings",  href: "/app/system-settings",     icon: "fa-sliders" },
						{ label: "Email Account",    href: "/app/email-account",       icon: "fa-envelope" },
						{ label: "Print Settings",   href: "/app/print-settings",      icon: "fa-print" },
						{ label: "Notification",     href: "/app/notification",        icon: "fa-bell" },
					],
				},
				{
					heading: "Customization",
					links: [
						{ label: "Custom Fields",    href: "/app/custom-field",        icon: "fa-plus-square-o" },
						{ label: "Customize Form",   href: "/app/customize-form",      icon: "fa-pencil-square-o" },
						{ label: "DocType",          href: "/app/doctype",             icon: "fa-file-code-o" },
						{ label: "Print Formats",    href: "/app/print-format",        icon: "fa-print" },
						{ label: "Workflow",         href: "/app/workflow",            icon: "fa-random" },
					],
				},
				{
					heading: "Data & Apps",
					links: [
						{ label: "Data Import",      href: "/app/data-import",         icon: "fa-upload" },
						{ label: "Data Export",      href: "/app/data-export",         icon: "fa-download" },
						{ label: "Installed Apps",   href: "/app/installed-apps",      icon: "fa-th-large" },
						{ label: "Error Log",        href: "/app/error-log",           icon: "fa-exclamation-triangle" },
					],
				},
			],
		},
	];

	/* ── State ────────────────────────────────────────────────────────────────── */

	let _activeGroup   = null;
	let _drawerOpen    = false;
	let _injected      = false;

	/* ── Helpers ──────────────────────────────────────────────────────────────── */

	function _is_customer_map() {
		// URL-only check — #cm-nav-rail persists in DOM after SPA navigation,
		// so we cannot use it as a reliable indicator of the current page.
		return /\/desk\/customer-map/.test(window.location.pathname);
	}

	function _is_desk() {
		// Only run on the Frappe desk (not website/CRM SPA etc.)
		return !!document.querySelector(".body-sidebar-container");
	}

	/* ── CSS injection ────────────────────────────────────────────────────────── */

	function _inject_styles() {
		if (document.getElementById("welch-global-nav-css")) return;
		const style = document.createElement("style");
		style.id = "welch-global-nav-css";
		style.textContent = `
/* ── Hide Frappe's native sidebar ─────────────────────────────────────────── */
.body-sidebar {
	display: none !important;
}
.body-sidebar-placeholder {
	width: 56px !important;
	min-width: 56px !important;
	flex-shrink: 0 !important;
}

/* ── Welch Global Nav Rail ─────────────────────────────────────────────────── */
#welch-nav-rail {
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	width: 56px;
	background: #1a237e;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 1050;
	overflow: hidden;
}
.welch-rail-logo {
	width: 36px;
	height: 36px;
	background: #fff;
	color: #1a237e;
	border-radius: 8px;
	font-size: 19px;
	font-weight: 900;
	line-height: 36px;
	text-align: center;
	margin: 10px auto 6px;
	cursor: pointer;
	flex-shrink: 0;
	user-select: none;
}
.welch-rail-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 8px 2px 6px;
	background: none;
	border: none;
	border-left: 3px solid transparent;
	color: rgba(255,255,255,.58);
	font-size: 9px;
	font-family: inherit;
	cursor: pointer;
	text-decoration: none !important;
	gap: 3px;
	transition: background .15s, color .15s, border-left-color .15s;
	line-height: 1.2;
}
.welch-rail-btn i {
	font-size: 16px;
	line-height: 1;
}
.welch-rail-btn:hover,
.welch-rail-btn:focus {
	background: rgba(255,255,255,.12);
	color: #fff;
	text-decoration: none !important;
	outline: none;
}
.welch-rail-btn.welch-rail-active {
	background: rgba(255,255,255,.18);
	color: #fff;
	border-left-color: #90caf9;
}
.welch-rail-top {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	overflow-y: auto;
	overflow-x: hidden;
	flex: 1;
}
.welch-rail-bottom {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	border-top: 1px solid rgba(255,255,255,.15);
	padding-top: 4px;
	padding-bottom: 6px;
}
/* User avatar circle at very bottom */
.welch-rail-user {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 6px 2px 8px;
	gap: 2px;
}
.welch-rail-avatar {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: rgba(255,255,255,.25);
	color: #fff;
	font-size: 11px;
	font-weight: 700;
	line-height: 28px;
	text-align: center;
	cursor: pointer;
	user-select: none;
}
.welch-rail-user-name {
	font-size: 8px;
	color: rgba(255,255,255,.55);
	text-align: center;
	max-width: 52px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* ── Nav Drawer ────────────────────────────────────────────────────────────── */
#welch-nav-drawer {
	position: fixed;
	left: 56px;
	top: 0;
	bottom: 0;
	width: 256px;
	background: #fff;
	z-index: 1049;
	box-shadow: 4px 0 20px rgba(0,0,0,.16);
	transform: translateX(-120%);
	transition: transform .22s cubic-bezier(.4,0,.2,1);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
#welch-nav-drawer.welch-drawer-open {
	transform: translateX(0);
}
.welch-drawer-header {
	background: #1a237e;
	color: #fff;
	padding: 0 12px 0 14px;
	min-height: 46px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-shrink: 0;
}
.welch-drawer-header-inner {
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 13px;
	font-weight: 600;
	overflow: hidden;
}
.welch-drawer-close {
	background: none;
	border: none;
	color: rgba(255,255,255,.7);
	font-size: 20px;
	line-height: 1;
	cursor: pointer;
	padding: 2px 4px;
	flex-shrink: 0;
}
.welch-drawer-close:hover { color: #fff; }
.welch-drawer-body {
	flex: 1;
	overflow-y: auto;
	padding: 6px 0 12px;
}
.welch-drawer-section {
	padding: 10px 0 2px;
}
.welch-drawer-heading {
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: .06em;
	color: #9fa8da;
	padding: 0 14px 4px;
}
.welch-drawer-link {
	display: flex;
	align-items: center;
	gap: 9px;
	padding: 7px 16px 7px 14px;
	font-size: 12.5px;
	color: #37474f;
	text-decoration: none !important;
	border-left: 3px solid transparent;
	transition: background .12s, color .12s, border-left-color .12s;
	cursor: pointer;
}
.welch-drawer-link i {
	width: 14px;
	text-align: center;
	color: #7986cb;
	font-size: 12px;
	flex-shrink: 0;
}
.welch-drawer-link:hover {
	background: #e8eaf6;
	color: #1a237e;
	border-left-color: #5c6bc0;
	text-decoration: none !important;
}
.welch-drawer-link:hover i { color: #1a237e; }
.welch-drawer-link.welch-link-active {
	background: #e3f2fd;
	color: #1565c0;
	border-left-color: #1565c0;
	font-weight: 600;
}

/* ── Backdrop ─────────────────────────────────────────────────────────────── */
#welch-nav-backdrop {
	position: fixed;
	left: 56px;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 1048;
	background: rgba(0,0,0,.14);
	display: none;
}
#welch-nav-backdrop.welch-backdrop-open {
	display: block;
}

/* ── Account dropdown panel ───────────────────────────────────────────────── */
#welch-account-panel {
	position: fixed;
	left: 56px;
	bottom: 0;
	width: 200px;
	background: #fff;
	border: 1px solid #e8eaf6;
	border-radius: 6px;
	box-shadow: 4px -4px 16px rgba(0,0,0,.14);
	z-index: 1050;
	display: none;
	padding: 8px 0;
}
#welch-account-panel.welch-acct-open { display: block; }
.welch-acct-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 14px;
	font-size: 12.5px;
	color: #37474f;
	cursor: pointer;
	text-decoration: none !important;
}
.welch-acct-item i { width: 14px; color: #7986cb; text-align: center; }
.welch-acct-item:hover { background: #e8eaf6; color: #1a237e; }
.welch-acct-divider { border-top: 1px solid #e8eaf6; margin: 4px 0; }
		`;
		document.head.appendChild(style);
	}

	/* ── Build Rail HTML ──────────────────────────────────────────────────────── */

	function _build_rail_html() {
		// Get current user initials for avatar
		const fullName = (frappe && frappe.session && frappe.session.user_info)
			? frappe.session.user_info.fullname || frappe.session.user || ""
			: "";
		const initials = fullName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() || "SG";

		const topButtons = NAV_GROUPS.filter(g => g.id !== "settings").map(g => `
			<button class="welch-rail-btn" data-nav="${g.id}" title="${g.title}">
				<i class="fa ${g.icon}"></i>
				<span>${g.label}</span>
			</button>
		`).join("");

		return `
		<div id="welch-nav-rail">
			<div class="welch-rail-top">
				<div class="welch-rail-logo" id="welch-rail-logo" title="Welch Packaging — Customer Map"
				     onclick="window.location='/desk/customer-map'">W</div>
				${topButtons}
			</div>
			<div class="welch-rail-bottom">
				<button class="welch-rail-btn" data-nav="settings" title="Settings & Admin">
					<i class="fa fa-cog"></i>
					<span>Admin</span>
				</button>
				<div class="welch-rail-user" id="welch-rail-user" title="Account: ${fullName}">
					<div class="welch-rail-avatar" id="welch-rail-avatar">${initials}</div>
					<div class="welch-rail-user-name">${initials}</div>
				</div>
			</div>
		</div>
		<div id="welch-nav-drawer">
			<div class="welch-drawer-header">
				<div class="welch-drawer-header-inner">
					<i class="fa welch-drawer-icon" id="welch-drawer-icon"></i>
					<span id="welch-drawer-title">Navigation</span>
				</div>
				<button class="welch-drawer-close" id="welch-drawer-close" title="Close">×</button>
			</div>
			<div class="welch-drawer-body" id="welch-drawer-body"></div>
		</div>
		<div id="welch-nav-backdrop"></div>
		<div id="welch-account-panel">
			<div class="welch-acct-item" onclick="frappe.ui.toolbar.clear_cache()">
				<i class="fa fa-refresh"></i> Clear Cache
			</div>
			<div class="welch-acct-item" onclick="window.location='/app/user/${frappe && frappe.session ? frappe.session.user : ''}'">
				<i class="fa fa-user-o"></i> My Profile
			</div>
			<div class="welch-acct-item" onclick="window.location='/app/user'">
				<i class="fa fa-users"></i> Users
			</div>
			<div class="welch-acct-divider"></div>
			<div class="welch-acct-item" onclick="frappe.app.logout()">
				<i class="fa fa-sign-out"></i> Logout
			</div>
		</div>
		`;
	}

	/* ── Suppress Frappe's native sidebar ─────────────────────────────────────── */

	function _suppress_frappe_sidebar() {
		// Make placeholder exactly 56px so page content is offset correctly
		const placeholder = document.querySelector(".body-sidebar-placeholder");
		if (placeholder) {
			placeholder.style.cssText = "width:56px !important; min-width:56px !important; flex-shrink:0 !important;";
		}
	}

	/* ── Show / hide nav group drawer ─────────────────────────────────────────── */

	function _show_group(groupId) {
		const group = NAV_GROUPS.find(g => g.id === groupId);
		if (!group) return;

		// Update active state on rail
		document.querySelectorAll(".welch-rail-btn").forEach(b => {
			b.classList.toggle("welch-rail-active", b.dataset.nav === groupId);
		});

		// Build drawer body
		const body = document.getElementById("welch-drawer-body");
		if (!body) return;
		const currentPath = window.location.pathname;

		body.innerHTML = group.sections.map(sec => `
			<div class="welch-drawer-section">
				<div class="welch-drawer-heading">${sec.heading}</div>
				${sec.links.map(lnk => {
					const isActive = lnk.active || (lnk.href !== "#upload" && currentPath.startsWith(lnk.href));
					return `<a class="welch-drawer-link ${isActive ? "welch-link-active" : ""}"
					           href="${lnk.href}"
					           ${lnk.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}
					           data-action="${lnk.action || ""}"
					           title="${lnk.label}">
					            <i class="fa ${lnk.icon}"></i>${lnk.label}
					          </a>`;
				}).join("")}
			</div>
		`).join("");

		// Handle special links
		body.querySelectorAll(".welch-drawer-link[data-action='upload']").forEach(el => {
			el.addEventListener("click", (e) => {
				e.preventDefault();
				_hide_drawer();
				// trigger upload dialog if on customer map, else navigate there
				if (_is_customer_map() && window._cmApp && window._cmApp._open_upload_dialog) {
					window._cmApp._open_upload_dialog();
				} else {
					window.location = "/desk/customer-map";
				}
			});
		});

		// Update header
		const iconEl = document.getElementById("welch-drawer-icon");
		const titleEl = document.getElementById("welch-drawer-title");
		if (iconEl)  iconEl.className = "fa " + group.icon + " welch-drawer-icon";
		if (titleEl) titleEl.textContent = group.title;

		// Open drawer + backdrop
		const drawer = document.getElementById("welch-nav-drawer");
		const backdrop = document.getElementById("welch-nav-backdrop");
		if (drawer)   drawer.classList.add("welch-drawer-open");
		if (backdrop) backdrop.classList.add("welch-backdrop-open");

		_activeGroup = groupId;
		_drawerOpen  = true;
	}

	function _hide_drawer() {
		const drawer   = document.getElementById("welch-nav-drawer");
		const backdrop = document.getElementById("welch-nav-backdrop");
		const acctPanel= document.getElementById("welch-account-panel");
		if (drawer)    drawer.classList.remove("welch-drawer-open");
		if (backdrop)  backdrop.classList.remove("welch-backdrop-open");
		if (acctPanel) acctPanel.classList.remove("welch-acct-open");
		document.querySelectorAll(".welch-rail-btn").forEach(b => b.classList.remove("welch-rail-active"));
		_activeGroup  = null;
		_drawerOpen   = false;
	}

	/* ── Account panel ────────────────────────────────────────────────────────── */

	function _toggle_account_panel() {
		const panel = document.getElementById("welch-account-panel");
		if (!panel) return;
		const open = panel.classList.toggle("welch-acct-open");
		// Close nav drawer when account opens
		if (open) {
			const drawer   = document.getElementById("welch-nav-drawer");
			const backdrop = document.getElementById("welch-nav-backdrop");
			if (drawer)    drawer.classList.remove("welch-drawer-open");
			if (backdrop)  backdrop.classList.remove("welch-backdrop-open");
			document.querySelectorAll(".welch-rail-btn").forEach(b => b.classList.remove("welch-rail-active"));
			_drawerOpen = false;
			_activeGroup = null;
		}
	}

	/* ── Bind events ──────────────────────────────────────────────────────────── */

	function _bind_events() {
		// Rail nav buttons
		document.querySelectorAll(".welch-rail-btn[data-nav]").forEach(btn => {
			btn.addEventListener("click", e => {
				e.stopPropagation();
				const group = btn.dataset.nav;
				if (_drawerOpen && _activeGroup === group) {
					_hide_drawer();
				} else {
					// Close account panel if open
					const acct = document.getElementById("welch-account-panel");
					if (acct) acct.classList.remove("welch-acct-open");
					_show_group(group);
				}
			});
		});

		// Account avatar
		const userBtn = document.getElementById("welch-rail-user");
		if (userBtn) userBtn.addEventListener("click", e => {
			e.stopPropagation();
			_toggle_account_panel();
		});

		// Close button
		const closeBtn = document.getElementById("welch-drawer-close");
		if (closeBtn) closeBtn.addEventListener("click", _hide_drawer);

		// Backdrop
		const backdrop = document.getElementById("welch-nav-backdrop");
		if (backdrop) backdrop.addEventListener("click", _hide_drawer);

		// ESC key
		document.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				_hide_drawer();
				const acct = document.getElementById("welch-account-panel");
				if (acct) acct.classList.remove("welch-acct-open");
			}
		});

		// Close account panel on outside click
		document.addEventListener("click", e => {
			if (!e.target.closest("#welch-rail-user") && !e.target.closest("#welch-account-panel")) {
				const acct = document.getElementById("welch-account-panel");
				if (acct) acct.classList.remove("welch-acct-open");
			}
		});
	}

	/* ── Main inject ──────────────────────────────────────────────────────────── */

	function _inject() {
		if (_is_customer_map()) return;          // Customer Map has its own rail
		if (!_is_desk()) return;                  // Not the Frappe desk
		if (document.getElementById("welch-nav-rail")) {
			_suppress_frappe_sidebar();           // Already injected — just re-suppress
			return;
		}

		_inject_styles();

		// Insert rail + drawer + backdrop before all other body content
		const container = document.createElement("div");
		container.innerHTML = _build_rail_html();
		while (container.firstChild) {
			document.body.insertBefore(container.firstChild, document.body.firstChild);
		}

		_suppress_frappe_sidebar();
		_bind_events();
		_injected = true;
	}

	/* ── Re-evaluate on Frappe page changes ───────────────────────────────────── */

	function _on_page_change() {
		setTimeout(() => {
			if (_is_customer_map()) {
				// Hide our global rail if customer map injects its own
				const rail = document.getElementById("welch-nav-rail");
				if (rail) rail.style.display = "none";
			} else {
				const rail = document.getElementById("welch-nav-rail");
				if (rail) {
					rail.style.display = "";            // Restore
					_suppress_frappe_sidebar();
				} else {
					_inject();                          // First time on this page type
				}
				_hide_drawer();
			}
		}, 150);
	}

	/* ── Boot ─────────────────────────────────────────────────────────────────── */

	function _boot() {
		_inject();

		// Hook into Frappe's page router
		if (typeof frappe !== "undefined") {
			$(document).on("page-change", _on_page_change);
			frappe.router && frappe.router.on && frappe.router.on("change", _on_page_change);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", _boot);
	} else {
		_boot();
	}

})();
