/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */

import { formatAndMergeUsers, validateUser, sortUsers, filterUsers } from './test-module.js';

const rawMockData = [
  {
    full_name: 'Ihor Tkachuk', course: 'Chemistry', country: 'Ukraine', city: 'Kyiv', state: 'Kyiv', age: 35, gender: 'Male', picture_large: './images/teacher-1.jpg', email: 'ihor_tkachuk@domain.com', phone: '+380964993252', note: 'Great teacher', favorite: true,
  },
  {
    full_name: 'Pragg Ramesh', course: 'Chess', country: 'India', city: 'Mumbai', state: 'Maharashtra', age: 24, gender: 'Male', picture_large: './images/teacher-2.jpg', email: 'pragg@domain.com', phone: '+911234567890', note: 'Grandmaster', favorite: false,
  },
  {
    full_name: 'Floor Jansen', course: 'Vocal', country: 'Denmark', city: 'Copenhagen', state: 'Capital', age: 41, gender: 'Female', picture_large: './images/teacher-3.jpg', email: 'floor@domain.com', phone: '+4512345678', note: 'Symphonic singer', favorite: true,
  },
  {
    full_name: 'John Burke', course: 'Computer Science', country: 'Belgium', city: 'Brussels', state: 'Brussels', age: 37, gender: 'Male', picture_large: './images/teacher-4.jpg', email: 'john@domain.com', phone: '+3212345678', note: 'Tech enthusiast', favorite: false,
  },
];

const teachers = formatAndMergeUsers(rawMockData, []);
let filteredTeachers = [...teachers];
const currentSort = { field: null, asc: true };


function openTeacherInfoModal(teacher) {
  const modal = document.querySelector('#modal-teacher-info');
  modal.querySelector('h2').textContent = teacher.full_name;
  modal.querySelector('.subject-highlight').textContent = teacher.course;

  const meta = modal.querySelectorAll('.meta-line');
  meta[0].textContent = `${teacher.city}, ${teacher.country}`;
  meta[1].textContent = `${teacher.age}, ${teacher.gender}`;
  meta[2].innerHTML = `<a href="mailto:${teacher.email}" class="link-sky">${teacher.email}</a>`;
  meta[3].textContent = teacher.phone;
  modal.querySelector('.teacher-bio p').textContent = teacher.note;

  const photo = modal.querySelector('.teacher-photo-float');
  if (teacher.picture_large) {
    photo.innerHTML = `<img src="${teacher.picture_large}" alt="${teacher.full_name}">`;
  } else {
    const initials = teacher.full_name.split(' ').map((n) => n[0]).join('.');
    photo.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#eee;border-radius:50%;font-size:2rem">${initials}</div>`;
  }

  const starBtn = modal.querySelector('.star-outline');
  starBtn.innerHTML = teacher.favorite ? '★' : '☆';
  starBtn.style.color = teacher.favorite ? '#f56a6a' : '#000';
  starBtn.onclick = () => {
    teacher.favorite = !teacher.favorite;
    applyFiltersAndSearch();
    openTeacherInfoModal(teacher);
  };

  window.location.hash = 'modal-teacher-info';
}

function renderTeachersGrid(list) {
  const grid = document.querySelector('.teachers-grid');
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<p>No teachers found.</p>';
    return;
  }

  list.forEach((teacher) => {
    const names = teacher.full_name.split(' ');
    const initials = names.map((n) => n[0]).join('.').toUpperCase();
    const avatarHtml = teacher.picture_large
      ? `<img src="${teacher.picture_large}" alt="${teacher.full_name}">`
      : `<span>${initials}</span>`;

    const card = document.createElement('div');
    card.className = `teacher-card ${teacher.favorite ? 'has-star' : ''}`;
    card.innerHTML = `
      <div class="${teacher.picture_large ? 'avatar-ring' : 'avatar-ring initials-ring'}">
        ${avatarHtml}
        ${teacher.favorite ? '<span class="star-badge">★</span>' : ''}
      </div>
      <h3 class="teacher-name">${names[0]}<br>${names.slice(1).join(' ')}</h3>
      <p class="teacher-subject">${teacher.course}</p>
      <p class="teacher-country">${teacher.country}</p>
    `;
    card.addEventListener('click', () => openTeacherInfoModal(teacher));
    grid.appendChild(card);
  });
}

