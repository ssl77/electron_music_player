/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');
const os = require('os');
let user = os.homedir();


//let mymusicpath = path.join(__dirname, 'mymusic');
//let mymusicpath = `/Users/silouane/Desktop/mymusic`;
let mymusicpath = path.join(user, `Desktop/mymusic`);

function basic() {
    //δημιουργία φακέλου μουσικής
    let existspath = fs.existsSync(mymusicpath);
    if (!existspath) {
        fs.mkdirSync(mymusicpath, 0744);
    }

    //ανάγνωση φακέλων
    fs.lstat(mymusicpath, (err, stat) => {
        if (err) throw err;
        if (stat.isDirectory()) {
            fs.readdir(mymusicpath, (err, files) => {
                if (err) throw err;
                if (files.length > 1) {
                    document.getElementById("dtl").innerHTML = "";
                    for (let i = 0; i < files.length; i++) {

                        //αν δεν είναι κρυφό αρχείο
                        let firstL = files[i].charAt(0);
                        if (firstL !== ".") {

                            //αν είναι μουσικό αρχείο
                            let musFile = files[i].endsWith(".mp3");
                            let musFile2 = files[i].endsWith(".wav");
                            let musFile3 = files[i].endsWith(".ogg");
                            let stats = fs.lstatSync(path.join(mymusicpath, files[i]));
                            if (musFile == true || musFile2 == true || musFile3 == true) {

                                let hh4 = document.createElement("ul");
                                let node = document.createTextNode(files[i]);
                                hh4.appendChild(node);
                                hh4.setAttribute("class", "track");
                                let prosthikiId = `nodr`;

                                let fil = `${prosthikiId}${files[i]}`; //

                                hh4.setAttribute("id", fil);
                                let d = files[i];
                                let tr = path.join(mymusicpath, d);
                                let mC = `myChoice('${tr}')`;
                                hh4.setAttribute("onclick", mC);
                                let elem = document.getElementById("dtl");
                                elem.appendChild(hh4);

                            } else if (stats.isDirectory()) {
                                //αν είναι διεύθυνση
                                let hh4 = document.createElement("ul");
                                let span = document.createElement("span");
                                // span.setAttribute("onclick", "closeTab(this)");
                                hh4.appendChild(span);
                                let node = document.createTextNode(`📁 ${files[i]}`);
                                span.appendChild(node);
                                hh4.setAttribute("class", "track_title");
                                let number;
                                if (i < 10) { number = '00' + i; }
                                if (i < 100 && i > 9) { number = '0' + i; }
                                if (i > 99 && i < 1000) { number = "" + i; }
                                let prosthikiId = `d${number}`;

                                let fil = `${prosthikiId}${files[i]}`;
                                // let fil = `${files[i]}`;
                                hh4.setAttribute("id", fil);
                                let b = `openF('${fil}')`;
                                span.setAttribute("onclick", b);
                                let elem = document.getElementById("dtl");
                                elem.appendChild(hh4);
                            }
                        }
                    }

                } else {
                    document.getElementById("dtl").innerHTML = `<h4 class = "track_title"
                    style = "color:grey"> <i> Δεν υπάρχουν φάκελοι </i></h4>`;
                }
            });
        }
        //παρακολούθηση αλλαγών
        fs.watch(mymusicpath, {
            recursive: true
        }, (load, f) => {
            basic();
        });
    });
}

function openF(y) {
    //ανάγνωση μουσικών κομματιών
    if (document.getElementById(y).getElementsByTagName('li')[0] == undefined) { //αυτο δεν σβήνει!
        let ulelem = document.getElementById(y);
        let ul = ulelem.innerHTML;
        let ulnew = ul.replace('📁', '📂');
        ulelem.innerHTML = ulnew;
        let prosthikiFid = y.slice(0, 4);
        let ypath = y.slice(4);

        let url = path.join(mymusicpath, `${ypath}`);

        fs.readdir(url, (err, files) => {
            if (err) throw err;
            if (files.length > 0) {
                for (let x = 0; x < files.length; x++) {
                    let firstl = files[x].charAt(0);
                    let musFile = files[x].endsWith(".mp3");
                    let musFile2 = files[x].endsWith(".wav");
                    let musFile3 = files[x].endsWith(".ogg");
                    let stats = fs.lstatSync(path.join(url, files[x]));

                    if (firstl !== "." && (musFile == true || musFile2 == true || musFile3 == true)) {
                        let par = document.createElement("li");
                        let node = document.createTextNode(files[x]);
                        par.appendChild(node);
                        par.setAttribute("class", "track");
                        let fil = `${prosthikiFid}${files[x]}`;
                        par.setAttribute("id", fil);
                        let tr = `'${url}/${files[x]}'`;
                        let mC = `myChoice(${tr})`;
                        par.setAttribute("onclick", mC);
                        let elem = document.getElementById(y);
                        elem.appendChild(par);
                    }


                }


            } else {
                if (files.length === 0) {
                    let par = document.createElement("li");
                    let node = document.createTextNode("- κενός φάκελος -");
                    par.appendChild(node);
                    par.setAttribute("class", "not_exist");

                    document.getElementById(y).appendChild(par);
                }

            }

        });
    } else {
        let parent = document.getElementById(y);
        let str = parent.innerHTML;
        let newstr = str.replace('📂', '📁');
        parent.innerHTML = newstr;
        while (parent.childNodes[1]) {
            parent.removeChild(parent.childNodes[1]);
        }
    }

}

//ανεξάρτητη function
//επιλογή κομματιού
function myChoice(z) {
    let kathetos = z.lastIndexOf("/");
    let kathetosW = z.lastIndexOf("\\");
    let t;
    let tW = z.slice(kathetosW + 1);
    if (kathetos != -1) {
        t = z.slice(kathetos + 1);
    } else { t = z.slice(kathetosW + 1); }
    document.getElementById("mymusic").src = z;
    let au = document.getElementById("musplay");
    au.load();
    au.play();
    document.getElementById("now").style.visibility = "visible";
    document.getElementById("now").innerHTML = `🎶Τώρα παίζει τό κομμάτι <span style = 'color:red'> "${t}"</span> `;
    document.getElementById(f).style.color = "crimson";

}



//ανεξάρτητη function
//άνοιγμα-κλείσιμο οδηγιών
function iclick() {
    let instr = document.getElementById("instructions");
    if (instr.innerHTML === "ℹ️Οδηγίες") {
        instr.innerHTML += ` <ol style="color:black">
                <li class="ins">1. Εισάγετε στον φάκελο " mymusic " της επιφάνειας εργασίας τους φακέλους σας με τα μουσικά κομμάτια σας.</li>
                <li class="ins">2. Τους φακέλους αυτούς βλέπετε στα αριστερά σας, κάνοντας "κλίκ " εκεί που λέει "εκλογή κομματιού ".</li>
                <li class="ins">3. Μήν βάζετε υποφακέλους στους φακέλους σας. Το πρόγραμμα τους αγνοεί.</li>
                <li class="ins">4. Το πρόγραμμα δέχεται μουσικά αρχεία 'mp3', 'wav' και 'ogg'.</li>
                <li class="ins">5. Μην αλλάζετε θέση ή όνομα στον φάκελο 'mymusic'.</li>
            </ol>`;
    } else { instr.innerHTML = "ℹ️Οδηγίες"; }
}