(async function () {
    const response = await fetch("./data.json");
    const data = await response.json();


    console.log(data);
    const genre = document.getElementById("genre")
    const genreOptions =  data.genre.reduce(function (index,options) {
        return `${index}<option value="${options}">${options}</option>`
    },'')
    genre.innerHTML += genreOptions;
})();