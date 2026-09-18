import API from "./api.js";

import state from "./state.js";

import {
    openModal,
    closeModals,
} from "./ui.js";

import {
    loadBooks,
    setupBookEvents,
    renderBooks,
} from "./books.js";

import {
    loadMembers,
    setupMemberEvents,
} from "./members.js";


async function loadStats() {

    const stats =
        await API.getStats();


    document
        .getElementById(
            "total-books"
        )
        .textContent =
        stats.total_books;


    document
        .getElementById(
            "available-books"
        )
        .textContent =
        stats.available_books;


    document
        .getElementById(
            "borrowed-books"
        )
        .textContent =
        stats.borrowed_books;


    document
        .getElementById(
            "total-members"
        )
        .textContent =
        stats.members;

}


async function refreshLibrary() {

    await Promise.all([
        loadStats(),
        loadMembers(),
        loadBooks(),
    ]);

}


window.refreshLibrary =
    refreshLibrary;


function setupNavigation() {

    document
        .querySelectorAll(
            "[data-view]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const view =
                        button.dataset.view;


                    document
                        .querySelectorAll(
                            ".view"
                        )
                        .forEach(item => {

                            item
                                .classList
                                .remove("active");

                        });


                    document
                        .getElementById(
                            `${view}-view`
                        )
                        .classList
                        .add("active");


                    document
                        .querySelectorAll(
                            "[data-view]"
                        )
                        .forEach(item => {

                            item
                                .classList
                                .toggle(
                                    "active",
                                    item.dataset.view ===
                                    view
                                );

                        });


                    document
                        .getElementById(
                            "page-title"
                        )
                        .textContent =
                        view.charAt(0)
                            .toUpperCase() +
                        view.slice(1);

                }
            );

        });


    document
        .querySelectorAll(
            "[data-go-books]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelector(
                            '[data-view="books"]'
                        )
                        .click();

                }
            );

        });

}


function setupModals() {

    document
        .getElementById(
            "open-book-modal"
        )
        .addEventListener(
            "click",
            () =>
                openModal(
                    "book-modal"
                )
        );


    document
        .getElementById(
            "open-member-modal"
        )
        .addEventListener(
            "click",
            () =>
                openModal(
                    "member-modal"
                )
        );


    document
        .getElementById(
            "modal-backdrop"
        )
        .addEventListener(
            "click",
            closeModals
        );


    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                closeModals
            );

        });

}


function setupSearch() {

    const search =
        document.getElementById(
            "book-search"
        );


    let timeout;


    search.addEventListener(
        "input",
        () => {

            clearTimeout(timeout);


            timeout =
                setTimeout(
                    async () => {

                        state.search =
                            search.value;


                        await loadBooks();

                    },
                    300
                );

        }
    );

}


function setupFilters() {

    document
        .querySelectorAll(
            ".filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.filter =
                        button.dataset.filter;


                    document
                        .querySelectorAll(
                            ".filter"
                        )
                        .forEach(item => {

                            item
                                .classList
                                .remove("active");

                        });


                    button
                        .classList
                        .add("active");


                    renderBooks();

                }
            );

        });

}


async function init() {

    setupNavigation();

    setupModals();

    setupSearch();

    setupFilters();

    setupBookEvents(
        refreshLibrary
    );

    setupMemberEvents(
        refreshLibrary
    );


    await refreshLibrary();

}


init();