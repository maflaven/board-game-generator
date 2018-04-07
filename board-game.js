let two;
let squares = [];
let texts = [];

const generateBoard = (options) => {

  if (typeof two !== "undefined") {
    two.remove(squares.concat(texts));
    squares = []; texts = [];
    two.update();
  } else {
    const params = { width: 3000, height: 3000 };
    const elem = document.getElementById('board');
    two = new Two(params).appendTo(elem);
  }

  const boardSideLength = options.boardSideLength || 3000;
  const sections = options.sections || 20;
  const sideLength = boardSideLength / sections;
  const quadrantSize = sections / 4;
  const sectionLineWidth = 4;

  for (let i = 0; i < sections; i++) {

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

    const text = two.makeText(`#${i + 1}`, x, y);
    text.rotation = rotation;
    texts.push(text);
  }

  two.update();
}

const sizeInput = document.getElementById("size");
const spacesInput = document.getElementById("spaces");
const generateButton = document.getElementById("generate");

generateButton.onclick = () => {
  generateBoard({
    boardSideLength: sizeInput.value || 3000,
    sections: spacesInput.value || 40,
  });
};

generateButton.onclick();
