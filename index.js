var highestWindowZIndex = 3;
var openWindowIDs = new Set();
var currentFocussedTaskbarButton = undefined;

let onClippedWindowClosed = null;
 
function closeAllOpenWindows() 
{
    for (let id of openWindowIDs) 
    {
        let window = document.getElementById(id);
        if (window != null && window != undefined) 
        {
            if (clippedWindow == window)
                onClippedWindowClosed();

            window.remove();
        }
    }

    openWindowIDs.clear();

    document.getElementById("openprograms").innerHTML = "";
}

function focusWindow(id)
{   
    let windowToFocus = document.getElementById(id);
    windowToFocus.style.zIndex = highestWindowZIndex++;

    if (currentFocussedTaskbarButton != undefined) {
        currentFocussedTaskbarButton.classList = [];
    }

    let taskbarButton = document.getElementById("taskbarbutton-"+id);
    currentFocussedTaskbarButton = taskbarButton;

    taskbarButton.classList = ["active"];
}

function closeWindow(id)
{
    let window = document.getElementById(id);
    if (clippedWindow == window)
        onClippedWindowClosed();
    window.remove(); 

    let taskbarButton = document.getElementById("taskbarbutton-"+id);
    taskbarButton.remove(); 

    openWindowIDs.delete(id);
}

function setLeftRightOfWindow(id, left, right)
{
    let win = document.getElementById(id);
    win.style.left = left + "%";
    win.style.right = right + "%";
}

function moveWindowToRight(id, percentage)
{
    let win = document.getElementById(id);
    newLeft = Number(win.style.left.substr(0, win.style.left.length - 1)) + percentage;
    
    if (newLeft >= 100)
    {
        let html = win.parentElement.innerHTML;
        newLeft += 30;

        let winOutOfScreen = document.createElement("div");
        winOutOfScreen.innerHTML = html;
        document.body.appendChild(winOutOfScreen);
        let innerWin = winOutOfScreen.getElementsByClassName("window")[0];
        innerWin.style.top = win.getBoundingClientRect().top + "px";
        innerWin.id = "";
        innerWin.style.zIndex = "";
        innerWin.style.right = "";
        innerWin.style.transition = "";
        innerWin.style.width = win.clientWidth + "px";
        innerWin.style.height = win.clientHeight + "px";
        innerWin.classList.add("window-out-of-screen")
        innerWin.style.left = `calc(50% + 42vh)`;

        setTimeout(() => {
            closeWindow(id)
        }, 50);
        setTimeout(() => {
            winOutOfScreen.remove();
        }, 2000)
        
    }
    win.style.left = newLeft + "%";
    win.style.right = Number(win.style.right.substr(0, win.style.right.length - 1)) - percentage + "%";
}

/**
 * id: "",
 * title: "",
 * bodyHTML: ``,
 * minimize: 1,
 * maximize: 1,
 * onClose: () => {},
 * buttons: {}
 */
