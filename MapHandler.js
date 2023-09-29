class MapHandler {
    constructor(SIZE) {
        this.SIZE = SIZE;
        this.SIZE_COL = Math.sqrt(this.SIZE);
        this.map = [];
        this.isMapCreated = false;
        this.EDGE_LENGTH = Math.sqrt(this.SIZE);
    }

    _generateMap() {
        let row = [];
        for (let i = 0; i < this.SIZE; i++) {
            row.push(new Space(i, SpaceType.Blank).getHTMLNode());
            if (parseInt(i % this.SIZE_COL) === this.SIZE_COL - 1) {
                this.map.push(row);
                row = [];
            }
        }

        this.isMapCreated = true;
    }

    getMap() {
        if (!this.isMapCreated) this._generateMap();
        return this.map;
    }
}