function renderStatistics(list) {
  const tbody = document.querySelector('.stats-table tbody');
  tbody.innerHTML = '';
  list.forEach((teacher) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${teacher.full_name}</td><td>${teacher.course}</td><td>${teacher.age}</td><td>${teacher.gender}</td><td>${teacher.country}</td>`;
    tbody.appendChild(tr);
  });
}

function renderFavorites(list) {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  track.innerHTML = '';
  list.forEach((teacher) => {
    const names = teacher.full_name.split(' ');
    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.innerHTML = `
      <div class="${teacher.picture_large ? 'avatar-ring' : 'avatar-ring initials-ring'}">
        ${teacher.picture_large ? `<img src="${teacher.picture_large}" alt="${teacher.full_name}">` : `<span>${names.map((n) => n[0]).join('.')}</span>`}
      </div>
      <h3 class="teacher-name">${names[0]}<br>${names.slice(1).join(' ')}</h3>
      <p class="teacher-subject">${teacher.course}</p>
      <p class="teacher-country">${teacher.country}</p>
    `;
    card.addEventListener('click', () => openTeacherInfoModal(teacher));
    track.appendChild(card);
  });
}

function sortStatsTable(field, thElement) {
  currentSort.asc = (currentSort.field === field) ? !currentSort.asc : true;
  currentSort.field = field;

  document.querySelectorAll('.stats-table th').forEach((th) => {
    th.innerHTML = th.innerHTML.replace(' ↓', '').replace(' ↑', '');
  });
  thElement.innerHTML += currentSort.asc ? ' ↓' : ' ↑';

  filteredTeachers = sortUsers(filteredTeachers, field, currentSort.asc ? 'asc' : 'desc');
  renderStatistics(filteredTeachers);
}

function renderAll() {
  renderTeachersGrid(filteredTeachers);
  renderStatistics(filteredTeachers);
  const favorites = filterUsers(teachers, { favorite: true });
  renderFavorites(favorites);
}

function applyFiltersAndSearch() {
  const searchVal = document.querySelector('.search-input').value.toLowerCase();
  const regionFilter = document.querySelector('#filter-region').value;
  const sexFilter = document.querySelector('#filter-sex').value;
  const ageFilter = document.querySelector('#filter-age').value;
  const favOnly = document.querySelector('#fav-only').checked;
  const photoOnly = document.querySelector('#photo-only').checked;

  const exactFilters = {};
  if (regionFilter !== 'All') exactFilters.country = regionFilter;
  if (sexFilter !== 'All') exactFilters.gender = sexFilter;
  if (favOnly) exactFilters.favorite = true;

  let result = filterUsers(teachers, exactFilters);

  result = result.filter((t) => {
    let match = true;
    if (searchVal) {
      const matchName = t.full_name.toLowerCase().includes(searchVal);
      const matchNote = (t.note || '').toLowerCase().includes(searchVal);
      const matchAge = t.age.toString() === searchVal;
      if (!matchName && !matchNote && !matchAge) match = false;
    }
    if (ageFilter === '18-31' && (t.age < 18 || t.age > 31)) match = false;
    if (ageFilter === '32-45' && (t.age < 32 || t.age > 45)) match = false;
    if (ageFilter === '46+' && t.age < 46) match = false;
    if (photoOnly && !t.picture_large) match = false;

    return match;
  });

  filteredTeachers = result;

  if (currentSort.field) {
    filteredTeachers = sortUsers(filteredTeachers, currentSort.field, currentSort.asc ? 'asc' : 'desc');
  }

  renderAll();
}

function initFiltersDropdowns() {
  const regionSelect = document.querySelector('#filter-region');
  const uniqueCountries = [...new Set(teachers.map((t) => t.country))].sort();
  regionSelect.innerHTML = `<option value="All">All Regions</option>${uniqueCountries.map((c) => `<option value="${c}">${c}</option>`).join('')}`;
}

function handleAddTeacher(e) {
  e.preventDefault();
  const form = e.target;
  const capitalize = (s) => (s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : 'Unknown');

  const newTeacher = {
    id: Date.now().toString(),
    full_name: capitalize(form.querySelector('input[placeholder="Enter name"]').value),
    course: form.querySelectorAll('select')[0].value,
    country: capitalize(form.querySelectorAll('select')[1].value),
    city: capitalize(form.querySelectorAll('input[type="text"]')[1].value),
    state: 'State',
    email: form.querySelector('input[type="email"]').value,
    phone: form.querySelector('input[type="tel"]').value,
    b_date: form.querySelector('input[type="date"]').value,
    age: parseInt(new Date().getFullYear() - new Date(form.querySelector('input[type="date"]').value).getFullYear(), 10) || 30,
    gender: capitalize(form.querySelector('input[name="sex"]:checked').value),
    note: capitalize(form.querySelector('textarea').value || 'New note'),
    favorite: false,
    picture_large: '',
  };

  if (!validateUser(newTeacher)) {
    window.alert('Помилка валідації! Перевірте правильність заповнення полів.');
    return;
  }

  teachers.unshift(newTeacher);
  initFiltersDropdowns();
  applyFiltersAndSearch();
  form.reset();
  window.location.hash = '';
}

function setupEventListeners() {
  document.querySelectorAll('.modal-overlay, .modal-close-btn').forEach((el) => el.addEventListener('click', (e) => {
    if (e.target === el) window.location.hash = '';
  }));

  ['#filter-age', '#filter-region', '#filter-sex', '#photo-only', '#fav-only'].forEach((id) => {
    document.querySelector(id).addEventListener('change', applyFiltersAndSearch);
  });

  document.querySelector('.btn-search').addEventListener('click', applyFiltersAndSearch);
  document.querySelector('.search-input').addEventListener('input', applyFiltersAndSearch);

  const headers = document.querySelectorAll('.stats-table th');
  const fields = ['full_name', 'course', 'age', 'gender', 'country'];
  headers.forEach((th, idx) => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => sortStatsTable(fields[idx], th));
  });

  document.querySelector('.form-add-teacher').addEventListener('submit', handleAddTeacher);
}


document.addEventListener('DOMContentLoaded', () => {
  initFiltersDropdowns();
  renderAll();
  setupEventListeners();
});
