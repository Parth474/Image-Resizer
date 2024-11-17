const uploadBox = document.querySelector(".upload-box"),
    previewImg = uploadBox.querySelector("img"),
    fileInput = uploadBox.querySelector("input"),
    widthInput = document.querySelector(".width input"),
    heightInput = document.querySelector(".height input"),
    ratioInput = document.querySelector(".ratio input"),
    qualityInput = document.querySelector(".quality input"),
    downloadBtn = document.querySelector(".download-btn"),
    wrapper = document.querySelector(".wrapper");

let ogImageRatio;

const loadFile = (file) => {
    if (!file) return; // return if no file is selected
    previewImg.src = URL.createObjectURL(file); // load file to preview
    previewImg.addEventListener("load", () => {
        widthInput.value = previewImg.naturalWidth;
        heightInput.value = previewImg.naturalHeight;
        ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
        wrapper.classList.add("active");
    });
}

fileInput.addEventListener("change", (e) => loadFile(e.target.files[0]));

uploadBox.addEventListener("click", () => fileInput.click());

widthInput.addEventListener("keyup", () => {
    const height = ratioInput.checked ? widthInput.value / ogImageRatio : heightInput.value;
    heightInput.value = Math.floor(height);
});

heightInput.addEventListener("keyup", () => {
    const width = ratioInput.checked ? heightInput.value * ogImageRatio : widthInput.value;
    widthInput.value = Math.floor(width);
});

const resizeAndDownload = () => {
    const canvas = document.createElement("canvas");
    const a = document.createElement("a");
    const ctx = canvas.getContext("2d");
    const imgQuality = qualityInput.checked ? 0.5 : 1.0;

    canvas.width = widthInput.value;
    canvas.height = heightInput.value;
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);

    a.href = canvas.toDataURL("image/jpeg", imgQuality);
    a.download = new Date().getTime();
    a.click();
}

downloadBtn.addEventListener("click", resizeAndDownload);

// Drag & Drop functionality
uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();  // Prevent default to allow drop
    wrapper.classList.add("dragging"); // Add dragging class for visual feedback
});

uploadBox.addEventListener("dragleave", () => {
    wrapper.classList.remove("dragging"); // Remove dragging class
});

uploadBox.addEventListener("drop", (e) => {
    e.preventDefault(); // Prevent default behavior
    wrapper.classList.remove("dragging"); // Remove dragging class
    const file = e.dataTransfer.files[0]; // Get the dropped file
    loadFile(file); // Call loadFile to handle the file
});
