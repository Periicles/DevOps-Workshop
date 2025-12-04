# Breweries API Project

This project is a simple backend application that fetches data from the Open Brewery API. It provides routes to list all breweries.

## Project Structure

```
breweries
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers           # Contains controllers for handling requests
│   │   └── breweriesController.ts
│   ├── routes                # Defines the routes for the application
│   │   └── breweries.ts
│   ├── services              # Contains services for API calls
│   │   └── breweryService.ts
│   └── types                 # Type definitions for the application
│       └── index.d.ts
├── package.json              # NPM configuration file
├── tsconfig.json             # TypeScript configuration file
├── .env.example              # Example environment variables
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd breweries
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

## Usage

- The application exposes an endpoint to fetch all breweries:
  ```
  GET /breweries
  ```

This will return a list of breweries fetched from the Open Brewery API.

## License

This project is licensed under the MIT License.