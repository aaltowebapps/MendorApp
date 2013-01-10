/**
 * @author Nam Vu Hoang
 * 
 */

/**
 * Dependencies:
 * 		jquery-1.8.3-min.js
 * 		jquery.format-1.2.min.js
 * 		raphael-min.js  
 * 		raphael-popup.js
 * 		Mendor.js
 */


/**************************************************************
 * createMendorGraphStyle()
 **************************************************************/
function createMendorGraphStyle() {
	var style = {

		hour : {
			axis : {
				'stroke' : '#666',
				'stroke-width' : 2,
			},
			font : {
				'font-family' : 'Arial, Helvetica, sans-serif',
				'font-size' : 12,
				'font-weight' : 'normal',
				'stroke-width' : 0,
				'fill' : 'black',
			},
		},
		
		date : {
			row : {
				'stroke' : '#666',
			},
			font : {
				'font-family' : 'Arial, Helvetica, sans-serif',
				'font-size' : 12,
				'font-weight' : 'normal',
				'stroke-width' : 0,
				'fill' : 'black',
			},
			weekend : {
				row : {
					'fill' : '#FCC', //'0-#fff-#faa:25-#fff', // '#FEE',
					'stroke': 'blue', 
					'stroke-width' : 0,
				},
			},
			newDate : {
				line : {
					'stroke' : '#33F',					
					'stroke-dasharray' : '. ',
				},
			},
		},
		
		month : {			
			font : {
				'font-family' : 'Arial, Helvetica, sans-serif',
				'font-size' : 14,
				'font-weight' : 'bold',
				'stroke-width' : 0,
				'fill' : '#FFF',
			},
			row : {
				'fill' : '#33F', // '#F88', 
			},
		},
		
		dot : {
			circle : {
				'cursor' : 'pointer',				
				'stroke' : 'black',
			},
			font : {
				'font-family' : 'Arial, Helvetica, sans-serif',
				'font-size' : 10,
				'font-weight' : 'normal',
				'stroke-width' : 0,
				'fill' : 'black',
			},
			popup : {
				font : {
					'font-family' : 'Arial, Helvetica, sans-serif',
					'font-size' : 12,
					'font-weight' : 'bold',
					'stroke-width' : 0,
					'fill' : 'black',
				},
				frame : {
					'fill': '#FF0',
					'stroke': '#DD0',
					'stroke-width': 2,
					'fill-opacity': .9
				}				
			},			
		},
		
		line : {
			'stroke-width' : 0,
		},
		
		floatingAxisElement : {
			'stroke' : '#A00',
			'stroke-dasharray' : '- ',
		},
		
		measurement : {
			Single : {
				'fill' : 'red',
			},
			Paired : {
				'fill' : 'green',				
			},
			Bedtime : {
				'fill' : '#808',
				'fill-opacity': .4
			},
			FirstMeal : {
				'fill' : '#FF3',				
			},
			SecondMeal : {
				'fill' : '#3FF',				
			},
		}
				
	}
	return style;
}

/**************************************************************
 * MendorGraph()
 **************************************************************/
function MendorGraph(frameId, personId, startDate, endDate) {
	
	if (frameId instanceof Object) {
		var params = frameId;
		frameId = params.frameId;
		personId = params.personId;
		startDate = params.startDate;
		endDate = params.endDate;
	}	

	//
	// load and set config params
	//				
	var paper = Raphael(frameId, '100%', '100%');
	
	var frame = $(paper.canvas).parent();
	var frameWidth = frame.outerWidth();
	var frameHeight = frame.outerHeight();	

	var paperWidth = Math.min(Math.floor(frameWidth * 0.90), frameWidth - 10);
	var paperHeight = Math.floor(frameHeight * 0.90);				
	
	var style = createMendorGraphStyle();

	this.paper = paper;
	this.style = style;
	this.personId = personId;
	this.startDate = startDate;
	this.endDate = endDate;
	
	this.minHour = -6;
	this.maxHour = this.minHour + HOURS_PER_DAY;

	//
	// set styles and graphical metrics
	//
	this.minX = new Array();
	this.minX.dayOfWeek = 10,
	this.minX.day = this.minX.dayOfWeek + 35; // context.measureText('WWWW').width;
	this.minX.hour = this.minX.day + 50; // context.measureText('88').width + 20;
	this.maxX = paperWidth;
	
	this.xStep = (this.maxX - this.minX.hour) / (this.maxHour - this.minHour);

	this.minX.nextDate = new Array();
	this.minX.nextDate.line = this.minX.hour + this.xStep * (HOURS_PER_DAY - this.maxHour);
	this.minX.nextDate.dayOfWeek = this.minX.nextDate.line + 5;
	this.minX.nextDate.day = this.minX.nextDate.dayOfWeek + (this.minX.day - this.minX.dayOfWeek);
	
	var numberOfDates = getDayInterval(this.startDate, this.endDate) + 1;
	var monthInterval = getMonthInterval(this.startDate, this.endDate);	
	
	this.yStep = 40;
	paperHeight = this.yStep * (numberOfDates + monthInterval) + 50;
	this.maxY = paperHeight - 30;
	this.minY = this.maxY - this.yStep * (numberOfDates + monthInterval);
	this.hourTickHeight = 5;
	this.dotRadius = 4;				
	
	paper.setSize(paperWidth, paperHeight);

	// draw x y axis and tick marks
	this.drawHourAxis();
	this.drawDateAxis();
	this.drawfloatingAxisElement();
	
	// set auto scroll
	frame.width(frameWidth);
	frame.height(frameHeight);

}


