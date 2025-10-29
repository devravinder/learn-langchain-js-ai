type Resolve = (files: File[]) => void;
type Reject = (event: Event) => void;

export const mapFileListToArray = (files: FileList) => {
  const array: File[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file) array.push(file);
  }
  return array;
};

export default function openFile(
  options: { multiple?: boolean; accept?: string } = {}
) {
  return new Promise((resolve: Resolve, reject: Reject) => {
    const input = document.createElement("input");

    if (options.multiple) input.setAttribute("multiple", "");

    if (options.accept) input.setAttribute("accept", options.accept);

    input.setAttribute("type", "file");
    input.style.display = "none";

    input.addEventListener("change", (ev) => {
      if (input.files?.length) {
        resolve(mapFileListToArray(input.files));
      } else {
        reject(ev);
      }
      input.remove();
    });

    document.body.appendChild(input);
    const event = new MouseEvent("click");
    input.dispatchEvent(event);
  });
}
