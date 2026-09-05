class StemPainter { 
    constructor(drawer) { 
        
        this.drawer = drawer; } 
        
    paint(note, x, y, layout) { 
        
        if (!note || !layout) { 
            return; 

        } 
        
        const pitch = note.keys?.[0]; 
        
        if (!pitch) { 
            return; 
        } 
        const stemUp = this.isStemUp(pitch); 
        if (stemUp) { 
            this.paintUp( x, y, layout ); 
        } 
        else { this.paintDown( x, y, layout ); 

        } 
    } 
    
    isStemUp(pitch) { 
        const normalized = 
        pitch .toLowerCase() 
        .replace("/", ""); 
        
        /* * B4 a vyššie -> stem dole * 
        * C4 až A4 -> stem hore */ 
       
        const order = [ "c", "d", "e", "f", 
            "g", "a", "b" ]; 
            
        const letter = normalized[0]; 
        const octave = Number( normalized.slice(1) ); 
        if (octave < 4) { return true; } 
        if (octave > 4) { return false; } 
        return order.indexOf(letter) < 
        order.indexOf("b"); 
    } 
    
    paintUp(x, y, layout) { 
        const length = layout.stemLength ?? 35; 
        
        this.drawer.drawLine( x + 5, y, x + 5, 
            y - length, 
            { 
                stroke: Theme.COLORS.note, 
                "stroke-width": Theme.STROKE.default 
            } 
        ); 
    } 
    
    paintDown(x, y, layout) { 
        const length = layout.stemLength ?? 35; 
        this.drawer.drawLine( x - 5, y, x - 5, y + length, 
            { 
                stroke: Theme.COLORS.note, 
                "stroke-width": Theme.STROKE.default 
            } 
        ); 
    } 
} 
window.StemPainter = StemPainter;