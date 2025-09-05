export class MapManager {
    constructor() {
        this.markers = [];
        this.visible = false;
    }

    toggle() {
        this.visible = !this.visible;
        window.dispatchEvent(new CustomEvent('map:toggle', { detail: { visible: this.visible } }));
    }

    addMarker(marker) {
        this.markers.push(marker);
    }
}


