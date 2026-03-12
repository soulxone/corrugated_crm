/**
 * CRM → Customer Map Integration
 * Adds a "📍 View on Customer Map" button to:
 *   - Frappe CRM Lead forms (Vue SPA at /crm/leads/...)
 *   - Frappe CRM Deal forms (Vue SPA at /crm/deals/...)
 *   - Standard Frappe desk: Customer and Contact forms
 *
 * For the Frappe CRM Vue SPA, we use a MutationObserver to detect
 * route changes (since standard doctype_js won't fire there).
 */

(function () {
	"use strict";

	/* ── Helpers ──────────────────────────────────────────────────────────── */

	/**
	 * Build the Customer Map URL with optional search/state query params.
	 * @param {string} searchTerm  – customer name or address fragment
	 * @param {string} state       – two-letter state code (optional)
	 */
	function buildMapUrl(searchTerm, state) {
		const base   = "/desk/customer-map";
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (state)      params.set("state",  state);
		const qs = params.toString();
		return qs ? `${base}?${qs}` : base;
	}

	/**
	 * Create the map button DOM element.
	 */
	function makeButton(label, url) {
		const btn = document.createElement("a");
		btn.href      = url;
		btn.target    = "_blank";
		btn.rel       = "noopener noreferrer";
		btn.className = "btn btn-xs btn-default crm-map-btn";
		btn.title     = "Open this address in Customer Map";
		btn.innerHTML = `<i class="fa fa-map-marker" style="color:#e53935"></i>&nbsp; ${label}`;
		btn.style.cssText = "margin-left:8px;white-space:nowrap;font-size:12px;";
		return btn;
	}

	/* ── Frappe CRM Vue SPA integration ───────────────────────────────────── */

	let _crmObserver = null;
	let _lastCrmPath = "";

	/**
	 * Check if the current URL is a CRM Lead or Deal detail page.
	 * CRM uses routes like:  /crm/leads/CRM-LEAD-00001
	 *                         /crm/deals/CRM-DEAL-00001
	 */
	function isCrmDetailPage() {
		return /\/(leads|deals)\/[^/]+/.test(window.location.pathname);
	}

	/**
	 * Extract the record name from the current CRM URL path.
	 * e.g. "/crm/leads/CRM-LEAD-00001" → "CRM-LEAD-00001"
	 */
	function getCrmRecordName() {
		const m = window.location.pathname.match(/\/(leads|deals)\/([^/?]+)/);
		return m ? m[2] : null;
	}

	/**
	 * Inject the map button into the CRM Vue SPA action bar.
	 * The CRM SPA renders a bar with class `.form-sidebar` or header actions.
	 * We target the top action area which contains the status selector.
	 */
	function injectCrmMapButton() {
		// Already injected on this navigation
		if (document.querySelector(".crm-map-btn")) return;
		if (!isCrmDetailPage()) return;

		const recName = getCrmRecordName();
		if (!recName) return;

		// Determine whether it's a lead or deal
		const isLead = /\/leads\//.test(window.location.pathname);
		const isDeal = /\/deals\//.test(window.location.pathname);

		if (!isLead && !isDeal) return;

		const doctype = isLead ? "CRM Lead" : "CRM Deal";
		const nameField = isLead ? "lead_name" : "customer_name";
		const addrField = "city";

		// Fetch the record to get name / state for the map URL
		frappe.call({
			method: "frappe.client.get",
			args: { doctype, name: recName, fieldname: [nameField, "state", "city", addrField] },
		}).then((r) => {
			if (!r.message) return;
			const rec      = r.message;
			const customer = rec[nameField] || rec["company_name"] || recName;
			const state    = rec["state"] || "";
			const url      = buildMapUrl(customer, state);

			// Try to find the CRM form header action area (where Save/Convert etc live)
			// The CRM SPA uses a sticky header – try several selectors
			const targets = [
				".form-header-actions",
				".crm-form-actions",
				"[class*='HeaderActions']",
				".crm-main-section .flex.items-center.gap-2",
				"header .flex.gap-2",
			];

			let container = null;
			for (const sel of targets) {
				container = document.querySelector(sel);
				if (container) break;
			}

			// Fallback: append to the top-level CRM page container heading
			if (!container) {
				container = document.querySelector(".crm-main-section") ||
				            document.querySelector("[class*='LeadDetail']") ||
				            document.querySelector("[class*='DealDetail']");
			}

			if (!container) return;

			const btn = makeButton("View on Customer Map", url);
			container.appendChild(btn);
		}).catch(() => {
			// CRM not available or record not found – silently skip
		});
	}

	/**
	 * Start observing DOM mutations to detect CRM SPA route navigation.
	 */
	function startCrmObserver() {
		if (_crmObserver) return;
		_crmObserver = new MutationObserver(() => {
			const path = window.location.pathname;
			if (path !== _lastCrmPath) {
				_lastCrmPath = path;
				// Small delay to let the Vue component finish rendering
				setTimeout(injectCrmMapButton, 600);
			}
		});
		_crmObserver.observe(document.body, { childList: true, subtree: true });

		// Also handle initial load
		setTimeout(injectCrmMapButton, 800);
	}

	/* ── Standard Frappe Desk form integration ────────────────────────────── */

	/**
	 * Inject map button into a standard Frappe desk form.
	 * Called from frappe.ui.form.on handlers below.
	 */
	function injectDeskFormButton(frm, nameField, stateField) {
		const customer = frm.doc[nameField] || frm.doc.customer_name || frm.doc.name || "";
		const state    = frm.doc[stateField] || "";
		const url      = buildMapUrl(customer, state);

		// Add a custom button in the form's action bar
		frm.add_custom_button(
			'<i class="fa fa-map-marker" style="color:#e53935"></i>&nbsp; View on Customer Map',
			() => window.open(url, "_blank"),
			"Links"
		);
	}

	/* ── Standard Frappe desk: Customer form ──────────────────────────────── */
	if (typeof frappe !== "undefined" && frappe.ui && frappe.ui.form) {
		frappe.ui.form.on("Customer", {
			refresh(frm) {
				// Get primary address state if available
				const state = (frm.doc.primary_address || "").match(/\b([A-Z]{2})\b/)?.[1] || "";
				const url   = buildMapUrl(frm.doc.customer_name || frm.doc.name, state);
				frm.add_custom_button(
					'<i class="fa fa-map-marker" style="color:#e53935"></i>&nbsp; View on Customer Map',
					() => window.open(url, "_blank"),
					"Links"
				);
			},
		});

		/* ── Standard Frappe desk: Contact form ───────────────────────────────── */
		frappe.ui.form.on("Contact", {
			refresh(frm) {
				// Build search term from full name
				const name  = frm.doc.full_name || (frm.doc.first_name + " " + (frm.doc.last_name || "")).trim();
				// Try to get linked customer name
				let customer = name;
				if (frm.doc.links && frm.doc.links.length) {
					const custLink = frm.doc.links.find((l) => l.link_doctype === "Customer");
					if (custLink) customer = custLink.link_name;
				}
				const url = buildMapUrl(customer, "");
				frm.add_custom_button(
					'<i class="fa fa-map-marker" style="color:#e53935"></i>&nbsp; View on Customer Map',
					() => window.open(url, "_blank"),
					"Links"
				);
			},
		});
	}

	/* ── Boot: start CRM observer once DOM is ready ───────────────────────── */
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", startCrmObserver);
	} else {
		startCrmObserver();
	}

})();
