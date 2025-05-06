import { DateTime } from "luxon";
import { TNoteAutomation } from "../types/TNoteAutomation"

export const convertedNoteAutomation = (automation: TNoteAutomation) => ({
    ...automation,
    dateTime: DateTime.fromISO(automation.dateTime, {
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
        .toUTC()
        .toISO({ suppressMilliseconds: true }) || automation.dateTime,
});