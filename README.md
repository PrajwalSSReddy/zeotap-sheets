# zeotap-sheets

A web application that mimics the core functionalities of a spreadsheet program like Google Sheets.

## Features

-   **Interactive Spreadsheet Interface**: A grid-based UI for entering and manipulating data.
-   **Mathematical Functions**: Support for core spreadsheet functions:
    -   SUM
    -   AVERAGE
    -   MAX
    -   MIN
    -   COUNT
-   **Data Quality Functions**: Implementation of data transformation and validation:
    -   TRIM
    -   UPPER
    -   LOWER
-   **Formula Calculation**: Capability to enter and evaluate basic formulas (e.g., `SUM(A1,A2)`, `A1+A2`, `A1*A2`).
-   **Keyboard Navigation**: Use of `Enter` to move down, `Tab` to move right, `Shift+Tab` to move left, and arrow keys for cell navigation.
-   **Open File**: Load CSV or Excel files into the spreadsheet from local storage.
-   **Drag and Drop**: Ability to drag and drop CSV or Excel files to load data.
-   **Save Functionality**: Export spreadsheet data to CSV and Excel (`.xlsx`) formats.
-  **Theme**: Toggle between dark and light modes.
-  **User Experience**: Formula input field, proper rendering of cells and selection.

## Tech Stack

-   **Frontend:** React.js
-   **Build Tool:** Create React App (using Webpack, Babel, etc)
-   **Styling:** HTML/CSS with very basic styling.
-   **Data Parsing**: `XLSX` library for excel parsing.
-    **Language**: JavaScript

## Data Structures

The spreadsheet data is stored in a nested JavaScript object for efficient cell access and updates:
```javascript
    {
        rows: 100,
        cols: 26,
        data: {
        1: {
            1: { value: '10', formula:''},
            2: { value: '20', formula:''}
         },
        }
    }
```

# Setup and Installation
#### Clone the repository:
```bash
    git clone <your_repository_url>
```
#### Navigate to the project directory:
```bash
cd <project_directory_name>
```
#### Install dependencies:
```bash
npm install
```
or
```bash
yarn install
```
or
```bash
pnpm install
```
#### Start the development server:
```bash
npm start
```
or

```bash
yarn start
```
or
```bash
pnpm start
```
#### Open your browser: The application will run at http://localhost:3000 or similar url on your browser.

# Usage

#### The spreadsheet can be navigated using mouse or keyboard.

-  Enter data in a cell and press Enter or Tab for navigating to next cells.

-  Enter formulas in the formula input field using google sheets syntax SUM(A1,B2) or A1+B2 etc.

-  Click save button to save as csv or excel file.

-  Open a file by clicking open button and choose a csv or excel file from your local machine or you can also drag and drop a file into the spreadsheet.

-  Click theme toggle to switch between dark or light mode.

# Known Issues
-  Performance might degrade for large datasets or complex formula as the data structure is not optimized for larger dataset.

-  There can be some bugs which have not been identified.

**Explanation**

The primary change in this version is that the setup and usage is formatted with backticks which means that the contents are formatted with code markdown.

**How to Use**

1.  **Replace Content:** Update your `README.md` file content with this updated code.
2.  **Customization**: Do not forget to replace `your_repository_url` and `project_directory_name` with the correct values.

With this, your `README.md` should now contain all the necessary details formatted as requested. This should give a clear and structured view of all the information for your application.
