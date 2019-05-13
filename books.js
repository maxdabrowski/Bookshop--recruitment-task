/*..........................POBRANIE DANYCH Z PLIKU books.json ...............................*/
fetch("./books.json")
  .then(function(response) {
    return response.json();
  })
  .then(responseObj => {
    const booksObj = responseObj;
    let books = booksObj;
    const booksFromJSON = [...booksObj];

    /*..............................WYŚWIETLANIE OKNA MODALNEGO ..............................*/
    const modal = document.getElementById("modal");
    const close = document.getElementById("close");
    const modalImg = document.getElementById("modalImg");

    window.addEventListener("click", function(e) {
      if (e.target.dataset.modal === "yes") {
        modal.style.display = "block";
        modalImg.setAttribute("src", event.target.dataset.popup);
      }
    });
    close.addEventListener("click", function() {
      modal.style.display = "none";
    });
    window.addEventListener("click", function(e) {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    });

    /*...................... SORTOWANIE ZALEŻNE OD PRZEKAZANEGO PARAMETRU.................. */
    function sortBooks(param) {
      books.sort(function(obj1, obj2) {
        if (param === "pages") {
          return obj1.pages - obj2.pages;
        }
        if (param === "date") {
          if (
            parseInt(obj1.releaseDate.substring(obj1.releaseDate.length - 4)) <
            parseInt(obj2.releaseDate.substring(obj2.releaseDate.length - 4))
          )
            return -1;
          if (
            parseInt(obj1.releaseDate.substring(obj1.releaseDate.length - 4)) <
            parseInt(obj2.releaseDate.substring(obj2.releaseDate.length - 4))
          )
            return 1;
          if (
            parseInt(
              obj1.releaseDate.substring(obj1.releaseDate.length - 4)
            ) ===
            parseInt(obj2.releaseDate.substring(obj2.releaseDate.length - 4))
          ) {
            if (
              parseInt(obj1.releaseDate.substring(0, 2)) <
              parseInt(obj2.releaseDate.substring(0, 2))
            )
              return -1;
            if (
              parseInt(obj1.releaseDate.substring(0, 2)) >
              parseInt(obj2.releaseDate.substring(0, 2))
            )
              return 1;
          }
        }
        if (param === "author") {
          if (
            obj1.author.substring(
              obj1.author.indexOf(" "),
              obj1.author.length
            ) <
            obj2.author.substring(obj2.author.indexOf(" "), obj2.author.length)
          )
            return -1;
          if (
            obj1.author.substring(
              obj1.author.indexOf(" "),
              obj1.author.length
            ) >
            obj2.author.substring(obj2.author.indexOf(" "), obj2.author.length)
          )
            return 1;
          return 0;
        }
      });
      setCookie(books);
      return books;
    }

    /*..............................FILTROWANIE PO ILOŚCI STRON......................... */
    function filterBooks() {
      const pages = document.getElementById("input").value;
      books = booksFromJSON.filter(function(obj) {
        return obj.pages > pages;
      });
      if (books.length === 0) {
        filterEmpty();
      }
      setCookie(books);
      return books;
    }

    /*....................GENEROWANIE NAPISU  BRAK WYNIKÓW WYSZUKIWANIA.................*/
    function filterEmpty() {
      const listElement = document.createElement("li");
      listElement.classList.add("empty");
      listElement.innerHTML = "brak wyników wyszukiwania";
      const list = document.getElementById("bookList");
      list.appendChild(listElement);
    }

    /*..........USUNIĘCIE SORTOWANIA I FILTRA I GENROWANIE STANU POCZĄTKOWEGO...........*/
    function clearAll() {
      const sortRadio = document.querySelectorAll('input[name="sort"]');
      for (let i = 0; i < sortRadio.length; i++) {
        sortRadio[i].checked = false;
      }
      document.getElementById("input").value = "";
      books = [...booksFromJSON];
      cleanHTML();
      generateBooksInHTML(books);
      setCookie(books);
    }

    /*......................USUWANIE ELEMENTÓW LISTY W HTML .............................*/
    function cleanHTML() {
      const clean = document.getElementById("bookList");
      while (clean.firstChild) {
        clean.removeChild(clean.firstChild);
      }
    }

    /*............................TWORZENIE CIASTECZKA  ............................... */
    function setCookie(booksToCokkie) {
      const booksToCookieJSON = JSON.stringify(booksToCokkie);
      document.cookie = `books = ${booksToCookieJSON}`;
    }

    /*................OBSŁUGA SORTOWANIA W ZALEŻNOŚCI OD RADIO BUTOWA...................*/
    function checkRadio() {
      const sortRadio = document.querySelectorAll('input[name="sort"]');
      for (let i = 0; i < sortRadio.length; i++) {
        if (sortRadio[i].checked) {
          cleanHTML();
          generateBooksInHTML(sortBooks(sortRadio[i].value));
          break;
        }
      }
    }

    /*...................... OBSŁUGA FILTROWANIA PO ILOŚCI  STRON..................... */
    function filterInput() {
      cleanHTML();
      generateBooksInHTML(filterBooks());
    }

    /*.............................GENEROWANIA CAŁEJ LISTY ........................... */

    function generateBooksInHTML(book) {
      book.map(generateBook);
    }

    /*......................GENEROWANIE JEDNEGO ELEMENTU LISTY........................ */
    function generateBook(obj) {
      /* element listy */
      const listElement = document.createElement("li");
      listElement.classList.add("listItem");

      /* div Z liczbą porządkową i zdjęciem */
      const image = document.createElement("div");
      image.classList.add("image");

      /* liczba porządkowa */
      const number = document.createElement("h1");
      number.classList.add("number");
      number.innerHTML = books.indexOf(obj) + 1;

      /* zdjęcie ksiązki z danymi do popupa */
      const bookImage = document.createElement("img");
      bookImage.setAttribute("data-modal", "yes");
      bookImage.setAttribute("data-popup", obj.cover.large);
      bookImage.setAttribute("src", obj.cover.small);

      /* div z danymi ksiązki */
      const bookDate = document.createElement("div");
      bookDate.classList.add("bookDate");

      /* tytuł */
      const title = document.createElement("h1");
      title.classList.add("title");
      title.innerHTML = obj.title;

      /* linia oddzielająca */
      const line = document.createElement("hr");
      line.classList.add("line");

      /* autor */
      const author = document.createElement("p");
      author.classList.add("author");
      author.innerHTML = obj.author;

      /* data */
      const date = document.createElement("span");
      date.classList.add("datePagesLink");
      date.innerHTML = `Release Date: ${obj.releaseDate}`;

      /* liczba stron */
      const bookPages = document.createElement("span");
      bookPages.classList.add("datePagesLink");
      bookPages.innerHTML = `Pages: ${obj.pages}`;

      /* link */
      const linkBook = document.createElement("span");
      linkBook.classList.add("datePagesLink");
      linkBook.innerHTML = "Link:";

      /* kotwica w linku*/
      const link = document.createElement("a");
      link.classList.add("link");
      link.setAttribute("href", obj.link);
      link.innerHTML = "shop";

      /* tworzenie zależności w DOM */
      const list = document.getElementById("bookList");
      list.appendChild(listElement);
      listElement.appendChild(image);
      image.appendChild(number);
      image.appendChild(bookImage);
      listElement.appendChild(bookDate);
      bookDate.appendChild(title);
      bookDate.appendChild(line);
      bookDate.appendChild(author);
      bookDate.appendChild(date);
      bookDate.appendChild(bookPages);
      bookDate.appendChild(linkBook);
      linkBook.appendChild(link);
    }

    /*........................OBSŁUGA ZDARZENIA NA WYCZYŚĆ I ALT + R .........................*/

    const button = document.getElementById("clear");
    button.addEventListener("click", clearAll);

    window.addEventListener("keydown", function(e) {
      if (e.altKey && e.keyCode === 82) {
        clearAll();
      }
    });

    /*..........................OBSŁUGA ZDARZENIA NA RADIO BUTTONY ................. */
    const sortRadio = document.querySelectorAll('input[name="sort"]');
    for (let i = 0; i < sortRadio.length; i++) {
      sortRadio[i].addEventListener("click", checkRadio);
    }

    /*..................OBSŁUGA ZDARZENIA NA INPUT DO SOTOWANIA .................... */
    const input = document.getElementById("input");
    input.addEventListener("keyup", filterInput);

    /*..................WYŚWIETLANIE STRONY NA POCZĄTKU LUB PO RZEŁADOWANIU  .................... */
    function generateDOM() {
      if (document.cookie.indexOf("books=") === -1) {
        generateBooksInHTML(booksFromJSON);
      } else {
        const cookie = document.cookie.substring(6);
        const cookieObj = JSON.parse(`${cookie}`);
        books = cookieObj;
        generateBooksInHTML(books);
      }
    }
    window.addEventListener("load", generateDOM);
  })
  .catch(error => console.log("błąd: ", error));