/**************************************************************
 * MendorGraph.drawHourAxis()
 **************************************************************/
MendorGraph.prototype.drawHourAxis = function() {
	
	var paper = this.paper;				
	
	//
	// draw axis line
	//
	paper
		.path(
			Raphael.fullfill('M{x},{y}l{width},0',
			{
				x : 0,
				y : this.maxY,							
				width : paper.width + 200,
			}))
		.attr(this.style.hour.axis);

	//
	// draw axis ticks
	//
	var x = this.minX.hour;
	for (var hour = this.minHour; hour < this.maxHour; hour += 1, x += this.xStep) {
		
		paper
			.path(
				Raphael.fullfill('M{x},{y}l0,{height}', {
					x : x,
					y : this.maxY,
					height : this.hourTickHeight
				}))
			.attr(this.style.hour.axis)
			.attr('stroke-width', hour % 2 == 0 ? 2 : 1);
		
		if (hour % 2 == 0) {

			var hourText = $.format.number(hour >= 0 ? hour : hour + HOURS_PER_DAY, '00') + ':00';
			
			paper
				.text(x, this.maxY + this.hourTickHeight + 10, hourText)
				.attr(this.style.hour.font);
		}
	}
};


/**************************************************************
 * MendorGraph.drawDateAxis()
 **************************************************************/
MendorGraph.prototype.drawDateAxis = function() {
	
	var paper = this.paper;

	var yStep = this.yStep;
	var y = this.maxY - yStep;
	var nextDate = addDayInterval(this.endDate, 1);	

	for (var date = this.endDate; getDayInterval(this.startDate, date) >= 0; y -= yStep) {
		
		// draw date row rectangle
		if (isWeekend(date)) {
			
			paper
				.rect(0, y + 1, paper.width, yStep - 2)
				.attr(this.style.date.weekend.row);
		}
 
		// draw day-of-week text (current day)
		paper
			.text(this.minX.dayOfWeek, y + yStep / 2, $.format.date(date, 'EEE'))
			.attr(this.style.date.font)			
			.attr('text-anchor', 'start');
			
		// draw date text(current day)
		paper
			.text(this.minX.day, y + yStep / 2, $.format.date(date, 'dd'))
			.attr(this.style.date.font)			
			.attr('text-anchor', 'start');
		
		// draw day-of-week text (next day)
		paper
			.text(this.minX.nextDate.dayOfWeek, y + yStep / 2, $.format.date(nextDate, 'EEE'))
			.attr(this.style.date.font)			
			.attr('text-anchor', 'start');
		
		// draw date text (next day)
		paper
			.text(this.minX.nextDate.day, y + yStep / 2, $.format.date(nextDate, 'dd'))
			.attr(this.style.date.font)			
			.attr('text-anchor', 'start');

		if (date.getDate() != 1) {

			// draw date row rectangle border
			paper
				.path(
					Raphael.fullfill('M{x},{y}l{width},0', {
						x : 0,
						y : y,
						width : paper.width,					
					}))
				.attr(this.style.date.row);

		} else {
			// draw month title row
			y -= yStep;

			paper
				.rect(0, y, paper.width, yStep - 1)
				.attr(this.style.month.row);

			// draw date text
			paper
				.text(this.minX.dayOfWeek, y + yStep / 2, $.format.date(date, 'MMMMM yyyy'))
				.attr(this.style.month.font)
				.attr('text-anchor', 'start');
		}
		
		 nextDate = date;
		 date = addDayInterval(date, -1);
	} // for
	
	
	paper
		.path(
			Raphael.fullfill('M{x},{y1}L{x},{y2}', {
				x : this.minX.nextDate.line,
				y1 : this.minY,
				y2 : this.maxY,
			}))
		.attr(this.style.date.newDate.line);
}


