#---->>>> Tender Data Table Application <<<<-----
This project is a React-based web application designed to display tender data in a searchable, and interactive table. It fetches data from a backend API and provides features like search by title or supplier name and navigation to tender details.

Features
Data Display: Shows tender information including ID, Title, Supplier Name, Deadline, and Value.
Search Functionality: Users can search for tenders by title or awarded supplier name.
Loading Indicator: A visual loader is displayed while data is being fetched.
Row Interaction: Clicking on a table row navigates to a detailed view of that specific tender (assuming a /tender/:id route exists).

Technologies Used:
React.js: Frontend library for building the user interface.
Axios: Promise-based HTTP client for making API requests.
React Router DOM: For client-side routing to navigate between pages (e.g., to tender detail view).
CSS: For styling the application.

Prerequisites
Before you begin, ensure you have the following installed:
Node.js: (LTS version recommended) - Includes npm (Node Package Manager). You can download it from nodejs.org.
npm or Yarn: Package manager for JavaScript. npm comes with Node.js. If you prefer Yarn, you can install it via npm install -g yarn.

Getting Started
Follow these steps to get the project up and running on your local machine.

1. Clone the Repository
   If your project is in a Git repository, clone it using:

git clone <your-repository-url>
cd <your-project-folder>

If it's a local folder, navigate to your project directory.

2. Install Dependencies
   Navigate into your project directory and install the necessary npm packages:

cd your-project-name # if you cloned it
npm install

# OR

yarn install

3. Backend API (Important)
   This application relies on a backend API endpoint /api/es/tenders to fetch data. You will need to ensure this API is running and accessible.

If you have a separate backend project: Start your backend server according to its instructions. Ensure it's configured to serve data on /api/es/tenders.

If you don't have a backend yet: The app will likely show a "Data fetching error" in the console and the loader will disappear without data. For local development, you might consider setting up a mock API using tools like json-server or configuring your package.json proxy if your backend runs on a different port.

Example (Proxy in package.json): If your backend runs on http://localhost:5000, add this to your package.json file:

// Inside your package.json, typically after "name" and "version"
"proxy": "http://localhost:5000",

This tells the development server to proxy unknown requests to your backend.

4. Run the Application
   Once dependencies are installed and your backend API is ready (or you've configured a proxy), you can start the React development server:

npm start

# OR

yarn start

This command will:
Start the development server.
Open the application in your default web browser at http://localhost:3000 (or another available port).
The page will reload if you make edits.
You will also see any lint errors in the console.



I have added Images of the application in the src/assets/Screenshotsofapplication folder

I have made this Responsive , so that it can work at any devices
