import FontFaceObserver from 'fontfaceobserver';
import './style.css';

//----------------------------------------------------------------------------
//Parameters

//Drag Arrow parameters
let dragArrowSpacing = 20;
let dragArrowWidth = 16;
let dragArrowHeight = 18;
let dragArrowColor = "#333333";

//SVG parameters
let width = 1200;                   //1080 pixels horizontal
let height = 800;                   //800 pixels vertical
let svgBackgroundColor = "white";

let svgBlurredBackground = undefined;
let svgBackgroundImage = undefined;
let svgMask = undefined;

//Background image parameters
let imagePositionX = 0;
let imagePositionY = 0;
let imageWidth = 1200;
let imageHeight = 800;
let imageRatio = imageWidth/imageHeight;
let imageURL = "https://diy-magazine.s3.amazonaws.com/d/diy/Artists/K/Kendrick-Lamar/_1200x800_crop_center-center_82_line/84914/Screen-Shot-2015-04-16-at-14.19.05.jpg";
let imageMaskColor = "black";
let imageDarkMaskOpacity = 0.11;
let blurEffect = false;
let blurCloneEffect = false;
let blurAmount = 10;
let shadowOpacity = 1;
let imageShadowEffect = false;
let imageShadowBlurAmount = 4;
let imageShadowShiftX = 8;
let imageShadowShiftY = 8;
let imageShadowColor = imageMaskColor;

//Quote parameters
let quotePositionX = 524;
let quotePositionY = 140;
let quoteBackgroundColor = "#4C5355";
let quoteBackgroundOpacity = 1;
let lineSeparation = 50;
let linePaddingX = 6;
let linePaddingY = 8;
let quoteShadowEffect = false;
let quoteShadowBlurAmount = 4;
let quoteShadowShiftX = 8;
let quoteShadowShiftY = 8;
let quoteShadowColor = imageMaskColor;
let lines = [ "I pray to God you actually pray when somebody dies",
            "Thoughts and prayers, way better-off timelines",
            "False claimin' not cute, I'm mortified",
            "The new Earth in hot pursuit, two-hundred lives"];

//Text parameters
let fontFamilyCustom = "Varela Round";
let fontSizeCustom = 18;
let fontWeightCustom = 400;
let fontColor = "#EDE7DC";
let quoteChar = "“";
let quoteCharacterSize = 114;
let quoteCharacterColor = quoteBackgroundColor;
let quoteCharacterShiftX = -80;
let quoteCharacterShiftY = 70;
let quoteCharPositionX = quotePositionX + quoteCharacterShiftX;
let quoteCharPositionY = quotePositionY + quoteCharacterShiftY;
let quoteCharacterFontFamily = "Nunito Sans";

//Song info parameters
let infoPaddingFromBottom = 260;
let infoShiftX = 0;
let infoPositionX = quotePositionX + infoShiftX;
let infoPositionY = height - infoPaddingFromBottom; 
let infoTextColor = quoteBackgroundColor;
let infoFontSize = 22;
let infoFontWeight = 600;
let infoFontFamily = "Nunito Sans";
let infoText = 'KENDRICK LAMAR  "RICH SPIRIT"'

//Save file parameters
let saveFile = false;                //Save SVG file? true -> yes, false -> no
let filename = "Card";
let loadFilename = filename + "_settings";

//Cursor state
let cursorElement = undefined;
let caretPosition = 0;

//App state history
let appState = [];
let appStateIndex = 0;
let fontList = ["Varela Round", "Nunito Sans"];
let fontCSSUrlList = ["https://fonts.googleapis.com/css2?family=Varela+Round:wght@400&display=swap", "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900"];

//----------------------------------------------------------------------------
//Main

//Download button response
const saveSVGButton = document.getElementById("save-svg");
saveSVGButton.onclick = function() {
    const currentFilename = document.getElementsByName("save-filename")[0].value;
    if (currentFilename.replace(/\s/g, '') !== ""){
        filename = currentFilename;
    }
    downloadSVG();
};

//Download settings file response
const saveSettingsButton = document.getElementById("save-settings");
saveSettingsButton.onclick = function() {
    const currentSettingsFilename = document.getElementsByName("save-settings-filename")[0].value;
    if (currentSettingsFilename.replace(/\s/g, '') !== ""){
        loadFilename = currentSettingsFilename;
    }
    saveSVGParameters();
};

const imageHeightToRatioButton = document.getElementById("image-height-to-ratio");
imageHeightToRatioButton.onclick = function() {
    console.log(parseInt(document.getElementsByName("image-width")[0].value));
    imageHeight = parseInt(document.getElementsByName("image-width")[0].value)/imageRatio;
    document.getElementsByName("image-height")[0].value = imageHeight;
    rerenderSVG();
};

const imageWidthToRatioButton = document.getElementById("image-width-to-ratio");
imageWidthToRatioButton.onclick = function() {
    //console.log(parseInt(document.getElementsByName("image-height")[0].value));
    imageWidth = parseInt(document.getElementsByName("image-height")[0].value)*imageRatio;
    document.getElementsByName("image-width")[0].value = imageWidth;
    rerenderSVG();
};

const imageCenterXButton = document.getElementById("image-center-X");
imageCenterXButton.onclick = function() {
    imagePositionX = (width - imageWidth)/2;
    document.getElementsByName("image-position-X")[0].value = imagePositionX;
    rerenderSVG();
};


const imageCenterYButton = document.getElementById("image-center-Y");
imageCenterYButton.onclick = function() {
    imagePositionY = (height - imageHeight)/2;
    document.getElementsByName("image-position-Y")[0].value = imagePositionY;
    rerenderSVG();
};

const quoteColorPickerButton = document.getElementById('quote-color-picker');
quoteColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        quoteBackgroundColor = result.sRGBHex;
        document.getElementsByName("quote-color")[0].value = quoteBackgroundColor;
        rerenderSVG();
    });
};

const fontColorPickerButton = document.getElementById('font-color-picker');
fontColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        fontColor = result.sRGBHex;
        document.getElementsByName("font-color")[0].value = fontColor;
        rerenderSVG();
    });
};

const maskColorPickerButton = document.getElementById('mask-color-picker');
maskColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        imageMaskColor = result.sRGBHex;
        document.getElementsByName("mask-color")[0].value = imageMaskColor;
        rerenderSVG();
    });
};

const backgroundColorPickerButton = document.getElementById('background-color-picker');
backgroundColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        svgBackgroundColor = result.sRGBHex;
        document.getElementsByName("background-color")[0].value = svgBackgroundColor;
        rerenderSVG();
    });
};

const glyphColorPickerButton = document.getElementById('glyph-color-picker');
glyphColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        quoteCharacterColor = result.sRGBHex;
        document.getElementsByName("glyph-color")[0].value = quoteCharacterColor;
        rerenderSVG();
    });
};

const footerColorPickerButton = document.getElementById('footer-color-picker');
footerColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        infoTextColor = result.sRGBHex;
        document.getElementsByName("footer-color")[0].value = infoTextColor;
        rerenderSVG();
    });
};

const quoteShadowColorPickerButton = document.getElementById('quote-shadow-color-picker');
quoteShadowColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        quoteShadowColor = result.sRGBHex;
        document.getElementsByName("quote-shadow-color")[0].value = quoteShadowColor;
        rerenderSVG();
    });
};

const imageShadowColorPickerButton = document.getElementById('image-shadow-color-picker');
imageShadowColorPickerButton.onclick =  function() {
    if (!window.EyeDropper) {
    console.log('Your browser does not support the EyeDropper API');
    return;
    }

    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        imageShadowColor = result.sRGBHex;
        document.getElementsByName("image-shadow-color")[0].value = imageShadowColor;
        rerenderSVG();
    });
};

const blurEffectCheckbox =   document.getElementsByName("blurred-back-effect")[0];
blurEffectCheckbox.onchange = function() {
    blurEffect = document.getElementsByName("blurred-back-effect")[0].checked;
    let inputs = document.getElementsByClassName("image-blur");
    if (blurEffect && blurCloneEffect){
        blurCloneEffect = false;
        document.getElementsByName("blurred-back-clone-effect")[0].checked = blurCloneEffect;
    }
    else if (blurCloneEffect || blurEffect){
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#212121";
        }
    }
    else {
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#bbbbbb";
        }
    }
    rerenderSVG();
};

