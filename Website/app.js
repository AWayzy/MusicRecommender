const searchBar = document.getElementById('searchBar');
const done = document.getElementById("gotchuButton");
const songListDisplay = document.getElementById('songList');
const playListDisplay = document.getElementById("playList");
var displayedSongs = [];
var playlistSongs = [];
var recommendations = [];

let songlist = [];
let songids = [];
let allsongs = [];
let recList = [];

class Song {
    constructor(artist, name, id) {
        this.artist = artist;
        this.name = name;
        this.id = id;
    }


}


playListDisplay.songcount = 0


function getRandomInt(max) {
    return Math.floor(Math.random() * max);

}

function matchingSong(name) {
    return function(songs) {
        return songs.name === name;
    }
}

function matchingId(name, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === name) {
            return array[i];
        }
    }
}

function recommendSongs() {
    for (i = 0; i < playlistSongs.length; i++) {
        song = playlistSongs[i][2];
        console.log(song);
        songindex = allsongs.find(matchingSong(song));
        if (songindex != null) {
            songid = songindex.id;
            songAnt = null;
            songAntInd = null;
            for (i = 0; i < recList.antecedents.length; i++) {

                songAnt = recList.antecedents[i].indexOf(songid);
                songAntInd = i;
                if (songAnt != null && songAnt != -1) {
                    console.log("broken with " + songAnt);
                    break;
                }
            }
            if (songAnt != null) {
                songCon = recList.consequents[songAntInd];
                songConSub = songCon.split("'")[1].trim();
                console.log("conseq is " + songConSub);
                recindex = matchingId(songConSub, allsongs);
                console.log(recindex);
                if (recindex != null) {
                    recommendations.push(recindex);
                    songCon = null;
                } else {
                    console.log("did not find recommendation");
                }
            } else {
                console.log("did not find rule");
            }
        } else {
            console.log("didn't find matching song");
        }
    }

    console.log(recommendations);
    displayReccomendations();
    recommendations = [];

}

function displayReccomendations() {
    if (recommendations.length == 0) {
        htmlString = [`<li class="character">
                <h2>No Recommended Songs!</h2>`];
        songListDisplay.innerHTML = htmlString.join(' ');
    } else {
        htmlString = [];
        htmlString.push(`
            <li class="character2">
            <h1>We Recommend These Songs:</h1>
            </li>
        `)
        recommendations.forEach(function callbackFn(item, index) {
            artist = item.artist;
            title = item.name;
            displayedSongs.push([index, artist, title])
            htmlString.push(`
            <li class="character">
            <h2>${title}</h2>
            <p>${artist}</p>
            </li>
            `)

        }, songlist)
        songListDisplay.innerHTML = htmlString.join(' ');
    };
}


function addToPlaylist(clicked) {
    if (displayedSongs == []) {
        return
    }
    console.log("adding song", clicked)
    songtodisplay = displayedSongs[clicked]
    artist = songtodisplay[1]
    song = songtodisplay[2]
    if (playListDisplay.songcount == 0) {
        playListDisplay.songcount = 1
        playListDisplay.innerHTML = `<l1 class="song">
                                    <h2>${song}</h2>
                                    <h3>${artist}</h3>
                                    <button class="removebuttonunchanged">Remove</button>
                                    </l1>`
    } else {
        playListDisplay.songcount += 1
        html = []
        html.push(playListDisplay.innerHTML)
        html.push(`<l1 class="song">
        <h2>${song}</h2>
        <h3>${artist}</h3>
        <button class="removebuttonunchanged">Remove</button>
        </l1>`)
        playListDisplay.innerHTML = html.join(" ")
    }
    store = playlistSongs.length
    playlistSongs.push([store, artist, song])

    button = document.getElementsByClassName("removebuttonunchanged")[0]
    button.onclick = function(i) { removeFromPlaylist(i.srcElement.id - 100); }
    button.class = "nowchanged"
    button.className = "nowchanged"
    button.id = playlistSongs.length - 1 + 100

    for (var i = 0; i < playlistSongs.length; i++) {
        ele = document.getElementById(i + 100);
        ele.onclick = function(item) { removeFromPlaylist(item.srcElement.id - 100); }
    };

    return


}

