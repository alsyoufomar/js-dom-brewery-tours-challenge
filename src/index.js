const ul = document.querySelector('#breweries-list')

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

function addPubs (pubs) {
    pubs.forEach(pub => addPub(pub));
}

function init () {
    fetch("https://api.openbrewerydb.org/breweries?by_state=ohio")
        .then(res => res.json())
        .then(x => addPubs(x))
}
init()
