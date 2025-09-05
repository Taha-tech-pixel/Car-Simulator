export class SettingsManager {
    constructor() {
        this.keybinds = {
            photo: 'KeyP',
            replay: 'KeyR'
        };
        this.accessibility = {
            colorblind: 'none', // none | deuter | prot | trit
            uiScale: 1.0,
            reduceMotion: false,
            reduceBloom: false
        };
    }
}


