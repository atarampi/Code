	var totalSlides = 0;
	var currentSlide = 1;
	var contentSlides = "";
	var intervalvar = 0;
	var displayOpen = false;
	var currentCompany = 0;

	var slideshowOnPageReady = function() {
		
		jQuery("#slideshow-previous").click(showPreviousSlide);
		jQuery("#slideshow-next").click(showNextSlide);

		var totalWidth = 72;
		contentSlides = $(".slideshow-content");
		contentSlides.each(function (i) {
			totalWidth += this.clientWidth;
			totalSlides++;
		});
		
		jQuery("#slideshow-holder span").bind('click', function() {
			$this = jQuery(this);
			currentCompany = $this.attr('id');
			if (displayOpen == false) {
				displayOpen = true;
				jQuery("#textWindow").show();
			}
			updateInfo(currentCompany);

			
		});
		jQuery("#closeButton").bind('click', function() {
			displayOpen = false;
			jQuery("#textWindow").hide();
			clearHilite();
		});
		
		
		jQuery("#rightCycle").bind('click', function() {
			currentCompany++;
			updateInfo(currentCompany);
			if( (currentCompany==10) || (currentCompany==20) || (currentCompany==30) || (currentCompany==40) || (currentCompany==50) || (currentCompany==60) || (currentCompany==70)  || (currentCompany==80) || (currentCompany==90)  ) {
				currentSlide = currentCompany/10;
				showNextSlide();
			}
		});
		jQuery("#leftCycle").bind('click', function() {
			currentCompany--;
			updateInfo(currentCompany);
			if( (currentCompany==9) || (currentCompany==19) || (currentCompany==29) || (currentCompany==39) || (currentCompany==49) || (currentCompany==59) || (currentCompany==69) || (currentCompany==79) || (currentCompany==89) ) {
				currentSlide = ((currentCompany+1)/10) + 1;
				showPreviousSlide();
			}
		});
		
		jQuery("#slideshow-holder").width(totalWidth);
		jQuery("#slideshow-scroller").attr({ scrollLeft: 0 });

		updateButtons();

	}
	
	function updateInfo (currentCompany) {
		if(currentCompany == 0) {
			jQuery("#leftCycle").hide();
		} else {
			jQuery("#leftCycle").show();
		}
		if(currentCompany == 99) {
			jQuery("#rightCycle").hide();
		} else {
			jQuery("#rightCycle").show();
		}
		$dataIndex = dataArray[currentCompany];
		jQuery("#rank").html($dataIndex.rank + '.');
		jQuery("#companyName").html($dataIndex.company);
		jQuery("#growthRate").html($dataIndex.growth);
		jQuery("#cityLoc").html($dataIndex.city);
		jQuery("#stateLoc").html($dataIndex.state);
		jQuery("#revenues").html($dataIndex.revenues + ' million');
		jQuery("#ceo").html($dataIndex.ceo);
		jQuery("#blurb").html($dataIndex.blurb);
		jQuery("#companyImage").attr('src', 'http://i.cdn.turner.com/money/.element/img/5.0/fortune/innercity/2013/photos/' + $dataIndex.image);
		if(currentCompany > 49) {
			jQuery("#textWindow").css( 'height', 303 );
		} else {
			jQuery("#textWindow").css( 'height', 420 );
		}
		if (displayOpen) {
			clearHilite();
			jQuery('.slideshow-content span:eq(' + currentCompany  +')').addClass('hilite');
		}
	}
	
	function clearHilite() {
		$("#slideshow-holder span").each(function (i) {
		   		$(this).removeClass("hilite");
		});
	}
	
	function showPreviousSlide() {
	   currentSlide--;
	   currentCompany = (currentSlide * 10)-1;
	   updateInfo(currentCompany);
	   updateContentHolder();
	   updateButtons();
	}

	function showNextSlide() {
	   currentSlide++;
	   currentCompany = (currentSlide * 10)-10;
	   updateInfo(currentCompany);
	   updateContentHolder();
	   updateButtons();
	}

	function updateContentHolder() {
	   var scrollAmount = 0;
	   contentSlides.each(function (i) {
		   if (currentSlide - 1 > i) {
				scrollAmount += this.clientWidth;
			}
		});
		jQuery("#slideshow-scroller").animate({ scrollLeft: scrollAmount }, 600);
	}

	function updateButtons() {
		if (currentSlide < totalSlides) {
		   jQuery("#slideshow-next").show();
	   } else {
		   jQuery("#slideshow-next").hide();
	   }
	   if (currentSlide > 1) {
			jQuery("#slideshow-previous").show();
		} else {
			jQuery("#slideshow-previous").hide();
		}
	}

	$(document).ready(slideshowOnPageReady);