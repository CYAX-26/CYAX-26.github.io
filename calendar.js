document.addEventListener('DOMContentLoaded', function () {

  // Replace this with your published CSV URL
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR66UbVbwCCaoDuHsB4A1bGknrJ2vdNL18q-IVFst2AUF8sX_U-v2TrnMlEgOvMMxl1hwiKLKV1v6_j/pub?output=csv';

  // Fetch CSV from Google Sheets
  fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {

      // Split CSV into rows and skip the header
      const rows = csvText.trim().split('\n').slice(1);

      // Map each row into a FullCalendar event
      const events = rows.map(row => {
        // Split row by comma
        const [title, start, end, signupUrl] = row.split(',');

        // Ignore empty rows
        if (!title) return null;

        return {
          title: title,
          start: start,
          end: end,
          extendedProps: { signupUrl: signupUrl }
        };
      }).filter(e => e !== null); // Remove nulls

      // Initialize FullCalendar
      const calendarEl = document.getElementById('calendar');
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events,
        eventClick: function(info) {
          if(info.event.extendedProps.signupUrl) {
            window.open(info.event.extendedProps.signupUrl, '_blank');
          }
        }
      });

      // Render the calendar
      calendar.render();
    })
    .catch(error => {
      console.error("Error fetching CSV:", error);
    });

});
