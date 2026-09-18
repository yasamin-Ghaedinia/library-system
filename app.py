from flask import Flask, jsonify, render_template, request

from config import Config
from services.library import Library

from models.exceptions import (
    BookAlreadyExistsError,
    BookNotAvailableError,
    BookNotFoundError,
    MemberAlreadyExistsError,
    MemberNotFoundError,
)


app = Flask(__name__)

app.config.from_object(Config)

library = Library("Central Library")


def seed_data():
    books = [
        ("Python Crash Course", "Eric Matthes"),
        ("Clean Code", "Robert C. Martin"),
        ("Fluent Python", "Luciano Ramalho"),
        ("The Pragmatic Programmer", "Andrew Hunt"),
        ("Atomic Habits", "James Clear"),
        ("Deep Work", "Cal Newport"),
    ]

    members = [
        "Yasamin",
        "Amir",
        "Sara",
    ]

    for title, author in books:
        library.add_book(title, author)

    for name in members:
        library.add_member(name)


seed_data()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/stats")
def get_stats():
    return jsonify(
        library.get_stats()
    )


@app.route("/api/books")
def get_books():
    query = request.args.get("search", "")

    books = library.find_books(query)

    return jsonify(
        [
            book.to_dict()
            for book in books
        ]
    )


@app.route("/api/books", methods=["POST"])
def add_book():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    author = data.get("author", "").strip()

    if not title or not author:
        return jsonify(
            {"error": "Title and author are required."}
        ), 400

    try:
        book = library.add_book(title, author)

        return jsonify(book.to_dict()), 201

    except BookAlreadyExistsError as error:
        return jsonify(
            {"error": str(error)}
        ), 400


@app.route("/api/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    try:
        library.remove_book(book_id)

        return jsonify(
            {"message": "Book removed successfully."}
        )

    except (
        BookNotFoundError,
        BookNotAvailableError,
    ) as error:
        return jsonify(
            {"error": str(error)}
        ), 400


@app.route("/api/members")
def get_members():
    return jsonify(
        [
            member.to_dict()
            for member in library.members
        ]
    )


@app.route("/api/members", methods=["POST"])
def add_member():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()

    if not name:
        return jsonify(
            {"error": "Name is required."}
        ), 400

    try:
        member = library.add_member(name)

        return jsonify(member.to_dict()), 201

    except MemberAlreadyExistsError as error:
        return jsonify(
            {"error": str(error)}
        ), 400


@app.route(
    "/api/books/<int:book_id>/borrow",
    methods=["POST"],
)
def borrow_book(book_id):
    data = request.get_json(silent=True) or {}

    try:
        member_id = int(data.get("member_id"))
    except (TypeError, ValueError):
        return jsonify(
            {"error": "Valid member_id is required."}
        ), 400

    try:
        book, member = library.borrow_book(
            member_id,
            book_id,
        )

        return jsonify({
            "message": (
                f"{book.title} borrowed by "
                f"{member.name}."
            ),
            "book": book.to_dict(),
        })

    except (
        BookNotFoundError,
        BookNotAvailableError,
        MemberNotFoundError,
    ) as error:

        return jsonify(
            {"error": str(error)}
        ), 400



@app.route(
    "/api/books/<int:book_id>/return",
    methods=["POST"],
)
def return_book(book_id):
    data = request.get_json(silent=True) or {}

    try:
        member_id = int(data.get("member_id"))
    except (TypeError, ValueError):
        return jsonify(
            {"error": "Valid member_id is required."}
        ), 400

    try:
        book, member = library.return_book(
            member_id,
            book_id,
        )

        return jsonify({
            "message": (
                f"{book.title} returned successfully."
            ),
            "book": book.to_dict(),
        })

    except (
        BookNotFoundError,
        MemberNotFoundError,
    ) as error:

        return jsonify(
            {"error": str(error)}
        ), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify(
        {"error": "Not found."}
    ), 404


if __name__ == "__main__":
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
    )