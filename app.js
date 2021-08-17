const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
const editBookmarkForm = document.getElementById("edit-bookmark-form");
const editModal = document.getElementById('edit-modal');
const editModalClose = document.getElementById("close-edit-modal");
let bookmarks = [];
// Dim Icons, Bright Icons
function dimIcons (){
  document.querySelectorAll("#edit-bookmark").forEach(ele=>{
    ele.classList.remove("bright-icons");
    ele.classList.add("dim-icons");
  });
  document.querySelectorAll(".fa-trash-alt").forEach(ele=>{
    ele.classList.remove("bright-icons");
    ele.classList.add("dim-icons");
  });
}
function brightIcons(){
  document.querySelectorAll(".fa-edit").forEach(ele=>{
    ele.classList.remove("dim-icons");
    ele.classList.add("bright-icons");
    
  });
  document.querySelectorAll(".fa-trash-alt").forEach(ele=>{
    ele.classList.remove("dim-icons");
    ele.classList.add("bright-icons");
   
  });
}
// Show Modal, Focus on Input
function showModal() {
  dimIcons();
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
  brightIcons();
});
editModalClose.addEventListener('click', () => {
  editModal.classList.remove('show-modal');
  brightIcons();
});


// Validate Form
function validate(nameValue, urlValue) {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address.');
    return false;
  }
  // Valid
  return true;
}

// Build Bookmarks
function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = '';
  // Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Edit Icon
    const editIcon = document.createElement("i");
    editIcon.classList.add("far","fa-edit","bright-icons");
    editIcon.setAttribute("id","edit-bookmark");
    editIcon.setAttribute("title","edit-bookmark");
    editIcon.classList.add("bright-icons");
    editIcon.setAttribute("onclick",`editBookmark("${url}")`)
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('far', 'fa-trash-alt',"bright-icons");
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(editIcon,closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch bookmarks
function fetchBookmarks() {
  // Get bookmarks from localStorage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create bookmarks array in localStorage
    bookmarks = [
      {
        name: 'You Tube',
        url: 'https://youtube.com',
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com',
      },
      {
        name: 'Medium',
        url: 'https://medium.com',
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
  // Loop through the bookmarks array
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}
// Edit Section
// show edit bookmark

function editBookmark(url){
  editModal.classList.add("show-modal");
  dimIcons();
  let editName, editUrl,bookmarkIndex;
  bookmarks.forEach((bookmark,index) =>{
    if(bookmark["url"] === url){
      editName = bookmark["name"];
      editUrl  = bookmark["url"];
      bookmarkIndex = index
    }
  });
  document.getElementById("edit-website-name").focus();
  document.getElementById("edit-website-name").value = editName;
  document.getElementById("edit-website-url").value = editUrl.substring(8);
  localStorage.setItem("editIndex", bookmarkIndex);
}
// Store Bookmarks
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  // Add 'https://' if not there
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }
  // Validate
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  // Set bookmark object, add to array
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  // Set bookmarks in localStorage, fetch, reset input fields
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}
// Edit and storeBookmark
function editStoreBookmark(e) {
  e.preventDefault();
  const editNameValue = document.getElementById("edit-website-name").value;
  let editUrlValue = document.getElementById("edit-website-url").value;
  // Add 'https://' if not there
  if (!editUrlValue.includes('https://') && !editUrlValue.includes('http://')) {
    editUrlValue = `https://${editUrlValue}`;
  }
  // Validate
  if (!validate(editNameValue, editUrlValue)) {
    return false;
  }
  // Set bookmark object, add to array
  bookmarks[localStorage.getItem("editIndex")]  = {
    name: editNameValue,
    url: editUrlValue,
  };
  
  
  // Set bookmarks in localStorage, fetch, reset input fields
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  editModal.classList.remove("show-modal");

}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);
editBookmarkForm.addEventListener("submit",editStoreBookmark);
// On Load, Fetch Bookmarks
fetchBookmarks();



// // // Edit Close
// window.addEventListener("click", (e)=> {
//   if(e.target === editModal){
//       editModal.classList.remove("show-modal");

//   }
// });
// window.addEventListener('click', (e) => {
//   e.target === modal ? modal.classList.remove('show-modal') : false;
  
// });