const blurCloneEffectCheckbox =   document.getElementsByName("blurred-back-clone-effect")[0];
blurCloneEffectCheckbox.onchange = function() {
    blurCloneEffect = document.getElementsByName("blurred-back-clone-effect")[0].checked;
    let inputs = document.getElementsByClassName("image-blur");
    if (blurCloneEffect && blurEffect){
        blurEffect = false;
        document.getElementsByName("blurred-back-effect")[0].checked = blurEffect;
    }
    else if (blurCloneEffect || blurEffect){
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#212121";
        }
    }
    else {
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#bbbbbb";
        }
    }
    rerenderSVG();
};

const quoteShadowEffectCheckbox =   document.getElementsByName("quote-shadow-effect")[0];
quoteShadowEffectCheckbox.onchange = function() {
    quoteShadowEffect = document.getElementsByName("quote-shadow-effect")[0].checked;

    let inputs = document.getElementsByClassName("quote-shadow");
    if (quoteShadowEffect){
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#212121";
        }
    }
    else {
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#bbbbbb";
        }
    }

    console.log(quoteShadowEffect);
    rerenderSVG();
};

const imageShadowEffectCheckbox =   document.getElementsByName("image-shadow-effect")[0];
imageShadowEffectCheckbox.onchange = function() {
    imageShadowEffect = document.getElementsByName("image-shadow-effect")[0].checked;

    let inputs = document.getElementsByClassName("image-shadow");
    if (imageShadowEffect){
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#212121";
        }
    }
    else {
        for (let step = 0; step < inputs.length; step++){
            inputs[step].style.color = "#bbbbbb";
        }
    }

    console.log(imageShadowEffect);
    rerenderSVG();
};

//Load settings button response
let picker = document.getElementsByName("load-settings-filename")[0];

picker.onchange = () => {
    // (B1) GET SELECTED CSV FILE
    let selected = picker.files[0];

    // (B2) READ CSV INTO ARRAY
    let reader = new FileReader();
    reader.addEventListener("load", () => {
    // (B2-1) SPLIT ROWS & COLUMNS
    let parameters = new Object();
    let data = reader.result.split("\r\n");
    for (let i in data) {
        parameters[data[i].split(",")[0]] = decodeURIComponent(data[i].split(",")[1]);
    }

    setParameters(parameters);
    setFormPlaceholders();
    rerenderSVG();
    });
    reader.readAsText(selected);
};

document.getElementById("save-form").onkeydown = (event) => update(event);
document.getElementById("background-form").onkeydown = (event) => update(event);
document.getElementById("quote-form").onkeydown = (event) => update(event);
document.getElementById("text-form").onkeydown = (event) => update(event);
document.getElementById("footer-form").onkeydown = (event) => update(event);
document.getElementById("advanced-form").onkeydown = (event) => update(event);

console.log(document.fonts.keys());

//Initial run
setFormPlaceholders();

createSVG();
loadWebFonts();
// setTimeout(() => rerenderSVG(), 40);
// setTimeout(() => document.body.style.opacity = 1, 800);

// Select the node that will be observed for mutations
const targetNode = document.getElementById("svg-container");

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true};
// Create an observer instance linked to the callback function
const observer = new MutationObserver(observerCallback);

// Start observing the target node for configured mutations
targetNode.onfocus = () => observer.observe(targetNode, config);
targetNode.onblur = () => {
    observer.disconnect();
    cursorElement = undefined;
}
targetNode.onkeydown = (event) => {
    //check if backspace was pressed
    if(window.getSelection() && window.getSelection().focusNode){
        const fNode = window.getSelection().focusNode;
        const caretPos = window.getSelection().focusOffset;
        const text = fNode.textContent;
        if (event.key === "Backspace" && caretPos == 0){
            event.preventDefault();
            if (lines.includes(text)){
                const index = lines.indexOf(text);
                if (index > 0){
                    const tempCursorElement = index - 1;
                    const tempCaretPosition = lines[index - 1].length;
                    console.log("cursorElement: ", tempCursorElement);
                    console.log("caretPosition: ", tempCaretPosition);
                    lines[index - 1] += text;
                    lines = lines.filter((line, i) => i !== index);
                    rerenderSVG();
                    cursorElement = tempCursorElement;
                    caretPosition = tempCaretPosition;
                    loadCaretPosition();
                }
            }
        }
        else if (event.key === "Enter" && (caretPos < 2 || !lines.includes(text))){
            event.preventDefault();
            if (caretPos === 1 && lines.includes(text)){
                const newText = text.slice(0, caretPos);
                const index = lines.indexOf(text);
                lines[index] = text.slice(caretPos);
                lines.splice(index, 0, newText);
                rerenderSVG();
                cursorElement = index + 1;
                caretPosition = 0;
                loadCaretPosition();
            }
        }
    }
};

//----------------------------------------------------------------------------
//Function definitions
// Callback function to execute when mutations are observed
function observerCallback(mutationList, observer){
    for (const mutation of mutationList) {
        if (mutation.type === "characterData") {
            console.log("The characterData was modified.");
            console.log(mutation.target.data);
            console.log(mutation.oldValue);
            const newText = mutation.target.data;
            if(lines.includes(mutation.oldValue)){
                console.log("Found a match");
                if (mutation.oldValue.trim().endsWith(newText.trim()) && newText.length < mutation.oldValue.length - 1){
                    const index = lines.indexOf(mutation.oldValue);
                    console.log("line split detected");
                    lines[lines.indexOf(mutation.oldValue)] = newText;
                    lines.splice(index, 0, mutation.oldValue.slice(0, mutation.oldValue.length - newText.length));
                    cursorElement = lines.indexOf(mutation.oldValue) + 1;
                    caretPosition = 0;
                } 
                else {
                    lines[lines.indexOf(mutation.oldValue)] = newText;
                }
                rerenderSVG();
            } else if (mutation.oldValue === infoText){
                infoText = newText;
                rerenderSVG();
            } else if (mutation.oldValue === quoteChar){
                quoteChar = newText;
                rerenderSVG();
            } else {
                console.log("No match found");
            }
        }
    }
};