function makeWindow(windowOptions)
{
    if (openWindowIDs.has(windowOptions.id) || document.getElementById(windowOptions.id) != null) {
        closeWindow(windowOptions.id)
    }
    
    let taskbar = document.getElementById("openprograms");
    let taskbarButton = document.createElement("div");
    taskbarButton.innerHTML = `<button id="taskbarbutton-${windowOptions.id}">${windowOptions.title.substring(0, 10)}...</button>`;
    taskbarButton.onclick = () => { focusWindow(windowOptions.id); };
    taskbar.appendChild(taskbarButton);

    let div = document.createElement("div");
    openWindowIDs.add(windowOptions.id);
    div.innerHTML = `

<div class="window" style="z-index:${highestWindowZIndex++}; top: 20%; min-width=250;" ${windowOptions.id ? `id="${windowOptions.id}"` : ""}>
<div class="title-bar">
    <div class="title-bar-text">
        ${windowOptions.title}
    </div>

    <div class="title-bar-controls">
        ${windowOptions.minimize ? `<button aria-label="Minimize"></button>` : ""}
        ${windowOptions.maximize ? `<button aria-label="Maximize"></button>` : ""}
        <button class="close-btn" aria-label="Close"></button>
    </div>
</div>
<div class="window-body">
    ${windowOptions.bodyHTML ? windowOptions.bodyHTML : ""}
    <section class="button-row field-row" style="justify-content: flex-end">
    </section>
</div>
</div>
    `;
    let btnrow = div.getElementsByClassName("button-row")[0];

    if (windowOptions.buttons)
    {
        for (const [btnName, callback] of Object.entries(windowOptions.buttons))
        {
            let btn = document.createElement("button")
            btn.innerHTML = btnName;
            btn.onclick = callback;
            btnrow.append(btn);
        }
    }

    div.getElementsByClassName("close-btn")[0].onclick = (windowOptions.onClose !== undefined)? windowOptions.onClose : () => { closeWindow(windowOptions.id); };
    
    setTimeout(() => {
        focusWindow(windowOptions.id);
        setLeftRightOfWindow(windowOptions.id, windowOptions.left || 20, windowOptions.right || 20);
    
    }); // This is totally because we want a delay and not because our code is trash

    

    return div;
}

function BLUE_SCREEN_OF_DEATH_BABY()
{
    let scr = document.getElementById("screen");
    scr.innerHTML = `
    
    <br><br><br>
    <center><b style="color: white">
        <h4>
            <span style="background: white; color: blue; padding: 5px 20px">Unstable system</span>
            <br><br>

            A FATAL ERROR HAS OCCURED.
            <br><br>
            YOU DID NOT MANAGE TO KEEP YOUR COMPUTER STABLE.

            <br><br>
        </h4>
        SYS32_NOTFOUND	    &nbsp;&nbsp;&nbsp;&nbsp; 0xC00D07F0L<br>
        ERR_UNSTABLE        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0xC00D07DCL

        <br><br><br>
        <span style="background: white; color: blue; padding: 5px 20px">Press <span style="color: darkgrey">F5</span> to reboot.</span>
    </b></center>
    
    `;
    scr.style.background = "blue"

    gameResult(true, false);
}

function startDeletingSys32()
{
    setTimeout(() => {
        let askToStart = makeWindow({
            id: "start-setup",
            title: "Download ready",
            bodyHTML: "The executables from '<u>htpp://downloadmoreRAM.com/</u>' were downloaded successfully.<br>Do you want to run them now?<br><br>",
            buttons: {
                Yes: () => {
                    closeWindow("start-setup");
                    setTimeout(closeAllOpenWindows, 400);
                    setTimeout(actuallyStartDeletingSys32, 4000);
                    setTimeout(startInstallingRam, 2000);
                },
                No: () => {
                    closeWindow("start-setup");
                }
            }
        })

        document.getElementById("screen").append(
            askToStart
        )
    }, 1000)

    
}

let RAMInstalled = false;

function startInstallingRam()
{
    const mbsToInstall = 1024;
    let mbsInstalled = 0;
    const maxSquaresInBar = 38;

    let setupWindow = makeWindow({
        id: "installing-ram",
        title: "More-Ram-Setup.exe",
        bodyHTML: `
        <p>Installing extra RAM, please don't turn off your computer.<br><br>
        Installed <span id="mbs-installed"></span>MB / ${mbsToInstall}MB.</p>
        <input class="progress-bar" disabled="" type="text" value="&#9646;&#9646;&#9646;">
        <br><br>
        `,
        // minimize: 1,
        // maximize: 1,
        left: 40,
        right: 4,
        onClose: () => {
            closeWindow("installing-ram")
        },
        buttons: {
            Cancel: event => {
                closeWindow("installing-ram")
            }
        }
    })

    let innerWin = setupWindow.getElementsByClassName("window")[0];
    innerWin.style.top = "15%";


    document.getElementById("screen").append(
        setupWindow
    )
    
    let interval = setInterval(() => {


        let span = document.getElementById("mbs-installed");
        if (!span)
        {
            clearInterval(interval);
            return;
        }
        mbsInstalled += !!document.getElementById("sys32-deleting-window") ? 1 : 3;
        span.innerHTML = mbsInstalled;
        let percentage = mbsInstalled / mbsToInstall;
        if (percentage >= 1)
        {
            /// !!!! wooooooooooooooooo you can now play minesweepr
            closeWindow("installing-ram")
            RAMInstalled = true;
            
            document.getElementById("screen").append(makeWindow({
                id: "installing-ram-done",
                title: "Setup successful!",
                bodyHTML: `
                <p>${mbsToInstall}MB of ram was added to your system.<br><br>
                `,
                // minimize: 1,
                // maximize: 1,
                left: 30,
                right: 30,
                onClose: () => {
                    closeWindow("installing-ram-done")
                },
                buttons: {
                    OK: event => {
                        closeWindow("installing-ram-done")
                    }
                }
            }))
        }
        
        innerWin.getElementsByClassName("progress-bar")[0].value = "▮".repeat((percentage * maxSquaresInBar) | 0 + 1);
    }, 40)
}