function removeFromPlaylist(id) {
    playListDisplay.songcount -= 1
    console.log("removing song", playlistSongs[id][2], id)
    playlistSongs.splice(id, 1)
    newlist = []
    for (i = 0; i < playlistSongs.length; i++) {
        song = playlistSongs[i];
        artist = song[1];
        song = song[2];
        newlist.push(`<l1 class="song">
                        <h2>${song}</h2>
                        <h3>${artist}</h3>
                        <button class="removebuttonunchanged">Remove</button>
                        </l1>`);

    };
    if (playListDisplay.songcount == 0) {
        playListDisplay.innerHTML = `<li class="song">
                                <h1>Add some songs to see them in your Playlist!</h1>
                                </l1>`
    } else {
        playListDisplay.innerHTML = newlist.join(" ")
        buttons = document.getElementsByClassName("removebuttonunchanged")
        for (i = 0; i < buttons.length; i++) {
            bb = buttons[i]
            bb.id = i + 100
        };
        for (var i = 100; i < buttons.length + 100; i++) {
            ele = document.getElementById(i);
            ele.onclick = function(item) { removeFromPlaylist(item.srcElement.id - 100); }
        };
    };
    return
}

function getAllIndexes(songlist, foundSongs) {
    var indexes = [],
        i = -1;
    foundSongs.forEach(function callbackFn(item) {
        songlist = this
        indexes.push(songlist.songs.indexOf(item))
    }, songlist);
    return indexes;
}

function loadEmptyPlaylist() {
    playListDisplay.innerHTML = `<li class="song">
                                <h1>Add some songs to see them in your Playlist!</h1>
                                </l1>`
}

const loadCharacters = async() => {
    try {
        const res = fetch("500psongs.json");
        songlist = await (await res).json();
        console.log(songlist);

        const res1 = fetch("500pids.json");
        songids = await (await res1).json();
        console.log(songids);

        const res2 = fetch("20000Rules.json");
        recList = await (await res2).json();
        console.log(recList.antecedents);

        for (i = 0; i < songlist.artists.length; i++) {
            let newSong = new Song(songlist.artists[i], songlist.songs[i], songids.ids[i]);
            allsongs.push(newSong);
        }

        displayRandomSongs(songlist);
    } catch (err) {
        console.error(err);
    }
};


searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    displayedSongs = []
    console.log("searching", searchString)
    if (e.target.value == "") {
        displayRandomSongs(songlist)
    } else {
        const filteredSongs = songlist.songs.filter((song) => {
            return (
                song.toLowerCase().includes(searchString)
            );
        });
        const songIndices = getAllIndexes(songlist, filteredSongs)
        displaySongs(songIndices);
    };
});

done.addEventListener("click", recommendSongs, false);

const displayRandomSongs = (songs) => {
    const randints = [-1];
    let songies = songs
    for (var i = 1; i < 25; i++) randints.push(getRandomInt(20000));
    htmlString = []
    randints.forEach(function callbackFn(item, index) {
        if (item == -1) {
            htmlString.push(`
            <li class="character2">
            <h1>Check Out These Songs:</h1>
            </li>
        `)
        } else {
            songies = this
            artist = songies.artists[item];
            title = songies.songs[item];
            displayedSongs.push([index, artist, title])
            htmlString.push(`
            <li class="character">
            <h2>${title}</h2>
            <p>${artist}</p>
            <button class="songbutton">Add Song to Playlist</button>
            </li>
    `)
        }

    }, songies)
    songListDisplay.innerHTML = htmlString.join(' ');
    buttons = document.getElementsByClassName("songbutton")
    if (buttons.length !== 0) {
        for (i = 0; i < buttons.length; i++) {
            button = buttons[i]
            button.id = i
        }
        for (var i = 0; i < buttons.length; i++) {
            ele = document.getElementById(i);
            ele.onclick = function(i) { addToPlaylist(i.srcElement.id); }
        }
    };

}


const displaySongs = (songs) => {
    if (songs.length == 0) {
        htmlString = [`<li class="character">
        <h2>No Songs Found!</h2>`];
        songListDisplay.innerHTML = htmlString.join(' ');
    } else {
        htmlString = [];
        songs.forEach(function callbackFn(item, index) {
            if (index > 24) {
                return
            } else {
                songies = this
                artist = songies.artists[item];
                title = songies.songs[item];
                displayedSongs.push([index, artist, title])
                htmlString.push(`
            <li class="character">
            <h2>${title}</h2>
            <p>${artist}</p>
            <button class="songbutton">Add Song to Playlist</button>
            </li>
    `)
            }
        }, songlist)
        songListDisplay.innerHTML = htmlString.join(' ');
        buttons = document.getElementsByClassName("songbutton")
        if (buttons.length !== 0) {
            for (i = 0; i < buttons.length; i++) {
                button = buttons[i]
                button.id = i
            }
            for (var i = 0; i < buttons.length; i++) {
                ele = document.getElementById(i);
                ele.onclick = function(i) { addToPlaylist(i.srcElement.id); }
            }
        };

    };
};



loadCharacters();
loadEmptyPlaylist();