function saveSVGParameters(){
    const rows = [
        ["background-color", encodeURIComponent(svgBackgroundColor)],
        ["blur-amount", blurAmount],
        ["blurred-back-clone-effect", blurCloneEffect],
        ["blurred-back-effect", blurEffect],
        ["font-color", encodeURIComponent(fontColor)],
        ["font-family", fontFamilyCustom],
        ["font-size", fontSizeCustom],
        ["font-weight", fontWeightCustom],
        ["footer-color",encodeURIComponent(infoTextColor)],
        ["footer-font-family", infoFontFamily],
        ["footer-shift-X", infoShiftX],
        ["footer-text", infoText],
        ["glyph-color",encodeURIComponent(quoteCharacterColor)],
        ["glyph-font-family", quoteCharacterFontFamily],
        ["glyph-shift-X", quoteCharacterShiftX],
        ["glyph-shift-Y", quoteCharacterShiftY],
        ["glyph-position-X", quoteCharPositionX],
        ["glyph-position-Y", quoteCharPositionY],
        ["glyph-size", quoteCharacterSize],
        ["image-url", imageURL],
        ["image-position-X", imagePositionX],
        ["image-position-Y", imagePositionY],
        ["image-width", imageWidth],
        ["image-height", imageHeight],
        ["info-padding", infoPaddingFromBottom],
        ["info-position-X", infoPositionX],
        ["info-position-Y", infoPositionY],
        ["info-size", infoFontSize],
        ["info-weight", infoFontWeight],
        ["lines", encodeURIComponent(lines.join('\\'))],
        ["line-padding-X", linePaddingX],
        ["line-padding-Y", linePaddingY],
        ["line-separation", lineSeparation],
        ["quote-character", quoteChar],
        ["quote-box-opacity", quoteBackgroundOpacity],
        ["quote-color", encodeURIComponent(quoteBackgroundColor)],
        ["quote-position-X", quotePositionX],
        ["quote-position-Y", quotePositionY],
        ["mask-opacity", imageDarkMaskOpacity],
        ["mask-color", encodeURIComponent(imageMaskColor)],
        ["svg-width", width],
        ["svg-height", height],
        ["quote-shadow-effect", quoteShadowEffect],
        ["quote-shadow-blur-amount", quoteShadowBlurAmount],
        ["quote-shadow-shift-X", quoteShadowShiftX],
        ["quote-shadow-shift-Y", quoteShadowShiftY],
        ["quote-shadow-color", encodeURIComponent(quoteShadowColor)],
        ["image-shadow-effect", imageShadowEffect],
        ["image-shadow-blur-amount", imageShadowBlurAmount],
        ["image-shadow-shift-X", imageShadowShiftX],
        ["image-shadow-shift-Y", imageShadowShiftY],
        ["image-shadow-color", encodeURIComponent(imageShadowColor)]
    ];

    let csvContent = "data:text/csv;charset=utf8,";
    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", loadFilename + ".csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

function downloadSVG(){
    let canvasH = document.createElement('canvas');
    canvasH.id = "canvas";
    canvasH.width = width;
    canvasH.height = height;
    document.body.appendChild(canvasH);

    const element = document.createElement("a");

    //Remove area backgrounds from svg before downloading
    const dragArrows = document.querySelectorAll("g.drag-arrow");
    dragArrows.forEach((arrow) => {
        arrow.remove();
    });

    //Remove area backgrounds from svg before downloading
    const areas = document.querySelectorAll("rect.area");
    areas.forEach((area) => {
        area.remove();
    });

    let svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let DOMURL = self.URL || self.webkitURL || self;

    let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    element.href = DOMURL.createObjectURL(svg);
    element.download = filename + ".svg";
    document.body.appendChild(element);
    element.click();
    canvas.remove();
    rerenderSVG();
}

function setImageParameters(url, setDimensions) {
    var img = new Image();
    img.onload = function() {
        if (setDimensions){
            imageWidth = parseInt(this.width);
            imageHeight = parseInt(this.height);
        }
        imageRatio = parseInt(this.width)/parseInt(this.height);
    };
    img.src = url;
}

function setParameters(obj){
    width = parseInt(obj["svg-width"]);
    height = parseInt(obj["svg-height"]);
    svgBackgroundColor = obj["background-color"];
    imagePositionX = parseInt(obj["image-position-X"]);
    imagePositionY = parseInt(obj["image-position-Y"]);
    imageWidth = parseInt(obj["image-width"]);
    imageHeight = parseInt(obj["image-height"]);
    imageRatio = imageWidth/imageHeight;
    imageURL = obj["image-url"];
    imageDarkMaskOpacity = obj["mask-opacity"];
    blurEffect = (obj["blurred-back-effect"] === "true");
    blurCloneEffect = (obj["blurred-back-clone-effect"] === "true");
    blurAmount = parseInt(obj["blur-amount"]);
    quotePositionX = parseInt(obj["quote-position-X"]);
    quotePositionY = parseInt(obj["quote-position-Y"]);
    quoteBackgroundColor = obj["quote-color"];
    quoteBackgroundOpacity = obj["quote-box-opacity"];
    lineSeparation = parseInt(obj["line-separation"]);
    linePaddingX = parseInt(obj["line-padding-X"]);
    linePaddingY = parseInt(obj["line-padding-Y"]);
    lines = obj["lines"].split("\\");
    fontFamilyCustom = obj["font-family"];
    fontSizeCustom = parseInt(obj["font-size"]);
    fontWeightCustom = parseInt(obj["font-weight"]);
    fontColor = obj["font-color"];
    quoteCharacterSize = parseInt(obj["glyph-size"]);
    quoteCharacterShiftX = parseInt(obj["glyph-shift-X"]);
    quoteCharacterShiftY = parseInt(obj["glyph-shift-Y"]);
    infoPaddingFromBottom = parseInt(obj["info-padding"]);
    infoFontSize = parseInt(obj["info-size"]);
    infoFontWeight = parseInt(obj["info-weight"]);
    infoText = obj["footer-text"];
    imageMaskColor = obj["mask-color"];
    quoteCharacterColor = obj["glyph-color"];
    infoTextColor = obj["footer-color"];
    quoteCharacterFontFamily = obj["glyph-font-family"];
    infoFontFamily = obj["footer-font-family"];
    infoShiftX = parseInt(obj["footer-shift-X"]);
    imageShadowEffect = (obj["image-shadow-effect"] === "true");
    imageShadowBlurAmount = parseInt(obj["image-shadow-blur-amount"]);
    imageShadowShiftX = parseInt(obj["image-shadow-shift-X"]);
    imageShadowShiftY = parseInt(obj["image-shadow-shift-Y"]);
    imageShadowColor = obj["image-shadow-color"];
    quoteShadowEffect = (obj["quote-shadow-effect"] === "true");
    quoteShadowBlurAmount = parseInt(obj["quote-shadow-blur-amount"]);
    quoteShadowShiftX = parseInt(obj["quote-shadow-shift-X"]);
    quoteShadowShiftY = parseInt(obj["quote-shadow-shift-Y"]);
    quoteShadowColor = obj["quote-shadow-color"];
    quoteChar = obj["quote-character"];
    quoteCharPositionX = parseInt(obj["glyph-position-X"]);
    quoteCharPositionY = parseInt(obj["glyph-position-Y"]);
    infoPositionX = parseInt(obj["info-position-X"]);
    infoPositionY = parseInt(obj["info-position-Y"]);

    loadWebFonts();
}

//The following function Constructs the SVG
function createSVG(){
    //Create empty SVG element
    const canvas = Snap("#LyricCard");
    canvas.attr({id: "LyricCard", width: width, height: height});
    // var canvas = Snap(width, height);
    // canvas.attr({id: "LyricCard"});

    const backgroundGroup = canvas.group();
    backgroundGroup.attr({id: "background-group"});

    //Setting up blur and shadow effects
    const blurFilter = canvas.filter(Snap.filter.blur(blurAmount, blurAmount));
    const quoteShadowFilter = canvas.filter(Snap.filter.shadow(quoteShadowShiftX, quoteShadowShiftY, quoteShadowBlurAmount, quoteShadowColor, parseFloat(shadowOpacity)));
    const imageShadowFilter = canvas.filter(Snap.filter.shadow(imageShadowShiftX, imageShadowShiftY, imageShadowBlurAmount, imageShadowColor, parseFloat(shadowOpacity)));

    //Setting up SVG background color
    const svgBackground = canvas.rect(imagePositionX, imagePositionY, imageWidth, imageHeight);
    svgBackground.attr({fill: svgBackgroundColor});

    backgroundGroup.add(svgBackground);

    //Setting up background image with "dimming" mask and blur effects
    if (blurCloneEffect){
        let blurredHeight = height;
        let blurredWidth = width;
        if(width/height > imageRatio){
            blurredWidth = width + 2*blurAmount;
            blurredHeight = blurredWidth/imageRatio;
        }
        else {
            blurredHeight = height + 2*blurAmount;
            blurredWidth = blurredHeight*imageRatio;
        }
        
        var mask = svgMask ?? canvas.rect(imagePositionX, imagePositionY, imageWidth, imageHeight);
        mask.attr({fill: imageMaskColor, x: imagePositionX, y: imagePositionY, width: imageWidth, height: imageHeight});
        mask.attr({opacity: imageDarkMaskOpacity});
        
        let backgroundImage = svgBackgroundImage && svgBackgroundImage.attr("href") === imageURL ? svgBackgroundImage : canvas.image(imageURL, imagePositionX, imagePositionY, imageWidth, imageHeight);
        backgroundImage.attr({x: imagePositionX, y: imagePositionY, width: imageWidth, height: imageHeight});
        backgroundImage.attr({filter: blurFilter});

        svgMask = mask;
        svgBackgroundImage = backgroundImage;
        backgroundGroup.add(imageShadowFilter, blurFilter, backgroundImage, mask);
    }
    else{
        let backgroundImage = svgBackgroundImage && svgBackgroundImage.attr("href") === imageURL ? svgBackgroundImage : canvas.image(imageURL, imagePositionX, imagePositionY, imageWidth, imageHeight);
        backgroundImage.attr({x: imagePositionX, y: imagePositionY, width: imageWidth, height: imageHeight});

        var mask = svgMask ?? canvas.rect(imagePositionX, imagePositionY, imageWidth, imageHeight);
        mask.attr({fill: imageMaskColor, x: imagePositionX, y: imagePositionY, width: imageWidth, height: imageHeight});
        mask.attr({opacity: imageDarkMaskOpacity});

        if(blurEffect){
            backgroundImage.attr({filter: blurFilter});
        }

        svgBackgroundImage = backgroundImage;
        svgMask = mask;
        backgroundGroup.add(imageShadowFilter, blurFilter, backgroundImage, mask);
    }

    if (imageShadowEffect){
        backgroundGroup.attr({filter: imageShadowFilter});
    }

    let backGroupDragStartX = 0;
    let backGroupDragStartY = 0;
    let dragged = false;
    backgroundGroup.drag( 
        function(dx, dy, posx, posy) { 
            dragged = dx*dx + dy*dy > 2;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                const backGroupEl = this;
                console.log("original transform: ", this.data('origTransform'));
                backGroupEl.transform(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
            }
        },
        function(posx, posy){
            dragged = false;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                this.data('origTransform', this.transform().local);
                backGroupDragStartX = this.getBBox().x;
                backGroupDragStartY = this.getBBox().y;
                console.log("Move started");
            }
        },
        function(){
            console.log("cursorElement: ", cursorElement);
            console.log("parentNode: ", window.getSelection()?.focusNode?.parentNode?.nodeName);
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                console.log("Move stopped");
                // linesGroupElement = document.getElementById("linesGroup");
                // console.log(linesGroupElement.getBBox().x);
                const delX = this.getBBox().x - backGroupDragStartX;
                const delY = this.getBBox().y - backGroupDragStartY;
                
                imagePositionX += delX;
                imagePositionY += delY;
                rerenderSVG();
            } else if (!dragged){
                cursorElement = 0;
                caretPosition = 0;
                loadCaretPosition();
            }
        }
    );

    const quoteGroup = canvas.group();
    const linesGroup = canvas.group();
    linesGroup.attr({id: "linesGroup"});
    
    for (let step = 0; step < lines.length; step++) {

        let linePositionX = quotePositionX + 1.2*linePaddingX;
        let linePositionY = quotePositionY + linePaddingY + step*lineSeparation;
        let lineText = canvas.text(linePositionX, linePositionY, lines[step])
        lineText.attr({fontFamily: fontFamilyCustom});
        lineText.attr({fontSize: ""+fontSizeCustom+"pt"});
        lineText.attr({fill: fontColor});
        lineText.attr({fontWeight: fontWeightCustom})

        let blockWidth = lineText.getBBox().width;
        let blockHeight = lineText.getBBox().height;
        let lineBlock = canvas.rect(quotePositionX, quotePositionY + step*lineSeparation - 0.72*blockHeight - 0.09*linePaddingY, blockWidth + 2*linePaddingX, blockHeight + 2*linePaddingY)
        lineBlock.attr({fill: quoteBackgroundColor});
        lineBlock.attr({opacity: quoteBackgroundOpacity});

        linesGroup.add(lineBlock, lineText)
    }

    quoteGroup.add(linesGroup);

    const linesDragArrowGroup = canvas.group();
    linesDragArrowGroup.attr({class: "drag-arrow lines"})

    const quoteGroupBBox = quoteGroup.getBBox();
    const dragArrowVerticalEdge = canvas.line(quoteGroupBBox.x - dragArrowSpacing, quoteGroupBBox.y2 + dragArrowSpacing - dragArrowHeight + 1, quoteGroupBBox.x - dragArrowSpacing, quoteGroupBBox.y2 + dragArrowSpacing);
    dragArrowVerticalEdge.attr({stroke: dragArrowColor, strokeWidth: 3});
    const dragArrowHorizontalEdge = canvas.line(quoteGroupBBox.x - dragArrowSpacing - 1, quoteGroupBBox.y2 + dragArrowSpacing, quoteGroupBBox.x - dragArrowSpacing + dragArrowWidth, quoteGroupBBox.y2 + dragArrowSpacing);
    dragArrowHorizontalEdge.attr({stroke: dragArrowColor, strokeWidth: 3});
    const dragArrowBox = canvas.rect(quoteGroupBBox.x - 0.7*dragArrowSpacing - dragArrowWidth, quoteGroupBBox.y2 + 0.7*dragArrowSpacing - dragArrowHeight, 1.9*dragArrowWidth, 1.9*dragArrowHeight);
    dragArrowBox.attr({opacity: 0});
    linesDragArrowGroup.add(dragArrowBox, dragArrowVerticalEdge, dragArrowHorizontalEdge);

    linesGroup.add(linesDragArrowGroup);

    const linesGroupBBox = linesGroup.getBBox();
    const linesBackgroundRect = canvas.rect(linesGroupBBox.x - 5*linePaddingX, linesGroupBBox.y - 4*linePaddingY, linesGroupBBox.width + 10*linePaddingX, linesGroupBBox.height + 8*linePaddingY);
    linesBackgroundRect.attr({class: "lines-background area", opacity: 0});
    linesGroup.prepend(linesBackgroundRect);
    
    var lineGroupDragStartX = 0;
    var lineGroupDragStartY = 0;

    linesBackgroundRect.drag( 
        function(dx, dy, posx, posy) { 
            dragged = true;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                const quoteGroupEl = this.parent();
                console.log("original transform: ", this.data('origTransform'));
                quoteGroupEl.transform(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
            }
        },
        function(posx, posy){
            dragged = false;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                this.data('origTransform', this.transform().local);
                lineGroupDragStartX = this.parent().getBBox().x;
                lineGroupDragStartY = this.parent().getBBox().y;
                console.log("Move started");
            }
        },
        function(){
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                console.log("Move stopped");
                // linesGroupElement = document.getElementById("linesGroup");
                // console.log(linesGroupElement.getBBox().x);
                console.log(this.parent());
                quotePositionX += this.parent().getBBox().x - lineGroupDragStartX;
                quotePositionY += this.parent().getBBox().y - lineGroupDragStartY;
                rerenderSVG();
            } else if (!dragged){
                cursorElement = 0;
                caretPosition = 0;
                loadCaretPosition();
            }
        }
    );

    const quoteCharGroup = canvas.group();

    const quoteCharacter = canvas.text(quoteCharPositionX, quoteCharPositionY, quoteChar);
    quoteCharacter.attr({fontFamily: quoteCharacterFontFamily});
    quoteCharacter.attr({fontSize: ""+quoteCharacterSize+"pt"});
    quoteCharacter.attr({fill: quoteCharacterColor});
    quoteCharGroup.add(quoteCharacter);

    const charDragArrowGroup = canvas.group();
    charDragArrowGroup.attr({class: "drag-arrow char"})
    const quoteCharBBox = quoteCharacter.getBBox();
    const charDragArrowVertEdge = canvas.line(quoteCharBBox.x - 0.45*dragArrowSpacing, quoteCharBBox.y + 1.3*dragArrowSpacing - 1, quoteCharBBox.x - 0.45*dragArrowSpacing, quoteCharBBox.y + 1.3*dragArrowSpacing + dragArrowHeight - 2);
    charDragArrowVertEdge.attr({stroke: dragArrowColor, strokeWidth: 3});
    const charDragArrowHorizEdge = canvas.line(quoteCharBBox.x - 0.45*dragArrowSpacing - 1, quoteCharBBox.y + 1.3*dragArrowSpacing, quoteCharBBox.x - 0.45*dragArrowSpacing + dragArrowWidth, quoteCharBBox.y + 1.3*dragArrowSpacing);
    charDragArrowHorizEdge.attr({stroke: dragArrowColor, strokeWidth: 3});
    const charDragArrowBox = canvas.rect(quoteCharBBox.x - 0.88*dragArrowSpacing, quoteCharBBox.y + 0.8*dragArrowSpacing, 1.9*dragArrowWidth, 1.8*dragArrowHeight);
    charDragArrowBox.attr({opacity: 0});
    charDragArrowGroup.add(charDragArrowBox, charDragArrowVertEdge, charDragArrowHorizEdge);
    
    quoteCharGroup.add(charDragArrowGroup);

    const quoteCharGroupBBox = quoteCharGroup.getBBox();
    const quoteCharBackgroundRect = canvas.rect(quoteCharGroupBBox.x - 4*linePaddingX, quoteCharGroupBBox.y + 1*linePaddingY, quoteCharGroupBBox.width + 6*linePaddingX, quoteCharGroupBBox.height - 2*linePaddingY);
    quoteCharBackgroundRect.attr({class: "char-background area", opacity: 0});
    quoteCharGroup.prepend(quoteCharBackgroundRect);

    quoteCharBackgroundRect.drag( 
        function(dx, dy, posx, posy) { 
            dragged = true;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                const quoteCharGroupEl = this.parent();
                console.log("original transform: ", this.data('origTransform'));
                quoteCharGroupEl.transform(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
            }
        },
        function(posx, posy){
            dragged = false;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                this.data('origTransform', this.transform().local);
                lineGroupDragStartX = this.parent().getBBox().x;
                lineGroupDragStartY = this.parent().getBBox().y;
                console.log("Move started");
            }
        },
        function(){
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                console.log("Move stopped");
                // linesGroupElement = document.getElementById("linesGroup");
                // console.log(linesGroupElement.getBBox().x);
                console.log(this.parent());
                quoteCharPositionX += this.parent().getBBox().x - lineGroupDragStartX;
                quoteCharPositionY += this.parent().getBBox().y - lineGroupDragStartY;
                rerenderSVG();
            } else if (!dragged){
                cursorElement = 0;
                caretPosition = 0;
                loadCaretPosition();
            }
        }
    );

    quoteGroup.add(quoteCharGroup);

    if (quoteShadowEffect){
        quoteGroup.attr({filter: quoteShadowFilter});
    }

    const footerGroup = canvas.group();
    
    const infoTextElement = canvas.text(infoPositionX, infoPositionY, infoText);
    infoTextElement.attr({fontFamily: infoFontFamily});
    infoTextElement.attr({fontSize: ""+infoFontSize+"pt"});
    infoTextElement.attr({fill: infoTextColor});
    infoTextElement.attr({fontWeight: infoFontWeight});
    footerGroup.add(infoTextElement);

    const infoDragArrowGroup = canvas.group();
    infoDragArrowGroup.attr({class: "drag-arrow info"})
    const infoBBox = infoTextElement.getBBox();
    const infoDragArrowVertEdge = canvas.line(infoBBox.x - dragArrowSpacing + 2, infoBBox.y2 + 0.4*dragArrowSpacing - dragArrowHeight + 1, infoBBox.x - dragArrowSpacing + 2, infoBBox.y2 + 0.4*dragArrowSpacing);
    infoDragArrowVertEdge.attr({stroke: dragArrowColor, strokeWidth: 3});
    const infoDragArrowHorizEdge = canvas.line(infoBBox.x - dragArrowSpacing + 1, infoBBox.y2 + 0.4*dragArrowSpacing, infoBBox.x - dragArrowSpacing + 2 + dragArrowWidth, infoBBox.y2 + 0.4*dragArrowSpacing);
    infoDragArrowHorizEdge.attr({stroke: dragArrowColor, strokeWidth: 3});
    const infoDragArrowBox = canvas.rect(infoBBox.x - 0.65*dragArrowSpacing - dragArrowWidth, infoBBox.y2 + 0.1*dragArrowSpacing - dragArrowHeight, 1.9*dragArrowWidth, 1.9*dragArrowHeight);
    infoDragArrowBox.attr({opacity: 0});
    infoDragArrowGroup.add(infoDragArrowBox, infoDragArrowVertEdge, infoDragArrowHorizEdge);
    
    footerGroup.add(infoDragArrowGroup);

    const footerGroupBBox = footerGroup.getBBox();
    const footerBackgroundRect = canvas.rect(footerGroupBBox.x - 5*linePaddingX, footerGroupBBox.y - 2.5*linePaddingY, footerGroupBBox.width + 10*linePaddingX, footerGroupBBox.height + 5*linePaddingY);
    footerBackgroundRect.attr({class: "footer-background area", opacity: 0});
    footerGroup.prepend(footerBackgroundRect);

    footerBackgroundRect.drag( 
        function(dx, dy, posx, posy) { 
            dragged = true;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                const infoGroupEl = this.parent();
                console.log("original transform: ", this.data('origTransform'));
                infoGroupEl.transform(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
            }
        },
        function(posx, posy){
            dragged = false;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                this.data('origTransform', this.transform().local);
                lineGroupDragStartX = this.parent().getBBox().x;
                lineGroupDragStartY = this.parent().getBBox().y;
                console.log("Move started");
            }
        },
        function(){
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                console.log("Move stopped");
                // linesGroupElement = document.getElementById("linesGroup");
                // console.log(linesGroupElement.getBBox().x);
                console.log(this.parent());
                infoPositionX += this.parent().getBBox().x - lineGroupDragStartX;
                infoPositionY += this.parent().getBBox().y - lineGroupDragStartY;
                rerenderSVG();
            } else if (!dragged){
                cursorElement = 0;
                caretPosition = 0;
                loadCaretPosition();
            }
        }
    );

    quoteGroup.add(footerGroup);

    const quoteDragArrowGroup = canvas.group();
    quoteDragArrowGroup.attr({class: "drag-arrow quote"})
    const quoteBBox = quoteGroup.getBBox();
    const quoteDragArrowVertEdge = canvas.line(quoteBBox.x2 + 0.7*dragArrowSpacing, (infoBBox.y2 > quoteGroupBBox.y2 ? infoBBox.y2 : quoteBBox.y2) + 1.1*dragArrowSpacing - 2*dragArrowHeight + 1, quoteBBox.x2 + 0.7*dragArrowSpacing, (infoBBox.y2 > quoteGroupBBox.y2 ? infoBBox.y2 : quoteBBox.y2) + 1.1*dragArrowSpacing);
    quoteDragArrowVertEdge.attr({stroke: dragArrowColor, strokeWidth: 6});
    const quoteDragArrowHorizEdge = canvas.line(quoteBBox.x2 + 0.7*dragArrowSpacing - 2*dragArrowWidth - 2, (infoBBox.y2 > quoteGroupBBox.y2 ? infoBBox.y2 : quoteBBox.y2) + 1.1*dragArrowSpacing, quoteBBox.x2 + 0.7*dragArrowSpacing + 3, (infoBBox.y2 > quoteGroupBBox.y2 ? infoBBox.y2 : quoteBBox.y2) + 1.1*dragArrowSpacing);
    quoteDragArrowHorizEdge.attr({stroke: dragArrowColor, strokeWidth: 6});
    const quoteDragArrowBox = canvas.rect(quoteBBox.x2 - 1.75*dragArrowWidth, (infoBBox.y2 > quoteGroupBBox.y2 ? infoBBox.y2 : quoteBBox.y2) - 0.25*dragArrowSpacing - dragArrowHeight, 3.35*dragArrowWidth, 3.2*dragArrowHeight);
    quoteDragArrowBox.attr({opacity: 0});
    quoteDragArrowGroup.add(quoteDragArrowBox, quoteDragArrowVertEdge, quoteDragArrowHorizEdge);
    
    quoteGroup.add(quoteDragArrowGroup);

    const fullQuoteGroupBBox = quoteGroup.getBBox();
    const quoteBackgroundRect = canvas.rect(fullQuoteGroupBBox.x - 1*linePaddingX, fullQuoteGroupBBox.y - 0*linePaddingY, fullQuoteGroupBBox.width + 7*linePaddingX, fullQuoteGroupBBox.height + 3*linePaddingY);
    quoteBackgroundRect.attr({class: "quote-background area", opacity: 0});
    quoteGroup.prepend(quoteBackgroundRect);

    quoteBackgroundRect.drag( 
        function(dx, dy, posx, posy) { 
            dragged = true;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                const quoteGroupEl = this.parent();
                console.log("original transform: ", this.data('origTransform'));
                quoteGroupEl.transform(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
            }
        },
        function(posx, posy){
            dragged = false;
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                this.data('origTransform', this.transform().local);
                lineGroupDragStartX = this.parent().getBBox().x;
                lineGroupDragStartY = this.parent().getBBox().y;
                console.log("Move started");
            }
        },
        function(){
            if (cursorElement !== undefined || window.getSelection()?.focusNode?.parentNode?.nodeName === "text"){
                console.log("Move stopped");
                // linesGroupElement = document.getElementById("linesGroup");
                // console.log(linesGroupElement.getBBox().x);
                console.log(this.parent());
                const delX = this.parent().getBBox().x - lineGroupDragStartX;
                const delY = this.parent().getBBox().y - lineGroupDragStartY;
                quotePositionX += delX;
                quotePositionY += delY;
                quoteCharPositionX += delX;
                quoteCharPositionY += delY;
                infoPositionX += delX;
                infoPositionY += delY;
                rerenderSVG();
            } else if (!dragged){
                cursorElement = 0;
                caretPosition = 0;
                loadCaretPosition();
            }
        }
    );

    //Adding nice google fonts for later use
    const fonts = Snap.parse('<style>' + fontCSSUrlList.map(url => '@import url("' + url + '");').join('') + '</style>');
    canvas.append(fonts);

    // quoteDragArrowGroup.drag( 
    //     function(dx, dy, posx, posy) { 
    //         const quoteGroupEl = this.parent();
    //         const scaleX = 1 + (dx / quoteGroupEl.getBBox().width);
    //         const scaleY = 1 + (dy / quoteGroupEl.getBBox().height);
    //         const scale = dx*dx > dy*dy ? scaleX : scaleY;
    //         console.log("scaleX: ", scaleX);
    //         console.log("original transform: ", this.data('origTransform'));
    //         quoteGroupEl.transform(this.data('origTransform') + (this.data('origTransform') ? "S" : "s") + scale.toFixed(2));
    //     },
    //     function(posx, posy){
    //         this.data('origTransform', this.transform().local);
    //         lineGroupDragStartX = this.parent().getBBox().x;
    //         lineGroupDragStartY = this.parent().getBBox().y;
    //         console.log("Move started");
    //     },
    //     function(){
    //         console.log("Move stopped");
    //         // linesGroupElement = document.getElementById("linesGroup");
    //         // console.log(linesGroupElement.getBBox().x);
    //         console.log(this.parent());
    //         const delX = this.parent().getBBox().x - lineGroupDragStartX;
    //         const delY = this.parent().getBBox().y - lineGroupDragStartY;
    //         quotePositionX += delX;
    //         quotePositionY += delY;
    //         quoteCharPositionX += delX;
    //         quoteCharPositionY += delY;
    //         infoPositionX += delX;
    //         infoPositionY += delY;
    //         rerenderSVG();
    //     }
    // );

    //let bufferSpace = document.createElement('div');
    //bufferSpace.className = 'end-buffer-space';
    //document.body.append(bufferSpace);
}