function actuallyStartDeletingSys32()
{
    const sys32FilesToDelete = 500;
    let sys32FilesDeleted = 0;
    const maxSquaresInBar = 38;

    let notResponding = false;
    let timesCancelled = 0;

    let removeSys32Window = makeWindow({
        id: "sys32-deleting-window",
        title: "Virus-Setup.exe",
        bodyHTML: `
        <p>Deleting '<u>C:/System32</u>'.<br><br>
        Deleted <span id="sys32-files-deleted"></span>/${sys32FilesToDelete} files.</p>
        <input id="sys32-deleting-progress-bar" class="progress-bar" disabled="" type="text" value="&#9646;&#9646;&#9646;">
        <br><br>
        `,
        // minimize: 1,
        // maximize: 1,
        left: 4,
        right: 40,
        onClose: () => {
            removeSys32Window.getElementsByClassName("window")[0].style.transform = `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)`
        },
        buttons: {
            Cancel: event => {

                if (timesCancelled++ < 2)
                {
                    dontRespond()
                }
                else
                {
                    event.target.innerHTML = "<b>Nope!<b>"
                }
            }
        }
    })

    let innerWin = removeSys32Window.getElementsByClassName("window")[0];
    innerWin.style.top = "50%";
    innerWin.classList.add("sys32-deleting-window")

    function dontRespond(time=2500) {
        
        notResponding = true;
        innerWin.classList.add("not-responding-window")
        let oldTitle = innerWin.getElementsByClassName("title-bar-text")[0].innerHTML;
        innerWin.getElementsByClassName("title-bar-text")[0].innerHTML = "Not responding";

        setTimeout(() => {
            notResponding = false;
            innerWin.classList.remove("not-responding-window")
            innerWin.getElementsByClassName("title-bar-text")[0].innerHTML = oldTitle;
        }, time)
    }


    document.getElementById("screen").append(
        removeSys32Window
    )
    
    let interval = setInterval(() => {

        if (notResponding)
            return;

        let span = document.getElementById("sys32-files-deleted");
        if (!span)
        {
            clearInterval(interval);
            return;
        }
        span.innerHTML = ++sys32FilesDeleted;
        let percentage = sys32FilesDeleted / sys32FilesToDelete;
        if (percentage >= 1)
        {
            BLUE_SCREEN_OF_DEATH_BABY() // !!!!!!!!!!! woooo
        }
        innerWin.style.animationDuration = 4 - 3 * percentage + "s";
        
        document.getElementById("sys32-deleting-progress-bar").value = "▮".repeat((percentage * maxSquaresInBar) | 0 + 1);
    }, 50)
}

function showStartMenu()
{
    let startMenu = document.getElementById("start-menu");
    startMenu.style.display = "block";

    if (fistTimeStart && isOn())
    {
        postStickyNote("Whenever the PC is behaving <b><u>unstable</u></b>, smash it on the side")
        setTimeout(() => {
            document.body.classList.add("screen-dark")
            
        }, 1000)
        fistTimeStart = false;
    }
    
}

