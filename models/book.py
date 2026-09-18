class Book:
    _id_counter = 1

    def __init__(self, title, author):
        self.id = Book._id_counter
        Book._id_counter += 1

        self.title = title
        self.author = author
        self.available = True
        self.borrowed_by = None

    def borrow(self, member):
        self.available = False
        self.borrowed_by = member.id

    def return_book(self):
        self.available = True
        self.borrowed_by = None

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "available": self.available,
            "borrowed_by": self.borrowed_by,
        }

    def __str__(self):
        status = "Available" if self.available else "Borrowed"
        return f"{self.title} - {self.author} ({status})"