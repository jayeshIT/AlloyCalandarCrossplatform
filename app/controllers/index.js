var date1 = new Date(2014, 09, 17, 18, 10, 0);// JS cal will show 10 th month
var date2 = new Date(2014, 09, 17, 18, 25, 0);// JS cal will show 10 th month

if (Titanium.Platform.osname == "android") {
	var android_calendar = require('com.indianic.androidcalender');
}

function showCalendars(calendars) {
	var cals = "";
	for (var i = 0; i < calendars.length; i++) {
		cals += calendars[i].name + " - " + calendars[i].id;
		cals += ", ";
		var details = {
			title : 'Do the New',
			description : "I'm going to do some stuff at this time.",
			begin : date1,
			end : date2
		};
		var evt = calendars[i].createEvent(details);
		var reminderDetails = {
			minutes : 10,
			method : Ti.Calendar.METHOD_ALERT
		};
		evt.createReminder(reminderDetails);
		var db = Titanium.Database.install("/jay.db", 'jay');
		db.execute("INSERT INTO event(eventID)VALUES(?)", evt.id);
		db.close();
		var db = Titanium.Database.install("/jay.db", 'jay');
		var aa = db.execute("SELECT * FROM event where eventID=" + evt.id);
		if (aa.isValidRow()) {
			Ti.API.info("FROM DB" + aa.fieldByName('eventID'));
		}
		aa.close();
		db.close();
	}
}

$.RemoEvent.addEventListener('click', function(e) {
	try {
		if (Titanium.Platform.osname == 'android') {
			var CALENDAR_TO_USE = 1;
			var calendarz = Ti.Calendar.getCalendarById(CALENDAR_TO_USE);
			Titanium.API.info("calendar to delete" + JSON.stringify(calendarz));
			var db = Titanium.Database.install("/jay.db", 'jay');
			var aa = db.execute("SELECT * FROM event");
			if (aa.isValidRow()) {
				var MyID = aa.fieldByName('eventID');
				Ti.API.info("FROM DB To DELETE: " + MyID);
				android_calendar.deleteCalenderEvent(MyID);
				aa.next();
			}
			aa.close();
			db.close();

		} else {
			var iPhoneCalender = Titanium.Calendar.defaultCalendar;
			var db = Titanium.Database.install("/jay.db", 'jay');
			var aa = db.execute("SELECT * FROM event");
			if (aa.isValidRow()) {
				var MyID = aa.fieldByName('eventID');
				Ti.API.info("FROM DB To DELETE: " + MyID);
				var event_delete = iPhoneCalender.getEventById(MyID);
				if (event_delete) {
					event_delete.remove();
				}
				aa.next();
			}
			aa.close();
			db.close();
			Titanium.API.info('==========DELETED FROM IPHONE CALANDER===========');
		}
	} catch(exp) {
		Titanium.API.info('THE DELETE EXCEPTION:' + exp);
	}
});
$.AddEvent.addEventListener('click', function(e) {
	try {
		Ti.API.info('SELECTABLE CALENDARS:');
		if (Ti.Platform.osname === 'android') {
			Ti.API.info('SELECTABLE CALENDARS:');
			var sc = Ti.Calendar.allCalendars;
			Titanium.API.info("SC:" + sc);
			Titanium.API.info("SC1:" + JSON.stringify(sc));
			var CALENDAR_TO_USE = 1;// default cal by ID -1
			var calendar = Ti.Calendar.getCalendarById(CALENDAR_TO_USE);
			Titanium.API.info("calendar" + calendar);
			Titanium.API.info("calendar3" + JSON.stringify(calendar));
			var anz = [];
			anz.push(calendar);
			showCalendars(anz);
		} else {
			if (Ti.Calendar.eventsAuthorization == Ti.Calendar.AUTHORIZATION_AUTHORIZED) {
				var iPhoneCalender = Titanium.Calendar.defaultCalendar;
				Titanium.API.info("iPhone Date1:" + date1);
				Titanium.API.info("iPhone date2:" + date2);
				var evt = iPhoneCalender.createEvent({
					title : 'Sample Event',
					notes : 'This is a test event which has some values assigned to it.',
					location : 'Appcelerator Inc',
					begin : date1,
					end : date2,
					availability : Ti.Calendar.AVAILABILITY_FREE,
					allDay : false
				});
				var alert1 = evt.createAlert({
					absoluteDate : date1
				});
				var allAlerts = new Array(alert1);
				evt.alerts = allAlerts;
				evt.save(Ti.Calendar.SPAN_THISEVENT);
				alert('Event Added on');
				var db = Titanium.Database.install("/jay.db", 'jay');
				db.execute("INSERT INTO event(eventID)VALUES(?)", evt.id);
				db.close();
			} else {
				Titanium.API.info("this is authorization part");
				Titanium.API.info("authorization Date1:" + date1);
				Titanium.API.info("authorization date2:" + date2);
				Ti.Calendar.requestEventsAuthorization(function(e) {
					if (e.success) {
						var iPhoneCalender = Titanium.Calendar.defaultCalendar;
						var evt = iPhoneCalender.createEvent({
							title : 'Sample Event',
							notes : 'This is a test event which has some values assigned to it.',
							location : 'Appcelerator Inc',
							begin : date1,
							end : date2,
							availability : Ti.Calendar.AVAILABILITY_FREE,
							allDay : false
						});
						evt.save(Ti.Calendar.SPAN_THISEVENT);
						var alert1 = evt.createAlert({
							absoluteDate : new Date(new Date().getTime() - (1000 * 60 * 20)),
						});
						var alert2 = evt.createAlert({
							relativeOffset : -(60 * 15)
						});
						var allAlerts = new Array(alert1, alert2);
						evt.alerts = allAlerts;
						alert(evt.id);
						var db = Titanium.Database.install("/jay.db", 'jay');
						db.execute("INSERT INTO event(eventID)VALUES(?)", evt.id);
						db.close();
					} else {
						alert('Access to calendar is not allowed');
					}
				});
			}
		}
	} catch(exp) {
		Titanium.API.info('THE ADD EXCEPTION:' + exp);
	}
});
$.container.open();