function hideStartMenu(event)
{
    let startMenu = document.getElementById("start-menu");
    
    if (event.target == startMenu || event.target.classList.contains("program-link"))
        startMenu.style.display = "none";
}

function notEnoughRamPopup(programName)
{
    let popup = makeWindow({
        id: programName + "-window",
        title: "Unstable system error",
        bodyHTML: `
        <p>Cannot open '${programName}', not enough RAM available.
        <br>
        Install or download more RAM.</p>
        <br><br>
        `,
        // minimize: 1,
        // maximize: 1,
        // onClose: () => {
        //     popup.remove()

        // },
        buttons: {
            OK: event => {
                closeWindow(programName + "-window")
            }
        }
    })
    document.getElementById("screen").append(popup);
}


function openMinesweeper()
{

    if (!RAMInstalled)
    {
        notEnoughRamPopup("Minesweeper.exe")
        return;
    }
    

    let boardString = "";
    for (let x=0, y=0, i=0; y < 8; i++, x=i%12, y=Math.floor(i/12))
    {
        boardString += `<img onclick="console.log('${x}, ${y}')" src="./img/minesweeper/blank.gif" border="0" alt=""></img>`;
    }
    
    let ms = makeWindow({
        id: "minesweeper",
        title: "Minesweeper",
        bodyHTML: `
        <img src="./img/minesweeper/top.png" border="0" width="100%" alt=""></img>
        ${boardString}
        <br>

        <div class="status-bar">
            <p class="status-bar-field">High score: 0</p>
            <p class="status-bar-field">P1: Mr. Unstable</p>
        </div>
        `,
        left: 25,
        right: 25,
        // minimize: 1,
        // maximize: 1,
        // onClose: () => {
        //     ie.remove()
        // }
    })
    
    document.getElementById("screen").append(ms);
    
}

function startTaskManager()
{
    let popup = makeWindow({
        id: "task-manager",
        title: "TaskManager.exe not found",
        bodyHTML: `
        <p>Go to the online support page to learn about the problems with your computer.</p>
        `,
        // minimize: 1,
        // maximize: 1,
        // onClose: () => {
        //     popup.remove()

        // },
        buttons: {
            OK: event => {
                closeWindow("task-manager")
            }
        }
    })
    document.getElementById("screen").append(popup);
}


function openNotepad()
{
    if (!RAMInstalled)
    {
        notEnoughRamPopup("Notepad32.exe")
        return;
    }

    let np = makeWindow({
        id: "notepad",
        title: "Notepad",
        bodyHTML: `
        <button>Save</button>

        <br>
        <textarea style="width: 100%" rows="20">
DIARY OF MR. UNSTABLE

====== Day 1 =========

Finally got this brand new second hand computer.
I really have to check out the interwebs,
and eventually I should try to play Minesweeper..


====== Day 2 =========

The screen is just flickering a lot and I'm getting sick of it...
...I smashed the screen out of frustration, but now it's just getting worse.

Please don't tell my wife


====== Day 3 =========

I tried to start Minesweeper.exe, but my PC does not have enough RAM it seems....
My wife won't let me buy more RAM.....  sigh..

....what if I could DOWNLOAD RAM from the interwebs?


====== Day 4 =========

todo.
</textarea>

        <div class="status-bar">
            <p class="status-bar-field">C:/Users/Mr.Unstable/Documents/diary.txt</p>
            <p class="status-bar-field">Nr. of Words: Countless</p>
        </div>
        `,
        left: 10,
        right: 10,
        minimize: 1,
        maximize: 1,
        // onClose: () => {
        //     ie.remove()
        // }
    })
    
    document.getElementById("screen").append(np);
    
}


