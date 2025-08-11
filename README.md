# Vehicle Management Application

This application is developed as a test project using **React** and **TypeScript**. For state management, it uses **Redux Toolkit** (including **RTK Query** for REST API integration), and form validation is handled through **React Hook Form**. The backend is powered by Supabase.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [REST API](#rest-api)

---

## Features

- **Vehicle & Model Overview**
  - List/grid view with paging, sorting, and filtering (via REST API)
  - Filter state is automatically saved and re-applied when reopening the page
- **CRUD Operations**
  - Create, edit, and delete vehicles and models
  - Form validation via React Hook Form
- **Routing**
  - Each functionality/page has its own route (React Router-based)

---

## Project Structure

src/
|-- components/ # Global reusable components
|-- pages/ # Route-based pages
|-- store/ # Redux configuration and slices
|-- api/ # Backend communication services (RTK Query)
|-- utils/ # Utility functions and types


File and component names follow the [Airbnb naming convention](https://github.com/airbnb/javascript/tree/master/react#naming).

---

## Getting Started

1. Clone the repository:
    ```
    git clone <repo-url>
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Start the development server:
    ```
    npm start
    ```

To configure Supabase API, add your API key and URL in the `.env` file.

---

## REST API

All data is stored and accessed through RTK Query services, communicating with the Supabase backend:

- **VehicleMake**: `Id`, `Name`, `Abrv`
- **VehicleModel**: `Id`, `MakeId`, `Name`, `Abrv`
    - The field `MakeId` links models to their manufacturer

All CRUD operations, sorting, filtering, and paging are performed via REST API.

---
