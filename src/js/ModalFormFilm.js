import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import ItcTabs from './TabNavigator';
import lightboxHtml from './RenderModalFormMarkup';
import FilmotekaAPI from './FilmotekaAPI';

const movieInfo = new FilmotekaAPI();
//console.log(movieInfo.getInfoCardModal(550).then(data => console.log(data)));

let indexModal;
let galleryList = [];
let i = 0;

document.querySelectorAll('.film-card').forEach(item => {
  galleryList[i] = [item.dataset.imgindex, item.dataset.filmid];
  i += 1;

  item.addEventListener('click', event => {
    makeLightbox(item.dataset.imgindex, item.dataset.filmid);
  });
});

const instance = basicLightbox.create('', {
  className: 'lightbox',
  closable: true,
  onShow: () => {
    document.addEventListener('keydown', onKeyPress);
    document.body.classList.add('scroll-disable');
  },
  onClose: () => {
    document.removeEventListener('keydown', onKeyPress);
    document.body.classList.remove('scroll-disable');
  },
});

const onKeyPress = function () {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = getNextIndex(indexModal);
    makeLightbox(galleryList[nextIndex][0], galleryList[nextIndex][1]);
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    prevIndex = getPrevIndex(indexModal);
    makeLightbox(galleryList[prevIndex][0], galleryList[prevIndex][1]);
  }

  if (event.key === 'Escape') {
    closeModal(indexModal);
  }
};

const elem = instance.element();

async function makeLightbox(index, filmid) {
  indexModal = index;
  let poster = '';
  let videoSrc = '';

  console.log(document.documentElement.clientWidth);

  await movieInfo.getPoster(filmid, 500).then(data => {
    poster = data;
  });

  await movieInfo.getVideo(filmid).then(data => {
    videoSrc = data.replace('watch?v=', 'embed/');
  });

  await movieInfo
    .getInfoCardModal(filmid)
    .then(data => {
      elem.innerHTML = lightboxHtml(
        getNextIndex(index),
        getPrevIndex(index),
        galleryList.length,
        poster,
        videoSrc,
        data
      );
      instance.show();
      addBasicLightboxVisibility();
      addArrowEventlisteners();
      addCloseBtnEventlistener();
      addTabs();
    })
    .then(data => {})
    .catch(error => {
      console.log('oops!');
    });
}

function getNextIndex(index) {
  let nextIndex = Number(index) + 1;
  if (nextIndex > galleryList.length - 1) {
    nextIndex = 0;
  }
  return nextIndex;
}

function getPrevIndex(index) {
  let prevIndex = index - 1;
  if (prevIndex < 0) {
    prevIndex = galleryList.length - 1;
  }
  return prevIndex;
}

function addBasicLightboxVisibility() {
  const figure = document.querySelector('.lightbox__container');
  figure.style.display = 'block';
  figure.style.opacity = 1;
}

function addArrowEventlisteners() {
  document.querySelectorAll('.lightbox__arrow').forEach(item => {
    item.addEventListener('click', event => {
      makeLightbox(
        galleryList[item.dataset.next][0],
        galleryList[item.dataset.next][1]
      );
    });
  });
}

function addCloseBtnEventlistener() {
  document
    .querySelector('.lightbox__close-btn')
    .addEventListener('click', event => {
      event.preventDefault();
      closeModal(indexModal);
    });
}

function closeModal(index) {
  document.querySelector(`[data-imgindex="${index}"]`).focus();
  instance.close();
}

function addTabs() {
  let elTab = document.querySelector('.tabs');
  new ItcTabs(elTab);

  elTab.addEventListener('itc.change', e => {
    const paneFrom = e.detail.paneFrom;
    const player = paneFrom.querySelector('.player');
    const iframeSrc = player ? player.src : '';

    if (player) {
      player.src = iframeSrc;
    }
  });
}
