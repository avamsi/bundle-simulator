function daily() {
	const threads = GmailApp.search('label:daily -in:inbox is:unread -is:muted');
	if (threads.length === 0) {
		return;
	}
	const labelIdsToRemove = [];
	for (const label of Gmail.Users.Labels.list('me').labels) {
		if (label.name == 'daily' || label.name == 'skipped') {
			labelIdsToRemove.push(label.id);
		}
	}
	for (const thread of threads) {
		const labels = {
			'addLabelIds': ['INBOX'],
			'removeLabelIds': ['CATEGORY_UPDATES', ...labelIdsToRemove],
		};
		Gmail.Users.Threads.modify(labels, 'me', thread.getId());
	}
}

function weekly() {
	const threads = GmailApp.search('label:weekly -in:inbox is:unread -is:muted');
	// For whatever reason, GmailApp.moveThreadsToInbox throws when asked to move
	// more than 100 threads at once. Avoid that by buffering manually.
	const maxThreads = 100;
	for (let i = 0; i < threads.length; i += maxThreads) {
		GmailApp.moveThreadsToInbox(threads.slice(i, i + maxThreads));
	}
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
