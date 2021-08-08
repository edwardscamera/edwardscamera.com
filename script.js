const createLayout = (data, elmt) => {
    data.forEach(el => {
        if (data == undefined || !el.tag) return;
        let c = document.createElement(el.tag);
        Object.keys(el).forEach(prop => {
            switch (prop) {
                case 'content':
                    c.innerText = el.content;
                    break;
                case 'style':
                    Object.assign(c.style, el.style);
                    break;
                case 'class':
                    el.class.forEach(cl => c.classList.add(cl));
                    break;
                case 'children':
                    createLayout(el.children, c);
                    break;
                default:
                    c[prop] = el[prop];
                    break;
            }
        });
        elmt.appendChild(c);
    });
};

const Navigation = {
    Home: window.location.origin,
    Projects: 'projects.html',
    Photography: 'photography.html',
    Contact: 'contact.html'
};

let clouds = [];
for (let i = 0; i < 30; i++) {
    clouds.push({
        element: document.createElement('IMG'),
        width: Math.floor(Math.random() * 150) + 50,

    });
    clouds[i].x = Math.floor(Math.random() * window.innerWidth + (clouds[i].width * 2)) - clouds[i].width;
    if (screen.width < 480) clouds[i].x = Math.min(clouds[i].x, window.innerWidth - clouds[i].width * 2.8);
    clouds[i].y = Math.random() * (window.innerHeight - clouds[i].width);
    clouds[i].element.src = "images/cloud.png";
    Object.assign(clouds[i].element.style, {
        position: "absolute",
        zIndex: -10,
        left: clouds[i].x + 'px',
        top: clouds[i].y + 'px',
        width: clouds[i].width + 'px'
    });
    document.querySelector('#CloudContainer').appendChild(clouds[i].element);
}

// Background Color
let points = {
    0.0: [0, 0, 0],
    0.22: [0, 0, 0],
    0.24: [252, 169, 148],
    0.26: [135, 206, 250],
    0.5: [135, 206, 250],
    0.74: [135, 206, 250],
    0.76: [252, 169, 148],
    0.78: [0, 0, 0],
    1.0: [0, 0, 0],
};

const lerp = (a, b, v) => a + v * (b - a);

function getLowest(points, x) {
    const sorted = Object.keys(points)
        .map(i => parseFloat(i))
        .sort((a, b) => a - b);

    if (x < sorted[0]) return sorted[0];
    if (x > sorted[sorted.length - 1]) return sorted[sorted.length - 1];

    let j = 0;
    for (let i = 0; i < sorted.length; i++) {
        if (x >= sorted[i]) j = sorted[i];
    }

    return j;
}

function getHighest(points, x) {
    const sorted = Object.keys(points)
        .map(i => parseFloat(i))
        .sort((a, b) => a - b);

    if (x < sorted[0]) return sorted[0];
    if (x > sorted[sorted.length - 1]) return sorted[sorted.length - 1];

    const lowest = getLowest(points, x);

    return sorted[sorted.indexOf(lowest) + 1];

}

function getLerpAmount(points, x) {
    return (x - getLowest(points, x)) / (getHighest(points, x) - getLowest(points, x));
}

function getColor(minutes) {
    return [
        lerp(points[getLowest(points, minutes / 1440)][0], points[getHighest(points, minutes / 1440)][0], getLerpAmount(points, minutes / 1440)),
        lerp(points[getLowest(points, minutes / 1440)][1], points[getHighest(points, minutes / 1440)][1], getLerpAmount(points, minutes / 1440)),
        lerp(points[getLowest(points, minutes / 1440)][2], points[getHighest(points, minutes / 1440)][2], getLerpAmount(points, minutes / 1440))
    ];
}

const updateColors = () => {
    const myval = getColor(((new Date()).getHours() * 60) + (new Date()).getMinutes());
    document.body.style.backgroundColor = `rgb(${myval[0]}, ${myval[1]}, ${myval[2]})`;
};
updateColors();
window.setInterval(updateColors, 60 * 1000);

