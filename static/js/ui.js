export function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "toast-container"
        );


    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type === "error" ? "error" : ""}`;


    toast.textContent =
        message;


    container.appendChild(toast);


    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateX(30px)";


        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);

}


export function openModal(id) {

    document
        .getElementById(
            "modal-backdrop"
        )
        .classList
        .add("active");


    document
        .getElementById(id)
        .classList
        .add("active");

}


export function closeModals() {

    document
        .getElementById(
            "modal-backdrop"
        )
        .classList
        .remove("active");


    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal
                .classList
                .remove("active");

        });

}