var addInputs = jQuery('#debt-calc-inputs');
var inputMarkup = '<li><input type="text" class="debt-type" value=""><input type="text" class="amount-owed" value=""><input type="text" class="loan-interest" value=""><input type="text" class="monthly-payment" value=""><span><div></div></span></li>';
var MonthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var somethingSelected = false;
var tabCode = 0;
var tabKeyUpCode = 9;
var deleteCode = 8;

getRowCount = function() {
	debtRowCount = $('#debt-calc-inputs li').size();
	if (debtRowCount == 1) {
		jQuery("#debt-calc-inputs li:eq(0) span").hide();
		if (jQuery('#outputSlate').children().length === 0) {
			jQuery("#initialSlate").show();
			jQuery('#debt-calc-container').removeAttr( 'style' );
		}

	} else {
		jQuery("#debt-calc-inputs li:eq(0) span").show();
		jQuery("#initialSlate").hide();
	}
	
	if ( debtRowCount < 10 ) {
		jQuery('#add-more').show();
	}
}

addCommas = function (nStr) {
	nStr += '';
	decimalSplit = nStr.split('.');
	preDecimal = decimalSplit[0];
	postDecimal = decimalSplit.length > 1 ? '.' + decimalSplit[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(preDecimal)) {
		preDecimal = preDecimal.replace(rgx, '$1' + ',' + '$2');
	}
	return preDecimal + postDecimal;
}

checkInputs = function () {
		var valueArray = [];
		var goAhead = false;
		var inputChecksOut = false;
		inputRowCount = jQuery("#debt-calc-inputs li").length;
		//console.log(inputRowCount);
		for (var i = 0; i < inputRowCount; i++) {
			inputArrayKeypress = $("#debt-calc-inputs li:eq(" + i + ") input").map(function() {
				return $(this).val().replace(/[^0-9\.]+/g, '');
			}).get();
			inputArrayKeypress.shift();
			valueArray.push(inputArrayKeypress);
		};
		//console.log(valueArray);
		for (var i = 0; i < inputRowCount; i++) {
			if (!inputChecksOut) {
				for (var j = 0; j < 3; j++) {
					if (valueArray[i][j].length === 0) {
						inputChecksOut = true;
						break
					} else if ((i == inputRowCount-1) && (j==2) && (valueArray[i][j].length !== 0)) {
						goAhead = true;
					}
				}
			}
		}
		
 		if (!goAhead) {
 			jQuery('#calculateValues').addClass('inactiveCalculation');
 		} else {
 			jQuery('#calculateValues').removeClass();
 		}
 		
};

howManyMonths = function (balance, interestRate, payment, interestCost, mostMonths) {
	var count = 1;

	var calculateInterest = 0;
	
	while (balance > payment) {
		
		calculateInterest = (balance * interestRate);
		interestCost += calculateInterest;
		balance += calculateInterest;
		balance -= payment;
		count++;
		if (count > 312324 ) {
			break
		}
	}
	
	if (count > mostMonths) {
		mostMonths = count
	}
	
	if ( balance > 0 ) {
		//console.log('remaining balance: ' + balance + '\n adding \n' + (balance * interestRate));
		interestCost += (balance * interestRate);
	}
	
	return {
		"interestTotal" : interestCost,
		"monthCount" : mostMonths
	};
}


