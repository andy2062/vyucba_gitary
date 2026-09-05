class NotationLayout {

    constructor() {

        this.startX = 10;
        this.startY = 20;

        this.measureWidth = 260;
        this.measureHeight = 120;

        this.measureGap = 0;

        this.measuresPerRow = Infinity;

    }

    getMeasure(index) {
        

        const row =
            Math.floor(index / this.measuresPerRow);

        const column =
            index % this.measuresPerRow;

        return {

            x:
                this.startX +
                column *
                (this.measureWidth + this.measureGap),

            y:
                this.startY +
                row *
                this.measureHeight,

            width:
                this.measureWidth,

            formatWidth:

        this.measureWidth,
            

        };

    }

}

window.NotationLayout = NotationLayout;