if (screen.width >= 480) {
    // Clouds
    window.setInterval(() => {
        clouds.forEach(cloud => {
            cloud.x += cloud.width / 400;
            if (cloud.x > window.innerWidth) cloud.x = -cloud.width;
            cloud.element.style.left = cloud.x + 'px';

        });
    }, 1000 / 60);
    // Navbar
    Object.keys(Navigation).forEach(tab => {
        let d = Object.assign(document.createElement('DIV'), {
            innerText: tab,
            onclick: () => window.location.href = Navigation[tab],

        });
        d.classList.add('NavbarItem', 'NoSelect');
        document.querySelector('#NavbarContainer').appendChild(d);
    });
    // Content
    window.onresize = () => {
        document.querySelector('#Content').style.marginLeft = document.querySelector('#NavbarContainer').offsetWidth + 'px';
        document.querySelector('#Content').style.width = window.innerWidth - document.querySelector('#NavbarContainer').offsetWidth + 'px';
    }
    window.onresize();

} else {

    const ham = document.createElement('H1');
    ham.classList.add("mobileOnly", "NoSelect");
    ham.innerText = '\u2630';
    ham.id = 'dropdownMenu';
    document.querySelector('#NavbarContainer').appendChild(ham);

    const NavbarItems = document.createElement('DIV');
    NavbarItems.id = 'NavbarItems';
    document.querySelector('#NavbarContainer').appendChild(NavbarItems);
    ham.onclick = () => {
        for (let c of NavbarItems.children) c.style.display = c.style.display === 'none' ? 'block' : 'none';
    }

    Object.keys(Navigation).forEach(tab => {
        let d = document.createElement('DIV');
        d.classList.add('NoSelect');
        d.style.display = 'none';
        if (typeof (Navigation[tab]) === 'string') {
            d.innerText = tab;
            d.onclick = () => window.location.href = Navigation[tab];
        }
        if (typeof (Navigation[tab]) === 'object') {
            let x = document.createElement('DIV');
            d.appendChild(x);
            x.innerText = tab + ' \u25BA';

            let b = document.createElement('DIV');
            d.appendChild(b);


            Object.keys(Navigation[tab]).forEach(r => {
                j = document.createElement('DIV');
                j.innerText = r;
                j.style.display = 'none';
                j.classList.add('darkentry');
                j.onclick = () => window.location.href = Navigation[tab][r];
                b.appendChild(j);
            });

            d.onclick = () => {
                for (let c of b.children) c.style.display = c.style.display === 'none' ? 'block' : 'none';

                if (x.innerText === tab + ' \u25BC') {
                    x.innerText = tab + ' \u25BA';
                } else {
                    x.innerText = tab + ' \u25BC';
                }

            };

        }
        d.classList.add('NavbarItem');
        NavbarItems.appendChild(d);
    });

    document.querySelector('#ClearFix').style.height = document.querySelector('#NavbarContainer').offsetHeight + 'px';
}

