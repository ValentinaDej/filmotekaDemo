export default function lightboxHtml(
  nextImg,
  prevImg,
  galleryListLength,
  poster,
  videoSrc,
  data
) {
  let htmlValue = `
   <div class="lightbox__container tabs" id="tabs-1">
     ${
       galleryListLength > 1
         ? `<button data-next="${prevImg}" class="lightbox__arrow lightbox__arrow-prev">«</button>`
         : ''
     }
     <div class="tabs__nav"">
          <button class="tabs__btn tabs__btn_active">Info</button>
          <button class="tabs__btn">Trailer</button>
      </div> 
     <div class="tabs__content">
        <div class="lightbox__film-info tabs__pane tabs__pane_show" data-index="0">
          <img
            src="${poster}"
            alt="${data.title}"
            width="100px" height = "150px"
          />
          <h2>${data.title}</h2>
          <p>${data.about}</p>
        </div>
        <div class="lightbox__film-trailer tabs__pane" data-index="1">
             <div class='iframe'>
            <iframe class = "player" id='player-1' src='${videoSrc}' width="560" height="315">
            </iframe>
            </div>
        </div>
      </div>
       <div class="lightbox__close-btn">&#215</div>
        ${
          galleryListLength > 1
            ? ` <button data-next="${nextImg}" class="lightbox__arrow lightbox__arrow-next">»</button>`
            : ''
        }
    </div>
    `;
  return htmlValue;
}
