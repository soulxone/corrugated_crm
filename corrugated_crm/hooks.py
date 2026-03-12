app_name = "corrugated_crm"
app_title = "Corrugated CRM"
app_publisher = "Welchwyse"
app_description = "Corrugated industry fields, spec cards, and audit trail for Frappe CRM"
app_email = "admin@welchwyse.com"
app_license = "MIT"

# ── Fixtures ──────────────────────────────────────────────────────────────────
# Exports/imports Custom Field and Print Format records from the DB.
# Run: bench --site <site> export-fixtures --app corrugated_crm
fixtures = [
    {
        "doctype": "Custom Field",
        "filters": [
            ["name", "in", [
                # CRM Lead corrugated fields
                "CRM Lead-corrugated_section",
                "CRM Lead-box_style",
                "CRM Lead-flute_type",
                "CRM Lead-board_grade",
                "CRM Lead-corrugated_col1",
                "CRM Lead-box_length",
                "CRM Lead-box_width",
                "CRM Lead-box_depth",
                "CRM Lead-annual_quantity",
                "CRM Lead-print_section",
                "CRM Lead-num_colors",
                "CRM Lead-print_method",
                "CRM Lead-coating",
                "CRM Lead-files_section",
                "CRM Lead-cad_file",
                "CRM Lead-print_artwork",
                "CRM Lead-spec_notes",
                # CRM Deal corrugated fields
                "CRM Deal-corrugated_section",
                "CRM Deal-box_style",
                "CRM Deal-flute_type",
                "CRM Deal-board_grade",
                "CRM Deal-corrugated_col1",
                "CRM Deal-box_length",
                "CRM Deal-box_width",
                "CRM Deal-box_depth",
                "CRM Deal-annual_quantity",
                "CRM Deal-print_section",
                "CRM Deal-num_colors",
                "CRM Deal-print_method",
                "CRM Deal-coating",
                "CRM Deal-files_section",
                "CRM Deal-cad_file",
                "CRM Deal-print_artwork",
                "CRM Deal-spec_notes",
            ]]
        ]
    },
    {
        "doctype": "Print Format",
        "filters": [["name", "in", ["Corrugated Spec Card - Lead", "Corrugated Spec Card - Deal"]]]
    },
]

# ── Included in every Frappe Desk page ────────────────────────────────────────
app_include_js = ["/assets/corrugated_crm/js/audit_trail.js"]

# ── DocType JS overrides ───────────────────────────────────────────────────────
# Injects the Estimates child list into CRM Lead and CRM Deal forms
doctype_js = {
    "CRM Lead": "public/js/crm_lead.js",
    "CRM Deal": "public/js/crm_deal.js",
}
