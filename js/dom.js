const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function makeBook(data, writer, timestamp, isCompleted) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = data;

    const textWriter = document.createElement("h3");
    textWriter.innerText = writer;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = timestamp;
    
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textWriter, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);

    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(createCheckButton());
        container.append(createTrashButton());
    }

    return container;
}

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

    const textBook = document.getElementById("title").value;
    const textAuthor = document.getElementById("author").value;
    const timestamp = document.getElementById("date").value;

    const book = makeBook(textBook, textAuthor, timestamp, false);
    const bookObject = composedBookObject(textBook, textAuthor, timestamp, false);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedBOOKList.append(book);
    updateDataToStorage();

    window.alert("Anda berhasil menambahkan buku");
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner > h2").innerText;
    const bookAuthor = bookElement.querySelector(".inner > h3").innerText;
    const bookTimestamp = bookElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookTimestamp, true);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    
    bookElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner > h2").innerText;
    const bookAuthor = bookElement.querySelector(".inner > h3").innerText;
    const bookTimestamp = bookElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookTimestamp, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for (book of books) {
        const newBook = makeBook(book.task, book.author, book.timestamp, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}



function createTrashButton() {
    return createButton("trash-button", function (event) {
        var answer = window.confirm("Apa Anda yakin ingin menghapus buku ini?");

        if(answer == true) {
            removeBookFromCompleted(event.target.parentElement);
        }else {
            return;
        }
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}