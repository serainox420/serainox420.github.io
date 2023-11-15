// Known .txt files in the repository
const fileNames = ['file1.txt', 'file2.txt', 'file3.txt'];

// Object to store file contents, keyed by filename
let filesContent = {};

// Fetch the contents of all .txt files from the GitHub repository
function loadTxtFiles() {
    let fetchPromises = fileNames.map(fileName => {
        let url = `https://raw.githubusercontent.com/serainox420/serainox420.github.io/personal/szmelcdb/txt/${fileName}`;
        return fetch(url)
            .then(response => response.text())
            .then(content => filesContent[fileName] = content)
            .catch(error => console.error('Error fetching file:', fileName, error));
    });

    Promise.all(fetchPromises).then(() => listFiles());
}

function listFiles() {
    const fileListPopup = document.getElementById('file-list-popup');
    fileListPopup.innerHTML = fileNames.map(fileName => 
        `<a href="#" class="file-list-item" data-filename="${fileName}">${fileName}</a>`
    ).join('');

    var fileItems = fileListPopup.getElementsByClassName('file-list-item');
    Array.from(fileItems).forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            const fileName = element.dataset.filename;
            displayFileContent(fileName);
        });
    });

    fileListPopup.classList.remove('hidden');
}

function displayFileContent(fileName) {
    const content = filesContent[fileName];
    document.getElementById('content').innerHTML = createIframesFromContent(content);
    document.getElementById('file-list-popup').classList.add('hidden');
}

function createIframesFromContent(text) {
    return text.split('\n')
               .filter(line => line.trim() !== '')
               .map(url => `<div class="wrapper" onclick="window.location.href='${url}';"><iframe src="${url}" sandbox="allow-top-navigation" style="pointer-events: none; scrolling="no"></iframe></div>`)
               .join('');
}

// Remove or modify search functionality as it won't work with iframes
function search() {
    // Update or remove this function as needed
}

document.getElementById('list-button').addEventListener('click', listFiles);
document.getElementById('searchQuery').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        search();
    }
});
document.getElementById('navbar').addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Search') {
        search();
    }
});

loadTxtFiles();
