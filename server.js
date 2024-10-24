const { google } = require('googleapis');
const fs = require('fs');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique request IDs

const app = express();
app.use(express.json()); // Parse JSON request bodies

const serviceAccountKeyFile = 'service-account-key.json'; 
const serviceAccountKey = JSON.parse(fs.readFileSync(serviceAccountKeyFile, 'utf8'));

// Set up Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/calendar'],
  clientOptions: {
    subject: "subhadipta.nayak@tatwa.info" 
  }
});

// POST endpoint to create a Google Meet link
app.post('/api/create_meeting_link', async (req, res) => {
  try {
    const {
      summary = 'Instant Google Meet',
      location = 'Virtual',
      description = '',
      startTime,
      endTime,
      attendees = []
    } = req.body;

    const authClient = await auth.getClient();

    // Handle start and end times with fallback for instant meeting (30 minutes from now)
    const startDateTime = startTime ? new Date(startTime).toISOString() : getCurrentISTTime().toISOString();
    const endDateTime = endTime 
      ? new Date(endTime).toISOString() 
      : new Date(new Date(getCurrentISTTime()).getTime() + 30 * 60000).toISOString(); // Default 30 minutes duration

    // Create the Google Meet event
    const meetLink = await createGoogleMeetEvent(authClient, {
      summary,
      location,
      description,
      startDateTime,
      endDateTime,
      attendees
    });

    // Respond with the meeting link
    res.json({ meetLink });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create the meeting link.' });
    console.error('Error creating meeting:', err);
  }
});

// Helper function to create a Google Meet event
async function createGoogleMeetEvent(authClient, { summary, location, description, startDateTime, endDateTime, attendees }) {
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const event = {
    summary,
    location,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Kolkata', 
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Kolkata', 
    },
    attendees: attendees.map(attendee => ({ email: attendee.email, displayName: attendee.name })),
    conferenceData: {
      createRequest: {
        requestId: uuidv4(), 
        conferenceSolutionKey: {
          type: 'hangoutsMeet', 
        },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1, 
  });

  return response.data.hangoutLink; 
}

// Helper function to get the current IST time
function getCurrentISTTime() {
  const currentUtcTime = new Date();
  const ISTOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(currentUtcTime.getTime() + ISTOffset);
}

// Start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
