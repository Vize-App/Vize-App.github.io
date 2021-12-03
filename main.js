let eyalHeadshotSrc = './images/eyal_headshot.jpeg';
let eyalName = 'Eyal Lavian';
let jeremyName = 'Jeremy Bourdon';
let alexName = 'Alex Rindone';
let jeremyHeadshotSrc = './images/jeremy_headshot.jpg';
let alexHeadshotSrc = './images/alex_headshot.jpeg';
let hasSubmitted = false;

function updateHeadshots(newBioIndex = 0) {
    // TODO: make this a little more dynamic
    let firstHeadshot = document.querySelector('#firstHead');
    let secondHeadshot = document.querySelector('#secondHead');
    let thirdHeadshot = document.querySelector('#thirdHead');
    let names = document.querySelectorAll('.headshot-name');

    if (newBioIndex === 0) {
        firstHeadshot.style['background-image'] = "url(" + eyalHeadshotSrc + ")";
        names[0].innerHTML = "<span>" + eyalName + "</span>";
        secondHeadshot.style['background-image'] = "url(" + jeremyHeadshotSrc + ")";
        names[1].innerHTML = "<span>" + jeremyName + "</span>";
        thirdHeadshot.style['background-image'] = "url(" + alexHeadshotSrc + ")";
        names[2].innerHTML = "<span>" + alexName + "</span>";
    }

    if (newBioIndex === 1) {
        firstHeadshot.style['background-image'] = "url(" + jeremyHeadshotSrc + ")";
        names[0].innerHTML = "<span>" + jeremyName + "</span>";
        secondHeadshot.style['background-image'] = "url(" + alexHeadshotSrc + ")";
        names[1].innerHTML = "<span>" + alexName + "</span>";
        thirdHeadshot.style['background-image'] = "url(" + eyalHeadshotSrc + ")";
        names[2].innerHTML = "<span>" + eyalName + "</span>";
    }

    if (newBioIndex === 2) {
        firstHeadshot.style['background-image'] = "url(" + alexHeadshotSrc + ")";
        names[0].innerHTML = "<span>" + alexName + "</span>";
        secondHeadshot.style['background-image'] = "url(" + eyalHeadshotSrc + ")";
        names[1].innerHTML = "<span>" + eyalName + "</span>";
        thirdHeadshot.style['background-image'] = "url(" + jeremyHeadshotSrc + ")";
        names[2].innerHTML = "<span>" + jeremyName + "</span>";
    }

    names[0].classList.add('active');
}

window.addEventListener('load', (event) => {
    // set all background images for headshots
    updateHeadshots();
    console.log('test deploy...')
});

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  }

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'email=' + data.email
    });

    if (response.status >= 200 && response.status < 400) {
        return response;
    }
    throw Error('Unable to add user to email list');
  }

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

function disabledButton() {
    this.onclick = false;
}

function resetSubmission(submitButton, cb) {
    submitButton.onclick = cb;
    submitButton.classList.remove('loading');
    submitButton.classList.remove('disabled-btn');
}

function submitEmail() {
    if (hasSubmitted) return;
    let submitBtn = document.getElementById('submit-email-btn');
    
    submitBtn.classList.add('loading');
    submitBtn.classList.add('disabled-btn');
    submitBtn.onclick = disabledButton;
    
    let termsOfService = document.getElementById("termsAndService").checked;

    if (!termsOfService) {
        alert("You must agree to our terms of service");
        resetSubmission(submitBtn, submitEmail);
        return;
    }

    let email = document.getElementById("email").value;

    if (!validateEmail(email)) {
        alert("You have entered an invalid email address!")
        resetSubmission(submitBtn, submitEmail);
        return;
    }

    let url = 'https://api.thevizeapp.com/auth/subscribe'

    postData(url, { email: email }).then(function(response) {
        if (response.status === 204) {
            const successEl = document.getElementById("success-message");
            successEl.classList.add('show-message');
            submitBtn.onclick = disabledButton;
            hasSubmitted = true;
        }
    }).catch(function(error) {
        const errorEl = document.getElementById("error-message");
        errorEl.classList.add('show-message')
        submitBtn.onclick = submitEmail;
    }).finally(function(){
        submitBtn.classList.remove('loading');
    });
}

function toggleBios(direction) {
    let ACTIVE = 'active';
    let HIDDEN = 'hidden';
    let NEXT = 'next';
    let PREVIOUS = 'prev';
    let bios = document.querySelectorAll(".bio");
    let currentBioIndex;
    let newBioIndex;
    
    // find current bio index and set current index
    bios.forEach((bio, index) => {
        if (!currentBioIndex && bio.classList.contains(ACTIVE)) {
            currentBioIndex = index;
        }
    });

    // find out what the next index should be
    if (currentBioIndex === (bios.length - 1) && direction === NEXT) {
        newBioIndex = 0;
    } else if (currentBioIndex === 0 && direction === PREVIOUS) {
        newBioIndex = bios.length - 1;
    } else if (typeof currentBioIndex === 'number' && direction === PREVIOUS) {
        newBioIndex = currentBioIndex - 1;
    } else if (typeof currentBioIndex === 'number' && direction === NEXT) {
        newBioIndex = currentBioIndex + 1;
    }

    // hide and activate bios based on currentBioIndex and new index
    if (typeof newBioIndex === 'number') {
        bios[newBioIndex].classList.add(ACTIVE);
        bios[newBioIndex].classList.remove(HIDDEN);
        bios[currentBioIndex].classList.remove(ACTIVE);
        bios[currentBioIndex].classList.add(HIDDEN);
    }

    updateHeadshots(newBioIndex);
}