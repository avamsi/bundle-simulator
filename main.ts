function moveUnreadThreadsToInbox(label: string) {
    var threads = GmailApp.search('is:unread label:' + label)
    // For whatever reason, GmailApp.moveThreadsToInbox throws when asked
    // to move more than 100 threads at once.
    var maxThreads = 100
    for (var i = 0; i < threads.length; i += maxThreads) {
      GmailApp.moveThreadsToInbox(threads.slice(i, i + maxThreads))
    }
}

function daily() {
    moveUnreadThreadsToInbox('daily');
}

function weekly() {
    moveUnreadThreadsToInbox('weekly');
}

function scheduleTriggers() {
    ScriptApp.newTrigger('daily')
        .timeBased()
        .atHour(8)
        .everyDays(1)
        .create();
    ScriptApp.newTrigger('weekly')
        .timeBased()
        .atHour(11)
        .onWeekDay(ScriptApp.WeekDay.SATURDAY)
        .create();
}