/** This function provides a place for doing things before
     and after generating the SVG.
**/
function rerenderSVG(){
    //First save the caret position
    saveCaretPosition();

    //Next remove contents of SVG (and other elements previously generated) that is to be replaced
    let svgElement = document.getElementsByTagName("svg")[0];
    // empty contents of svgElement
    svgElement.innerHTML = '';

    // // remove svgElement
    // svgElement.remove();

    //Generated new SVG
    createSVG();

    //Restore caret position
    loadCaretPosition();
    setFormPlaceholders();
}

//Function to save the caret position in the SVG
function saveCaretPosition(){
    if (window.getSelection && window.getSelection().focusNode) {
        const selection = window.getSelection();
        const cNode = selection.focusNode;
        const pNode = cNode.parentNode;
        if (pNode.nodeName === 'text'){
            const text = cNode.textContent;
            if (lines.includes(text)){
                cursorElement = lines.indexOf(text);
            } else if (text === infoText){
                cursorElement = "infoText";
            } else if (text === quoteChar){
                cursorElement = "quoteChar";
            } else {
                cursorElement = undefined;
            }
            caretPosition = selection.focusOffset ?? 0;
        }
        else {
            cursorElement = undefined;
            caretPosition = 0;
        }
    }
    else {
        cursorElement = undefined;
        caretPosition = 0;
    }
}

