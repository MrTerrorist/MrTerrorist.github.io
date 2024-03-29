const htmlEl = document.documentElement;
const GRID_NAME = '日剧生涯个人喜好表';
const Caches = {};
const get = async(url) => {
    if (Caches[url]) return Caches[url];
    htmlEl.setAttribute('data-no-touch', true);
    const f = await fetch(url);
    const data = await f.json();
    Caches[url] = data;
    htmlEl.setAttribute('data-no-touch', false);
    return data;
}
const loadedTracks = new Map();
const Images = {};
const loadImage = (src, onOver) =>{
    if (Images[src]) return onOver(Images[src]);
    const el = new Image();
    el.crossOrigin = 'Anonymous';
    el.src = src;
    el.onload = () =>{
        onOver(el) 
        Images[src] = el;
    }
};
const typeTexts = `入坑曲
最爱的
隔一段时间就想听
MV最好看的
对自己意义重大的
80年代最爱
90年代最爱
最想去现场听的
最想安利的
循环最多的
最感动的
以前爱听现在不听的
Live上很有气氛但平时不想听的
和平时听歌风格相反的最梦回的`;
const types = typeTexts.trim().split(/\n+/g);
let tracks = [];
const generatorDefaultTracks = () =>{
    tracks = new Array(types.length).fill(null);
}
const getTrackIdsText = () =>tracks 
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const bodyMargin = 20;
const contentWidth = 600;
const contentHeight = 560;
const col = 5;
const row = 3;
const colWidth = Math.ceil(contentWidth / col);
const rowHeight = Math.ceil(contentHeight / row);
const titleHeight = 40;
const fontHeight = 24;
const width = contentWidth + bodyMargin * 2;
const height = contentHeight + bodyMargin * 2 + titleHeight;
const scale = 3;
canvas.width = width * scale;
canvas.height = height * scale;
ctx.fillStyle = '#FFF';
ctx.fillRect(0, 0, width * scale, height * scale);
ctx.textAlign = 'left';
ctx.font = `${7*scale}px sans - serif`;
ctx.fillStyle = '#AAA';
ctx.textBaseline = 'middle';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.fillText('music-grid.0x01bf52.com · @网易花钱的老大 音乐数据来自于 Spotify API · 基于 @卜卜口 的动画生涯个人喜好表 · 禁止商业、盈利用途', 19 * scale, (height - 10) * scale);
ctx.scale(scale, scale);
ctx.translate(bodyMargin, bodyMargin + titleHeight);
ctx.font = '16px sans-serif';
ctx.fillStyle = '#222';
ctx.textAlign = 'center';
ctx.save();
ctx.font = 'bold 24px sans-serif';
ctx.fillText(GRID_NAME, contentWidth / 2, -24);
ctx.lineWidth = 2;
ctx.strokeStyle = '#222';
for (let y = 0; y <= row; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * rowHeight);
    ctx.lineTo(contentWidth, y * rowHeight);
    ctx.globalAlpha = 1;
    ctx.stroke();
    if (y === row) break;
    ctx.beginPath();
    ctx.moveTo(0, y * rowHeight + rowHeight - fontHeight);
    ctx.lineTo(contentWidth, y * rowHeight + rowHeight - fontHeight);
    ctx.globalAlpha = .2;
    ctx.stroke();
}
ctx.globalAlpha = 1;
for (let x = 0; x <= col; x++) {
    ctx.beginPath();
    ctx.moveTo(x * colWidth, 0);
    ctx.lineTo(x * colWidth, contentHeight);
    ctx.stroke();
}
ctx.restore();
for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
        const top = y * rowHeight;
        const left = x * colWidth;
        const type = types[y * col + x];
        ctx.fillText(type, left + colWidth / 2, top + rowHeight - fontHeight / 2, colWidth - 10);
    }
}

const APIURL = `https://api.themoviedb.org/`;

const getCoverURLById = trackID =>`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${trackID}`;