jQuery(document).ready(function() {

	addInputs.html(inputMarkup);
	jQuery('#initialSlate').show();
	getRowCount();
	
	jQuery('.expand-industry').click(function() {
		jQuery('#moreMethodology').slideToggle();
		jQuery('.toggleBar').toggleClass('expanded');
	});		

	jQuery('#add-more').click(function() {
		debtRow = jQuery('#debt-calc-inputs li').size();
		if ( ( debtRow + 1 ) != 10) {
			jQuery(inputMarkup).appendTo(addInputs);
			jQuery('#add-more').show();

		} else {
			jQuery(inputMarkup).appendTo(addInputs);
			jQuery('#add-more').hide();
		}
		checkInputs();
		getRowCount();	
		
	});

	jQuery('#calculateValues').click(function() {
		var inactiveCheck = jQuery( "#calculateValues" ).hasClass( "inactiveCalculation" );
		if (inactiveCheck) {
			return false
		};
		inDebtForever = false, valueArray = [], interestCost = 0, mostMonths = 0, calcReturn = null, mixedBag = [], calcTrue = false, fullBag =[];

		howMany = jQuery("#debt-calc-inputs li").length;
		jQuery('#initialSlate').hide();
		jQuery('#outputSlate').hide();
		jQuery('#outputSlate').empty();
		jQuery("#debt-calc-inputs li input").removeClass('blankInput');

		//get inputs and put them in an array;
		for (var i = 0; i < howMany; i++) {
			inputValues = jQuery("#debt-calc-inputs li:eq(" + i + ") input").map(function() {
				return jQuery(this).val().replace(/[^0-9\.]+/g, '');
			}).get();
			inputValues.shift();
			valueArray.push(inputValues);
		};

		/* blankInput */
		howManyDebts = valueArray.length;

		for (var i = 0; i < howManyDebts; i++) {

			debtHolder = valueArray[i];
			//console.log("debtHolder" + debtHolder);
			for (var j = 0; j < 3; j++) {
				if (debtHolder[j].length === 0) {
					jQuery("#debt-calc-inputs li:eq(" + i + ") input:eq(" + (j + 1 ) + ")").addClass('blankInput');
				}
			}
			rowBroken = (debtHolder[0].length === 0 || debtHolder[1].length === 0 || debtHolder[2].length === 0) ? true : false;
			fullBroken = (debtHolder[0].length === 0 && debtHolder[1].length === 0 && debtHolder[2].length === 0) ? true : false;
			mixedBag[i] = rowBroken;
			fullBag[i] = fullBroken;
			//console.log("mixedBag" + mixedBag);
			if (!fullBroken && !rowBroken) {
				minimumPayment = 0, balance = Number(debtHolder[0]), interestRate = (Number(debtHolder[1]) / 100) / 12, payment = Number(debtHolder[2]);
				minimumPayment = Math.ceil((balance * (Number(debtHolder[1]) / 100)) / 12);
				//console.log('minimumPayment ' + minimumPayment);
				if ((minimumPayment > payment) || payment <= (balance * interestRate) ) {
					inDebtForever = true;
					jQuery("#debt-calc-inputs li:eq(" + i + ") input:eq(3)").addClass('blankInput');
				} else {
					calcReturn = howManyMonths(balance, interestRate, payment, interestCost, mostMonths);
					mostMonths = calcReturn.monthCount;
					interestCost = calcReturn.interestTotal;
				}
			}

		};
		//console.log(calcReturn);
		for (var i = 0; i < mixedBag.length; i++) {
			if (!mixedBag[i]) {
				calcTrue = true;
				break
			}
		}
		for (var i = (fullBag.length - 1); i > -1; i--) {
			if (fullBag[i] && i > 0) {
				jQuery("#debt-calc-inputs li:eq(" + i + ")").remove();
			}
		}

		if (calcTrue) {
			jQuery('#debt-calc-container').css("min-height", "245px");

			if (!inDebtForever) {
				if (calcReturn.monthCount <= 360) {
					var monthsfromNow = new Date(new Date(cnnSiteWideCurrDate).setMonth(cnnSiteWideCurrDate.getMonth() + calcReturn.monthCount));
					jQuery('#outputSlate').html('<div class="header">I will be debt-free by</div>' + '<div class="month">' + MonthArray[monthsfromNow.getMonth()] + '</div><div class="year">' + monthsfromNow.getFullYear() + '</div>' + '<div class="interest">Interest I will pay: <span>$' + addCommas(calcReturn.interestTotal.toFixed(0)) + '</span></div>');
					jQuery('#outputSlate').show();
				} else {
					jQuery('#outputSlate').html('<div class="header">I won\'t pay off my debt</div>' + '<div class="notEnough">within the next 30 years</div>');
					jQuery('#outputSlate').show();
				}
			} else {
				jQuery('#outputSlate').html('<div class="header">I can\'t pay off my debt</div>' + '<div class="notEnough">I\'m not paying enough<BR>each month.</div>');
				jQuery('#outputSlate').show();
			}
		};
		getRowCount();
	});
	
	
	jQuery("#debt-calc-inputs span div").live("click", function() {
		jQuery(this).parent().parent().remove();
		checkInputs();
		getRowCount();
	});
	

	jQuery(".debt-type").live({
		keypress : function(e) {
			fieldInput = jQuery(this).val();
			if (e.which != tabCode && e.which != deleteCode && fieldInput.length > 18 && !somethingSelected) {
				e.preventDefault();
			}
			//somethingSelected = false;
		},
		mousedown : function(e) {
			jQuery(this).select(function() {
				somethingSelected = true;
			});
		}
	});
	
	
	jQuery(".amount-owed, .monthly-payment").live({
		keyup : function(e) {
			
			checkInputs();
			clearInput = false;
			$fieldInput = jQuery(this).val();
			if ($fieldInput.indexOf("0") === 0) {
				clearInput = true;
			};

			storeInput = $fieldInput.replace(/[^0-9\.]+/g, '');

			if (storeInput.length !== 0 && !clearInput) {
				jQuery(this).val('$' + addCommas(storeInput));
				if (e.which === tabKeyUpCode) {
					jQuery(this).select();
				}
			} else {
				jQuery(this).val('');
			}
		},
		keypress : function(e) {
			jQuery(this).select(function() {
				somethingSelected = true;
			});
			$fieldInput = jQuery(this).val();
			storeInput = $fieldInput.replace(/[^0-9\.]+/g, '');
			allowed = '1234567890';
			var key = String.fromCharCode(e.which);

			if (e.which != tabCode && e.which != deleteCode && allowed.indexOf(key) < 0) {
				e.preventDefault();
			} else if (Number(storeInput + key) > 999999  && !somethingSelected ) {
				//if you enter a number that will be over limit, and text is not selected dont allow
				e.preventDefault();
			};
			somethingSelected = false;
		},
		mousedown : function(e) {
			jQuery(this).select(function() {
				somethingSelected = true;
			});
		}
	
	});
	
	jQuery(".amount-owed").live({
		blur : function(e) {
			if (jQuery(this).val().length > 0) {
				$theField = jQuery(this).val().replace(/[^0-9\.]+/g, '');
				//console.log(Number($theField));
				jQuery(this).val('$' + addCommas(Number($theField)));
			}
		}
	});
	
	jQuery(".monthly-payment").live({
		blur : function(e) {
			if (jQuery(this).val().length > 0) {
				$theField = jQuery(this).val().replace(/[^0-9\.]+/g, '');
				jQuery(this).val('$' + addCommas(Number($theField)));
			}
			var monthlyInput = Number(jQuery(this).val().replace(/[^0-9\.]+/g, ''));
			var owedBalance = Number(jQuery(this).siblings( ".amount-owed" ).val().replace(/[^0-9\.]+/g, ''));
			if ((monthlyInput > owedBalance)) {
				jQuery(this).val(   '$' +  addCommas(owedBalance)  )
			}
		}
	});

	jQuery(".loan-interest").live({
		keypress : function(e) {
			$theField = jQuery(this);
			fieldInput = $theField.val();
			decimalPlace = false;
			var key = String.fromCharCode(e.which);
			if (fieldInput.indexOf('.') > -1) {
				decimalPlace = true
			}
			// if there is a decimal, dont allow any more decimals
			allowed = (decimalPlace) ? '1234567890' : '1234567890.';
			if (e.which != tabCode && e.which != deleteCode && allowed.indexOf(key) < 0) {
				e.preventDefault();
			} else if (Number(fieldInput + key) > 99.999 && !somethingSelected) {  
				//if you enter a number that will be over limit, and text is not selected dont allow
				e.preventDefault();
			}

			if (decimalPlace) {
				arrayDecimal = fieldInput.split('.');
				if (e.which != tabCode && e.which != deleteCode && (arrayDecimal[1] + key).length > 2 && !somethingSelected) {
					e.preventDefault();
				}
			}
			somethingSelected = false;
		},
		keyup : function(e) {
			if (e.which === tabKeyUpCode) {somethingSelected = true};
			checkInputs();
			fieldInput = jQuery(this).val();

			if (fieldInput === "00") {
				jQuery(this).val('0')
			};
		},
		mousedown : function(e) {
			jQuery(this).select(function() {
				somethingSelected = true;
			});
		},
		blur : function(e) {
			$theField = jQuery(this).val();
			if ( $theField.length > 0 ) {
				fieldInput = Number($theField);
				jQuery(this).val(fieldInput.toFixed(2))
			}
			
		}
	});

});