function openInterwebExplorer()
{
    let ie = makeWindow({
        id: "interweb-explorer",
        title: "Interweb Explorer",
        bodyHTML: `
        <button class="back" style="min-width: 0px; height: 20px">🡸</button>
        <button class="forward" style="min-width: 0px; height: 20px; margin-right: 10px">🡺</button>
        <button class="home" style="min-width: 0px; height: 20px; margin-right: 10px">Home</button>

        <input id="ie-url-field" type="text" value="bing.com" style="width: calc(100% - 180px); pointer-events: none">
        <br><br>

        <iframe src="./interweb_explorer_pages/home.html"></iframe>
        
        <div class="status-bar">
            <p class="status-bar-field"><img src="img/spinningearth.gif" style="height: 12px;margin-right: 5px;margin-bottom: -2px;">Connected to the internet</p>
            <p class="status-bar-field">CPU Usage: 69%</p>
            <p class="status-bar-field">RAM Usage: 97%</p>
        </div>
        `,
        left: 10,
        right: 10,
        minimize: 1,
        maximize: 1,
        // onClose: () => {
        //     ie.remove()
        // }
    })
    let ieWindow = ie.getElementsByClassName("window")[0];

    ieWindow.style.height = "calc(100% - 10vh)"
    ieWindow.style.top = "5%";

    let iframe = ie.getElementsByTagName("iframe")[0];

    ie.getElementsByClassName("back")[0].onclick = () => {
        iframe.contentWindow.location.href = "./interweb_explorer_pages/home.html"
    }
    ie.getElementsByClassName("forward")[0].onclick = () => {
        iframe.contentWindow.history.forward()
    }
    ie.getElementsByClassName("home")[0].onclick = () => {
        iframe.contentWindow.location.href = "./interweb_explorer_pages/home.html"
    }

    document.getElementById("screen").append(ie);
}

function isOn()
{
    return document.body.classList.contains("on");
}
let fistTimeStart = true;
let onFirstTimeOn = null;

function toggleOnOff()
{
    if (isOn())
        document.body.classList.remove("on")
    else
    {
        document.body.classList.add("on")
        if (onFirstTimeOn != null)
        {
            onFirstTimeOn();
            onFirstTimeOn = null;
        }
    }
    
    let hand = document.getElementById("hand")
    hand.classList.add("click");
    setTimeout(() => { hand.classList.remove("click"); }, 50);
}

let notesPosted = 0;
function postStickyNote(text)
{
    let note = document.createElement("div")
    note.className = "sticky-note"
    note.innerHTML = text;
    note.style.left = `calc(50vw + ${-28 + notesPosted++ * 16}vh)`
    note.style.top = `${71 - notesPosted * .6}vh`
    document.getElementsByClassName("perspective")[0].appendChild(note)
}

let clippedWindow = null;

