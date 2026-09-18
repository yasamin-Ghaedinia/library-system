from models.exceptions import (
    BookAlreadyExistsError,
    BookNotAvailableError,
    BookNotFoundError,
    MemberAlreadyExistsError,
    MemberNotFoundError,
)


class Library:
    def __init__(self, name):
        self.name = name
        self.books = []
        self.members = []

    def add_book(self, title, author):
        for book in self.books:
            if book.title.lower() == title.lower():
                raise BookAlreadyExistsError(
                    "A book with this title already exists."
                )

        from models.book import Book

        book = Book(title, author)
        self.books.append(book)

        return book

    def remove_book(self, book_id):
        book = self.get_book(book_id)

        if not book.available:
            raise BookNotAvailableError(
                "Borrowed books cannot be removed."
            )

        self.books.remove(book)

        return book

    def get_book(self, book_id):
        for book in self.books:
            if book.id == book_id:
                return book

        raise BookNotFoundError("Book not found.")

    def find_books(self, query=""):
        query = query.lower().strip()

        if not query:
            return self.books

        return [
            book
            for book in self.books
            if query in book.title.lower()
            or query in book.author.lower()
        ]

    def add_member(self, name):
        for member in self.members:
            if member.name.lower() == name.lower():
                raise MemberAlreadyExistsError(
                    "A member with this name already exists."
                )

        from models.member import Member

        member = Member(name)
        self.members.append(member)

        return member

    def get_member(self, member_id):
        for member in self.members:
            if member.id == member_id:
                return member

        raise MemberNotFoundError("Member not found.")

    def borrow_book(self, member_id, book_id):
        member = self.get_member(member_id)
        book = self.get_book(book_id)

        if not book.available:
            raise BookNotAvailableError(
                "This book is already borrowed."
            )

        book.borrow(member)
        member.borrow_book(book)

        return book, member

    def return_book(self, member_id, book_id):
        member = self.get_member(member_id)
        book = self.get_book(book_id)

        if book not in member.borrowed_books:
            raise BookNotFoundError(
                "This member doesn't have this book."
            )

        book.return_book()
        member.return_book(book)

        return book, member

    def get_stats(self):
        total_books = len(self.books)

        available_books = len(
            [
                book
                for book in self.books
                if book.available
            ]
        )

        borrowed_books = total_books - available_books

        return {
            "total_books": total_books,
            "available_books": available_books,
            "borrowed_books": borrowed_books,
            "members": len(self.members),
        }