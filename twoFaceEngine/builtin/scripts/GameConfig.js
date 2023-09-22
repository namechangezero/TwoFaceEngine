
class GameSettingsClass{
    constructor(){
        this.gameTitle = "TwoFaceEngine";
        this.loadGameSettingsJson();
    }

    setGameTitle(title){
        this.gameTitle = title;
        document.title = title;
    }

    setFPS(fps){
        Time.waitAfterFrame = 1000/fps;
    }

    loadGameSettingsJson(){
        fetch('../../../GameSettings.json').then(response => response.json()).then(json => {
            this.setGameTitle(json.GameWindowTitle);
            this.setFPS(json.default_framerate);
        })

    }



}

