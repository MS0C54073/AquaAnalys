# **App Name**: AquaView

## Core Features:

- Dashboard Top Bar: Display a top bar with the project title (Water Quality Monitor), WiFi status, battery indicator, and a settings icon.
- Dashboard Grid: Implement a 2x2 grid layout displaying temperature, pH level, turbidity, and dissolved oxygen (DO) readings using interactive cards with visual indicators.
- Live Chart Area: Show real-time sensor data using charts (pH, Temperature, DO, and Turbidity) displayed in a multi-line chart that plots recent measurements
- Monitoring Control Bar: Provide control to start or stop the monitoring, export monitoring data as CSV/PDF and enter to Settings with the button bar.
- Simulated Data Generation: Simulate realistic data for temperature, pH, turbidity, and dissolved oxygen, incorporating fluctuations and the option for manual overrides, alert creation, and adjustments to refresh intervals and simulation speeds.
- Adjustable Settings: Provide setting adjustments for data types, setting and data type refresh speeds, and visual customization (data appearance).

## Style Guidelines:

- Dark theme with a background color of desaturated blue-gray (#232931).
- Primary color: Aqua blue (#00FFFF) for interactive elements and key data points.
- Accent color: A contrasting magenta (#FF00FF) to highlight alerts and critical data.
- Font: 'Inter', a grotesque-style sans-serif, used for both headlines and body text.
- Use rounded cards (border-radius: 12px) with soft shadows (box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2)) for data presentation.
- Implement smooth fade transitions on card updates and sliding animations on the chart for new data points.