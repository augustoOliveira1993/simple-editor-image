const fileInput = document.querySelector('.file-input'),
    filterOptions = document.querySelectorAll('.filter button'),
    filterName = document.querySelector('.filter-info .name'),
    filterValue = document.querySelector('.filter-info .value'),
    filterSlider = document.querySelector('.slider input[type="range"]'),
    rotateOptions = document.querySelectorAll('.rotate button'),
    previewImg = document.querySelector('.preview-img img'),
    resetFilterBtn = document.querySelector('.reset-filter'),
    saveImageBtn = document.querySelector('.save-img'),
    chooseImgBtn = document.querySelector('.choose-img');

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
let nameFile = '';

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}
const loadImage = () => {
    let file = fileInput.files[0];
    nameFile = file.name;
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener('load', () => {
        resetFilterBtn.click();
        document.querySelector('.container').classList.remove('disabel');
    });
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
       document.querySelector('.filter .active').classList.remove('active');
       option.classList.add('active');
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200"
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }
        if(option.id === "saturation") {
            filterSlider.max = "200"
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }
        if(option.id === "inversion") {
            filterSlider.max = "100"
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        if(option.id === "grayscale") {
            filterSlider.max = "100"
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }

    });
})

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active');

    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    }
    if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    }
    if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    }
    if(selectedFilter.id === "grayscale") {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener('click', () => {
        if(option.id === "left") {
            rotate -= 90;
        }
        if(option.id === "right") {
            rotate += 90;
        }
        if(option.id === "vertical") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        if(option.id === "horizontal") {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
})

const resetFilter = () => {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipHorizontal = 1, flipVertical = 1;
    filterOptions[0].click();
    filterSlider.value = 100;
    filterValue.innerText = '100%';
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImg.width;
    canvas.height = previewImg.height;
    ctx.translate(canvas.width/2, canvas.height/2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.filter =`brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = `editado_${nameFile}.png`;
    saveImageBtn.innerText = 'Salvando...';
    link.href = canvas.toDataURL();
    link.click();
    saveImageBtn.innerText = 'Salvar imagem';
}
fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input',  updateFilter);
resetFilterBtn.addEventListener('click',  resetFilter);
saveImageBtn.addEventListener('click',  saveImage);
chooseImgBtn.addEventListener('click', () => fileInput.click());
