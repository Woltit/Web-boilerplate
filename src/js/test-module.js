/* eslint-disable linebreak-style */
export const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess',
  'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics',
];

export const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export function formatAndMergeUsers(randomUserMock = [], additionalUsers = []) {
  const formatUser = (user) => ({
    gender: user.gender ? `${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1)}` : 'Unknown',
    title: user.name?.title || user.title || '',
    full_name: user.full_name || `${user.name?.first || ''} ${user.name?.last || ''}`.trim(),
    city: user.location?.city || user.city || 'Unknown',
    state: user.location?.state || user.state || 'Unknown',
    country: user.location?.country || user.country || 'Unknown',
    postcode: user.location?.postcode || user.postcode || '',
    coordinates: user.location?.coordinates || user.coordinates || { latitude: '', longitude: '' },
    timezone: user.location?.timezone || user.timezone || { offset: '', description: '' },
    email: user.email || '',
    b_date: user.dob?.date || user.b_date || '',
    age: user.dob?.age || user.age || null,
    phone: user.phone || '',
    picture_large: user.picture?.large || user.picture_large || '',
    picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || '',
    id: user.id?.value || user.id || generateId(),
    favorite: user.favorite !== undefined ? user.favorite : false,
    course: user.course || COURSES[Math.floor(Math.random() * COURSES.length)],
    bg_color: user.bg_color || '#ffffff',
    note: user.note || 'No notes',
  });

  const allUsers = [...randomUserMock, ...additionalUsers].map(formatUser);
  const uniqueUsers = [];
  const seenEmails = new Set();

  allUsers.forEach((user) => {
    if (user.email && !seenEmails.has(user.email)) {
      seenEmails.add(user.email);
      uniqueUsers.push(user);
    } else if (!user.email) {
      uniqueUsers.push(user);
    }
  });

  return uniqueUsers;
}

export function validateUser(user) {
  const isCapitalizedString = (str) => typeof str === 'string' && /^[A-ZА-ЯІЇЄҐ]/.test(str);
  const stringFields = ['full_name', 'gender', 'note', 'state', 'city', 'country'];

  const hasInvalidField = stringFields.some((field) => !isCapitalizedString(user[field]));
  if (hasInvalidField) return false;

  if (typeof user.age !== 'number' || Number.isNaN(user.age)) return false;

  const phoneRegex = /^[+\d\s-()]+$/;
  if (typeof user.phone !== 'string' || !phoneRegex.test(user.phone)) return false;

  if (typeof user.email !== 'string' || !user.email.includes('@')) return false;

  return true;
}

export function filterUsers(users, filters = {}) {
  return users.filter((user) => {
    let isMatch = true;
    if (filters.country !== undefined && user.country !== filters.country) isMatch = false;
    if (filters.age !== undefined && user.age !== filters.age) isMatch = false;
    if (filters.gender !== undefined && user.gender !== filters.gender) isMatch = false;
    if (filters.favorite !== undefined && user.favorite !== filters.favorite) isMatch = false;
    return isMatch;
  });
}

export function sortUsers(users, sortBy, order = 'asc') {
  return [...users].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'b_day' || sortBy === 'b_date') {
      valA = new Date(a.b_date).getTime();
      valB = new Date(b.b_date).getTime();
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function findUser(users, searchParam) {
  const [key, value] = Object.entries(searchParam)[0];
  return users.find((user) => {
    if (key === 'name' && user.full_name) {
      return user.full_name.toLowerCase().includes(value.toLowerCase());
    }
    if (key === 'note' && user.note) {
      return user.note.toLowerCase().includes(value.toLowerCase());
    }
    if (key === 'age') return user.age === value;
    return user[key] === value;
  });
} 
