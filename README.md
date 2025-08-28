# AquaView Water Quality Monitoring System

This document provides a detailed overview of the AquaView application's architecture, features, and operational workflow.

## 1. System Overview

AquaView is a web-based dashboard designed for real-time monitoring and analysis of water quality parameters in an aquaculture environment. It leverages a simulated data stream to provide a dynamic and responsive user interface, complete with AI-powered analytics for insightful decision-making.

The application is built with Next.js and React, utilizing server-side components for performance and a rich client-side experience for interactivity.

## 2. Core Functionalities

### 2.1. Dashboard Interface
The main interface is a comprehensive dashboard divided into several key sections:

-   **Top Bar**: Displays the application title, mock status icons (WiFi, Battery), and an access point to the settings panel.
-   **Data Cards Grid**: A 2x2 grid presenting real-time values for four primary water quality parameters:
    -   Temperature
    -   pH Level
    -   Turbidity
    -   Dissolved Oxygen (DO)
-   **Live Chart**: A graphical representation of the historical data for all four parameters, updating in real-time.
-   **AI Analyst Card**: An AI-powered component that provides continuous analysis, status updates, and actionable recommendations based on the live data.
-   **Control Bar**: A set of controls to start or stop the data simulation, export data, and open the settings panel.

### 2.2. Data Simulation
The system uses a client-side data simulation engine to mimic a live sensor feed.

-   **Initialization**: On application load, it generates an initial history of 30 data points.
-   **Real-time Generation**: When monitoring is active, a new data point is generated at a configurable interval (default: 3 seconds). Each new point is calculated based on the previous one, with a small, random fluctuation to simulate realistic sensor drift.
-   **Data Clamping**: Generated values are clamped within realistic operational ranges to prevent nonsensical data.
-   **History Management**: The system maintains a rolling history of the last 30 data points.

### 2.3. State Management
A central `DataProvider`, using React's Context API, manages the application's state. This includes:

-   `dataHistory`: The array of the last 30 data points.
-   `currentData`: The most recent data point.
-   `settings`: User-configurable settings, including units and alert thresholds.
-   `isRunning`: A boolean state to control the data simulation (start/stop).
-   `isInitialized`: A flag to indicate when initial data and settings have been loaded.

This centralized approach ensures data consistency across all components.

### 2.4. AI-Powered Analysis
AquaView integrates a Genkit-based AI to provide intelligent analysis.

-   **Real-time Analysis (`analyzeWaterQuality`)**:
    -   This flow is triggered automatically whenever new data is generated.
    -   It sends the current sensor data and user-defined alert thresholds to the AI.
    -   The AI returns a structured analysis, including:
        -   `overallStatus`: 'Good', 'Warning', or 'Critical'.
        -   `summary`: A one-sentence overview.
        -   `detailedAnalysis`: Key observations and actionable recommendations.
    -   This analysis is displayed in the "AquaGuard Analyst" card.

-   **Report Generation (`generateReport`)**:
    -   This flow is triggered manually from the "Export" menu.
    -   It sends the last 10 data points and settings to the AI.
    -   The AI generates a comprehensive, multi-section report in markdown format, summarizing trends, anomalies, and providing recommendations for the period.
    -   The report is displayed in a dialog and can be downloaded as a text file.

### 2.5. User-Configurable Settings
Users can customize the application's behavior via the Settings panel.

-   **Units**: Change the temperature display between Celsius and Fahrenheit.
-   **Alert Thresholds**: Define the optimal ranges for each water quality parameter. When a parameter goes outside its defined range, a toast notification is triggered.
-   **Refresh Interval**: Adjust the frequency at which new data is generated.
-   **Persistence**: All settings are automatically saved to the browser's `localStorage` and are reloaded on subsequent visits.

## 3. Operational Algorithm

The system operates based on the following sequence of events:

1.  **Initialization**:
    a. The main `Home` component renders, wrapping the application in `DataProvider`.
    b. The `useWaterQualityData` hook is invoked.
    c. It attempts to load `settings` from `localStorage`. If not found, it uses initial default settings.
    d. It generates an initial `dataHistory` of 30 points to populate the chart.
    e. The `isInitialized` state is set to `true`.
    f. UI components, previously showing skeletons, render with the initial data.

2.  **Monitoring Loop (when `isRunning` is `true`)**:
    a. A `setInterval` timer is active, firing at the `refreshInterval` defined in `settings`.
    b. On each tick:
        i. A new `DataPoint` is generated based on the last point in `dataHistory`.
        ii. The `checkAlerts` function compares the new data point against the `settings.alerts` thresholds. If a threshold is breached, a `destructive` toast notification is displayed.
        iii. The new data point is appended to `dataHistory`, and the oldest point is removed to maintain a length of 30.
        iv. The UI automatically re-renders to reflect the new `currentData` and updated `dataHistory`.
        v. The `AnalystCard` triggers the `analyzeWaterQuality` AI flow with the new data. The card updates its display with the returned analysis.

3.  **User Interaction**:
    a. **Start/Stop Button**: Toggles the `isRunning` state, which starts or stops the monitoring loop.
    b. **Settings Button**: Opens the `SettingsSheet`. Any changes made within the sheet update the `settings` state and are persisted to `localStorage`.
    c. **Export Menu**:
        - **CSV**: Simulates a CSV file download (mock functionality).
        - **AI Report**:
            i. Sets the report dialog to a "generating" state.
            ii. Calls the `generateReport` AI flow.
            iii. Once the report is received, it's displayed in the dialog.
            iv. The user can then download the report as a `.txt` file.

This comprehensive workflow ensures a responsive, interactive, and insightful experience for monitoring water quality data.
