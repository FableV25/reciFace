const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const imagePreview = document.getElementById('imagePreview');
const predictBtn = document.getElementById('predictBtn');
const uploadForm = document.getElementById('uploadForm');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');
const errorDiv = document.getElementById('error');
const resetBtn = document.getElementById('resetBtn');

// click on upload
uploadArea.addEventListener('click', () => fileInput.click());

// drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(files[0]);
    }
});

// when a file is selected
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    fileName.textContent = `✓ ${file.name}`;
    
    // preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        predictBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// submit del formulario con AJAX
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    errorDiv.style.display = 'none';
    results.style.display = 'none';
    loading.style.display = 'block';
    predictBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        const data = await response.json();

        loading.style.display = 'none';

        if (data.success) {
            displayResults(data.predictions);
        } else {
            showError(data.error || 'Unknown error while procesing the image');
        }

    } catch (error) {
        loading.style.display = 'none';
        showError('Conection error: ' + error.message);
    }

    predictBtn.disabled = false;
});

function displayResults(predictions) {
    resultsContent.innerHTML = '';
    
    const attributes = {
        sex: 'Sexo',
        eyes: 'Ojos',
        race: 'Etnia',
        hair: 'Cabello'
    };

    for (const [key, label] of Object.entries(attributes)) {
        const item = predictions[key];
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <div>
                <span class="result-label">${label}:</span>
                <span class="result-value">${item.prediction}</span>
            </div>
            <span class="confidence">${item.confidence}%</span>
        `;
        resultsContent.appendChild(div);
    }

    results.style.display = 'block';
    resetBtn.style.display = 'block';
}

function showError(message) {
    errorDiv.textContent = 'Error: ' + message;
    errorDiv.style.display = 'block';
}

resetBtn.addEventListener('click', () => {
    uploadForm.reset();
    imagePreview.style.display = 'none';
    predictBtn.style.display = 'none';
    results.style.display = 'none';
    resetBtn.style.display = 'none';
    fileName.textContent = '';
    errorDiv.style.display = 'none';
});

// obtener el token CSRF  de las cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}