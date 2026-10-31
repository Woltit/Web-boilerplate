/**import testModules from './test-module.js'; */
const COURSES = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

function formatAndMergeUsers(random_user_mock = [], additional_users = []) {
  const formatUser = (user) => {
    return {
      gender: user.gender || "unknown",
      title: user.name?.title || user.title || "",
      full_name: user.full_name || `${user.name?.first || ''} ${user.name?.last || ''}`.trim(),
      city: user.location?.city || user.city || "",
      state: user.location?.state || user.state || "",
      country: user.location?.country || user.country || "",
      postcode: user.location?.postcode || user.postcode || "",
      coordinates: user.location?.coordinates || user.coordinates || { latitude: "", longitude: "" },
      timezone: user.location?.timezone || user.timezone || { offset: "", description: "" },
      email: user.email || "",
      b_date: user.dob?.date || user.b_date || "",
      age: user.dob?.age || user.age || null,
      phone: user.phone || "",
      picture_large: user.picture?.large || user.picture_large || "",
      picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || "",
      
      id: user.id?.value || user.id || generateId(),
      favorite: user.favorite !== undefined ? user.favorite : false,
      course: user.course || COURSES[Math.floor(Math.random() * COURSES.length)],
      bg_color: user.bg_color || "#ffffff",
      note: user.note || "New note"
    };
  };

  const allUsers = [...random_user_mock, ...additional_users].map(formatUser);

  const uniqueUsers = [];
  const seenEmails = new Set();

  for (const user of allUsers) {
    if (!seenEmails.has(user.email)) {
      seenEmails.add(user.email);
      uniqueUsers.push(user);
    }
  }

  return uniqueUsers;
}

function validateUser(user) {
  const isCapitalizedString = (str) => {
    return typeof str === 'string' && /^[A-ZА-ЯІЇЄҐ]/.test(str);
  };

  const stringFields = ['full_name', 'gender', 'note', 'state', 'city', 'country'];
  for (let field of stringFields) {
    if (!isCapitalizedString(user[field])) {
      return false; 
    }
  }

  if (typeof user.age !== 'number' || isNaN(user.age)) {
    return false;
  }

  const phoneRegex = /^[+\d\s\-\(\)]+$/;
  if (typeof user.phone !== 'string' || !phoneRegex.test(user.phone)) {
    return false;
  }

  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    return false;
  }

  return true;
}

function filterUsers(users, filters = {}) {
  return users.filter(user => {
    let isMatch = true;
    
    if (filters.country !== undefined && user.country !== filters.country) isMatch = false;
    if (filters.age !== undefined && user.age !== filters.age) isMatch = false;
    if (filters.gender !== undefined && user.gender !== filters.gender) isMatch = false;
    if (filters.favorite !== undefined && user.favorite !== filters.favorite) isMatch = false;
    
    return isMatch;
  });
}

function sortUsers(users, sortBy, order = 'asc') {
  return [...users].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'b_day' || sortBy === 'b_date') {
      valA = new Date(a.b_date).getTime();
      valB = new Date(b.b_date).getTime();
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return order === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

function findUser(users, searchParam) {
  const [key, value] = Object.entries(searchParam)[0];

  return users.find(user => {
    if (key === 'name' && user.full_name) {
      return user.full_name.toLowerCase().includes(value.toLowerCase());
    }
    if (key === 'note' && user.note) {
      return user.note.toLowerCase().includes(value.toLowerCase());
    }
    if (key === 'age') {
      return user.age === value;
    }
    
    return user[key] === value;
  });
}

function getPercentageByCriteria(users, searchPredicate) {
  if (!users || users.length === 0) return 0;
  
  const matchedUsersCount = users.filter(searchPredicate).length;
  
  const percentage = (matchedUsersCount / users.length) * 100;
  
  return Math.round(percentage * 100) / 100; 
}

// ==========================================
//             БЛОК ТЕСТУВАННЯ
// ==========================================

// 1. Створюємо мокові дані (імітація вхідних даних)
const mock_random_users = [
  {
    gender: "male", // з маленької літери, для тесту валідації
    title: "Mr",
    full_name: "Norbert Weishaupt",
    city: "Rhön-Grabfeld",
    state: "Mecklenburg-Vorpommern",
    country: "Germany",
    age: 65,
    email: "norbert.weishaupt@example.com",
    phone: "0079-8291509",
    note: "Some note"
  }
];

const mock_additional_users = [
  {
    gender: "Female",
    title: "Ms",
    full_name: "Anna Smith",
    city: "London",
    state: "London",
    country: "UK",
    age: 28,
    email: "anna@example.com",
    phone: "+4412345678",
    note: "Great student"
  }
];

// --- Тест Завдання 1: Форматування та об'єднання ---
console.log("--- ЗАВДАННЯ 1: Форматування ---");
const formattedUsers = formatAndMergeUsers(mock_random_users, mock_additional_users);
console.log(formattedUsers);


// --- Тест Завдання 2: Валідація ---
console.log("\n--- ЗАВДАННЯ 2: Валідація ---");
// Норберт не пройде валідацію, бо 'gender' з маленької літери. 
console.log("Чи валідний Norbert?", validateUser(formattedUsers[0])); 
// Виправляємо гендер на 'Male', щоб перевірити успішну валідацію
formattedUsers[0].gender = "Male"; 
console.log("Чи валідний Norbert після виправлення гендеру?", validateUser(formattedUsers[0]));
console.log("Чи валідна Anna?", validateUser(formattedUsers[1]));


// --- Тест Завдання 3: Фільтрація ---
console.log("\n--- ЗАВДАННЯ 3: Фільтрація (age: 65, country: Germany) ---");
const filtered = filterUsers(formattedUsers, { age: 65, country: "Germany" });
console.log(filtered);


// --- Тест Завдання 4: Сортування ---
console.log("\n--- ЗАВДАННЯ 4: Сортування за віком (за зростанням) ---");
const sortedAsc = sortUsers(formattedUsers, 'age', 'asc');
console.log(sortedAsc.map(u => `${u.full_name}: ${u.age}`));


// --- Тест Завдання 5: Пошук ---
console.log("\n--- ЗАВДАННЯ 5: Пошук за ім'ям (Anna) ---");
const foundUser = findUser(formattedUsers, { name: "Anna" });
console.log(foundUser);


// --- Тест Завдання 6: Відсоток ---
console.log("\n--- ЗАВДАННЯ 6: Відсоток юзерів старше 30 років ---");
const percent = getPercentageByCriteria(formattedUsers, user => user.age > 30);
console.log(`Результат: ${percent}%`);
/**console.log(testModules.hello); */
