import API from "./api.js";

import state from "./state.js";

import {
    showToast,
    openModal,
    closeModals,
} from "./ui.js";


export async function loadBooks() {

    state.books =
        await API.getBooks(
            state.search
        );


    renderBooks();

    renderDashboardBooks();

}


function getFilteredBooks() {

    if (
        state.filter === "available"
    ) {

        return state.books.filter(
            book => book.available
        );

    }


    if (
        state.filter === "borrowed"
    ) {

        return state.books.filter(
            book => !book.available
        );

    }


    return state.books;

}


function createBookCard(book) {

    const status =
        book.available
            ? "Available"
            : "Borrowed";


    const action =
        book.available
            ? `
                <button
                    class="action-button borrow-button"
                    data-id="${book.id}"
                >
                    Borrow
                </button>
            `
            : `
                <button
                    class="action-button return-button"
                    data-id="${book.id}"
                    data-member="${book.borrowed_by}"
                >
                    Return
                </button>
            `;


    return `
        <article
            class="book-card"
        >

            <div
                class="book-cover"
            >
                ${book.title}
            </div>


            <h3>
                ${book.title}
            </h3>


            <p>
                ${book.author}
            </p>


            <div
                class="book-footer"
            >

                <span
                    class="status ${
                        book.available
                            ? "available"
                            : "borrowed"
                    }"
                >
                    ${status}
                </span>


                <div>

                    ${action}

                    <button
                        class="action-button delete-book"
                        data-id="${book.id}"
                    >
                        ×
                    </button>

                </div>

            </div>

        </article>
    `;

}


export function renderBooks() {

    const container =
        document.getElementById(
            "books-container"
        );


    const books =
        getFilteredBooks();


    if (!books.length) {

        container.innerHTML = `
            <p>
                No books found.
            </p>
        `;

        return;

    }


    container.innerHTML =
        books
            .map(createBookCard)
            .join("");

}


export function renderDashboardBooks() {

    const container =
        document.getElementById(
            "dashboard-books"
        );


    container.innerHTML =
        state.books
            .slice(-4)
            .reverse()
            .map(createBookCard)
            .join("");

}


export function setupBookEvents(
    refresh
) {

    document.addEventListener(
        "click",
        async event => {

            const borrowButton =
                event.target.closest(
                    ".borrow-button"
                );


            const returnButton =
                event.target.closest(
                    ".return-button"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-book"
                );


            if (borrowButton) {

                state.selectedBook =
                    Number(
                        borrowButton.dataset.id
                    );


                renderBorrowMembers();

                openModal(
                    "borrow-modal"
                );

            }


            if (returnButton) {

                try {

                    await API.returnBook(
                        returnButton.dataset.id,
                        returnButton.dataset.member
                    );


                    showToast(
                        "Book returned successfully."
                    );


                    refresh();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }


            if (deleteButton) {

                try {

                    await API.deleteBook(
                        deleteButton.dataset.id
                    );


                    showToast(
                        "Book removed."
                    );


                    refresh();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }

        }
    );


    document
        .getElementById(
            "book-form"
        )
        .addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const title =
                    document
                        .getElementById(
                            "book-title"
                        )
                        .value;


                const author =
                    document
                        .getElementById(
                            "book-author"
                        )
                        .value;


                try {

                    await API.addBook({
                        title,
                        author,
                    });


                    event.target.reset();

                    closeModals();

                    showToast(
                        "New book added."
                    );


                    refresh();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

}


export function renderBorrowMembers() {

    const container =
        document.getElementById(
            "borrow-members"
        );


    const book =
        state.books.find(
            item =>
                item.id ===
                state.selectedBook
        );


    document
        .getElementById(
            "borrow-book-title"
        )
        .textContent =
        book?.title || "Select member";


    container.innerHTML =
        state.members
            .map(
                member => `
                    <button
                        class="member-option"
                        data-member-id="${member.id}"
                    >
                        <strong>
                            ${member.name}
                        </strong>

                        <br>

                        <small>
                            ${member.borrowed_count}
                            borrowed books
                        </small>

                    </button>
                `
            )
            .join("");


    container
        .querySelectorAll(
            ".member-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    try {

                        await API.borrowBook(
                            state.selectedBook,
                            button.dataset.memberId
                        );


                        closeModals();

                        showToast(
                            "Book borrowed successfully."
                        );


                        window.refreshLibrary();

                    } catch (error) {

                        showToast(
                            error.message,
                            "error"
                        );

                    }

                }
            );

        });

}