let currentBangumiIndex = null;
const searchBoxEl = document.querySelector('.search-box');
const formEl = document.querySelector('form');
const searchInputEl = formEl[0];
const animeListEl = document.querySelector('.track-list');
const openSearchBox = (index) =>{
    currentBangumiIndex = index;
    htmlEl.setAttribute('data-no-scroll', true);
    searchBoxEl.setAttribute('data-show', true);
    searchInputEl.focus();
}
const closeSearchBox = () =>{
    htmlEl.setAttribute('data-no-scroll', false);
    searchBoxEl.setAttribute('data-show', false);
    searchInputEl.value = '';
    formEl.onsubmit();
};
const setInputText = () =>{
    const text = searchInputEl.value.trim().replace(/,/g, '');
    setCurrentBangumi(text);
}
const setCurrentBangumi = async (value) =>{
    tracks[currentBangumiIndex] = value;
    drawTracks();
    closeSearchBox();
}
animeListEl.onclick = e =>{
    const id = e.target.getAttribute('data-id');
    if (currentBangumiIndex === null) return;
    setCurrentBangumi(id);
};


const searchFromAPI = async keyword =>{
    let url = `${APIURL}3/search/tv?api_key=f359cffc48a1befc770bc2fed33cfdda&language=ja-JP&page=1&include_adult=false&query=`;
    if (keyword) url = url + `${encodeURIComponent(keyword)}`;
    const tracks = await get(url);
    resetTrackList(tracks.results);
}
const resetTrackList = tracks =>{
    animeListEl.innerHTML = tracks.map((track, index) =>{    
        let title = typeof(track.name)=="undefined"||track.name==""?track.original_name:track.name;
        loadedTracks.set(track.poster_path, track) 
        return `<div class = "track-item" data-id = "${track.poster_path}" > <img src = "${getCoverURLById(track.poster_path)}" crossOrigin="Anonymous"> <h3> ${title} - ${track.first_air_date}</h3></div>`;
    }).join('');
}
formEl.onsubmit = async e =>{
    if (e) e.preventDefault();
    const keyword = searchInputEl.value.trim();
    if (keyword != undefined && keyword.length > 0) {
        await searchFromAPI(keyword)
    }
}
formEl.onsubmit();
const imageWidth = colWidth - 2;
const imageHeight = rowHeight - fontHeight;
const canvasRatio = imageWidth / imageHeight;
ctx.font = 'bold 32px sans-serif';
const drawTracks = () =>{
    for (let index in tracks) {
        const id = tracks[index];
        if (!id) continue;
        const x = index % col;
        const y = Math.floor(index / col);
        loadImage(getCoverURLById(id), el =>{
            const {naturalWidth, naturalHeight} = el;
            const originRatio = el.naturalWidth / el.naturalHeight;
            let sw, sh, sx, sy;
            if (originRatio < canvasRatio) {
                sw = naturalWidth 
                sh = naturalWidth / imageWidth * imageHeight;
                sx = 0 
                sy = (naturalHeight - sh)
            } else {
                sh = naturalHeight 
                sw = naturalHeight / imageHeight * imageWidth;
                sx = (naturalWidth - sw) 
                sy = 0
            }
            ctx.drawImage(el, sx, sy, sw, sh, x * colWidth + 1, y * rowHeight + 1, imageWidth, imageHeight, );
        }) 
    }
}
const outputEl = document.querySelector('.output-box');
const outputImageEl = outputEl.querySelector('img');
const showOutput = imgURL =>{
    outputImageEl.src = imgURL;
    outputEl.setAttribute('data-show', true);
    htmlEl.setAttribute('data-no-scroll', true);
}
const closeOutput = () =>{
    outputEl.setAttribute('data-show', false);
    htmlEl.setAttribute('data-no-scroll', false);
}
const downloadImage = () =>{
    const fileName = GRID_NAME + '.jpg';
    const mime = 'image/jpeg';
    const imgURL = canvas.toDataURL(mime, 0.8);
    const linkEl = document.createElement('a');
    linkEl.download = fileName;
    linkEl.href = imgURL;
    linkEl.dataset.downloadurl = [mime, fileName, imgURL].join(':');
    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
    showOutput(imgURL);
}
canvas.onclick = e =>{
    const rect = canvas.getBoundingClientRect();
    const {
        clientX,
        clientY
    } = e;
    const x = Math.floor(((clientX - rect.left) / rect.width * width - bodyMargin) / colWidth);
    const y = Math.floor(((clientY - rect.top) / rect.height * height - bodyMargin - titleHeight) / rowHeight);
    if (x < 0) return;
    if (x > col) return;
    if (y < 0) return;
    if (y > row) return;
    const index = y * col + x;
    if (index >= col * row) return;
    openSearchBox(index);
}