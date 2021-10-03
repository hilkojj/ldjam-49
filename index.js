var highestWindowZIndex = 3;
var openWindowIDs = new Set();
 
// id: ""
// event: drag event
function windowdrag(id, event) 
{
    let window = document.getElementById(id);
    console.log("yess");
}

function closeAllOpenWindows() 
{
    for (let id of openWindowIDs) 
    {
        let window = document.getElementById(id);
        if (window != null && window != undefined) 
        {
            window.remove();
        }
    }

    openWindowIDs.clear();
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
    let div = document.createElement("div");
    openWindowIDs.add(windowOptions.id);
    div.innerHTML = `

<div class="window" style="width: 250px; z-index:${highestWindowZIndex++}" ${windowOptions.id ? `id="${windowOptions.id}"` : ""}>
<div class="title-bar" style="user-select: all !important;" drag="console.log('oke')">
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

    div.getElementsByClassName("close-btn")[0].onclick = (windowOptions.onClose !== undefined)? windowOptions.onClose : () => { div.remove(); openWindowIDs.delete(windowOptions.id); };
    

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
}

function startDeletingSys32()
{
    closeAllOpenWindows();


    const sys32FilesToDelete = 100;
    let sys32FilesDeleted = 0;
    const maxSquaresInBar = 28;

    let notResponding = false;
    let timesCancelled = 0;

    let removeSys32Window = makeWindow({
        id: "sys32-deleting-window",
        title: "Deleting C:/System32....",
        bodyHTML: `
        <p>Deleted <span id="sys32-files-deleted"></span>/${sys32FilesToDelete} files.</p>
        <input id="sys32-deleting-progress-bar" class="progress-bar" disabled="" type="text" value="&#9646;&#9646;&#9646;">
        <br><br>
        `,
        // minimize: 1,
        // maximize: 1,
        onClose: () => {
            removeSys32Window.style.transform = `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)`
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


    function dontRespond(time=2000) {
        
        notResponding = true;
        removeSys32Window.classList.add("not-responding-window")
        let oldTitle = removeSys32Window.getElementsByClassName("title-bar-text")[0].innerHTML;
        removeSys32Window.getElementsByClassName("title-bar-text")[0].innerHTML = "Not responding";

        setTimeout(() => {
            notResponding = false;
            removeSys32Window.classList.remove("not-responding-window")
            removeSys32Window.getElementsByClassName("title-bar-text")[0].innerHTML = oldTitle;
        }, time)
    }


    document.getElementById("screen").append(
        removeSys32Window
    )
    
    setInterval(() => {

        if (notResponding)
            return;

        let span = document.getElementById("sys32-files-deleted");
        span.innerHTML = ++sys32FilesDeleted;
        let percentage = sys32FilesDeleted / sys32FilesToDelete;
        if (percentage >= 1)
        {
            BLUE_SCREEN_OF_DEATH_BABY() // !!!!!!!!!!! woooo
        }
        
        document.getElementById("sys32-deleting-progress-bar").value = "▮".repeat((percentage * maxSquaresInBar) | 0 + 1);
    }, 50)
}

function showStartMenu()
{
    let startMenu = document.getElementById("start-menu");
    startMenu.style.display = "block";

    
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
        id: "not-enough-ram-window",
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
                popup.remove()
            }
        }
    })
    document.getElementById("screen").append(popup);
}


function openMinesweeper()
{

    notEnoughRamPopup("Minesweeper.exe")

    
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
                popup.remove()
            }
        }
    })
    document.getElementById("screen").append(popup);
}


function openNotepad()
{

    notEnoughRamPopup("Notepad32.exe")

    
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
        // minimize: 1,
        // maximize: 1,
        // onClose: () => {
        //     ie.remove()
        // }
    })
    let ieWindow = ie.getElementsByClassName("window")[0];

    ieWindow.style.width = "calc(100% - 80px)"
    ieWindow.style.height = "calc(100% - 80px)"

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

window.onload = () => {

    console.log("Ludum dareee");
    
}
