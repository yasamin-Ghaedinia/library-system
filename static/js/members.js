import API from "./api.js";

import state from "./state.js";

import {
    closeModals,
    showToast,
} from "./ui.js";


export async function loadMembers() {

    state.members =
        await API.getMembers();


    renderMembers();

}


export function renderMembers() {

    const container =
        document.getElementById(
            "members-container"
        );


    if (!state.members.length) {

        container.innerHTML =
            "<p>No members yet.</p>";

        return;

    }


    container.innerHTML =
        state.members
            .map(
                member => {

                    const books =
                        member.borrowed_books
                            .map(
                                book =>
                                    book.title
                            )
                            .join(", ");


                    return `
                        <article
                            class="member-card"
                        >

                            <div
                                class="member-avatar"
                            >
                                ${member.name
                                    .charAt(0)
                                    .toUpperCase()
                                }
                            </div>


                            <h3>
                                ${member.name}
                            </h3>


                            <p>
                                ${member.borrowed_count}
                                borrowed books
                            </p>


                            <div
                                class="member-books"
                            >

                                <span>
                                    Currently reading
                                </span>


                                <strong>
                                    ${
                                        books ||
                                        "Nothing right now"
                                    }
                                </strong>

                            </div>

                        </article>
                    `;

                }
            )
            .join("");

}


export function setupMemberEvents(
    refresh
) {

    document
        .getElementById(
            "member-form"
        )
        .addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "member-name"
                        )
                        .value;


                try {

                    await API.addMember({
                        name,
                    });


                    event.target.reset();

                    closeModals();

                    showToast(
                        "New member added."
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