window.onload = () => {

    console.log("Ludum dareee");

    setTimeout(() => {
        postStickyNote("Game objective: <h3 style='margin: 0; font-size: 2.5vh'>play <b><u>minesweeper!</u></b></h3>")
    }, 1500)
    

    let hand = document.getElementById("hand");
    let screen = document.getElementById("screen");
    let smashHitbox = document.getElementById("smash-hitbox");
    let handXOffset = -1;
    let perspective = document.getElementsByClassName("perspective")[0];
    let glass = document.getElementsByClassName("glass")[0];

    // CLIPPY:
    let clippy = document.getElementsByClassName("clippy")[0];
    let holdingClippy = false;
    const MAX_CLIPPY_TOP = 73;
    const MIN_CLIPPY_TOP = -20;
    const MAX_CLIPPY_LEFT = 90;
    let clippingWindow = null;
    clippy.onmousedown = () => {
        console.log("Holding clippy")
        clippy.getElementsByClassName("clippy-body")[0].style.backgroundImage = "url('img/clippy/clippy.png')";
        holdingClippy = true;
        clippedWindow = null;
        clippy.style.transition = "";
        document.body.classList.add("holding-clippy");
    }

    function dropClippy()
    {
        holdingClippy = false;
        clippy.classList.remove("release-to-clip")

        if (clippingWindow)
        {
            clippedWindow = clippingWindow;
            clippingWindow = null;
            clippy.getElementsByClassName("clippy-body")[0].style.backgroundImage = "url('img/clippy/clippy-clipped.png')";
        }
        else
        {
            clippy.style.transition = "top .3s ease-in";
            clippy.style.top = MAX_CLIPPY_TOP + "%";
            clippy.getElementsByClassName("clippy-body")[0].style.backgroundImage = "url('img/clippy/clippy.png')";
        }
        document.body.classList.remove("holding-clippy");
    }
    function moveClippy(x, y)
    {
        let xper = Number(clippy.style.left.substring(0, clippy.style.left.length - 1)) + x * .16;
        let yper = Number(clippy.style.top.substring(0, clippy.style.top.length - 1)) + y * .16;

        xper = Math.max(0, Math.min(MAX_CLIPPY_LEFT, xper));
        yper = Math.max(MIN_CLIPPY_TOP, Math.min(MAX_CLIPPY_TOP, yper));

        clippy.style.left = xper + "%";
        clippy.style.top = yper + "%";
    }

    onClippedWindowClosed = () => {
        clippedWindow = null;
        dropClippy();
    }

    document.onmouseup = () => {
        if (holdingClippy)
            dropClippy();
    }

    screen.onmouseenter = () => { hand.classList.add("gone"); };
    screen.onmouseleave = () => {
        hand.classList.remove("gone");
        if (holdingClippy)
            dropClippy();
    };

    onFirstTimeOn = () => {
        clippy.style.left = "60%";
        clippy.style.top = "30%";
        setTimeout(dropClippy, 100);
    }

    document.addEventListener("mousemove", e => {

        {   // hand:
            var newX = e.clientX;   // - handXOffset;
            var newY = e.clientY;   // - 60;
    
            hand.style.left = `calc(${newX}px - ${handXOffset * .16}vh)`;//  newX + "px";
            hand.style.top = `calc(${newY}px - 6vh)`;;//  newY + "px";

        }
        if (holdingClippy)
        {   // clippy:
            
            let screenRect = screen.getBoundingClientRect();
            let mouseX = (e.clientX - screenRect.left) / (screenRect.right - screenRect.left);
            let mouseY = (e.clientY - screenRect.top) / (screenRect.bottom - screenRect.top);
            let xper = Math.max(0, Math.min(MAX_CLIPPY_LEFT, mouseX * 100 - 5));
            let yper = Math.max(MIN_CLIPPY_TOP, Math.min(MAX_CLIPPY_TOP, mouseY * 100 - 15));

            clippy.style.left = xper + "%";
            clippy.style.top = yper + "%";

            clippy.classList.remove("release-to-clip")
            clippingWindow = null;
            for (let w of document.getElementsByClassName("window"))
            {
                if (w.querySelector(":hover") && w.parentElement.id != "start-menu")
                {
                    clippy.classList.add("release-to-clip");
                    clippingWindow = w;
                    break;
                }
            }
        }

    }, false);
    hand.style.left = "10000px"

    let prevResetTimeout = null;
    let impactCounter = 0;
    const MAX_IMPACT = 50;

    function setBg()
    {
        console.log(impactCounter / MAX_IMPACT)
        document.getElementsByTagName("html")[0].style.background = `rgb(${impactCounter / MAX_IMPACT * 200}, 10, 30)`
    }
    setBg();

    smashHitbox.onmouseenter = () => {
        hand.src = "img/hand_fist.png"
        hand.classList.add("fist")
        handXOffset = 300;
        

        document.onclick = () => {
            if (impactCounter >= MAX_IMPACT)
                return;

            console.log("smash!")

            document.body.classList.remove("screen-dark")

            var audio = new Audio(Math.random() > .5 ? 'sfx/smash2.mp3' : 'sfx/smash2.mp3');
            audio.mozPreservesPitch = false;
            audio.webkitPreservesPitch = false;
            audio.playbackRate = Math.random() * 1. + .7;
            audio.play();

            ++impactCounter;

            setTimeout(() => {
                if (!clippedWindow)
                    moveClippy(100, 0);
            }, 100);

            for (let id of openWindowIDs) 
            {
                let window = document.getElementById(id);
                if (window != null && window != undefined && window != clippedWindow)
                {
                    window.style.transition = "left ease-out .3s, right ease-out .3s";
                    moveWindowToRight(id, 10);
                }
            }

            setBg();

            if (impactCounter > 1 && Math.random() > .2)
            {
                glass.innerHTML += `
                    <img src="img/broken_glass.png" class="broken-glass"
                        style="transform: translate(${-10 + Math.random() * 70}vh, ${-10 + Math.random() * 70}vh) scale(${1. + (Math.random() - .5) * 1.5}) rotate(${Math.random() * 360}deg)">
                `
            }
            if (impactCounter > 10 && Math.random() > .8)
            {
                console.log("smoke!")
                let smoke = document.createElement("ul")
                smoke.classList.add("smoke")
                smoke.style.left = `calc(50% - ${Math.random() > .5 ? 53 : -31}vh)`;
                for (var i = 0; i < 4; i++)
                    smoke.innerHTML += `<li style="animation-delay: ${Math.random() * 3}s"></li>`
                document.body.append(smoke)
            }
            
            hand.classList.remove("smash")
            perspective.classList.remove("impact")

            setTimeout(() => {

                if (impactCounter == MAX_IMPACT)
                {
                    new Audio('sfx/pc_dead.mp3').play();
                    smashHitbox.remove()
                    normalHand()
                    document.body.classList.add("pc-dead");
                    if (isOn())
                        toggleOnOff()
                    setTimeout(() => {
                        perspective.remove()
                        gameResult(false, false);
                    }, 500)
                }
                else
                {
                    perspective.classList.add("impact")
                }
                hand.classList.add("smash")
                    
                if (prevResetTimeout)
                    clearTimeout(prevResetTimeout);

                prevResetTimeout = setTimeout(() => {
                    hand.classList.remove("smash")
                    perspective.classList.remove("impact")
                }, 200)

            }, 10)
        }
        
        
    }
    function normalHand()
    {
        hand.src = "img/hand_pointer.png"
        hand.classList.remove("fist")
        handXOffset = 30;
        document.onclick = null;
    }
    smashHitbox.onmouseleave = () => {
        normalHand()
    }
    normalHand()
}

