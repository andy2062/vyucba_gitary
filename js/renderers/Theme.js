class Theme {

    //=========================
    // Colors
    //=========================

    static COLORS = {

        stroke: "#000",
        fill: "#fff",

        string: "#666",
        fret: "#666",

        staff: "#000",

        text: "#555",
        note: "#222",

        inactive: "#bdbdbd",

        root: "#FFD700",
        highlight: "#f03197d3",

        finger: "#222",
        fingerText: "#fff",

        barre: "#444"

    };


    //=========================
    // Finger Colors
    //=========================

    static FINGER_COLORS = {

        "0": "#8e24aa",
        "1": "#43a047",
        "2": "#2486db",
        "3": "#fb8c00",
        "4": "#e53935"

    };


    //=========================
    // Fonts
    //=========================

    static FONT = {

        default: 14,

        stringName: 18,
        fretNumber: 16,

        note: 18,
        noteName: 11,

        finger: 18,
        
        title: 22,
        description: 16

    };


    //=========================
    // Sizes
    //=========================

    static SIZE = {

    fingerRadius: 20,
    rootRadius: 24,

    markerRadius: 24,

    noteLabelRadius: 14,
    noteLabelOffset: 22,

    noteShadowOffset: 3,

    barreRadius: 10,
    barreWidth: 28,
    barreOpacity: 0.55,
    barreHeight: 14

};


    //=========================
    // Stroke
    //=========================

    static STROKE = {

        default: 1,

        string: 1,
        fret: 2,
        nut: 6,

        staff: 1,
        measure: 1,

        marker: 2

    };

}

window.Theme = Theme;