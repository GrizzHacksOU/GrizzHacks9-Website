// Event Schedule app - plain JS, no build step.
// Data lives in data.js (window.SCHEDULE).
//
// Testing tip: add ?now=2027-03-20T14:20 to the URL to pretend it's that
// time (event time zone). The clock keeps ticking from there.

(function () {
    "use strict";

    const S = window.SCHEDULE;
    const TZ = S.timeZone;
    const HOUR_H = 48; // px per hour in Day view (matches --hour-h in app.css)
    const MIN_BLOCK_PX = 18; // shortest drawn event block
    const MIN_BLOCK_MIN = (MIN_BLOCK_PX / HOUR_H) * 60; // ...in minutes, for overlap layout

    // ---------- time helpers ----------

    // Optional simulated clock via ?now=...
    let clockOffsetMs = 0;
    let simulated = false;
    const nowParam = new URLSearchParams(location.search).get("now");
    if (nowParam) {
        const hasOffset = /([zZ]|[+-]\d\d:\d\d)$/.test(nowParam);
        const iso = hasOffset ? nowParam : nowParam + S.hackingStarts.slice(-6);
        const t = Date.parse(iso);
        if (!Number.isNaN(t)) {
            clockOffsetMs = t - Date.now();
            simulated = true;
        }
    }
    const now = () => new Date(Date.now() + clockOffsetMs);

    const partsFmt = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    });
    // Date -> {date: "YYYY-MM-DD", h, m, s} in the event time zone
    function tzParts(d) {
        const o = {};
        for (const p of partsFmt.formatToParts(d)) o[p.type] = p.value;
        return { date: `${o.year}-${o.month}-${o.day}`, h: +o.hour, m: +o.minute, s: +o.second };
    }

    const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
    const clockFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit" });
    const longDateFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric" });
    const tzNameFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "long" });

    const fmtTime = (d) => timeFmt.format(d);
    const fmtRange = (ev) => `${fmtTime(ev.startD)} - ${fmtTime(ev.endD)}`;

    function hourLabel(h) {
        const hr = h % 12 || 12;
        return `${hr} ${h < 12 || h === 24 ? "AM" : "PM"}`;
    }

    function fmtDuration(ms) {
        const total = Math.max(0, Math.floor(ms / 1000));
        const d = Math.floor(total / 86400);
        const h = Math.floor((total % 86400) / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        const pad = (n) => String(n).padStart(2, "0");
        return d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s` : `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    function fmtShortDuration(ms) {
        const mins = Math.max(0, Math.round(ms / 60000));
        if (mins < 60) return `${mins}m`;
        if (mins >= 1440) return `${Math.round(mins / 1440)}d`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m ? `${h}h ${m}m` : `${h}h`;
    }

    // ---------- DOM helper ----------
    // el("div", {class: "x", onclick: fn}, "text", childNode, ...)
    function el(tag, attrs, ...children) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) {
            if (v == null || v === false) continue;
            if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
            else if (k === "style") Object.assign(node.style, v);
            else node.setAttribute(k, v === true ? "" : v);
        }
        for (const c of children) {
            if (c == null || c === false) continue;
            node.append(c instanceof Node ? c : String(c));
        }
        return node;
    }
    const $ = (id) => document.getElementById(id);

    // ---------- data prep ----------
    const events = S.events
        .map((ev) => ({ ...ev, startD: new Date(ev.start), endD: new Date(ev.end) }))
        .sort((a, b) => a.startD - b.startD || a.endD - b.endD);
    events.forEach((ev) => (ev.day = tzParts(ev.startD).date));

    const catOf = (ev) => S.categories[ev.category] || { label: ev.category, color: "#666" };
    const hackStart = new Date(S.hackingStarts);
    const hackEnd = new Date(S.hackingEnds);

    function liveState(t) {
        const current = events.filter((ev) => ev.startD <= t && t < ev.endD);
        const next = events.find((ev) => ev.startD > t) || null;
        return { current, next };
    }

    // ---------- state ----------
    const todayDate = tzParts(now()).date;
    let selectedDay = (S.days.find((d) => d.date === todayDate) || S.days[0]).date;
    let lastMinuteKey = "";

    // ---------- left panel: calendar ----------
    function renderCalendar() {
        const [y, m] = S.days[0].date.split("-").map(Number);
        const first = new Date(Date.UTC(y, m - 1, 1));
        const startDow = first.getUTCDay();
        const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
        const prevMonthDays = new Date(Date.UTC(y, m - 1, 0)).getUTCDate();
        const eventDates = new Set(S.days.map((d) => d.date));
        const today = tzParts(now()).date;

        $("cal-title").textContent = first.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

        const cal = $("cal");
        cal.replaceChildren(el("tr", {}, ...["S", "M", "T", "W", "T", "F", "S"].map((d) => el("th", { scope: "col" }, d))));

        let row = el("tr");
        for (let i = 0; i < startDow; i++) row.append(el("td", { class: "other" }, prevMonthDays - startDow + 1 + i));
        for (let day = 1; day <= daysInMonth; day++) {
            const iso = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const classes = [];
            const isEvent = eventDates.has(iso);
            if (isEvent) classes.push("event-day");
            if (iso === selectedDay) classes.push("selected");
            if (iso === today) classes.push("today");
            row.append(el("td", {
                class: classes.join(" ") || null,
                tabindex: isEvent ? 0 : null,
                role: isEvent ? "button" : null,
                "aria-label": isEvent ? `Show ${iso}` : null,
                onclick: isEvent ? () => selectDay(iso) : null,
                onkeydown: isEvent ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectDay(iso); } } : null,
            }, day));
            if (row.children.length === 7) { cal.append(row); row = el("tr"); }
        }
        if (row.children.length) {
            let n = 1;
            while (row.children.length < 7) row.append(el("td", { class: "other" }, n++));
            cal.append(row);
        }
    }

    function renderLegend() {
        $("legend").replaceChildren(...Object.values(S.categories).map((c) =>
            el("li", {}, el("span", { class: "swatch", style: { background: c.color } }), c.label)));
    }

    // ---------- left panel: clock + countdown ----------
    function renderClock() {
        const t = now();
        $("clock").textContent = clockFmt.format(t);

        const tzName = tzNameFmt.formatToParts(t).find((p) => p.type === "timeZoneName")?.value || TZ;
        $("tz").textContent = simulated ? `${tzName} (SIMULATED)` : tzName;

        let label, html;
        if (t < hackStart) {
            label = "Countdown";
            html = [el("span", {}, "Hacking begins in"), el("span", { class: "big" }, fmtDuration(hackStart - t))];
        } else if (t < hackEnd) {
            label = "Hacking in progress";
            html = [el("span", {}, "Submissions due in"), el("span", { class: "big" }, fmtDuration(hackEnd - t))];
        } else {
            label = "Countdown";
            html = [el("span", {}, `${S.eventName} is over.`), el("br"), el("span", {}, "See you next year!")];
        }
        $("countdown-label").textContent = label;
        $("countdown").replaceChildren(...html);
    }

    // ---------- right panel: day view ----------
    function layoutColumns(list) {
        // Side-by-side columns for overlapping events.
        const out = [];
        let cluster = [];
        let clusterEnd = -Infinity;
        // Short events are drawn taller than their real length, so lay out by drawn end.
        const drawnEnd = (item) => Math.max(item.e, item.s + MIN_BLOCK_MIN);
        function flush() {
            const colEnds = [];
            for (const item of cluster) {
                let c = colEnds.findIndex((end) => end <= item.s);
                if (c === -1) { c = colEnds.length; colEnds.push(0); }
                colEnds[c] = drawnEnd(item);
                item.col = c;
            }
            for (const item of cluster) item.cols = colEnds.length;
            out.push(...cluster);
            cluster = [];
            clusterEnd = -Infinity;
        }
        for (const item of list) {
            if (cluster.length && item.s >= clusterEnd) flush();
            cluster.push(item);
            clusterEnd = Math.max(clusterEnd, drawnEnd(item));
        }
        if (cluster.length) flush();
        return out;
    }

    function renderDaySwitch() {
        $("day-switch").replaceChildren(...S.days.map((d) => el("button", {
            class: d.date === selectedDay ? "is-current" : null,
            "aria-pressed": String(d.date === selectedDay),
            onclick: () => selectDay(d.date),
        }, `${d.label} ${Number(d.date.slice(8))}`)));
    }

    function renderDayGrid() {
        const day = S.days.find((d) => d.date === selectedDay);
        const grid = $("day-grid");
        const t = now();
        const { current, next } = liveState(t);
        const hours = day.endHour - day.startHour;
        grid.style.height = `${hours * HOUR_H}px`;

        const nodes = [];
        for (let h = day.startHour; h < day.endHour; h++) {
            nodes.push(el("div", { class: "hour-row", style: { top: `${(h - day.startHour) * HOUR_H}px` } },
                el("div", { class: "hour-label" }, hourLabel(h))));
        }

        const rangeStart = day.startHour * 60;
        const rangeEnd = day.endHour * 60;
        const items = events.filter((ev) => ev.day === day.date).map((ev) => {
            const sp = tzParts(ev.startD);
            const s = Math.max(rangeStart, sp.h * 60 + sp.m);
            const durMin = (ev.endD - ev.startD) / 60000;
            const e = Math.min(rangeEnd, s + durMin);
            return { ev, s, e };
        }).filter((it) => it.s < rangeEnd);

        for (const { ev, s, e, col, cols } of layoutColumns(items)) {
            const cat = catOf(ev);
            const classes = ["event-block"];
            if (ev.endD <= t) classes.push("is-past");
            if (current.includes(ev)) classes.push("is-now");
            const height = Math.max(MIN_BLOCK_PX, ((e - s) / 60) * HOUR_H - 2);
            nodes.push(el("button", {
                class: classes.join(" "),
                title: `${ev.title} (${fmtRange(ev)})`,
                style: {
                    top: `${((s - rangeStart) / 60) * HOUR_H + 1}px`,
                    height: `${height}px`,
                    left: `calc(52px + (100% - 56px) * ${col / cols})`,
                    width: `calc((100% - 56px) / ${cols} - 2px)`,
                    background: cat.color,
                },
                onclick: () => openDialog(ev),
            },
            el("span", { class: "ev-title" }, ev.title, next === ev ? el("span", { class: "tag-next" }, "NEXT") : null),
            height > 30 ? el("span", { class: "ev-time" }, fmtRange(ev)) : null));
        }

        // "Now" line
        const np = tzParts(t);
        const nowMin = np.h * 60 + np.m;
        if (np.date === day.date && nowMin >= rangeStart && nowMin <= rangeEnd) {
            nodes.push(el("div", { class: "now-line", id: "now-line", style: { top: `${((nowMin - rangeStart) / 60) * HOUR_H}px` } }));
        }

        grid.replaceChildren(...nodes);
    }

    function scrollDayToInteresting() {
        const scroller = $("day-scroll");
        const line = $("now-line");
        if (line) {
            scroller.scrollTop = Math.max(0, line.offsetTop - scroller.clientHeight / 3);
            return;
        }
        const firstBlock = $("day-grid").querySelector(".event-block");
        scroller.scrollTop = firstBlock ? Math.max(0, firstBlock.offsetTop - HOUR_H / 2) : 0;
    }

    // ---------- right panel: agenda view ----------
    function renderAgenda() {
        const t = now();
        const { current, next } = liveState(t);
        const nodes = [];
        for (const d of S.days) {
            const dayEvents = events.filter((ev) => ev.day === d.date);
            if (!dayEvents.length) continue;
            nodes.push(el("h4", {}, longDateFmt.format(dayEvents[0].startD)));
            for (const ev of dayEvents) {
                const classes = ["agenda-row"];
                if (ev.endD <= t) classes.push("is-past");
                if (current.includes(ev)) classes.push("is-now");
                nodes.push(el("button", { class: classes.join(" "), onclick: () => openDialog(ev) },
                    el("span", {}, fmtRange(ev)),
                    el("span", { class: "swatch", style: { background: catOf(ev).color }, title: catOf(ev).label }),
                    el("span", {},
                        el("b", {}, ev.title),
                        current.includes(ev) ? el("span", { class: "tag-now" }, "NOW") : null,
                        next === ev ? el("span", { class: "tag-next" }, "NEXT") : null,
                        el("span", { class: "where" }, ev.location))));
            }
        }
        $("agenda").replaceChildren(...nodes);
    }

    // ---------- status bar ----------
    function renderStatus() {
        const t = now();
        const { current, next } = liveState(t);
        $("status-now").textContent = current.length
            ? `Now: ${current.map((ev) => `${ev.title} (until ${fmtTime(ev.endD)})`).join(", ")}`
            : "Now: Nothing scheduled";
        $("status-next").textContent = next
            ? `Next: ${next.title} at ${fmtTime(next.startD)} (in ${fmtShortDuration(next.startD - t)})`
            : "Next: -";
    }

    // ---------- tabs ----------
    const tabs = [$("tab-day"), $("tab-agenda")];
    function selectTab(tab) {
        for (const tb of tabs) {
            const on = tb === tab;
            tb.setAttribute("aria-selected", String(on));
            tb.tabIndex = on ? 0 : -1;
            $(tb.getAttribute("aria-controls")).hidden = !on;
        }
        if (tab.id === "tab-day") scrollDayToInteresting();
    }
    tabs.forEach((tb, i) => {
        tb.addEventListener("click", () => selectTab(tb));
        tb.addEventListener("keydown", (e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const nextTab = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
            nextTab.focus();
            selectTab(nextTab);
        });
    });

    function selectDay(date) {
        selectedDay = date;
        renderCalendar();
        renderDaySwitch();
        renderDayGrid();
        selectTab($("tab-day"));
    }

    // ---------- event dialog ----------
    let dialogEvent = null;
    let returnFocus = null;

    function openDialog(ev) {
        dialogEvent = ev;
        returnFocus = document.activeElement;
        const cat = catOf(ev);
        $("dlg-title").textContent = ev.title;
        $("dlg-heading").textContent = ev.title;
        $("dlg-when").textContent = `${longDateFmt.format(ev.startD)}, ${fmtRange(ev)}`;
        $("dlg-where").textContent = ev.location || "TBA";
        $("dlg-host").textContent = ev.host || "";
        $("dlg-host-row").hidden = !ev.host;
        $("dlg-type").replaceChildren(el("span", { class: "swatch", style: { background: cat.color, display: "inline-block", verticalAlign: "middle", marginRight: "4px" } }), cat.label);
        $("dlg-desc").textContent = ev.description || "";
        $("dialog-backdrop").hidden = false;
        $("dlg-ok").focus();
    }

    function closeDialog() {
        $("dialog-backdrop").hidden = true;
        dialogEvent = null;
        if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    }

    $("dlg-ok").addEventListener("click", closeDialog);
    $("dlg-x").addEventListener("click", closeDialog);
    $("dialog-backdrop").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeDialog(); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dialogEvent) closeDialog();
    });

    // ---------- add to calendar ----------
    const utcStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    function eventDetails(ev) {
        return [ev.description, ev.host ? `Host: ${ev.host}` : "", S.eventName].filter(Boolean).join("\n");
    }

    $("dlg-google").addEventListener("click", () => {
        const ev = dialogEvent;
        if (!ev) return;
        const url = new URL("https://calendar.google.com/calendar/render");
        url.searchParams.set("action", "TEMPLATE");
        url.searchParams.set("text", `${S.eventName}: ${ev.title}`);
        url.searchParams.set("dates", `${utcStamp(ev.startD)}/${utcStamp(ev.endD)}`);
        url.searchParams.set("details", eventDetails(ev));
        url.searchParams.set("location", ev.location || "");
        url.searchParams.set("ctz", TZ);
        window.open(url.toString(), "_blank", "noopener");
    });

    function icsEscape(s) {
        return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    }

    $("dlg-ics").addEventListener("click", () => {
        const ev = dialogEvent;
        if (!ev) return;
        const ics = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//GrizzHacks//Event Schedule//EN",
            "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT",
            `UID:${ev.id}-${utcStamp(ev.startD)}@grizzhacks`,
            `DTSTAMP:${utcStamp(new Date())}`,
            `DTSTART:${utcStamp(ev.startD)}`,
            `DTEND:${utcStamp(ev.endD)}`,
            `SUMMARY:${icsEscape(`${S.eventName}: ${ev.title}`)}`,
            `LOCATION:${icsEscape(ev.location || "")}`,
            `DESCRIPTION:${icsEscape(eventDetails(ev))}`,
            "END:VEVENT",
            "END:VCALENDAR",
            "",
        ].join("\r\n");
        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const a = el("a", { href: URL.createObjectURL(blob), download: `${ev.id}.ics` });
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    // ---------- live updates ----------
    function tick() {
        renderClock();
        const p = tzParts(now());
        const minuteKey = `${p.date} ${p.h}:${p.m}`;
        if (minuteKey !== lastMinuteKey) {
            // Once a minute: refresh anything that depends on "now" (scroll position is kept).
            const first = lastMinuteKey === "";
            lastMinuteKey = minuteKey;
            if (!first) renderCalendar();
            renderDayGrid();
            renderAgenda();
            renderStatus();
        }
    }

    // ---------- boot ----------
    renderLegend();
    renderCalendar();
    renderDaySwitch();
    tick();
    selectTab($("tab-day"));
    setInterval(tick, 1000);
})();
