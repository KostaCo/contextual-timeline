// Names and tags of groups
var timelineGroups = [
    { id: "books", content: "📚 Books" },
    { id: "history", content: "⚔️ History" }
];

// Items to be displayed in the timeline
var timelineItems = [
    // Books
    { id: 1, group: "books", content: "Ep o Gilgamešu", start: "-002100-01-01", end: "-001200-01-01", className: "book" },
    { id: 2, group: "books", content: "Stari zavet", start: "-001500-01-01", end: "-000400-01-01", className: "book" },
    { id: 3, group: "books", content: "The Art of War", start: "-000450-01-01", className: "book" },
    { id: 4, group: "books", content: "Meditacije", start: "0170-01-01", className: "book" },
    { id: 5, group: "books", content: "Hamlet", start: "1623-01-01", className: "book" },
    { id: 6, group: "books", content: "Tvrdica", start: "1668-01-01", className: "book" },
    { id: 7, group: "books", content: "Gulliver's Travels", start: "1726-01-01", className: "book" },
    { id: 8, group: "books", content: "Der Sandmann", start: "1816-01-01", className: "book" },
    { id: 9, group: "books", content: "Frankenstein", start: "1818-01-01", className: "book" },
    { id: 10, group: "books", content: "Evgenije Onjegin", start: "1833-01-01", className: "book" },
    { id: 11, group: "books", content: "Le Père Goriot", start: "1835-01-01", className: "book" },
    { id: 12, group: "books", content: "The Raven and other poems", start: "1845-11-19", className: "book" },
    { id: 13, group: "books", content: "Les Fleurs du mal", start: "1857-01-01", className: "book" },
    { id: 14, group: "books", content: "Alice's adventures in Wonderland", start: "1865-01-01", className: "book" },
    { id: 15, group: "books", content: "Zločin i kazna", start: "1866-01-01", className: "book" },
    { id: 16, group: "books", content: "Ana Karenjina", start: "1878-01-01", className: "book" },
    { id: 17, group: "books", content: "The Time Machine", start: "1895-01-01", className: "book" },
    { id: 18, group: "books", content: "The Invisible Man", start: "1897-01-01", className: "book" },
    { id: 19, group: "books", content: "Ujka Vanja", start: "1897-01-01", className: "book" },
    { id: 20, group: "books", content: "Dracula", start: "1897-05-26", className: "book" },
    { id: 21, group: "books", content: "The War of the Worlds", start: "1898-04-01", className: "book" },
    { id: 22, group: "books", content: "Heart of Darkness", start: "1899-02-01",  className: "book" },
    { id: 23, group: "books", content: "Nečista krv", start: "1910-01-01", className: "book" },
    { id: 24, group: "books", content: "The Metamorphosis", start: "1915-10-01", className: "book" },
    { id: 25, group: "books", content: "The Great Gatsby", start: "1925-04-10", className: "book" },
    { id: 26, group: "books", content: "Proces", start: "1925-01-01", className: "book" },
    { id: 27, group: "books", content: "Zamak", start: "1926-01-01", className: "book" },
    { id: 28, group: "books", content: "Seobe", start: "1929-01-01", className: "book" },
    { id: 29, group: "books", content: "The Burrow and Other Stories", start: "1931-01-01", className: "book" },
    { id: 30, group: "books", content: "Majstor i Margarita", start: "1934-01-01", className: "book" },
    { id: 31, group: "books", content: "Mit o Sizifu", start: "1942-01-01", className: "book" },
    { id: 32, group: "books", content: "Stranac", start: "1942-06-01", className: "book" },
    { id: 33, group: "books", content: "Mali princ", start: "1943-04-06", className: "book" },
    { id: 34, group: "books", content: "Na Drini ćuprija", start: "1945-01-01", className: "book" },
    { id: 35, group: "books", content: "Animal Farm", start: "1945-08-17", className: "book" },
    { id: 36, group: "books", content: "1984", start: "1949-06-08", className: "book" },
    { id: 37, group: "books", content: "Fahrenheit 451", start: "1953-10-19", className: "book" },
    { id: 38, group: "books", content: "Prokleta avlija", start: "1954-01-01", className: "book" },
    { id: 39, group: "books", content: "Lord of the Flies", start: "1954-09-17", className: "book" },
    { id: 40, group: "books", content: "Glasam za ljubav", start: "1962-01-01", className: "book" },
    { id: 41, group: "books", content: "Dune", start: "1965-08-01", className: "book" },
    { id: 42, group: "books", content: "Kad su cvetale tikve", start: "1968-01-01", className: "book" },
    { id: 43, group: "books", content: "Dune: Messiah", start: "1969-01-01", className: "book" },
    { id: 44, group: "books", content: "Children of Dune", start: "1976-01-01", className: "book" },
    { id: 45, group: "books", content: "The Sandman (Gaiman)", start: "1988-01-01", end: "1996-12-31", className: "book" },
    { id: 46, group: "books", content: "Harry Potter serijal", start: "1997-06-26", end: "2016-12-31", className: "book" },
    
    // History Events
    { id: 101, group: "history",  content: "Stari vek", start: "-003500-01-01", end: "0476-01-01", className: "history" },
    { id: 102, group: "history",  content: "Srednji vek", start: "0476-01-01", end: "1453-01-01", className: "history" },
    { id: 103, group: "history",  content: "Novi vek", start: "1453-01-01", end: "1914-01-01", className: "history" },
    { id: 104, group: "history",  content: "Savremeno doba", start: "1914-01-01", end: "2026-01-01", className: "history" },

];