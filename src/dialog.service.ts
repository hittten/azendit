const modalElement = document.querySelector<HTMLDivElement>('.modal');
const modalYesButton = modalElement.querySelector<HTMLButtonElement>('button:first-child');
const modalNoButton = modalElement.querySelector<HTMLButtonElement>('button:last-child');

export async function openDialog(text: string) {
  modalElement.querySelector('p').textContent = text
  modalElement.classList.add('open')

  return new Promise<boolean>(resolve => {
    const closeDialog = (value: boolean) => {
      resolve(value);
      modalElement.classList.remove('open')
    };

    modalNoButton.onclick = () => closeDialog(false)
    modalYesButton.onclick = () => closeDialog(true)
    modalElement.onclick = (e) => {
      if (e.target === modalElement) {
        closeDialog(false);
      }
    }

    document.body.addEventListener("keyup", onKeyupEscape)

    function onKeyupEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeDialog(false)
        document.body.removeEventListener("keyup", onKeyupEscape)
      }
    }
  })
}
