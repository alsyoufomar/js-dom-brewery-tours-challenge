const ul = document.querySelector('#breweries-list')
const form = document.querySelector('#select-state-form')
const filtersList = document.querySelector(".filters-section")
let allBre = []
let searchWord
let stateWord




function addPubs (arr) {
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild)
  }
  arr.forEach(pub => addPub(pub))
}


function api (state, type) {
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&by_type=` + type)
    .then(res => {
      console.log(type, state)
      return res.json()
    })
    .then(res => {
      allBre = []
      res.forEach(a => allBre.push(a))
      filterMaker(cities())
      addPubs(res)
    })
}


form.addEventListener("submit", (e) => {
  e.preventDefault()
  stateWord = form['select-state'].value
  api(form['select-state'].value, 'micro&by_type=regional&by_type=brewpub')
})

const filter = document.querySelector("#filter-by-type")
filter.addEventListener("change", (e) => {
  api(stateWord, e.target.value)
})

/********************* the 1st Extention ************************/

const header = document.createElement("header")
header.classList.add(".search-bar")
const search = document.createElement("form")
search.setAttribute('id', 'search-breweries-form')
search.setAttribute('autocomplete', 'off')
const searchLabel = document.createElement('label')
searchLabel.setAttribute('for', 'search-breweries')
const searchTitle = document.createElement('h2')
searchTitle.innerText = 'Search brewerie:'
const searchBox = document.createElement('input')
searchBox.setAttribute('id', 'search-breweries')
searchBox.setAttribute('type', 'text')
searchBox.setAttribute('name', 'search-breweries')

searchLabel.append(searchTitle)
search.append(searchLabel, searchBox)
header.append(search)
const article = document.querySelector('.search--bar')
article.prepend(header)


search.addEventListener('input', (e) => {
  e.preventDefault()
  searchWord = search['search-breweries'].value
  const arr = allBre.filter(b => checker(b.name) === true)
  addPubs(arr)
})

function checker (name) {
  return name.toLowerCase().includes(searchWord.toLowerCase())
}


/****************** the 2nd Extention *******************/

const cityFilterHeading = document.createElement('div')
cityFilterHeading.classList.add('filter-by-city-heading')
const cityFilterTitle = document.createElement('h3')
cityFilterTitle.innerText = 'Cities'
const clearAllBtn = document.createElement('button')
clearAllBtn.innerText = 'clear all'
clearAllBtn.classList.add('clear-all-btn')
clearAllBtn.addEventListener('click', () => {
  switcher = !switcher
  addPubs(allBre)
})
cityFilterHeading.append(cityFilterTitle, clearAllBtn)


/************** the form template *************/
const filterForm = document.createElement('from')
filterForm.setAttribute('id', 'filter-by-city-form')
filtersList.append(cityFilterHeading, filterForm)

let switcher
function filterByCity (city) {
  const input = document.createElement('input')
  input.setAttribute('type', 'checkbox')
  input.setAttribute('name', city.toLowerCase())
  input.setAttribute('value', city.toLowerCase())
  input.addEventListener('change', (event) => {
    switcher = input.checked
    if (switcher) {
      input.checked = switcher
      const arr = allBre.filter(b => b.city.toLowerCase() === event.target.name)
      addPubs(arr)
    }
    else if (!switcher) {
      const arr = allBre.filter(b => b.city.toLowerCase() !== event.target.name)
      addPubs(arr)
    }
  })

  const label = document.createElement('label')
  label.setAttribute('for', city.toLowerCase())
  label.innerText = city.toLowerCase()

  filterForm.append(input, label)
}

function filterMaker (brews) {
  while (filterForm.hasChildNodes()) {
    filterForm.removeChild(filterForm.firstChild)
  }
  brews.forEach(x => filterByCity(x))
}

let city = new Set()
function cities () {
  city.forEach(c => city.delete(c))
  for (let n of allBre) {
    city.add(n.city)
  }
  return [...city]
}



function addPub (info) {
  const li = document.createElement('li');
  const title = document.createElement('h2');
  title.innerText = info.name
  const type = document.createElement('div');
  type.classList.add('type')
  type.innerText = info.brewery_type
  const address = document.createElement('section');
  address.classList.add('address')
  const addTitle = document.createElement('h3');
  addTitle.innerText = 'Address'
  const addStreet = document.createElement('p');
  addStreet.innerText = info.street
  const addCity = document.createElement('p');
  const strong = document.createElement('strong');
  strong.innerText = `${info.city}, ${info.postal_code}`
  address.append(addTitle, addStreet, addCity, strong)
  const phone = document.createElement('section');
  phone.classList.add('phone')
  const phTitle = document.createElement('h3');
  phTitle.innerText = 'Phone'
  const na = document.createElement('p');
  na.innerText = info.phone
  phone.append(phTitle, na)
  const link = document.createElement('section');
  const a = document.createElement('a');
  a.innerText = 'Visit Website';
  a.setAttribute('href', info.website_url)
  a.setAttribute('target', '_blank');
  link.append(a)
  li.append(title, type, address, phone, link);
  ul.append(li)
}