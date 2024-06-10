--------------------------------------------------------------------MERN Stack Coding Challenge-----------------------------------------------------------------------------
Overview:

This project is a MERN stack application that involves building a backend with Node.js, Express, MongoDB, and a frontend with React. The backend fetches data from a third-party API, stores it in MongoDB, and provides various endpoints to interact with the data. The frontend uses these endpoints to display data in tables and charts.

Table of Contents:

Project Setup
Backend
APIs
Database Initialization
Frontend
Features
Usage
License
Project Setup
Prerequisites
Node.js and npm installed on your machine.
MongoDB installed and running on your machine.
Visual Studio Code or any code editor of your choice.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Akash/Rolixer.git
cd Rolixer
Install backend dependencies:

bash
Copy code
cd backend
npm install
Install frontend dependencies:

bash
Copy code
cd ../frontend
npm install
Backend
Description
The backend is built with Node.js, Express, and MongoDB. It fetches data from a third-party API, initializes the MongoDB database with this data, and provides several endpoints to interact with the data.

APIs
Initialize Database

URL: /initialize
Method: GET
Description: Fetches the JSON from the third-party API and initializes the database with seed data.
List Transactions

URL: /transactions
Method: GET
Query Parameters: month, search, page, perPage
Description: Lists all transactions, supports search and pagination.
Statistics

URL: /statistics
Method: GET
Query Parameters: month
Description: Returns total sale amount, total number of sold items, and total number of not sold items for the selected month.
Bar Chart Data

URL: /bar-chart
Method: GET
Query Parameters: month
Description: Returns price range and the number of items in that range for the selected month.
Pie Chart Data

URL: /pie-chart
Method: GET
Query Parameters: month
Description: Returns unique categories and the number of items in each category for the selected month.
Combined Data

URL: /combined-data
Method: GET
Query Parameters: month
Description: Fetches data from the above APIs, combines the response, and sends a final response of the combined JSON.
Database Initialization
To initialize the database with seed data, make a GET request to:

bash
Copy code
http://localhost:5000/initialize
Frontend
Description
The frontend is built with React and uses the APIs provided by the backend to display data in tables and charts.

Features
Transactions Table:

Lists transactions with search and pagination functionality.
Displays transactions for the selected month.
Transactions Statistics:

Displays total amount of sale, total sold items, and total not sold items for the selected month.
Transactions Bar Chart:

Displays price range and the number of items in that range for the selected month.
Transactions Pie Chart:

Displays unique categories and the number of items in each category for the selected month.
Usage
Running the Backend
Start MongoDB:

bash
Copy code
mongod
Start the backend server:

bash
Copy code
cd backend
node server.js
The backend server will run on http://localhost:5000.

Running the Frontend:
Start the frontend server:
bash
Copy code
cd frontend
npm start
The frontend will run on http://localhost:3000.
Accessing the Application
Open your browser and navigate to http://localhost:3000.
Use the dropdown to select a month and view the transactions table, statistics, bar chart, and pie chart.
