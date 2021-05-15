export default function hasVimium() {
  try {
    const { shadowRoot } = document.querySelector('html > div');
    return Boolean(shadowRoot.querySelector('style').textContent.match(/vimium/));
  } catch (e) {
    return false;
  }
}