/**************************************************************
 * MendorGraph.drawfloatingAxisElement()
 **************************************************************/
MendorGraph.prototype.drawfloatingAxisElement = function() {
	
	var paper = this.paper;
	
	var floatingAxisElement = paper
		.path(
			Raphael.fullfill('M{x},{y1}L{x},{y2}', {
				x : paper.width / 2,
				y1 : this.minY,
				y2 : this.maxY,					
			}))
		.attr(this.style.floatingAxisElement)
		.hide();
		
	floatingAxisElement.currentX = paper.width / 2;
		
	// creating invisible area
	paper
		.rect(this.minX.hour, this.minY, this.maxX - this.minX.hour, this.maxY - this.minY)
		.attr({
			'stroke-width' : 0,
			'fill' : 'white',
			'fill-opacity' : 0.0,
		})
		.mouseover(function() {
			floatingAxisElement.show();
		})
		.mouseout(function() {
			floatingAxisElement.hide();
		})
		.mousemove(function(event) {
			floatingAxisElement.translate(
				event.layerX - floatingAxisElement.currentX, 0);
			floatingAxisElement.currentX = event.layerX; 
		});			

}


/**************************************************************
 * MendorGraph.getDotPosition()
 **************************************************************/
MendorGraph.prototype.findDotPosition = function(dot) {
	
	var time = dot.time;
	
	var hourInterval = time.getHours() + (time.getMinutes() / MINUTES_PER_HOUR);
	if (hourInterval >= this.maxHour) {
		hourInterval -= HOURS_PER_DAY;
	} else {
		time = addDayInterval(time, -1);
	}

	var monthInterval = getMonthInterval(time, this.endDate);
	var dayInterval = getDayInterval(time, this.endDate);

	var position = {
		x : this.minX.hour + this.xStep * (hourInterval - this.minHour),
		y : this.maxY - this.yStep * (dayInterval + monthInterval) - this.yStep / 2,
	};
	
	var center = {
		x : position.x,
		y : position.y + this.yStep / 8 + 1,
	};	
	
	dot.position = position;
	dot.center = center;	
}


/**************************************************************
 * MendorGraph.drawDot()
 **************************************************************/
MendorGraph.prototype.drawDot = function(dot) {
	
	if (dot.invisible) {
		return;
	}	
	
	dot.style = this.style.measurement[dot.type];
	
	var paper = this.paper;

	var yStep = this.yStep;
	
	if (dot.center == null) {
		this.findDotPosition(dot);
	}
	
	var position = dot.position;
	var center = dot.center;
		
 
	// write text
	var dotTextElement =
		paper
			.text(position.x, position.y - yStep / 8 - 1, $.format.number(dot.value, '0.0'))
			.attr(this.style.dot.font);			
			
	// draw circle
	var dotCircleElement =
		paper
			.circle(center.x, center.y, this.dotRadius)
			.attr(this.style.dot.circle)
			.attr(dot.style);
			
	var popupTextElement = null;
	var popupFrameElement = null;			

	var hour = dot.time.getHours();
	var text = $.format.date(dot.time, 'dd MMM @ HH:mm').concat('\n< ', $.format.number(dot.value, '0.0'), ' >');
	if (dot.text != null) {
		text = text.concat('\n' + dot.text);
	}	
	
	
	if (hour >= this.maxHour || hour < this.maxHour - 4) {
		
		popupTextElement = paper.text(center.x + 10, center.y, text);		
		popupFrameElement = paper.popup(center.x + 10, center.y, popupTextElement, 'right');
		
	} else {
		
		popupTextElement = paper.text(center.x - 10, center.y, text);		
		popupFrameElement = paper.popup(center.x - 10, center.y, popupTextElement, 'left');

	}
	
	popupTextElement
		.attr(this.style.dot.popup.font)
		.hide();
		
	popupFrameElement
		.attr(this.style.dot.popup.frame)
		.hide();
			
	dotCircleElement
		.mouseover(function() {
			dotTextElement.attr('font-weight', 800);
			popupFrameElement.toFront().show();
			popupTextElement.toFront().show();
		})
		.mouseout(function() {
			dotTextElement.attr('font-weight', 'normal');
			popupFrameElement.hide();
			popupTextElement.hide();
		});		
}


