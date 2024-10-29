# google-meet-link-generator
This project provides a simple RESTful API to automatically create Google Meet links and schedule events on Google Calendar. Built with Node.js and Express, it leverages the Google Calendar API to generate instant meeting links and allows users to customize event details such as the meeting name, date, time, and attendees. Ideal for quickly setting up virtual meetings with ease.

# Key Features:
- Create Google Meet links on the fly
- Schedule meetings with custom date, time, and attendees
- Google Calendar integration
- Easily configurable using service account credentials
# Tech Stack:
- Node.js
- Express
- Google Calendar API
- UUID for unique request ID generation
- JavaScript
- JSON

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- A **Google Cloud Platform** account with a service account created and the Calendar API enabled.
- A `service-account-key.json` file that contains the credentials for your Google service account.

## Getting Started

Follow these steps to set up and run the project:

**Clone the repository:**
   ```bash
   git clone https://github.com/nsubhadipta/google-meet-link-generator.git
   cd google-meet-link-generator
Install dependencies:

```bash
npm install
```
Add your Google service account key: Place your `service-account-key.json` file in the root of your project directory.

Run the application:

```bash
node server.js
```
Access the API: The application will start on `http://localhost:3000`. You can access the meeting link creation endpoint at `/api/create_meeting_link`.

# API 
```POST  http://localhost:3000/api/create_meeting_link```

Request Body:

```json
{
  "summary": "Project Test",
  "location": "Bhubaneswar",
  "description": "Discussion about the project.",
  "startTime": "2024-10-25T03:00:31.321Z",  // Optional
  "endTime": "2024-10-25T03:30:31.321Z",    // Optional
  "attendees": [
    {
      "email": "amarjyotimahanta6@gmail.com",
      "name": "Amarjyoti Mahanta"
    },
    {
      "email": "chittaranjan.das@tatwa.info",
      "name": "Chitta Ranjan Das"
    }
  ],
}
```
Response:

```json
{
  "meetLink": "https://meet.google.com/yit-apcd-jmv"
}
```
Description:

- If `startTime` is not provided, the API creates an instant meeting with a duration of 30 minutes from the current time.
- The meetLink in the response contains the URL for the created Google Meet.
# Contributing
Contributions are welcome! Please follow these steps to contribute to the project:

1. Fork the project.
2. Create your feature branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a pull request.
