const cl = console.log;

const moviecontainer = document.getElementById('moviecontainer');
const onmovieadd = document.getElementById('onAddMovie');
const backdrop = document.getElementById('backdrop');
const moviemodel = document.getElementById('moviemodel');
// const cancel = [...document.querySelectorAll('.cancel')];
const cancel = Array.from(document.querySelectorAll('.cancel'));
const onSubmit = document.getElementById('submit-form');
const moviename = document.getElementById('moviename');
const movieurl = document.getElementById('movieurl');
const rating = document.getElementById('rating');
const addbtn = document.getElementById('addbtn');
const updatebtn = document.getElementById('updatebtn');

let baseUrl = `https://movie-model-39c1b-default-rtdb.asia-southeast1.firebasedatabase.app/`;
let movieUrl = `${baseUrl}/movie.json`;


const makeApiCall = async(movieUrl, methodName, bodyMsg = null) => {
    try{
        let getmoviedata = await fetch(movieUrl, {
            method : methodName,
            body : bodyMsg,
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        return getmoviedata.json();
    }catch{
        alert('Invalid')
    }
}

const onClick = () => {
    backdrop.classList.add('active');
    moviemodel.classList.add('active');
    addbtn.classList.remove('d-none');
    updatebtn.classList.add('d-none');
}

const onSubmitform = async(eve) => {
    eve.preventDefault();
    let movieobj = {
        title : moviename.value,
        movieUrl : movieurl.value,
        rating : rating.value,
        movieId : uuidv4()
    }
    let data = await makeApiCall(movieUrl, "POST", JSON.stringify(movieobj));
    movieobj.id = data.name;
    movieTemplating(movieobj)
    onCancel()
}
const objtoArr = (obj) => {
    let arr = [];
    for (const key in obj) {
        let newobj = obj[key];
        newobj.id = key;
        arr.push(newobj)
    }
    return arr;
}

const onEdit = async(eve) => {
    let geteditId = eve.closest('.card').id;
    localStorage.setItem('editid', geteditId);
    let editUrl = `${baseUrl}/movie/${geteditId}.json`;
    try {
        let data = await makeApiCall(editUrl, "GET");
        moviename.value = data.title;
        movieurl.value = data.movieUrl;
        rating.value = data.rating;
        onClick();
        addbtn.classList.add('d-none');
        updatebtn.classList.remove('d-none'); 
    } catch (error) {
        console.log(error);
    }
}

const onUpdate = async(eve) => {
    let getupdtid = localStorage.getItem("editid");
    let updtUrl = `${baseUrl}/movie/${getupdtid}.json`
    let updtobj = {
        title : moviename.value,
        movieUrl : movieurl.value,
        rating: rating.value,
        id : getupdtid
    }
    try {
       let data = await makeApiCall(updtUrl, "PUT", JSON.stringify(updtobj));
       let getobj = [...document.getElementById(getupdtid).children];
       getobj[0].innerHTML = `<h2 class="text-capitalize">${data.title}</h2>
                                <span class="text-right ${movierating(data.rating)}">${data.rating}</span>`
       getobj[1].innerHTML = `<figure class="movieimg m-0">
                                <img src="${data.movieUrl}" alt="">
                              </figure>`
        onCancel()

    } catch (error) {
        alert(error)
    }
}

const onDelete = async(eve) => {
    let delid = eve.closest('.card').id;
    let delUrl = `${baseUrl}/movie/${delid}.json`;
    try {
        await makeApiCall(delUrl, "DELETE");
        document.getElementById(delid).remove();
    } catch (error) {
        cl(error)
    }
}
const movieTemplating = (eve) => {
    let div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
                <div class="card my-3" id="${eve.id}">
                    <div class="card-header rating d-flex justify-content-between align-items-center">
                        <h2 class="text-capitalize">${eve.title}</h2>
                        <span class="text-right ${movierating(eve.rating)}">${eve.rating}</span>
                    </div>
                    <div class="card-body p-0">
                        <figure class="movieimg m-0">
                        <img src="${eve.movieUrl}" alt="">
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
                    </div>
                </div>`

    moviecontainer.prepend(div);
}

const movierating = (rating) => {
    if(rating >= 4 && rating <= 5){
        return 'bg-success';
    }else if(rating >= 2 && rating < 4){
        return 'bg-warning';
    }else if(rating >= 0 && rating < 2){
        return 'bg-danger';
    }else{
        alert('please enter valid rating')
    }
}

const createCard = async() => {
    try {
        let data = await makeApiCall(movieUrl, "GET");
        objtoArr(data).forEach(ele => {
            movieTemplating(ele)
        })
    } catch (error) {
        alert(error)
    }
}
createCard()

const onCancel = () => {
    backdrop.classList.remove('active');
    moviemodel.classList.remove('active');
    onSubmit.reset();
}

cancel.forEach(ele => ele.addEventListener('click', onCancel))

onmovieadd.addEventListener('click', onClick);
onSubmit.addEventListener('submit', onSubmitform);
updatebtn.addEventListener('click', onUpdate);

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
