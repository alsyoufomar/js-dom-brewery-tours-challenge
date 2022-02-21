const ul = document.querySelector('#breweries-list')
const form = document.querySelector('#select-state-form')
const filtersList = document.querySelector(".filters-section")
const tourTypes = ['micro', 'regional', 'brewpub']
const state = {
  breweries: [],
  citiesList: [],
  stateName: '',
  type: '',
  city: '',
  BreName: '',
  checkedCities: []
}

let pageNum = 1
let pageCount
function render (arr) {
  pageCount = Math.ceil(arr.length / 10)
  buttonMaker(pageCount)
  pageNum--
  let start = 10 * pageNum
  let paginated = arr.slice(start, start + 10)
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild)
  }
  if (arr.length > 10) {
    paginated.forEach(pub => addBre(pub))
  }
  else {
    arr.forEach(pub => addBre(pub))
  }

}

function api () {
  let url = `https://api.openbrewerydb.org/breweries?by_state=${state.stateName}`
  fetch(url + state.type)
    .then(res => res.json())
    .then(res => {
      state.breweries = []
      state.breweries = res.filter(x => tourTypes.includes(x.brewery_type) === true)
      citiesSet()
      filterMaker(state.citiesList)
      render(state.breweries)
    })
}

form.addEventListener("submit", (e) => {
  e.preventDefault()
  state.stateName = form['select-state'].value
  api()
})

const filter = document.querySelector("#filter-by-type")
filter.addEventListener("change", (e) => {
  state.type = e.target.value
  e.target.value !== '' && (state.type = '&by_type=' + e.target.value)
  api()
})

/************ the 1st Extention ***************/

function searchByName () {
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
    state.BreName = search['search-breweries'].value
    const arr = state.breweries.filter(b => checker(b.name) === true)
    render(arr)
  })
}

function checker (name) {
  return name.toLowerCase().includes(state.BreName.toLowerCase())
}

searchByName()

/****************** the 2nd Extention *******************/

const cityFilterHeading = document.createElement('div')
cityFilterHeading.classList.add('filter-by-city-heading')
const cityFilterTitle = document.createElement('h3')
cityFilterTitle.innerText = 'Cities'
const clearAllBtn = document.createElement('button')
clearAllBtn.innerText = 'clear all'
clearAllBtn.classList.add('clear-all-btn')

cityFilterHeading.append(cityFilterTitle, clearAllBtn)

/************** the form template *************/

const cityFilter = document.createElement('from')
cityFilter.setAttribute('id', 'filter-by-city-form')
filtersList.append(cityFilterHeading, cityFilter)

function filterByCity (city) {
  const input = document.createElement('input')
  input.setAttribute('type', 'checkbox')
  input.setAttribute('name', city.toLowerCase())
  input.setAttribute('value', city.toLowerCase())
  clearAllBtn.addEventListener('click', () => {
    input.checked && (input.checked = false)
    state.checkedCities = []
    render(state.breweries)
  })
  input.addEventListener('change', (event) => {
    const arr = state.breweries.filter(b => b.city.toLowerCase() === event.target.name)
    const array = arr.map(b => b.name)
    console.log('array is ', array)
    console.log('arr = ', arr)
    if (input.checked) {
      arr.forEach(b => state.checkedCities.push(b))
      render(state.checkedCities)
      console.log('checked cities = ', state.checkedCities)
    }
    else {
      for (let i = state.checkedCities.length - 1; i >= 0; i--) {
        if (array.includes(state.checkedCities[i].name)) {
          state.checkedCities.splice(i, 1)
        }
      }

      render(state.checkedCities)
      if (state.checkedCities.length === 0) {
        render(state.breweries)
      }
      console.log('checked cities = ', state.checkedCities.length)
    }
  })

  const label = document.createElement('label')
  label.setAttribute('for', city.toLowerCase())
  label.innerText = city.toLowerCase()
  cityFilter.append(input, label)
}

function filterMaker (brews) {
  while (cityFilter.hasChildNodes()) {
    cityFilter.removeChild(cityFilter.firstChild)
  }
  brews.forEach(x => filterByCity(x))
}

function citiesSet () {
  let city = new Set()
  state.breweries.forEach(n => city.add(n.city))
  state.citiesList = [];
  [...city].forEach(c => state.citiesList.push(c))
}

/********************** the big guy **************************/

function addBre (info) {
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
  const addBtn = document.createElement('button')
  addBtn.setAttribute('name', info.name)
  addBtn.innerText = 'Add to visit list'
  addBtn.addEventListener('click', (e) => {
    console.log(e.target.name)
    const update = finder(e.target.name)
    fetch("http://localhost:3000/visitList", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    })
    const delBtn = document.createElement('button')
    delBtn.setAttribute('name', info.id)
    delBtn.innerText = 'Remove from visit list'
    li.append(delBtn)
    delBtn.addEventListener('click', (e) => {
      console.log(e.target.name)
      li.removeChild(delBtn)
      fetch("http://localhost:3000/visitList/" + e.target.name, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
    })
  })
  li.append(title, type, address, phone, link, addBtn);
  ul.append(li)
}

function finder (str) {
  return state.breweries.find(x => x.name === str)
}
/************************ The 3rd extention ***********************/

const article = document.querySelector('.search--bar')
const buttons = document.createElement('div')
buttons.classList.add('buttons')
article.append(buttons)

function buttonMaker (num) {
  while (buttons.hasChildNodes()) {
    buttons.removeChild(buttons.firstChild)
  }
  for (let i = 0; i < num; i++) {
    const page = document.createElement('button')
    page.classList.add('page')
    page.innerText = i + 1
    buttons.append(page)
    page.addEventListener('click', (e) => {
      pageNum = Number(e.target.innerText)
      render(state.breweries)
    })
  }
}

