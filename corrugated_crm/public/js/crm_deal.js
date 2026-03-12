/* =============================================================================
   Corrugated CRM – CRM Deal form enhancements
   Adds "Estimates" quick link and "New Estimate" button.
   ============================================================================= */
frappe.ui.form.on("CRM Deal", {
	refresh: function (frm) {
		if (!frm.is_new()) {
			frm.add_custom_button(__("Estimates"), function () {
				frappe.set_route("List", "Corrugated Estimate", { crm_deal: frm.doc.name });
			}, __("View"));

			frm.add_custom_button(__("New Estimate"), function () {
				frappe.new_doc("Corrugated Estimate", {
					crm_deal: frm.doc.name,
					customer: frm.doc.customer,
					// Pre-fill corrugated spec fields from deal
					box_style: frm.doc.box_style,
					flute_type: frm.doc.flute_type,
					board_grade: frm.doc.board_grade,
					length_inside: frm.doc.box_length,
					width_inside: frm.doc.box_width,
					depth_inside: frm.doc.box_depth,
					num_colors: frm.doc.num_colors,
					print_method: frm.doc.print_method,
					coating: frm.doc.coating,
					cad_file: frm.doc.cad_file,
					print_artwork: frm.doc.print_artwork,
				});
			}, __("Create"));
		}
	},
});