//Function to load the caret position in the SVG
function loadCaretPosition(){
    //The following if statement uses elements according to the ASSUMED structure of the SVG.
    //If the structure changes, this function will need to be updated!
    if (cursorElement !== undefined && window.getSelection()){
        const quoteTextGroup = document.getElementById("LyricCard").childNodes[1];
        let sel = window.getSelection();
        if (cursorElement === "infoText"){
            let infoTextElement = quoteTextGroup.childNodes[3].childNodes[1];
            if (infoTextElement){
                let range = document.createRange();
                range.setStart(infoTextElement.childNodes[0], caretPosition);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
        else if (cursorElement === "quoteChar"){
            let quoteCharElement = quoteTextGroup.childNodes[2].childNodes[1];
            if (quoteCharElement){
                let range = document.createRange();
                range.setStart(quoteCharElement.childNodes[0], caretPosition);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
        else if (typeof cursorElement === 'number' && cursorElement < lines.length){
            let lineElement = quoteTextGroup.childNodes[1].childNodes[2*cursorElement + 2];
            console.log("lineElement: ", lineElement);
            if (lineElement){
                let range = document.createRange();
                range.setStart(lineElement.childNodes[0], caretPosition);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
}

function setFormPlaceholders(){
    //SVG section
    document.getElementsByName("svg-width")[0].placeholder = width;
    document.getElementsByName("svg-height")[0].placeholder = height;

    document.getElementsByName("svg-width")[0].defaultValue = width;
    document.getElementsByName("svg-height")[0].defaultValue = height;

    //Background image section
    document.getElementsByName("image-url")[0].placeholder = imageURL;
    document.getElementsByName("image-position-X")[0].placeholder = imagePositionX;
    document.getElementsByName("image-position-Y")[0].placeholder = imagePositionY;
    document.getElementsByName("image-width")[0].placeholder = imageWidth;
    document.getElementsByName("image-height")[0].placeholder = imageHeight;

    document.getElementsByName("image-position-X")[0].defaultValue = imagePositionX;
    document.getElementsByName("image-position-Y")[0].defaultValue = imagePositionY;
    document.getElementsByName("image-width")[0].defaultValue = imageWidth;
    document.getElementsByName("image-height")[0].defaultValue = imageHeight;

    //Quote section
    document.getElementsByName("quote-position-X")[0].placeholder = quotePositionX;
    document.getElementsByName("quote-position-Y")[0].placeholder = quotePositionY;
    document.getElementsByName("line-padding-X")[0].placeholder = linePaddingX;
    document.getElementsByName("line-padding-Y")[0].placeholder = linePaddingY;
    document.getElementsByName("line-separation")[0].placeholder = lineSeparation;
    document.getElementsByName("quote-color")[0].placeholder = quoteBackgroundColor;

    document.getElementsByName("quote-position-X")[0].defaultValue = quotePositionX;
    document.getElementsByName("quote-position-Y")[0].defaultValue = quotePositionY;
    document.getElementsByName("line-padding-X")[0].defaultValue = linePaddingX;
    document.getElementsByName("line-padding-Y")[0].defaultValue = linePaddingY;
    document.getElementsByName("line-separation")[0].defaultValue = lineSeparation;
    document.getElementsByName("quote-color")[0].defaultValue = quoteBackgroundColor;

    let linesPlaceholder = "";
    for (let step = 0; step < lines.length; step++){
        if (step != 0){
            linesPlaceholder += "\\";
        }
        linesPlaceholder += lines[step];
    }
    document.getElementsByName("lines")[0].placeholder = linesPlaceholder;
    
    //Text section
    document.getElementsByName("font-family")[0].placeholder = fontFamilyCustom;
    document.getElementsByName("font-size")[0].placeholder = fontSizeCustom;
    document.getElementsByName("font-color")[0].placeholder = fontColor;
    
    document.getElementsByName("font-family")[0].defaultValue = fontFamilyCustom;
    document.getElementsByName("font-size")[0].defaultValue = fontSizeCustom;
    document.getElementsByName("font-color")[0].defaultValue = fontColor;
    
    //Footer
    document.getElementsByName("info-padding")[0].placeholder = height - infoPositionY;
    document.getElementsByName("info-size")[0].placeholder = infoFontSize;
    document.getElementsByName("footer-text")[0].placeholder = infoText;
    
    document.getElementsByName("info-padding")[0].defaultValue = height - infoPositionY;
    document.getElementsByName("info-size")[0].defaultValue = infoFontSize;
    
    //Advanced section
    document.getElementsByName("glyph-size")[0].placeholder = quoteCharacterSize;
    document.getElementsByName("info-weight")[0].placeholder = infoFontWeight;
    document.getElementsByName("font-weight")[0].placeholder = fontWeightCustom;
    document.getElementsByName("quote-box-opacity")[0].placeholder = quoteBackgroundOpacity;
    document.getElementsByName("glyph-size")[0].placeholder = quoteCharacterSize;
    document.getElementsByName("mask-opacity")[0].placeholder = imageDarkMaskOpacity;
    document.getElementsByName("glyph-shift-X")[0].placeholder = quotePositionX - quoteCharPositionX;
    document.getElementsByName("glyph-shift-Y")[0].placeholder = quotePositionY - quoteCharPositionY;
    document.getElementsByName("background-color")[0].placeholder = svgBackgroundColor;
    document.getElementsByName("mask-color")[0].placeholder = imageMaskColor;
    document.getElementsByName("blur-amount")[0].placeholder = blurAmount;
    document.getElementsByName("glyph-color")[0].placeholder = quoteCharacterColor;
    document.getElementsByName("footer-color")[0].placeholder = infoTextColor;
    document.getElementsByName("footer-font-family")[0].placeholder = infoFontFamily;
    document.getElementsByName("glyph-font-family")[0].placeholder = quoteCharacterFontFamily;
    document.getElementsByName("footer-shift-X")[0].placeholder = infoShiftX;
    document.getElementsByName("quote-shadow-shift-X")[0].placeholder = quoteShadowShiftX;
    document.getElementsByName("quote-shadow-shift-Y")[0].placeholder = quoteShadowShiftY;
    document.getElementsByName("quote-shadow-blur-amount")[0].placeholder = quoteShadowBlurAmount;
    document.getElementsByName("quote-shadow-color")[0].placeholder = quoteShadowColor;
    document.getElementsByName("image-shadow-shift-X")[0].placeholder = imageShadowShiftX;
    document.getElementsByName("image-shadow-shift-Y")[0].placeholder = imageShadowShiftY;
    document.getElementsByName("image-shadow-blur-amount")[0].placeholder = imageShadowBlurAmount;
    document.getElementsByName("image-shadow-color")[0].placeholder = imageShadowColor;
    
    document.getElementsByName("lines")[0].defaultValue = linesPlaceholder;
    document.getElementsByName("glyph-size")[0].defaultValue = quoteCharacterSize;
    document.getElementsByName("info-weight")[0].defaultValue = infoFontWeight;
    document.getElementsByName("font-weight")[0].defaultValue = fontWeightCustom;
    document.getElementsByName("quote-box-opacity")[0].defaultValue = quoteBackgroundOpacity;
    document.getElementsByName("glyph-size")[0].defaultValue = quoteCharacterSize;
    document.getElementsByName("mask-opacity")[0].defaultValue = imageDarkMaskOpacity;
    document.getElementsByName("glyph-shift-X")[0].defaultValue = quotePositionX - quoteCharPositionX;
    document.getElementsByName("glyph-shift-Y")[0].defaultValue = quotePositionY - quoteCharPositionY;
    document.getElementsByName("background-color")[0].defaultValue = svgBackgroundColor;
    document.getElementsByName("mask-color")[0].defaultValue = imageMaskColor;
    document.getElementsByName("blurred-back-effect")[0].defaultChecked = blurEffect;
    document.getElementsByName("blurred-back-clone-effect")[0].defaultChecked = blurCloneEffect;
    document.getElementsByName("blur-amount")[0].defaultValue = blurAmount;
    document.getElementsByName("glyph-color")[0].defaultValue = quoteCharacterColor;
    document.getElementsByName("footer-text")[0].defaultValue = infoText;
    document.getElementsByName("footer-color")[0].defaultValue = infoTextColor;
    document.getElementsByName("footer-font-family")[0].defaultValue = infoFontFamily;
    document.getElementsByName("glyph-font-family")[0].defaultValue = quoteCharacterFontFamily;
    document.getElementsByName("quote-shadow-effect")[0].defaultChecked = quoteShadowEffect;
    document.getElementsByName("quote-shadow-shift-X")[0].defaultValue = quoteShadowShiftX;
    document.getElementsByName("quote-shadow-shift-Y")[0].defaultValue = quoteShadowShiftY;
    document.getElementsByName("quote-shadow-blur-amount")[0].defaultValue = quoteShadowBlurAmount;
    document.getElementsByName("quote-shadow-color")[0].defaultValue = quoteShadowColor;
    document.getElementsByName("image-shadow-effect")[0].defaultChecked = imageShadowEffect;
    document.getElementsByName("image-shadow-shift-X")[0].defaultValue = imageShadowShiftX;
    document.getElementsByName("image-shadow-shift-Y")[0].defaultValue = imageShadowShiftY;
    document.getElementsByName("image-shadow-blur-amount")[0].defaultValue = imageShadowBlurAmount;
    document.getElementsByName("image-shadow-color")[0].defaultValue = imageShadowColor;
    

    //Save
    document.getElementsByName("save-filename")[0].placeholder = filename;
    document.getElementsByName("save-settings-filename")[0].placeholder = loadFilename;
}

function update(e){
    if(e.keyCode === 13){
        e.preventDefault(); // Otherwise the form will be submitted

        let rerender = true;
        //Responding to input from Save section
        console.log(e.target)
        const saveForm = document.getElementById('save-form');
        const saveFormData = new FormData(saveForm);
        for (const [key, value] of saveFormData) {
            if (value == ""){
                //console.log("empty value for " + key);
            }
            else {
                if(key == "svg-width"){
                    width = parseInt(value);
                }
                else if (key == "save-filename"){
                    filename = value;
                }
                else if (key == "save-settings-filename"){
                    loadFilename = value;
                }
                else if (key == "svg-height") {
                    height = parseInt(value);
                }
            }
        }

        //Responding to input from Background section
        const backgroundForm = document.getElementById('background-form');
        const backgroundFormData = new FormData(backgroundForm);
        for (const [key, value] of backgroundFormData) {
            if (value == ""){
                //console.log("empty value for " + key);
            }
            else {
                    if(key == "image-url"){
                        imageURL = value;
                        setImageParameters(value, false);
                    }
                    else if (key == "image-position-X"){
                        imagePositionX = parseInt(value);
                    }
                    else if (key == "image-position-Y"){
                        imagePositionY = parseInt(value);
                    }
                    else if (key == "image-width"){
                        imageWidth = parseInt(value);
                    }
                    else if (key == "image-height"){
                        imageHeight = parseInt(value);
                    }
            }
        }

        //Responding to input from Quote section
        const quoteForm = document.getElementById('quote-form');
        const quoteFormData = new FormData(quoteForm);
        for (const [key, value] of quoteFormData) {
            if (value == ""){
                //console.log("empty value for " + key);
            }
            else {
                    if(key == "lines"){
                        lines = value.split("\\");
                    }
                    else if (key == "quote-position-X"){
                        quotePositionX = parseInt(value);
                    }
                    else if (key == "quote-position-Y"){
                        quotePositionY = parseInt(value);
                    }
                    else if (key == "line-separation"){
                        lineSeparation = parseInt(value);
                    }
                    else if(key == "quote-color"){
                        quoteBackgroundColor = value;
                    }
            }
        }

        //Responding to input from Text section
        const textForm = document.getElementById('text-form');
        const textFormData = new FormData(textForm);
        for (const [key, value] of textFormData) {
            if (value == ""){
                //console.log("empty value for " + key);
            }
            else {
                    if (key == "font-color"){
                        fontColor = value;
                    }
                    else if (key == "font-family"){
                        fontFamilyCustom = value;
                        if (!fontList.includes(value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))){
                            loadWebFont(value);
                            rerender = false;
                        }
                    }
                    else if (key == "font-size"){
                        fontSizeCustom = parseInt(value);
                    }

                    rerender && rerenderSVG();     // rerendering SVG because of bug where boxes are not resized correctly (to fit new text size) on first render.
            }
        }

        //Responding to input from Footer section
        const footerForm = document.getElementById('footer-form');
        const footerFormData = new FormData(footerForm);
        for (const [key, value] of footerFormData) {
            if (value == ""){
                //console.log("empty value for " + key);
            }
            else {
                    if (key == "footer-text"){
                        infoText = value;
                    }
                    else if (key == "info-size"){
                        infoFontSize = parseInt(value);
                    }
                    else if (key == "info-padding"){
                        infoPaddingFromBottom = parseInt(value);
                    }
            }
        }

        //Responding to input from Advanced section
        const advancedForm = document.getElementById('advanced-form');
        const advancedFormData = new FormData(advancedForm);
        for (const [key, value] of advancedFormData) {
            if (value == ""){
                //console.log("empty value for " + key);
            }
            else {
                    if (key == "glyph-size"){
                        quoteCharacterSize = parseInt(value);
                    }
                    else if (key == "mask-opacity"){
                        imageDarkMaskOpacity = value;
                    }
                    else if (key == "quote-box-opacity"){
                        quoteBackgroundOpacity = value;
                    }
                    else if (key == "info-weight"){
                        infoFontWeight = parseInt(value);
                    }
                    else if (key == "font-weight"){
                        fontWeightCustom = parseInt(value);
                    }
                    else if (key == "info-padding"){
                        infoPaddingFromBottom = parseInt(value);
                    }
                    else if (key == "glyph-shift-X"){
                        quoteCharacterShiftX = parseInt(value);
                    }
                    else if (key == "glyph-shift-Y"){
                        quoteCharacterShiftY = parseInt(value);
                    }
                    else if (key == "background-color"){
                        svgBackgroundColor = value;
                    }
                    else if (key == "blur-amount"){
                        blurAmount = parseInt(value);
                    }
                    else if (key == "mask-color"){
                        imageMaskColor = value;
                    }
                    else if (key == "glyph-color"){
                        quoteCharacterColor = value;
                    }
                    else if (key == "footer-color"){
                        infoTextColor = value;
                    }
                    else if (key == "glyph-font-family"){
                        quoteCharacterFontFamily = value;
                        if (!fontList.includes(value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))){
                            loadWebFont(value);
                            rerender = false;
                        }
                    }
                    else if (key == "footer-font-family"){
                        infoFontFamily = value;
                        if (!fontList.includes(value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))){
                            loadWebFont(value);
                            rerender = false;
                        }
                    }
                    else if (key == "footer-shift-X"){
                        infoShiftX = parseInt(value);
                    }
                    else if (key == "line-padding-X"){
                        linePaddingX = parseInt(value);
                    }
                    else if (key == "line-padding-Y"){
                        linePaddingY = parseInt(value);
                    }
                    else if (key == "image-shadow-blur-amount"){
                        imageShadowBlurAmount = parseInt(value);
                    }
                    else if (key == "image-shadow-shift-X"){
                        imageShadowShiftX = parseInt(value);
                    }
                    else if (key == "image-shadow-shift-Y"){
                        imageShadowShiftY = parseInt(value);
                    }
                    else if (key == "image-shadow-color"){
                        imageShadowColor = value;
                    }
                    else if (key == "quote-shadow-blur-amount"){
                        quoteShadowBlurAmount = parseInt(value);
                    }
                    else if (key == "quote-shadow-shift-X"){
                        quoteShadowShiftX = parseInt(value);
                    }
                    else if (key == "quote-shadow-shift-Y"){
                        quoteShadowShiftY = parseInt(value);
                    }
                    else if (key == "quote-shadow-color"){
                        quoteShadowColor = value;
                    }

            }
        }

        console.log("FORM WAS SUBMITTED");
        rerender && rerenderSVG();
    }
    else {
        console.log("keyCode: " + e.keyCode);
    }
}

//WebFont loading function
function loadWebFont(fontFamily){
    // make sure first letter of each word in font family is capitalized
    fontFamily = fontFamily.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('+');

    const api_key = import.meta.env.VITE_GOOGLE_FONT_API_KEY;
    // fetch to google fonts api json data
    const font_url = 'https://www.googleapis.com/webfonts/v1/webfonts?capability=VF&key=' + api_key + '&family=' + fontFamily;
    const font_json = api_key && fetch(font_url).then(response => response.json()
    ).then(data => {
        console.log("data: ", data);
        let css_font_url = 'https://fonts.googleapis.com/css2?family=' + fontFamily;
        const font = data.items[0];

        //check if font has axis key
        if (font.hasOwnProperty('axes') && font.axes.length > 0) {
            css_font_url += ':wght@' + font.axes[0].start + '..' + font.axes[0].end;
        }
        else if ( font.variants.length > 0 ) {
            css_font_url += ':wght@';
            css_font_url += font.variants.filter(variant => !variant.includes('italic')).join(';').replace(/regular/g, '400');
        }
        css_font_url += '&display=swap';
        
        if (!fontCSSUrlList.includes(css_font_url)){
            // document.head.innerHTML += '<link rel="stylesheet" href="' + css_font_url + '">';
            fontCSSUrlList.push(css_font_url);
            fontList.push(fontFamily.replace('+', ' '));

            var style = document.createElement('style');
            style.textContent = '@import url("' + css_font_url + '")';

            var newFont = new FontFaceObserver(fontFamily.replace('+', ' '));

            newFont.load().then(function () {
                rerenderSVG();
                // setTimeout(() => rerenderSVG(), 30);
            }, function () {
                rerenderSVG();
            });
            
            // var fi = setInterval(function() {
            //     console.log("status: ", document.fonts.status);
            //     if (document.fonts.check('12px ' + fontFamily.replace('+', ' '))) {
            //         console.log('font loaded');
            //         rerenderSVG();
            //         clearInterval(fi);
            //     }

            // try {
            //     style.sheet.cssRules; // <--- MAGIC: only populated when file is loaded
            //     console.log(style.sheet.cssRules);
            //     setTimeout(() => {
            //         rerenderSVG();
            //         console.log(style.sheet.cssRules);
            //     }, 50);
            //     clearInterval(fi);
            // } catch (e){}
            // }, 20);  

            document.getElementsByTagName('head')[0].appendChild(style);
        }
    });
}

function loadWebFonts(){
    loadWebFont(fontFamilyCustom);
    loadWebFont(quoteCharacterFontFamily);
    loadWebFont(infoFontFamily);
}

//Add current app state to state history
function addState(){
    let state = {
        width: width,
        height: height,
        imageURL: imageURL,
        imagePositionX: imagePositionX,
        imagePositionY: imagePositionY,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        lines: lines,
        quotePositionX: quotePositionX,
        quotePositionY: quotePositionY,
        linePaddingX: linePaddingX,
        linePaddingY: linePaddingY,
        lineSeparation: lineSeparation,
        quoteBackgroundColor: quoteBackgroundColor,
        fontFamilyCustom: fontFamilyCustom,
        fontSizeCustom: fontSizeCustom,
        fontColor: fontColor,
        infoText: infoText,
        infoFontSize: infoFontSize,
        infoPaddingFromBottom: infoPaddingFromBottom,
        quoteCharacterSize: quoteCharacterSize,
        infoFontWeight: infoFontWeight,
        fontWeightCustom: fontWeightCustom,
        quoteBackgroundOpacity: quoteBackgroundOpacity,
        imageDarkMaskOpacity: imageDarkMaskOpacity,
        quoteCharacterShiftX: quoteCharacterShiftX,
        quoteCharacterShiftY: quoteCharacterShiftY,
        svgBackgroundColor: svgBackgroundColor,
        imageMaskColor: imageMaskColor,
        blurAmount: blurAmount,
        quoteCharacterColor: quoteCharacterColor,
        infoTextColor: infoTextColor,
        quoteCharacterFontFamily: quoteCharacterFontFamily,
        infoFontFamily: infoFontFamily,
        infoShiftX: infoShiftX,
        linePaddingX: linePaddingX,
        linePaddingY: linePaddingY,
        imageShadowBlurAmount: imageShadowBlurAmount,
        imageShadowShiftX: imageShadowShiftX,
        imageShadowShiftY: imageShadowShiftY,
        imageShadowColor: imageShadowColor,
        quoteShadowBlurAmount: quoteShadowBlurAmount,
        quoteShadowShiftX: quoteShadowShiftX,
        quoteShadowShiftY: quoteShadowShiftY,
        quoteShadowColor: quoteShadowColor
    };

    appState.push(state);
}

//Load App state at appStateIndex
function loadState(){
    let state = appState[appStateIndex];
    width = state.width;
    height = state.height;
    imageURL = state.imageURL;
    imagePositionX = state.imagePositionX;
    imagePositionY = state.imagePositionY;
    imageWidth = state.imageWidth;
    imageHeight = state.imageHeight;
    lines = state.lines;
    quotePositionX = state.quotePositionX;
    quotePositionY = state.quotePositionY;
    linePaddingX = state.linePaddingX;
    linePaddingY = state.linePaddingY;
    lineSeparation = state.lineSeparation;
    quoteBackgroundColor = state.quoteBackgroundColor;
    fontFamilyCustom = state.fontFamilyCustom;
    fontSizeCustom = state.fontSizeCustom;
    fontColor = state.fontColor;
    infoText = state.infoText;
    infoFontSize = state.infoFontSize;
    infoPaddingFromBottom = state.infoPaddingFromBottom;
    quoteCharacterSize = state.quoteCharacterSize;
    infoFontWeight = state.infoFontWeight;
    fontWeightCustom = state.fontWeightCustom;
    quoteBackgroundOpacity = state.quoteBackgroundOpacity;
    imageDarkMaskOpacity = state.imageDarkMaskOpacity;
    quoteCharacterShiftX = state.quoteCharacterShiftX;
    quoteCharacterShiftY = state.quoteCharacterShiftY;
    svgBackgroundColor = state.svgBackgroundColor;
    imageMaskColor = state.imageMaskColor;
    blurAmount = state.blurAmount;
    quoteCharacterColor = state.quoteCharacterColor;
    infoTextColor = state.infoTextColor;
    quoteCharacterFontFamily = state.quoteCharacterFontFamily;
    infoFontFamily = state.infoFontFamily;
    infoShiftX = state.infoShiftX;
    linePaddingX = state.linePaddingX;
    linePaddingY = state.linePaddingY;
    imageShadowBlurAmount = state.imageShadowBlurAmount;
    imageShadowShiftX = state.imageShadowShiftX;
    imageShadowShiftY = state.imageShadowShiftY;
    imageShadowColor = state.imageShadowColor;
    quoteShadowBlurAmount = state.quoteShadowBlurAmount;
    quoteShadowShiftX = state.quoteShadowShiftX;
    quoteShadowShiftY = state.quoteShadowShiftY;
    quoteShadowColor = state.quoteShadowColor;

    rerenderSVG();
}