/**************************************************************
 * MendorGraph.drawDots()
 **************************************************************/
MendorGraph.prototype.drawLine = function(dot1, dot2, pairType) {	
	
	var lineStyle = this.style.measurement[pairType];
	
	this.findDotPosition(dot1);
	this.findDotPosition(dot2);	
	
	dot1.text = '(Pre pair)';
	dot2.text = '(Post pair)';
	
	var paper = this.paper;
	
	var height = this.dotRadius;
	
	paper
		.rect(dot1.center.x, dot1.center.y - height / 2, dot2.center.x - dot1.center.x, height)
		.attr(this.style.line)
		.attr(lineStyle);	
		
	this.drawDot(dot1);		
	this.drawDot(dot2);	
}


/**************************************************************
 * MendorGraph.drawData()
 **************************************************************/
MendorGraph.prototype.drawData = function(xmlData) {
	
	var dayCount = 0;
	var measurmentCount = 0;
	var mendorGraph = this;

	var xmlMeasurementDays = xmlData.getElementsByTagName('MeasurementDays');
	
	$(xmlMeasurementDays).find('Paired24HourPeriodDTO').each(function() {
		++dayCount;
		
		var xmlMeasurements = this.getElementsByTagName('Measurements');
		$(xmlMeasurements).find('PairedMeasurementDTO').each(function() {			
			
			++measurmentCount;
			
			var dot1 = {
				time: new Date(this.getElementsByTagName('Timestamp')[0].textContent),
				value: this.getElementsByTagName('Value')[0].textContent,
			};
			
			var xmlPairedMeasurement = this.getElementsByTagName('PairedMeasurement')[0];
			
			if (xmlPairedMeasurement && xmlPairedMeasurement.childElementCount > 0) {
				
				var pairType = this.getElementsByTagName('Type')[1].textContent;
				var isPostMeasurement = this.getElementsByTagName('IsPostMeasurement')[0].textContent;

				dot1.type = 'Paired';
				dot1.text = isPostMeasurement == 'false' ? '(Pre pair)' : '(Pre/Post pair)';
				
				var dot2 = {
					time: new Date(xmlPairedMeasurement.getElementsByTagName('Timestamp')[0].textContent),
					value: xmlPairedMeasurement.getElementsByTagName('Value')[0].textContent,
					type: 'Paired',
					text: '(Post pair)'
				};
				
				var xmlPairedMeasurement2 = xmlPairedMeasurement.getElementsByTagName('PairedMeasurement')[0]
				
				if (xmlPairedMeasurement2 && xmlPairedMeasurement2.childElementCount > 0) {
					dot2.invisible = true;
					pairType = this.getElementsByTagName('Type')[2].textContent;
				}

				mendorGraph.drawLine(dot1, dot2, pairType);
				
			} else {
				dot1.type = 'Single';
				mendorGraph.drawDot(dot1);
			}
		});		
	});		
	
	console.log('Total: ' + dayCount + '\n' + measurmentCount);	
	
}



/**************************************************************
 * MendorGraph.getJsonData()
 **************************************************************/
MendorGraph.prototype.loadDataFromInternet = function(settings) {	

	var mendorGraph = this;	
	var timeFormat = 'yyyy/MM/dd%20HH%3Amm%3Ass';	
	
	var url;
	
	if (!settings || !settings.useDumpData) {
		url = Raphael.fullfill('http://devweb.mendor.com/core/person/{personId}/pairedmeasurements?startdate={startDate}&enddate={endDate}&filter=All', {
			personId : this.personId,
			startDate : $.format.date(this.startDate, timeFormat),
			endDate : $.format.date(this.endDate, timeFormat), 
		});
	} else {
		//url = 'http://devweb.mendor.com/core/person/10000000/pairedmeasurements?startdate=2011/10/07%2012:00:00&enddate=2011/11/04%2011:59:59&filter=All';
		//url = 'http://127.0.0.1:8020/MendorApp/MendorGraphicsView_JCanvas.html';
		url = 'dumpdata.xml';
	}	
	
	$.ajax(url, {
		type: 'GET',
		dataType: 'xml',
		timeout: 50000,
		processData: false,
	})
	.done(function(xmlData) {
		mendorGraph.drawData(xmlData);
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		window.alert(
			'Loading data from URL: ' +
			url +
			'\nStatus: ' +
			textStatus);
	})
}
