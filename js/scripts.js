document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()) {
        loadDataFromStorage();
    }
});

const booksQty = () => {
    const jumlahBuku = document.getElementById("jumlahBuku");
    jumlahBuku.innerText = books.length;
}

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
    booksQty();
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
    booksQty();
});