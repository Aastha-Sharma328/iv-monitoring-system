# IV Monitoring System

An IoT-based healthcare monitoring solution designed to continuously monitor Intravenous (IV) fluid levels and provide real-time alerts to medical staff before the IV bottle becomes empty.

The system aims to reduce manual monitoring efforts, prevent delayed bottle replacement, and improve patient safety in hospitals and healthcare facilities.

# Table of Contents

- Overview
- Problem Statement
- Objectives
- Features
- System Architecture
- Tech Stack
- Hardware Components
- Project Structure
- Installation Guide
- Usage
- Screenshots
- Future Scope
- Contributors
- License

# Overview

Traditional IV fluid monitoring requires nurses or hospital staff to manually inspect IV bottles periodically. This process can be inefficient, especially in high-patient environments.

The IV Monitoring System automates this process by collecting sensor data, processing it using embedded hardware, storing information in a database, and displaying real-time status through an interactive web dashboard.

# Problem Statement

Hospitals often face challenges such as:

- Continuous manual monitoring of IV bottles
- Increased workload on nursing staff
- Delays in replacing empty IV bottles
- Risk of blood backflow
- Lack of centralized monitoring

This project addresses these challenges through an automated monitoring system.

# Objectives

- Monitor IV fluid levels in real time
- Generate alerts before the bottle becomes empty
- Reduce dependency on manual inspection
- Improve patient safety
- Provide centralized monitoring dashboards
- Enable remote supervision of patients

# Features

### Authentication System
- Secure Login
- Role-based access
- Admin Dashboard
- Doctor Dashboard

### Patient Management
- View patient details
- Track IV status
- Patient cards interface

### Alerts System
- Active alerts section
- Low fluid notifications
- Critical condition indicators

### Dashboard
- Real-time monitoring
- Statistics overview
- Recent activity tracking
- Responsive design

### Future Features
- SMS notifications
- Mobile application
- AI prediction system
- Historical analytics
- Cloud integration

# System Architecture

Sensor Data Collection
↓
ESP32 Microcontroller
↓
Backend API
↓
Database
↓
Web Dashboard
↓
Doctors / Medical Staff

# Tech Stack

## Frontend

- React.js
- TypeScript
- Tailwind CSS
- Vite

## Backend

- Node.js
- Express.js
- Supabase

## Database

- PostgreSQL (Supabase)

## Hardware

- ESP32
- Load Cell Sensor
- HX711 Amplifier
- IV Bottle Setup
- GSM/4G Module *(Future Integration)*

# Hardware Components

ESP32: Data processing 
Load Cell: Weight measurement 
HX711: Sensor amplification 
GSM Module: Alert communication 
Power Supply: System operation


# Project Structure

iv-monitoring-system/

├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/

├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   └── database/

├── README.md
├── LICENSE
└── .gitignore

# Future Scope

- Hospital-wide deployment
- Predictive analytics
- AI-assisted monitoring
- Mobile notifications
- Integration with Electronic Health Records (EHR)
- Cloud-based monitoring system
