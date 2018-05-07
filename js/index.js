const app = {
    URL: 'https://mafe0002.github.io/cordova-project/content.json',
    DATA: null,
    init: function () {
        //fetch the data
        app.getData();
        //add event listeners 
        app.addListeners();
        //fix the current url
        history.replaceState({}, "List", "#list");
        document.title = 'List of Items';
    },
    addListeners: function () {
        //back button on second page
        let backBtn = document.querySelector('#details-page header a');
        backBtn.addEventListener('click', app.backHome);
        //listen for the browser back button
        window.addEventListener('popstate', app.browserBack);
    },
    getData: function () {
        let url = app.URL;
        //fetch the JSON data
//        fetch(url)
//            .then(response => response.json())
//            .then(data => {
//                //save the imported JSON into app.DATA
//                //pass the data to a function that builds the first page  
//                app.DATA = data;
//                //console.log(app.DATA);
//                app.showThings();
//            })
//            .catch(err => {
//                console.log(err);
//            })
      let xhr = new XMLHttpRequest();
      xhr.open('GET', './js/content.json');
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              console.log(xhr.status, xhr.statusText);
              data = JSON.parse(xhr.responseText);
              data.recipes.sort(function (a, b) {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
              app.DATA = data;
             app.showThings();
          }
      }
      xhr.send(null);
    },

    showThings: function () {
        //loop through the array and display the cards
        //add the click listener on each title
        let container = document.querySelector('#list-page .content');
        let df = document.createDocumentFragment();
        let recipes = app.DATA.recipes;

        recipes.forEach(function (recipe) {
            let div = document.createElement('div');
            div.classList.add('item-card');
            //div.classList.add('transition1');
            let img = document.createElement('img');
//            img.classList.add('icon');
            img.setAttribute('src', recipe.picture);
            let h2 = document.createElement('h2');
            h2.classList.add('item-title');
            h2.setAttribute('data-key', recipe.id);
            //console.log(recipe.id);
            let h2t = document.createTextNode(recipe.name);
            h2.appendChild(h2t);
            let p = document.createElement('p');
            p.classList.add('item-desc');
            let pt = document.createTextNode(recipe.desc);
            p.appendChild(pt);
            div.appendChild(img);
            div.appendChild(h2);
            div.appendChild(p);
            df.appendChild(div);
        });

        container.innerHTML = " ";
        container.appendChild(df);

        let titles = document.querySelectorAll('.content .item-title');
        //console.log(titles);
        let h2 = document.getElementsByClassName('item-title');
        [].forEach.call(titles, (h2) => {
            h2.addEventListener('click', app.navDetails);
            //console.log('working!');
        });

    },
    navDetails: function (ev) {
        ev.preventDefault();
        window.scrollTo(0, 0);
        let h2 = ev.currentTarget;
        //extract the id from the heading
        let id = h2.getAttribute('data-key');
        //change the url and save the id in the history.state
        //console.log(`#details/${id}`);
        history.pushState({
            "id": id
        }, "Details", `#details/${id}`);
        document.title = `Details for Item ${id}`;
        //get the info about this item
        let obj = app.getItem(id);
        //pass it to a function to display those details
        app.showDetails(obj);
    },
    getItem: function (id) {
        //retrieve an object from our JSON data
        //where the id matches the one passed to this function
        var location = "";
        let Recipes = app.DATA.recipes;
        var lists = "";
        Recipes.forEach(function (Recipe) {
            if (id == Recipe.id) {
                location = Recipe.id;
               // console.log(location);
               lists = Recipe;
               lists.ingredients.sort(function (a, b) {
        let nameA = a.list.toUpperCase();
        let nameB = b.list.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
            }
        });
        //console.log(list);
        return {
            id: location,
            title: "Recipe " + location,
            recipes: lists
        };
    },
    showDetails: function (obj) {
        //navigate to the second page
        document.getElementById('list-page').classList.remove('active');
        document.getElementById('details-page').classList.add('active');
        //set the title of the selected property
        let span = document.querySelector('.details-title');
        span.textContent = obj.title;

        let container2 = document.querySelector('#details-page .content');
        let recipes = obj.recipes;
        console.log(recipes);
        let df = document.createDocumentFragment();
        let ul = document.createElement('ul');
        let ulp = document.createElement('ul');
        ul.innerHTML = "";
        ulp.innerHTML = "";
        let div = document.createElement('div');
        div.classList.add('item-card');
        let instructions = recipes.procedure;
        
        let img = document.createElement('img');
            img.classList.add('icon');
            img.setAttribute('src', recipes.picture);
           let h = document.createElement('h2');
            h.classList.add('title2');
            let h2t = document.createTextNode('Ingredients:');
            h.appendChild(h2t);
            h.style.textAlign = "center";
            div.appendChild(img);
            div.appendChild(h);
        
        for (var ingredient in recipes.ingredients) {
            //console.log(recipes.ingredients[ingredient]);
            let li = document.createElement('li');
            li.classList.add('desc');
            let lit = document.createTextNode(recipes.ingredients[ingredient].list);
            li.appendChild(lit);
            ul.appendChild(li);
            div.appendChild(ul);
      };
        
         let h2 = document.createElement('h2');
            h2.classList.add('title2');
            let h2t2 = document.createTextNode('Procedure:');
            h2.appendChild(h2t2);
            h2.style.textAlign = "center";
             div.appendChild(h2);
        
        for (var instruction in instructions) {
            let li = document.createElement('li');
            li.classList.add('desc');
            let lit = document.createTextNode(instructions[instruction].step);
            li.appendChild(lit);
            ulp.appendChild(li);
            div.appendChild(ulp);
        };
       
        
        df.appendChild(div);
        container2.appendChild(df);
        //loop through the obj properties with a for in loop
        //create some HTML for each property...
    },
    backHome: function (ev) {
        if (ev) {
            ev.preventDefault();
            //only add to the pushState if the user click OUR back button
            //don't do this for the browser back button
            history.pushState({}, "List", `#list`);
            document.title = 'List of Items';
        }
        document.getElementById('list-page').classList.add('active');
        document.getElementById('details-page').classList.remove('active');
         window.location.reload(false);
    },
    browserBack: function (ev) {
        console.log('user hit the browser back button');
        //the browser will change the location hash.
        //use the updated location.hash to display the proper page
        if (location.hash == '#list') {
            console.log('show the list page');
            //we want to show the list page
            app.backHome();
            //NOT passing the new MouseEvent('click')
        } else {
            //we want to display the details
            console.log('show the details');
            let id = location.hash.replace("#details/", "");
            //use the id number from the hash to fetch the proper data
            let obj = app.getItem(id);
            //pass it to a function to display those details
            app.showDetails(obj);
        }
    }
}

let loadEvent = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);


