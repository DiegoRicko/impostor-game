export type Category = {
  id: string
  name: string
  words: {
    word: string
    clue: string
  }[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'frutas',
    name: 'Frutas',
    words: [
      { word: 'Manzana', clue: 'Roja' },
      { word: 'Plátano', clue: 'Amarilla' },
    ],
  },
  {
    id: 'animales',
    name: 'Animales',
    words: [
      { word: 'Elefante', clue: 'Grande' },
      { word: 'Gato', clue: 'Traicionero' },
    ],
  },
]
