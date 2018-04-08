let two;
let squares = [];
let texts = [];
let textsMap = {};

let showSpaceOrd = true;

const generateBoard = (options) => {

  if (typeof two !== "undefined") {
    two.clear();
    squares = []; texts = [];
  } else {
    const params = { width: 3000, height: 3000 };
    const elem = document.getElementById('board');
    two = new Two(params).appendTo(elem);
  }

  const boardSideLength = options.boardSideLength || 3000;
  const spaces = options.spaces || 20;
  const sideLength = boardSideLength / ((spaces) / 4 + 1);
  const quadrantSize = spaces / 4;
  const sectionLineWidth = 4;

  for (let i = 0; i < spaces; i++) {

    const lineWidthPadding = sectionLineWidth / 2;
    const ord = i % quadrantSize;
    let x;
    let y;
    let rotation;

    if (i < quadrantSize) {
      x = (sideLength / 2) + (sideLength * ord) + lineWidthPadding;
      y = sideLength / 2 + lineWidthPadding;
      rotation = ord === 0 ? 3 / 4 * Math.PI : Math.PI;
    } else if (quadrantSize <= i && i < quadrantSize * 2) {
      x = (sideLength / 2) + (sideLength * quadrantSize) + lineWidthPadding ;
      y = (sideLength / 2) + (sideLength * ord) + lineWidthPadding;
      rotation = ord === 0 ? 5 / 4 * Math.PI : -2 / 4 * Math.PI;
    } else if (quadrantSize * 2 <= i && i < quadrantSize * 3) {
      x = (sideLength / 2) + (sideLength * (quadrantSize - ord)) + lineWidthPadding;
      y = (sideLength / 2) + (sideLength * quadrantSize) + lineWidthPadding;
      rotation = ord === 0 ? -1 / 4 * Math.PI : 0;
    } else if (i >= quadrantSize * 3) {
      x = sideLength / 2 + lineWidthPadding;
      y = (sideLength / 2) + (sideLength * (quadrantSize - ord)) + lineWidthPadding;
      rotation = ord === 0 ? 1 / 4 * Math.PI : 2 / 4 * Math.PI;
    }

    const square = two.makeRectangle(x, y, sideLength, sideLength);
    square.stroke = 'orangered'
    square.linewidth = sectionLineWidth;
    squares.push(square);

    textsMap[i] = textsMap[i] || `Space\n#${i + 1}\nblarg`;

    const text = two.makeText(textsMap[i], x, y);
    text.rotation = rotation;
    texts.push(text);
  }

  two.update();

  const $selector = $('#space-selection');
  $selector.html("");

  texts.forEach((text, i) => {
    const el = document.getElementById(text.id);
    const splitMessage = el.innerHTML.split("\n");
    const lines = splitMessage.length;
    const lineHeight = 17;

    let initialDY;
    if (lines === 0) {
      initialDY = 0;
    } else if (lines % 2 === 0) {
      initialDY = -((lines / 2 - 1) * lineHeight + (lineHeight / 2));
    } else {
      initialDY = -((lines - 1) / 2 * lineHeight);
    }

    let newText = el.innerHTML.split("\n").map((line, i) => {
      const dy = i === 0 ? initialDY : lineHeight;

      return $(`<tspan x=0 dy="${dy}">${line}</tspan>`)[0].outerHTML;
    })
    .reduce((acc, current) => { return acc + current });

    const dy = lines === 0 ? 0 : lineHeight;

    if (showSpaceOrd) {
      newText += $(`<tspan x=0 dy="${dy}">(#${i + 1})</tspan>`)[0].outerHTML
    }

    el.innerHTML = newText;

    $selector.append($(`<option value="${i}">${i + 1}</option>`));
  });

  selector.onchange && selector.onchange();
}

const sizeInput = document.getElementById("size");
const spacesInput = document.getElementById("spaces");
const generateButton = document.getElementById("generate");
const selector = document.getElementById("space-selection");
const saveTextButton = document.getElementById("save-text");
const toggleSpaceOrdButton = document.getElementById("toggle-space-ord");

generateButton.onclick = () => {
  generateBoard({
    boardSideLength: sizeInput.value || 3000,
    spaces: spacesInput.value || 40,
  });
};

generateButton.onclick();

selector.onchange = () => {
  const i = $(selector).val();
  $('#text-editor').val(textsMap[i]);
};

selector.onchange();

saveTextButton.onclick = () => {
  const text = $('#text-editor').val();
  const i = $(selector).val();
  textsMap[i] = text;
  generateButton.onclick();
}

toggleSpaceOrdButton.onclick = () => {
  showSpaceOrd = !showSpaceOrd;
  generateButton.onclick();
}
