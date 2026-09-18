class Member:
    _id_counter = 1

    def __init__(self, name):
        self.id = Member._id_counter
        Member._id_counter += 1

        self.name = name
        self.borrowed_books = []

    def borrow_book(self, book):
        if book not in self.borrowed_books:
            self.borrowed_books.append(book)

    def return_book(self, book):
        if book in self.borrowed_books:
            self.borrowed_books.remove(book)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "borrowed_books": [
                book.to_dict()
                for book in self.borrowed_books
            ],
            "borrowed_count": len(self.borrowed_books),
        }

    def __str__(self):
        return self.name