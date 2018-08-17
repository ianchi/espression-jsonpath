const data = require('./store.json');

const lastBook = [
  {
    category: 'fiction',
    author: 'J. R. R. Tolkien',
    title: 'The Lord of the Rings',
    isbn: '0-395-19395-8',
    price: 22.99,
  },
];
module.exports = [
  { qry: '$.store', res: [data.store] },
  { qry: '$..color', res: ['red'] },
  { qry: '$..book[?(@.price>10)].category', res: ['fiction', 'fiction'] },
  {
    qry: '$.store.book[*].author',
    res: ['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien'],
  },
  {
    qry: '$.store.book.*.author',
    res: ['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien'],
  },
  { qry: '$.store.book[-1:].isbn', res: ['0-395-19395-8'] },
  {
    qry: '$..[::-1].title',
    res: ['The Lord of the Rings', 'Moby Dick', 'Sword of Honour', 'Sayings of the Century'],
  },
  {
    qry: '$..author',
    res: ['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien'],
  },
  {
    qry: '$.store..price',
    res: [8.95, 12.99, 8.99, 22.99, 19.95],
  },
  {
    qry: '$..book[2]',
    res: [
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99,
      },
    ],
  },
  { qry: '$..book[-1:]', res: lastBook },
  { qry: '$..book[(@.length-1)]', res: lastBook },
  { qry: '$..book[-1]', res: lastBook },
  { qry: '$..[(4-1)]', res: lastBook },
  { qry: '$.store..[-10:1].title', res: ['Sayings of the Century'] },
  {
    qry: '$.store..[10::-1].title',
    res: ['The Lord of the Rings', 'Moby Dick', 'Sword of Honour', 'Sayings of the Century'],
  },
  {
    qry: '$..book[?(@.isbn)]',
    res: [
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99,
      },
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ],
  },
  { qry: '$..[?(@.color)]', res: [{ color: 'red', price: 19.95 }] },
];
