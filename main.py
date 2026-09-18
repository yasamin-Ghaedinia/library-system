from book import Book
from member import Member
from library import Library
from exceptions import (
    BookAlreadyExistsError,
    BookNotAvailableError,
    BookNotFoundError,
)

library = Library("Central Library")

book1 = Book("Python Crash Course", "Eric Matthes")
book2 = Book("Clean Code", "Robert C. Martin")
book3 = Book("Fluent Python", "Luciano Ramalho")

library.add_book(book1)
library.add_book(book2)
library.add_book(book3)

yasamin = Member("Yasamin")
amir = Member("Amir")

library.show_books()

print()

try:
    library.borrow_book(yasamin, "Clean Code")
    library.borrow_book(amir, "Clean Code")
except (
    BookAlreadyExistsError,
    BookNotAvailableError,
    BookNotFoundError,
) as error:
    print(error)

print()

yasamin.show_books()

print()

library.show_books()

print()

try:
    library.return_book(yasamin, "Clean Code")
except BookNotFoundError as error:
    print(error)

print()

library.show_books()

print()

yasamin.show_books()