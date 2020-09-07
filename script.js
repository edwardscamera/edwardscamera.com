(() => {
    const Navigation = {
        Home: window.location.origin,
        Projects: {
            'WTFdidIjustwatch?': 'http://wtfdidijustwatch.com',
            'Array Map Creator': 'array-map-creator'
        },
        Photography: 'photography.html',
        Contact: 'contact.html'
    }
    if (screen.width >= 480) {
        // Clouds
        let clouds = [];
        for(let i = 0; i < 30; i++) {
            clouds.push({
                element: document.createElement('IMG'),
                width: Math.floor(Math.random() * 150) + 50,
                
            });
            clouds[i].x = Math.floor(Math.random() * window.innerWidth + (clouds[i].width * 2)) - clouds[i].width;
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
        window.setInterval(() => {
            clouds.forEach(cloud => {
                cloud.x += cloud.width / 400;
                if(cloud.x > window.innerWidth) cloud.x = -cloud.width;
                cloud.element.style.left = cloud.x + 'px';
                
            });
        }, 1000 / 60);
        // Navbar
        Object.keys(Navigation).forEach(tab => {
            let d = document.createElement('DIV');
            d.innerText = tab;
            d.classList.add('NoSelect');
            if (typeof(Navigation[tab]) === 'string') {
                d.onclick = () => window.location.href = Navigation[tab];
                d.classList.add('NavbarItem');
            }
            if (typeof(Navigation[tab]) === 'object') {
                d.onmouseenter = () => { for(let c of d.children) c.style.display ='block'; }
                d.onmouseleave = () => { for(let c of d.children) c.style.display = 'none'; }
                d.classList.add('NavbarDrop');
            }
            document.querySelector('#NavbarContainer').appendChild(d);
            if (typeof(Navigation[tab]) === 'object') {
                Object.keys(Navigation[tab]).forEach(child => {
                    let c = document.createElement('DIV');
                    c.innerText = child;
                    c.style.display = 'none';
                    c.classList.add('NavbarSubItem');
                    c.onclick = () => window.location.href = Navigation[tab][child];
                    d.appendChild(c);
                });
            }
        });
        // Content
        window.onresize = () => {
            document.querySelector('#Content').style.marginLeft = document.querySelector('#NavbarContainer').offsetWidth + 'px';
            document.querySelector('#Content').style.width = window.innerWidth - document.querySelector('#NavbarContainer').offsetWidth + 'px';
        }
        window.onresize();
    }else{
        const ham = document.createElement('H1');
        ham.classList.add("mobileOnly", "NoSelect");
        ham.innerText = '\u2630';
        ham.id = 'dropdownMenu';
        document.querySelector('#NavbarContainer').appendChild(ham);

        const NavbarItems = document.createElement('DIV');
        NavbarItems.id = 'NavbarItems';
        document.querySelector('#NavbarContainer').appendChild(NavbarItems);
        ham.onclick = () => {
            for(let c of NavbarItems.children) c.style.display = c.style.display === 'none' ? 'block' : 'none';
        }

        Object.keys(Navigation).forEach(tab => {
            let d = document.createElement('DIV');
            d.classList.add('NoSelect');
            d.style.display = 'none';
            if (typeof(Navigation[tab]) === 'string') {
                d.innerText = tab;
                d.onclick = () => window.location.href = Navigation[tab];
            }
            if (typeof(Navigation[tab]) === 'object') {
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
                    for(let c of b.children) c.style.display = c.style.display === 'none' ? 'block' : 'none';
                    
                    if (x.innerText === tab + ' \u25BC') {
                        x.innerText = tab + ' \u25BA';
                    }else{
                        x.innerText = tab + ' \u25BC';
                    }
                    
                };
                
            }
            d.classList.add('NavbarItem');
            NavbarItems.appendChild(d);
        });
        
        document.querySelector('#ClearFix').style.height = document.querySelector('#NavbarContainer').offsetHeight + 'px';
    }
})();
