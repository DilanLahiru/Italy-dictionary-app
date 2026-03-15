/**
 * Home screen constants and data
 */

const book = require('../assets/images/book.png');
const home = require('../assets/images/home.png');
const fruits = require('../assets/images/fruits.png');
const vehicle = require('../assets/images/vehicle.png');
const notification = require('../assets/images/notification.png');
const user = require('../assets/images/avatar.png');
const favorites = require('../assets/images/favorite.png');
const settings = require('../assets/images/setting.png');
const dictionary = require('../assets/images/dictionary.png');

export const LANGUAGES = ['Italy', 'Sinhala', 'English'];

export const LEARNING_CATEGORIES = [
  { id: 'atoz', icon: book, label: 'A - Z' },
  { id: 'house', icon: home, label: 'House' },
  { id: 'food', icon: fruits, label: 'Food' },
  { id: 'vehicle', icon: vehicle, label: 'Vehicle' },
];

export const HOME_TAB_ITEMS = [
  { id: 'home', label: 'Home', icon: home },
  { id: 'favorites', label: 'Favorites', icon: favorites },
  { id: 'settings', label: 'Settings', icon: settings },
];

export const ASSETS = {
  home,
  notification,
  user,
  favorites,
  settings,
  dictionary,
};
