
function makeWindow(windowOptions)
{
    let div = document.createElement("div");
    div.innerHTML = `

<div class="window" style="margin: 32px; width: 250px" ${windowOptions.id ? `id="${windowOptions.id}"` : ""}>
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

    div.getElementsByClassName("close-btn")[0].onclick = windowOptions.onClose;

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

window.onload = () => {

    const sys32FilesToDelete = 10;
    let sys32FilesDeleted = 0;
    const maxSquaresInBar = 28;

    let notResponding = false;
    let timesCancelled = 0;

    let removeSys32Window = makeWindow({
        id: "sys32-deleting-window",
        title: "Deleting C:/System32....",
        bodyHTML: `
        <p>Deleted <span id="sys32-files-deleted"></span>/${sys32FilesToDelete}</p>
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
