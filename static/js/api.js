const API = {

    async request(
        url,
        options = {}
    ) {

        const response =
            await fetch(
                url,
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    ...options,
                }
            );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.error ||
                "Something went wrong."
            );
        }


        return data;

    },


    getStats() {
        return this.request(
            "/api/stats"
        );
    },


    getBooks(search = "") {

        const params =
            new URLSearchParams();

        if (search) {
            params.set(
                "search",
                search
            );
        }


        return this.request(
            `/api/books?${params}`
        );

    },


    addBook(data) {

        return this.request(
            "/api/books",
            {
                method: "POST",

                body:
                    JSON.stringify(data),
            }
        );

    },


    deleteBook(id) {

        return this.request(
            `/api/books/${id}`,
            {
                method: "DELETE",
            }
        );

    },


    getMembers() {

        return this.request(
            "/api/members"
        );

    },


    addMember(data) {

        return this.request(
            "/api/members",
            {
                method: "POST",

                body:
                    JSON.stringify(data),
            }
        );

    },


    borrowBook(
        bookId,
        memberId
    ) {

        return this.request(
            `/api/books/${bookId}/borrow`,
            {
                method: "POST",

                body:
                    JSON.stringify({
                        member_id:
                            memberId,
                    }),
            }
        );

    },


    returnBook(
        bookId,
        memberId
    ) {

        return this.request(
            `/api/books/${bookId}/return`,
            {
                method: "POST",

                body:
                    JSON.stringify({
                        member_id:
                            memberId,
                    }),
            }
        );

    },

};


export default API;