if (document.title.includes("projects")) window.fetch('https://api.github.com/users/edwardscamera/repos').then(d => d.json()).then(data => {

    if (data.hasOwnProperty("message") && data.message.includes("API rate limit exceeded")) {
        console.log(data.message);
        document.querySelector("#Project-ParentTable").innerHTML = `
        Too many requests are being made! <br/><br/>
        Please wait before trying again. <br/><br/>
        Or check out my <a href="https://github.com/edwardscamera" target="_blank">github page</a> right now.
        `;
        document.querySelector("#Project-ParentTable").style.display = "block";
        return;
    }


    let getDate = date => {
        let month = null;
        switch (date.getMonth()) {
            case 0: month = "January"; break;
            case 1: month = "Feburary"; break;
            case 2: month = "March"; break;
            case 3: month = "April"; break;
            case 4: month = "May"; break;
            case 5: month = "June"; break;
            case 6: month = "July"; break;
            case 7: month = "August"; break;
            case 8: month = "September"; break;
            case 9: month = "October"; break;
            case 10: month = "November"; break;
            case 11: month = "December"; break;
        };
        let suffix = null;
        switch (parseInt(date.getDate().toString().split("").pop())) {
            case 0: suffix = "th"; break;
            case 1: suffix = "st"; break;
            case 2: suffix = "nd"; break;
            case 3: suffix = "rd"; break;
            case 4: suffix = "th"; break;
            case 5: suffix = "th"; break;
            case 6: suffix = "th"; break;
            case 7: suffix = "th"; break;
            case 8: suffix = "th"; break;
            case 9: suffix = "th"; break;
        }
        return `${month} ${date.getDate()}${suffix}, ${date.getFullYear()}`;
    };
    let renderRepos = () => {
        let omit = ["edwardscamera.com", "edwardscamera.github.io", "tola-engine", "edwardscamera"];
        document.querySelector('#Project-ParentTable').innerText = '';
        data.forEach(repo => {
            console.log(repo);
            if (!omit.includes(repo.name)) {
                let layout = [
                    {
                        tag: "div",
                        class: ["Project-Child"],
                        style: { position: "relative", },
                        children: [
                            {
                                tag: "h2",
                                children: [{
                                    tag: "a",
                                    class: ["NoSelect"],
                                    href: repo.homepage,
                                    content: repo.name,
                                    target: "_blank",
                                }],
                            },
                            {
                                tag: "h3",
                                content: repo.language,
                            },
                            { tag: "br" },
                            {
                                tag: "h3",
                                content: repo.description,
                            },
                            screen.width >= 480 ? { tag: "br" } : {},
                        ],
                    }
                ];
                layout[0].children.push({
                    tag: "h3",
                    children: [{
                        tag: "a",
                        href: repo.html_url,
                        target: "_blank",
                        content: `GitHub Page ${repo.currentver ? " | " + repo.currentver : ""}`,
                    }],
                });
                if (repo.downloadlink) layout[0].children[0] = {
                    tag: "h2",
                    children: [{
                        tag: "a",
                        href: repo.downloadlink,
                        target: "_blank",
                        content: repo.name,
                        /*content: "Download " + repo.currentver,*/
                    }],
                };
                layout[0].children.push(
                    {
                        tag: "h3",
                        innerHTML: `Updated ${getDate(repo.lastCommitDate)} `,
                        /*style: {
                            position: "absolute",
                            bottom: "10px",
                            left: (screen.width < 480) ? "50%" : null,
                            transform: (screen.width < 480) ? "translateX(-50%)" : null,
                        }*/
                    }
                );
                createLayout(layout, document.querySelector('#Project-ParentTable'));
            }
        });
        createLayout([{
            tag: 'div',
            class: ["Project-Child"],
            children: [{
                tag: 'h3',
                innerHTML: 'Looking for more information about these projects or other projects I\'m working on? Check out my <a href="https://github.com/edwardscamera" target="_blank">GitHub page</a> for source code and more about these projects.'
            }]
        }], document.querySelector('#Project-ParentTable'));
    };
    let loaded = new Array(data.length).fill(false);
    data.forEach(async repo => {
        window.fetch(`${repo.url}/commits`).then(d => d.json()).then(dat => {
            data[data.indexOf(repo)].lastCommitDate = new Date(dat[0].commit.author.date);
            window.fetch(`${repo.url}/releases`).then(d => d.json()).then(dat => {
                if (dat.length > 0) {
                    repo.currentver = dat[0].tag_name;
                    window.fetch(dat[0].assets_url).then(d => d.json()).then(dat => {
                        if (dat.length > 0 && dat[0].browser_download_url) {
                            repo.downloadlink = dat[0].browser_download_url;
                            console.log(dat[0]);
                            loaded[data.indexOf(repo)] = true;
                            if (!loaded.includes(false)) {
                                data = data.sort((a, b) => b.lastCommitDate.getTime() - a.lastCommitDate.getTime());
                                renderRepos();
                            };
                        } else {
                            loaded[data.indexOf(repo)] = true;
                            if (!loaded.includes(false)) {
                                data = data.sort((a, b) => b.lastCommitDate.getTime() - a.lastCommitDate.getTime());
                                renderRepos();
                            };
                        }
                    });
                } else {
                    loaded[data.indexOf(repo)] = true;
                    if (!loaded.includes(false)) {
                        data = data.sort((a, b) => b.lastCommitDate.getTime() - a.lastCommitDate.getTime());
                        renderRepos();
                    };
                }
            });

        });

    });
});

let origScreen = screen.width >= 480;
window.addEventListener('resize', () => {
    if (origScreen) { if (screen.width < 480) window.location.reload(); }
    else { if (screen.width >= 480) window.location.reload(); }
});