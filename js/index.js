let fileInput = null
const canvas = document.querySelector("#canvas");
const canvasCtx = canvas.getContext("2d");
const brightnessInput = document.querySelector("#brightness");
const saturationInput = document.querySelector("#saturation");
const blurInput = document.querySelector("#blur");
const inversionInput = document.querySelector("#inversion");
const grayscaleInput = document.querySelector("#grayscale");
const setting = {};
let image = null;
document.querySelectorAll(".drop-zone_input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });
    const ButtonElement = document.getElementById('clickbtn');
    ButtonElement.addEventListener("click", (e) => {
        inputElement.click();
    });
    inputElement.addEventListener("change", (e) => {
        console.log(inputElement.files);
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
            fileInput = inputElement
            document.getElementById('canvas').style.display = 'block'
            document.getElementById('drop-zone').remove()
            icons(inputElement);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone_over");
    });
    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone_over");
        });
    });

    dropZoneElement.addEventListener("drop", e => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            fileInput = inputElement
            document.getElementById('canvas').style.display = 'block'
            document.getElementById('editor').style.visibility = "visible";
            document.getElementById('drop-zone').remove()
            icons(e.dataTransfer);
        }
        dropZoneElement.classList.remove("drop-zone_over");
    });
});
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone_thumb");
    if (dropZoneElement.querySelector(".drop-zone_prompt")) {
        dropZoneElement.querySelector(".drop-zone_prompt").remove();
    }

    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone_thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}

function resetSettings() {
    setting.brightness = "100";
    setting.saturation = "100";
    setting.blur = "0";
    setting.inversion = "0";
    setting.grayscale = "0";

    brightnessInput.value = setting.brightness;
    saturationInput.value = setting.saturation;
    blurInput.value = setting.blur;
    inversionInput.value = setting.inversion;
    grayscaleInput.value = setting.grayscale;
}

function reset_set() {
    let a = confirm('Are you sure wanted to reset the settings?')
    if (a) {
        resetSettings()
        renderImage()
    }
}
function updateSetting(key, value) {
    if (!image) return;
    setting[key] = value;
    renderImage();
}
function generateFilter() {
    const { brightness, saturation, blur, inversion, grayscale } = setting;
    return `brightness(${brightness}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%) grayscale(${grayscale}%)`;
}

function renderImage() {
    canvas.width = image.width;
    canvas.height = image.height;
    canvasCtx.filter = generateFilter();
    canvasCtx.drawImage(image, 0, 0);
}

function icons(fileInput) {
    brightnessInput.addEventListener("change", () => updateSetting("brightness", brightnessInput.value));
    saturationInput.addEventListener("change", () => updateSetting("saturation", saturationInput.value));
    blurInput.addEventListener("change", () => updateSetting("blur", blurInput.value));
    inversionInput.addEventListener("change", () => updateSetting("inversion", inversionInput.value));
    grayscaleInput.addEventListener("change", () => updateSetting("grayscale", grayscaleInput.value));
    image = new Image();
    image.addEventListener("load", () => {
        resetSettings();
        renderImage();
    });
    image.src = URL.createObjectURL(fileInput.files[0]);

    resetSettings();
}

function download() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.width;
    
    ctx.filter = generateFilter();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}
