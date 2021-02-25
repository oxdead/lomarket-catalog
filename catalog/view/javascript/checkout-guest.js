; function guest_OnCountryChange(selector) {
	$(selector + ' select[name=\'country_id\']').on('change', function() {
		
		$.ajax({
			url: 'index.php?route=checkout/checkout/country&country_id=' + this.value,
			dataType: 'json',
			beforeSend: function() {
				$(selector + ' select[name=\'country_id\']').prop('disabled', true);
			},
			complete: function() {
				$(selector + ' select[name=\'country_id\']').prop('disabled', false);
			},
			success: function(json) {

				if (json['postcode_required'] == '1') {
					$(selector + ' input[name=\'postcode\']').parent().parent().addClass('required');
				} else {
					$(selector + ' input[name=\'postcode\']').parent().parent().removeClass('required');
				}


				html = '<option value="">' + json['text_select'] + '</option>';

				if (json['zone'] && json['zone'] != '') {
					for (i = 0; i < json['zone'].length; i++) {
						html += '<option value="' + json['zone'][i]['zone_id'] + '"';

						if (json['zone'][i]['zone_id'] == json['zone_id']) {
							html += ' selected="selected"';
						}

						html += '>' + json['zone'][i]['name'] + '</option>';
					}
				} else {
					html += '<option value="0" selected="selected">' + json['text_none'] + '</option>';
				}

				$(selector + ' select[name=\'zone_id\']').html(html);
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	});

	$(selector + ' select[name=\'country_id\']').trigger('change');
}

function guest_OnTermsAgree() {
	$(document).delegate('#guest-payment-method-body input[type=\'checkbox\']', 'click', function() {
		if(this.name == "agree") {
			var checkedStatus = (this.checked && this.name == 'agree') ? '1' : '0';
			$.ajax({
				url: 'index.php?route=checkout/easy_guest_payment_method/agree&agree=' + checkedStatus,
				dataType: 'json',
				success: function(json) {

					//todo: json["error"] handling, in controller too

					//console.log(json);
				},
				error: function(xhr, ajaxOptions, thrownError) {
					alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			});
		}

	});
}