const apiURL = 'https://api.lyrics.ovh';

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const itemList = document.getElementById('item-list');

function message(msg) {
  alert(msg);
}
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

function showData(data) {
  const dataList = data.data;
  let output = '';
  dataList.forEach(song => {
    output += `
      <li><span class='span-class'><i class="fas fa-microphone-alt"></i>   ${song.artist.name}</span><span class='span-class'><i class="fas fa-music"></i>  ${song.title}</span> <button data-artist='${song.artist.name}' data-songtitle='${song.title}' class='btn'>see lyric</button></li>
      `;
  });

  result.innerHTML = `<ul class='songs'>${output}</ul>`;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

async function getLyrics(artist, song) {
  const res = await fetch(`${apiURL}/v1/${artist}/${song}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  console.log(data);

  result.innerHTML = `<h2> ${song} by ${artist}<h2>
  <p>${lyrics}</p>`;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const searchTerm = search.value.trim();

  if (!searchTerm) {
    message('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.innerText === 'see lyric') {
    const artist = clickedEl.getAttribute('data-artist');
    const song = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, song);
  }
});
