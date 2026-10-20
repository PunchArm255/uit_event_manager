# UIT Event Manager

<img width="1431" height="707" alt="Screenshot 2026-10-20 at 6 16 19 PM" src="https://github.com/user-attachments/assets/384230f2-b2b2-4b41-9ff2-8802fdac6b0a" />

A minimalist academic event management and QR badge platform built for **Ibn Tofaïl University (Faculty of Sciences, Kénitra)**.

Developed for the **J2E** course under Master **GLCC** (*Software Engineering for Cloud Computing*).

**Author:** Mohammed NASSIRI ([GitHub](https://github.com/puncharm255) • [LinkedIn](https://linkedin.com/in/simonassiri))

---

## Overview

UIT Event Manager is a lightweight full-stack application designed to manage departmental seminars, workshops, and student attendance. It pairs a **Spring Boot 3** REST backend with a **React 19 + Tailwind CSS** frontend inspired by Notion's typography and clean spacing.

### Features
* **Student Portal:** Browse academic conferences, filter by topic (Cloud, AI, Security, etc.), register in one click, and access upcoming event passes.
* **Admin Dashboard:** Manage events, track attendees, and validate or invalidate check-ins on the fly.
* **QR Badge Generator:** Generates printable academic badges with scannable cryptographic QR codes and instant PNG download.
* **Developer Tools:** Integrated Swagger UI (`/swagger-ui/index.html`) and embedded H2 SQL console (`/h2-console`).

---

## Tech Stack

* **Backend:** Java 21, Spring Boot 3, Spring Data JPA, H2 Database, SpringDoc OpenAPI
* **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, html2canvas, qrcode

---

## Quickstart

### Prerequisites
* JDK 21+
* Node.js 18+ (only needed for frontend development)

### Running the App
From the root directory:

```bash
./mvnw spring-boot:run
```

The application will start on **`http://localhost:8080`**.

### Frontend Development (Optional)
```bash
cd frontend
npm install
npm run dev
```
Runs the Vite dev server at `http://localhost:5173` with automatic API and tool proxying to `:8080`.

To rebuild the production static bundle:
```bash
cd frontend
npm run build
```

---

## Demo Accounts

The login screen includes quick 1-click credentials for testing and evaluation:

| Role | Email | Password | Identifier |
|---|---|---|---|
| **Student** | `mohammed.nassiri@uit.ac.ma` | `student123` | Mohammed NASSIRI (`GLCC-2026`) |
| **Admin** | `admin@uit.ac.ma` | `admin123` | Pr. Admin (Département Info) |

---

## API & Database

* **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
* **H2 Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  * **Driver:** `org.h2.Driver`
  * **JDBC URL:** `jdbc:h2:file:./data/eventdb;AUTO_SERVER=TRUE`
  * **User:** `sa`
  * **Password:** *(leave blank)*

### Endpoints Summary
* `POST /api/auth/login` — Authenticate user
* `POST /api/auth/signup` — Register student
* `GET /api/events` — List events
* `POST /api/events` — Create event
* `DELETE /api/events/{id}` — Delete event
* `GET /api/registrations` — List all registrations
* `GET /api/registrations/my` — Current student registrations
* `POST /api/registrations` — Register for an event
* `POST /api/registrations/{id}/checkin` — Validate attendance
* `POST /api/registrations/{id}/invalidate` — Invalidate attendance
* `GET /api/badges/verify/{badgeCode}` — Verify badge code
* `POST /api/badges/invalidate/{badgeCode}` — Invalidate badge by code
