const userName = "VinhQua";
const overview = document.querySelector('.overview');
const reposList = document.querySelector('.repo-list');
const searchInput = document.querySelector('.filter-repos');
const allReposSection = document.querySelector('.repos');
const specificRepoSection = document.querySelector('.repo-data');
const backBtn = document.querySelector('.view-repos');
const getUserData = async function(){
    const request = await fetch(`https://api.github.com/users/${userName}`);
    const userData = await request.json();
    //console.log(userData);
    showUserData(userData);
};
getUserData();

const showUserData = function(userData){
    const div = document.createElement('div');
    div.innerHTML = `<figure><img src="${userData.avatar_url}" alt="${userData.name}"></figure>
                        <div>
                            <p><strong>Name:</strong> ${userData.name}</p>
                            <p><strong>Bio:</strong> ${userData.bio}</p>
                            <p><strong>Location:</strong> ${userData.location}</p>
                            <p><strong>Number of public repos</strong> ${userData.public_repos}</p>
                        </div>`
    div.classList.add('user-info');
    overview.append(div);
    getAllReposData();
};

const getAllReposData = async function(){
    const request = await fetch(`https://api.github.com/users/${userName}/repos?sort=updated&per_page=100`);
    const allReposData = await request.json();
    //console.log(allReposData);
    showAllRepos(allReposData);
};

const showAllRepos = function(allReposData){
    allReposData.forEach(function(repo,index){
        const li = document.createElement("li");
        li.classList.add('repo');
        li.innerHTML =`<h3>${repo.name}</h3>`
        reposList.append(li);
    })
};

searchInput.addEventListener('input',function(e){
    const searchText = e.target.value.toLowerCase();
    console.log(searchText);
    const allRepos = document.querySelectorAll('.repo');
    allRepos.forEach(function(repo,index){
        repoName = repo.innerText;
        //console.log(repoName);
        if (repoName.includes(searchText)){
            repo.classList.remove('hide');
        } else{
            repo.classList.add('hide');
        }
    });
});

reposList.addEventListener('click',function(e){
    if (e.target.matches('h3')){
       const repoName = e.target.innerText;
       //console.log(repoName);
       getSpecificRepoData(repoName);
    }
});

const getSpecificRepoData = async function(repoName){
    const request = await fetch(`https://api.github.com/repos/${userName}/${repoName}`)
    const SpecificRepoData = await request.json();
    const languagueRequest = await fetch(SpecificRepoData.languages_url);
    const languageJson = await languagueRequest.json();
    let languages = [];
    for (let language in languageJson){
        languages.push(language);
    }
    //console.log(SpecificRepoData);
    //console.log(languages);
    showSpecificRepo(SpecificRepoData,languages);
};
const showSpecificRepo = function(SpecificRepoData,languages){
    const div = document.createElement('div');
    div.innerHTML=`
    <h3>Name: ${SpecificRepoData.name}</h3>
    <p>Description: ${SpecificRepoData.description}</p>
    <p>Default Branch: ${SpecificRepoData.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${SpecificRepoData.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
    //console.log(div);
    specificRepoSection.innerHTML ="";
    specificRepoSection.append(div);
    specificRepoSection.classList.remove('hide');
    allReposSection.classList.add('hide');
    backBtn.classList.remove('hide');
};

backBtn.addEventListener('click',function(){
    specificRepoSection.classList.add('hide');
    allReposSection.classList.remove('hide');
    backBtn.classList.add('hide');
});
