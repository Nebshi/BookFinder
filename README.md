# Book Finder API

## Overview

The Book Finder API allows users to search, create, update, and delete books. This document provides instructions on how to set up, run, and test the API using Postman and Newman.

## Setup

### Prerequisites

1. **Node.js**: Make sure Node.js latest version is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
2. **Postman**: Download and install Postman from [getpostman.com](https://www.postman.com/).

### Installation

1. **Clone the repository**:
    ```bash
    git clone  https://github.com/Nebshi/BookFinder.git
    cd BookFinder
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Create a .env file in the root directory with the following content**:
    ```bash
    MONGODB_URI=your_mongodb_url
    PORT=port_number
    ```

4. **Run the seed file**:
    ```bash
    node seed.js
    ```
    - This script will populate your database with initial data.
    - If data is already present, the seed script will not affect existing records. Ensure that you have a clean database or reset it if necessary to avoid any inconsistencies.

4. **Run project**:
    ```bash
    npm start
    ```

## Running Tests
1. **Open Postman**.
2. **Import the Collection**:
   - Click on the "Import" button in the top-left corner of the Postman interface.
   - Select the `./collection/BookFinder.postman_collection.json` file and import it into Postman.
3. **Open Collection Runner**:
   - Click on the "Runner" button in the top-left corner of the Postman interface to open the Collection Runner.
4. **Choose Your Collection**:
   - In the Collection Runner window, select your imported collection from the dropdown list.
5. **Run the Tests**:
   - Click the "Run" button to execute all the tests in the selected collection.
   - Review the test results displayed in the Collection Runner interface.

## Postman Mock Server

You can use the Postman mock server to simulate the API responses:
- **Mock Server URL**: [Postman Mock Server](https://97145926-0f31-47aa-a81b-21ce204d7329.mock.pstmn.io/)

## API Documentation

For detailed API documentation, refer to the following link:
- [API Documentation](https://documenter.getpostman.com/view/32582062/2sAXjM4Xgk)


## Test Report

To view detailed test results, refer to the report file:
- **Report Filename**: `.report/BookFinder.postman_test_run.json`