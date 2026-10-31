/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const _ = window._;

export const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess',
  'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics',
];

export const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export function formatAndMergeUsers(randomUserMock = [], additionalUsers = []) {
  const allUsers = _.map([...randomUserMock, ...additionalUsers], (user) => ({
    gender: user.gender ? `${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1)}` : 'Unknown',
    title: user.name?.title || user.title || '',
    full_name: user.full_name || `${user.name?.first || ''} ${user.name?.last || ''}`.trim(),
    city: user.location?.city || user.city || 'Unknown',
    state: user.location?.state || user.state || 'Unknown',
    country: user.location?.country || user.country || 'Unknown',
    postcode: user.location?.postcode || user.postcode || '',
    coordinates: user.location?.coordinates || user.coordinates || { latitude: '48.3794', longitude: '31.1656' },
    timezone: user.location?.timezone || user.timezone || { offset: '', description: '' },
    email: user.email || '',
    b_date: user.dob?.date || user.b_date || '1990-01-01T00:00:00.000Z',
    age: user.dob?.age || user.age || 30,
    phone: user.phone || '',
    picture_large: user.picture?.large || user.picture_large || '',
    picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || '',
    id: user.id?.value || user.id || generateId(),
    favorite: _.defaultTo(user.favorite, false),
    course: user.course || _.sample(COURSES),
    bg_color: user.bg_color || '#ffffff',
    note: user.note || 'No notes',
  }));

  return _.uniqBy(allUsers, 'email');
}

export function validateUser(user) {
  const isCapitalizedString = (str) => typeof str === 'string' && /^[A-ZА-ЯІЇЄҐ]/.test(str);
  const stringFields = ['full_name', 'gender', 'note', 'state', 'city', 'country'];

  const isValidStrings = _.every(stringFields, (field) => isCapitalizedString(user[field]));
  if (!isValidStrings) return false;

  if (typeof user.age !== 'number' || Number.isNaN(user.age)) return false;

  const phoneRegex = /^[+\d\s-()]+$/;
  if (typeof user.phone !== 'string' || !phoneRegex.test(user.phone)) return false;

  if (typeof user.email !== 'string' || !user.email.includes('@')) return false;

  return true;
}

export function filterUsers(users, filters = {}) {
  const activeFilters = _.omitBy(filters, (val) => val === undefined || val === 'All' || val === '');
  return _.filter(users, _.matches(activeFilters));
}

export function sortUsers(users, sortBy, order = 'asc') {
  if (sortBy === 'b_day' || sortBy === 'b_date') {
    return _.orderBy(users, [(u) => new Date(u.b_date).getTime()], [order]);
  }
  return _.orderBy(users, [sortBy], [order]);
}

export function findUser(users, searchParam) {
  const [key, value] = _.toPairs(searchParam)[0];
  if (key === 'name') {
    return _.find(users, (u) => _.includes(_.toLower(u.full_name), _.toLower(value)));
  }
  if (key === 'note') {
    return _.find(users, (u) => _.includes(_.toLower(u.note), _.toLower(value)));
  }
  return _.find(users, { [key]: value });
}
