const books = []
const RENDER_BOOKS = 'render-books'
const SAVED_BOOKS = 'saved-books';
const STORAGE_KEY = 'BOOKS_SHELF_APPS';

document.addEventListener('DOMContentLoaded',() => {
    const submitBooks = document.getElementById('inputBook')
    submitBooks.addEventListener('submit',(ev)=> {
        ev.preventDefault();
        addBook();
    })
    if(isStorageExist()) {
        loadDataFromStorage();
    }
})

function searchBookTitle(books,title) {
  for(let book of books) {
    if(book.title.includes(title)) {
      searchedBooks.push(book)
    }
  }
}

//fungsi untuk menambahkan objek buku pada array of books
function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, bookTitle, bookAuthor, bookYear, isCompleted);
    books.push(bookObject)

    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
}

//fungsi untuk membuat id unik untuk setiap objek
function generateId() {
    return +new Date()
}

//fungsi untuk membuat objek buku berdasarkan input user
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

//menambahkan event RENDER_BOOKS untuk memfilter buku dan amenambahkan ke completed / uncompleted list 
document.addEventListener(RENDER_BOOKS, () => {
    const uncompletedBookShelf = document.getElementById('incompleteBookshelfList')
    uncompletedBookShelf.innerHTML = ''

    const completedBookShelf = document.getElementById('completeBookshelfList');
    completedBookShelf.innerHTML = ''

    for(const book of books) {
      const bookElement = createBook(book);
      if(!book.isCompleted) {
          uncompletedBookShelf.append(bookElement)
      } else {
          completedBookShelf.append(bookElement)
      }
    }

});

//fungsi untuk menemukan index buku
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

//fungsi untuk menghapus buku
function removeBook(bookId,title) {
    const targetBook = findBookIndex(bookId);
   
    if (targetBook === -1) return;
    const answer = confirm(`Apakah anda yakin ingin menghapus buku dengan judul ${title}?`)
    if(answer) {
      books.splice(targetBook, 1);
      alert(`Buku dengan judul ${title} telah dihapus!`)
    } else {
      return
    }
    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
}

//fungsi untuk mengubah buku dari completed -> uncompleted
function undoBookFromCompleted(bookId) {
    const targetBook = findBook(bookId);
   
    if (targetBook == null) return;
   
    targetBook.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
}

//fungsi untuk menampilkan buku 
function createBook(bookObject) {
    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book-card');

    const bookImage = document.createElement('img');
    bookImage.setAttribute('src','./images/bookPic.jpeg');
    bookImage.setAttribute('id','image')
    bookContainer.appendChild(bookImage)

    const title = document.createElement('h3');
    title.innerText = bookObject.title;
    bookContainer.appendChild(title);
   
    const author = document.createElement('p');
    author.innerText = `${bookObject.author}`;
    author.style.fontSize='14px'
    bookContainer.appendChild(author)

    const bookYear = document.createElement('p');
    bookYear.innerText = `${bookObject.year}`;
    bookYear.style.color="#7f8798"
    bookYear.style.fontSize='12px'
    bookYear.style.fontWeight='bold'
    bookContainer.appendChild(bookYear)

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('action');

    const isRead = document.createElement('button')
    const readStatus = document.createElement('i')
    isRead.appendChild(readStatus)
    readStatus.classList.add('fa-solid')
    readStatus.classList.add(bookObject.isCompleted? 'fa-xmark' : 'fa-check')

    const deleteBook = document.createElement('button')
    const deleteSymbol = document.createElement('i')
    deleteBook.appendChild(deleteSymbol)
    deleteSymbol.classList.add('fa-solid')
    deleteSymbol.classList.add('fa-trash')

    deleteBook.addEventListener('click', () => {
      removeBook(bookObject.id,bookObject.title);
    });

    btnContainer.appendChild(isRead)
    btnContainer.appendChild(deleteBook)
    bookContainer.appendChild(btnContainer)
   
    if (bookObject.isCompleted) {
        isRead.addEventListener('click', () => {
          undoBookFromCompleted(bookObject.id);
        });

      } else {
        isRead.addEventListener('click', () => {
          addBookToCompleted(bookObject.id);
        });
      }

    return bookContainer
  }

  function findBook(bookId) {
    for (const book of books) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }

  function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_BOOKS));
    }
  }

  function isStorageExist() /* boolean */ {
    if (typeof(Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_BOOKS,() => {
    console.log(localStorage.getItem(STORAGE_KEY));
    alert("Perubahan Disimpan")
  });

  document.addEventListener(RENDER_BOOKS,() => {
    console.log("Memuat ulang Rak Buku");
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_BOOKS));
  }





