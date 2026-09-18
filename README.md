# 📚 Library Management System

A lightweight library management system built with **Flask**, featuring a REST API backend and a vanilla JavaScript frontend. It allows you to manage books and members, track borrowing/returning of books, and view real-time library statistics.

>  **Note:** This project is not currently deployed to a live server. It was previously hosted but is no longer online. All the source code is complete and fully functional — you can run it locally by following the instructions below.

##  Features

- Add, search, and remove books
- Add and manage library members
- Borrow and return books, with availability tracking
- Prevents duplicate books/members and invalid operations (e.g., removing a borrowed book, double-borrowing)
- Live library statistics (total books, available/borrowed counts, member count)
- Simple REST API that separates backend logic from the frontend

##  Tech Stack

- **Backend:** Python, Flask
- **Server:** Gunicorn (for production use)
- **Config:** python-dotenv for environment variables
- **Frontend:** HTML, CSS, JavaScript (vanilla — no framework)
- **Data storage:** In-memory (data resets when the server restarts; no database is used)

##  Project Structure

```
library/
├── app.py                  # Flask app & API routes
├── config.py                # App configuration (host, port, debug)
├── requirements.txt
├── .env.example              # Sample environment variables
├── models/
│   ├── book.py               # Book model
│   ├── member.py              # Member model
│   └── exceptions.py           # Custom exceptions
├── services/
│   └── library.py             # Core library logic (business rules)
└── static/
    ├── templates/index.html
    ├── css/
    └── js/
```

##  Getting Started

### Prerequisites

- Python 3.10+ installed

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd library
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to change the host, port, or debug mode.

5. Run the app:
   ```bash
   python app.py
   ```

6. Open your browser and go to:
   ```
   http://localhost:8000
   ```

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/stats` | Get library statistics |
| GET    | `/api/books` | List all books (supports `?search=` query) |
| POST   | `/api/books` | Add a new book |
| DELETE | `/api/books/<book_id>` | Remove a book |
| GET    | `/api/members` | List all members |
| POST   | `/api/members` | Add a new member |
| POST   | `/api/books/<book_id>/borrow` | Borrow a book |
| POST   | `/api/books/<book_id>/return` | Return a book |

##  Notes

- The app comes pre-seeded with a few sample books and members on startup, so it's ready to explore right away.
- Since data is stored in memory, all changes are lost when the server restarts. Adding a database (e.g., SQLite) would be a natural next step.

##  License

This project currently has no license specified. Feel free to use it for learning purposes.
