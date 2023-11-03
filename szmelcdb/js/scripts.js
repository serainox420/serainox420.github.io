// Known .txt files in the repository
const fileNames = ['file1.txt', 'file2.txt', 'file3.txt'];

// Object to store file contents, keyed by filename
let filesContent = {};

// Fetch the contents of all .txt files from the GitHub repository
function loadTxtFiles() {
    let fetchPromises = fileNames.map(fileName => {
        // Construct the URL for the raw content of each file
        let url = `https://raw.githubusercontent.com/serainox420/serainox420/personal/txt/${fileName}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(content => {
                filesContent[fileName] = content; // Store the content in the object
            })
            .catch(error => {
                console.error('Error fetching file:', fileName, error);
            });
    });

    Promise.all(fetchPromises).then(() => {
        // After all files are fetched, display the file list
        listFiles();
    });
}

// Function to display the list of files
function listFiles() {
    const fileListPopup = document.getElementById('file-list-popup');
    fileListPopup.innerHTML = fileNames.map(fileName => 
        `<a href="#" class="file-list-item" data-filename="${fileName}">${fileName}</a>`
    ).join('');

    // Add click event listeners for each file item
    var fileItems = fileListPopup.getElementsByClassName('file-list-item');
    Array.from(fileItems).forEach(element => {
        element.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor action
            const fileName = this.dataset.filename;
            displayFileContent(fileName); // Display the content for the clicked file
        });
    });

    fileListPopup.classList.remove('hidden');
}

// Function to display the contents of a file when selected
function displayFileContent(fileName) {
    const content = filesContent[fileName];
    document.getElementById('content').innerHTML = formatContentAsHTML(content);
    document.getElementById('file-list-popup').classList.add('hidden');
}

// Format the content as HTML paragraphs
function formatContentAsHTML(text) {
    return text.split('\n')
               .map(line => `<p>${line}</p>`)
               .join('');
}

// Search functionality
function search() {
    let query = document.getElementById('searchQuery').value.toLowerCase();
    let paragraphs = document.querySelectorAll('#content p');
    paragraphs.forEach(p => {
        if (p.textContent.toLowerCase().includes(query)) {
            p.style.display = 'block';
        } else {
            p.style.display = 'none';
        }
    });
}

// Event listeners
document.getElementById('list-button').addEventListener('click', listFiles);
document.getElementById('searchQuery').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        search();
    }
});
document.getElementById('navbar').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Search') {
        search();
    }
});

// Initial call to load the .txt files when the site loads
loadTxtFiles();
