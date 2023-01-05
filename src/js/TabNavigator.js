export default class ItcTabs {
  constructor(target) {
    this.elTabs =
      typeof target === 'string' ? document.querySelector(target) : target;
    this.elButtons = this.elTabs.querySelectorAll('.tabs__btn');
    this.elPanes = this.elTabs.querySelectorAll('.tabs__pane');
    this.init();
    this.events();
  }
  init() {
    this.elTabs.setAttribute('role', 'tablist');
    this.elButtons.forEach((el, index) => {
      el.dataset.index = index;
      el.setAttribute('role', 'tab');
      this.elPanes[index].setAttribute('role', 'tabpanel');
    });
  }
  show(elLinkTarget) {
    const elPaneTarget = this.elPanes[elLinkTarget.dataset.index];
    const elLinkActive = this.elTabs.querySelector('.tabs__btn_active');
    const elPaneShow = this.elTabs.querySelector('.tabs__pane_show');
    if (elLinkTarget === elLinkActive) {
      return;
    }
    this.paneFrom = elPaneShow;
    this.paneTo = elPaneTarget;
    elLinkActive ? elLinkActive.classList.remove('tabs__btn_active') : null;
    elPaneShow ? elPaneShow.classList.remove('tabs__pane_show') : null;
    elLinkTarget.classList.add('tabs__btn_active');
    elPaneTarget.classList.add('tabs__pane_show');
    this.elTabs.dispatchEvent(
      new CustomEvent('itc.change', {
        detail: {
          elTab: this.elTabs,
          paneFrom: this.paneFrom,
          paneTo: this.paneTo,
        },
      })
    );
    elLinkTarget.focus();
  }
  events() {
    this.elTabs.addEventListener('click', e => {
      const target = e.target.closest('.tabs__btn');
      if (target) {
        e.preventDefault();
        this.show(target);
      }
    });
  }
}
