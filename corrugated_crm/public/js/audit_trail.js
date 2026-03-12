/* =============================================================================
   Corrugated CRM – Audit Trail Widget
   Injects a "Change History" timeline at the bottom of CRM Lead, CRM Deal,
   Corrugated Estimate, and Customer forms using Frappe's built-in
   track_changes versioning (frappe.model.docinfo.versions).
   ============================================================================= */
(function () {
	"use strict";

	var AUDIT_DOCTYPES = [
		"CRM Lead",
		"CRM Deal",
		"Customer",
		"Corrugated Estimate",
	];

	var WIDGET_ID = "cm-audit-trail";

	// Human-friendly field labels for corrugated fields
	var FIELD_LABELS = {
		box_style: "Box Style",
		flute_type: "Flute Type",
		board_grade: "Board Grade",
		box_length: "Length (in)",
		box_width: "Width (in)",
		box_depth: "Depth (in)",
		annual_quantity: "Annual Quantity",
		num_colors: "# Colors",
		print_method: "Print Method",
		coating: "Coating",
		cad_file: "CAD File",
		print_artwork: "Print Artwork",
		spec_notes: "Spec Notes",
		status: "Status",
		lead_name: "Lead Name",
		company_name: "Company",
		deal_name: "Deal Name",
		customer_name: "Customer Name",
	};

	function getLabel(fieldname) {
		return FIELD_LABELS[fieldname] || fieldname.replace(/_/g, " ").replace(/\b\w/g, function(c){ return c.toUpperCase(); });
	}

	function formatVal(v) {
		if (v === null || v === undefined || v === "") return "(empty)";
		return String(v);
	}

	function buildTimeline(versions) {
		if (!versions || !versions.length) {
			return '<div class="cm-audit-empty">No changes recorded yet.</div>';
		}

		var html = "";
		versions.forEach(function (ver) {
			var data = {};
			try { data = JSON.parse(ver.data); } catch(e) { return; }

			var changed = data.changed || [];
			if (!changed.length) return;

			var ts = ver.creation ? frappe.datetime.str_to_user(ver.creation) : "";
			var user = ver.owner || "";

			// Build field change rows, skipping internal Frappe fields
			var rows = changed
				.filter(function(c) { return c[0] && c[0].indexOf("_") !== 0 && c[0] !== "modified" && c[0] !== "modified_by"; })
				.map(function(c) {
					return '<div class="cm-audit-change">' +
						'<span class="cm-audit-field">' + getLabel(c[0]) + ':</span> ' +
						'<span class="cm-audit-old">' + frappe.utils.escape_html(formatVal(c[1])) + '</span>' +
						' <span class="cm-audit-arrow">→</span> ' +
						'<span class="cm-audit-new">' + frappe.utils.escape_html(formatVal(c[2])) + '</span>' +
					'</div>';
				});

			if (!rows.length) return;

			html += '<div class="cm-audit-entry">' +
				'<div class="cm-audit-meta">' +
					'<span class="cm-audit-dot">●</span>' +
					'<span class="cm-audit-ts">' + ts + '</span>' +
					'<span class="cm-audit-sep">|</span>' +
					'<span class="cm-audit-user">' + frappe.utils.escape_html(user) + '</span>' +
				'</div>' +
				rows.join("") +
			'</div>';
		});

		return html || '<div class="cm-audit-empty">No field changes recorded.</div>';
	}

	function renderAuditTrail(frm) {
		// Remove existing widget first
		frm.page.body.find("#" + WIDGET_ID).remove();

		var versions = (frappe.model.docinfo[frm.doctype] &&
			frappe.model.docinfo[frm.doctype][frm.docname] &&
			frappe.model.docinfo[frm.doctype][frm.docname].versions) || [];

		var timelineHtml = buildTimeline(versions);

		var $widget = $('<div id="' + WIDGET_ID + '" class="cm-audit-trail-wrap">' +
			'<div class="cm-audit-header">' +
				'<span class="cm-audit-title">📋 Change History</span>' +
				'<span class="cm-audit-count">' + versions.length + ' version' + (versions.length !== 1 ? 's' : '') + '</span>' +
			'</div>' +
			'<div class="cm-audit-body">' + timelineHtml + '</div>' +
		'</div>');

		frm.page.body.find(".form-page").append($widget);
	}

	// Inject CSS once
	var css = [
		".cm-audit-trail-wrap {",
		"  margin: 24px 15px 40px;",
		"  border: 1px solid #e2e8f0;",
		"  border-radius: 8px;",
		"  overflow: hidden;",
		"  font-family: inherit;",
		"}",
		".cm-audit-header {",
		"  background: #f8fafc;",
		"  border-bottom: 1px solid #e2e8f0;",
		"  padding: 10px 16px;",
		"  display: flex;",
		"  justify-content: space-between;",
		"  align-items: center;",
		"}",
		".cm-audit-title {",
		"  font-weight: 700;",
		"  font-size: 13px;",
		"  color: #1e293b;",
		"}",
		".cm-audit-count {",
		"  font-size: 11px;",
		"  color: #94a3b8;",
		"}",
		".cm-audit-body {",
		"  padding: 12px 16px;",
		"  max-height: 340px;",
		"  overflow-y: auto;",
		"  background: #fff;",
		"}",
		".cm-audit-entry {",
		"  margin-bottom: 14px;",
		"  padding-bottom: 14px;",
		"  border-bottom: 1px solid #f1f5f9;",
		"}",
		".cm-audit-entry:last-child { border-bottom: none; margin-bottom: 0; }",
		".cm-audit-meta {",
		"  font-size: 11px;",
		"  color: #64748b;",
		"  margin-bottom: 5px;",
		"}",
		".cm-audit-dot { color: #3b82f6; margin-right: 6px; }",
		".cm-audit-ts { font-weight: 600; color: #374151; }",
		".cm-audit-sep { margin: 0 6px; color: #cbd5e1; }",
		".cm-audit-user { font-style: italic; }",
		".cm-audit-change {",
		"  font-size: 12px;",
		"  color: #374151;",
		"  margin-left: 16px;",
		"  margin-top: 3px;",
		"}",
		".cm-audit-field { font-weight: 600; color: #1e293b; }",
		".cm-audit-old { color: #dc2626; text-decoration: line-through; }",
		".cm-audit-arrow { color: #94a3b8; margin: 0 3px; }",
		".cm-audit-new { color: #16a34a; font-weight: 600; }",
		".cm-audit-empty { font-size: 12px; color: #94a3b8; font-style: italic; padding: 8px 0; }",
	].join("\n");

	$("<style>").text(css).appendTo("head");

	// ── Hook into each target DocType ─────────────────────────────────────────
	AUDIT_DOCTYPES.forEach(function (dt) {
		frappe.ui.form.on(dt, {
			refresh: function (frm) {
				if (!frm.is_new()) {
					renderAuditTrail(frm);
				}
			},
		});
	});

})();
