
class GameSettingsClass{
    constructor(){
        this.gameTitle = "TwoFaceEngine";
        this.loadGameSettingsJson();
    }

    setGameTitle(title){
        this.gameTitle = title;
        document.title = title;
    }

    loadGameSettingsJson(){
        fetch('../../../GameSettings.json').then(response => response.json()).then(json => {
            this.setGameTitle(json.GameWindowTitle);
        })

    }



}