function gameResult(playerStable, pcStable)
{
    if (document.getElementsByClassName("game-result")[0])
        document.getElementsByClassName("game-result")[0].remove();

    if (playerStable && pcStable)
        document.getElementsByTagName("html")[0].style.background = `rgb(54 99 68)`;

    let div = document.createElement("div");
    div.innerHTML = `
    <div class="game-result">

        ${playerStable && pcStable ? `
        
        <h1>YOU WON</h1>
        <h1>THE GAME</h1>
        
        ` : `
        
        <h1>YOU</h1>
        <h1>FAILED</h1>
        
        `}
        
        <ul>
            <li>
                ${playerStable ? `✅  You were <u><i>stable</i></u>` : `❌  You ARE <b><u><i>UNSTABLE</i></u></b>!!`}
            </li>
            <li>
                ${pcStable ? `✅  The PC is <u><i>stable</i></u>` : `❌  The PC is <b><u><i>UNSTABLE</i></u></b>!!`}
            </li>
        </ul>

        <p>
            ${(playerStable && pcStable) ? `
            
            <!-- Both stable -->
            Good.
            
            ` : (playerStable ? `
            
            <!-- Only player stable -->
            
            You just didn't try hard enough.
            <br>
            At least you did not
            <br>smash the PC to pieces....
            
            ` : (pcStable ? `
            
            <!-- Only PC stable? -->
            
            This scenario should not exist,<br>You probably hacked the game.
            
            ` : `
            
            <!-- None stable -->

            You've got a real problem dude..
            <br>
            Why smash a brand new second hand PC --<i>that potentionally could run Minesweeper</i>-- to pieces?
            
            `))}
        </p>
        <p>
            🔄 Press <b>F5</b> to try again, <i>or continue...</i>
        </p>
    </div>`



    document.body.appendChild(div);
}
