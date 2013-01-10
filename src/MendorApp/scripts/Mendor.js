/**
 * @author Nam Vu Hoang
 */

/**
 * CONSTANTS
 */
var MILLISECONDS_PER_HOUR = 3600000.0;
var MINUTES_PER_HOUR = 60.0;
var HOURS_PER_DAY = 24;
var MONTHS_PER_YEAR = 12;
var MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * HOURS_PER_DAY;

//
// Checks if a date is weekend
//
function/* boolean */ isWeekend(date) {
	var dayOfWeek = date.getDay();
	return dayOfWeek == 0 || dayOfWeek == 6;
}

//
// Adds a number of dates to a specified date
//
function/* Date */ addDayInterval(/* Date */date, /* int */interval) {
	var newDate = new Date(date);
	newDate.setDate(newDate.getDate() + interval);
	return newDate;
}

//
// Adds a number of milisecs to a specified date
//
function/* Date */ addTimeInterval(/* Date */time, /* int */interval) {
	var newTime = new Date(time.getTime() + interval);
	return newTime;
}

//
// Gets the time interval between two dates in days.
//
function/* int */ getDayInterval(/* Date */time1, /* Date */time2) {
	var date1 = new Date(time1.getYear(), time1.getMonth(), time1.getDate());
	var date2 = new Date(time2.getYear(), time2.getMonth(), time2.getDate());
	var milisecs = date2.getTime() - date1.getTime();
	return Math.floor (milisecs / MILLISECONDS_PER_HOUR / HOURS_PER_DAY);
}


//
// Gets the month inverval between two dates
//
function /* int */ getMonthInterval(/* Date */time1, /* Date */time2) {
	return (time2.getYear() - time1.getYear()) * MONTHS_PER_YEAR +
		(time2.getMonth() - time1.getMonth());
}


//
// Gets a random integer value from 0 to max
//
function/* int */ randomInteger(/* int */max) {
	return Math.floor(Math.random() * max + 0.5);
}

//
// Gets a random double value from 0 to max
//
function/* double */ randomDouble(/* double */max) {
	return Math.random() * max;
}


function printJsonData(data) {
	var s = '';
	for (var key in data) {
		s = s.concat(key + ': ' + data[key] + '\n');
	}
	window.alert(s);	
}

